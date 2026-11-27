"""Browser acceptance checks. Run from repo root: python3 tests/browser_smoke.py.
Requires playwright and Chromium. Uses disposable browser profiles and a loopback server.
No real learner data, GPU inference, or textbook copyright material is used."""
import functools
import http.server
import json
from pathlib import Path
import threading
import unittest

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

def pdf_bytes():
    # One-page synthetic PDF, not the textbook. Build valid xref offsets.
    data = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for body in (
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >>",
        b"<< /Length 0 >>\nstream\nendstream",
    ):
        offsets.append(len(data))
        data.extend(f"{len(offsets)-1} 0 obj\n".encode()+body+b"\nendobj\n")
    pos = len(data)
    data.extend(b"xref\n0 5\n0000000000 65535 f \n")
    for off in offsets[1:]:
        data.extend(f"{off:010d} 00000 n \n".encode())
    data.extend(f"trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n{pos}\n%%EOF\n".encode())
    return bytes(data)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

class BrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}/"
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.context = self.browser.new_context(viewport={"width":1440,"height":1000},accept_downloads=True)
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto(self.url)
        self.page.locator("#main h1").wait_for()

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], "Uncaught browser errors")

    def route(self, name):
        self.page.evaluate("(route) => location.hash=route", name)
        self.page.wait_for_function("(route) => location.hash === '#' + route", arg=name)
        self.page.wait_for_timeout(60)

    def state(self):
        return self.page.evaluate("JSON.parse(localStorage.getItem('personal-ostep-v1'))")

    def seed(self, code):
        self.page.evaluate(code)
        self.page.reload()
        self.page.locator("#main h1").wait_for()

    def test_navigation_and_theme(self):
        self.assertEqual(self.page.locator("#toc a").count(),39)
        self.page.locator("#search").fill("paging")
        self.assertGreater(self.page.locator("#toc a").count(),0)
        self.assertLess(self.page.locator("#toc a").count(),39)
        self.page.locator("#search").fill("")
        self.page.locator("#theme").click()
        self.assertTrue(self.page.locator("body").evaluate("(e)=>e.classList.contains('dark')"))
        self.page.reload()
        self.assertTrue(self.page.locator("body").evaluate("(e)=>e.classList.contains('dark')"))
        self.route("lesson/4")
        self.page.locator("#override").wait_for()
        self.page.once("dialog",lambda dialog:dialog.accept())
        self.page.locator("#override").click()
        self.page.locator("#depth-0").wait_for()
        self.assertFalse(self.state()["lessons"]["2"]["mastered"])
        self.assertTrue(self.state()["lessons"]["4"]["override"])

    def test_exercises_mastery_quiz_and_review(self):
        self.route("lesson/2")
        self.page.locator("#depth-0").wait_for()
        self.page.locator('[data-value="d0"]').fill("wrong")
        self.page.locator('[data-check="d0"]').click()
        self.assertIn("Not matched",self.page.locator("#status-d0").inner_text())
        self.page.locator('[data-hint="d0"]').click()
        self.assertGreater(self.page.locator("#pane .step-focus").count(),0)
        self.page.locator('[data-value="d0"]').fill("3")
        self.page.locator('[data-check="d0"]').click()
        self.assertIn("Correct",self.page.locator("#status-d0").inner_text())
        for key,answer in [("d1","no"),("v0","policy"),("v1","yes")]:
            self.page.locator(f'[data-value="{key}"]').fill(answer)
            self.page.locator(f'[data-check="{key}"]').click()
        self.page.locator('[data-flag="read"]').check()
        self.page.locator('[data-text="opening"]').fill("The OS switches contexts under a time-sharing policy.")
        self.page.locator('[data-flag="written"]').check()
        self.page.locator('[data-text="synthesis"]').fill("A self-assessed attempt for the browser test.")
        self.page.locator('details').filter(has_text="Structural bridge and rubric").locator("summary").click()
        for cb in self.page.locator("[data-rubric]").all():
            cb.check()
        self.page.locator('[data-text="evidence"]').fill("Synthetic browser test evidence, not a real investigation.")
        self.page.locator('[data-flag="practical"]').check()
        for j in range(5):
            self.page.locator(f'[name="question{j}"][value="0"]').check()
        self.page.locator("#depth-quiz button[type=submit]").click()
        self.assertIn("100%",self.page.locator("#depth-quiz-result").inner_text())
        self.assertIn("Unit mastered",self.page.locator("#unit-status").inner_text())
        s=self.state()["lessons"]["2"]["units"]["2a"]
        self.assertGreater(s["due"],0)
        self.page.locator("#next-unit").click()
        self.page.locator("#depth-0").wait_for()
        self.assertEqual(self.state()["lessons"]["2"]["selectedUnit"],"2b")
        self.seed("""()=>{let s=JSON.parse(localStorage.getItem('personal-ostep-v1'));s.lessons['2'].units['2a'].due=1;localStorage.setItem('personal-ostep-v1',JSON.stringify(s))}""")
        self.route("review")
        self.page.locator(".reviewitem textarea").fill("Review attempt")
        self.page.locator("[data-bad]").click()
        self.assertEqual(self.state()["lessons"]["2"]["units"]["2a"]["reviewIndex"],0)
        self.assertGreater(self.state()["lessons"]["2"]["units"]["2a"]["due"],1)

    def test_all_unit_rendering_and_figures(self):
        units=self.page.evaluate("async()=>Object.entries((await import('./depth.js')).detailed).flatMap(([ch,us])=>us.map(u=>[ch,u.id]))")
        self.assertEqual(len(units),90)
        self.seed("""async()=>{let s=JSON.parse(localStorage.getItem('personal-ostep-v1'));let {detailed}=await import('./depth.js');for(const [ch,us] of Object.entries(detailed)){s.lessons[ch].override=true;for(const u of us)s.lessons[ch].units[u.id].override=true}localStorage.setItem('personal-ostep-v1',JSON.stringify(s))}""")
        svg_count=0
        for ch,uid in units:
            self.route("lesson/"+ch)
            self.page.locator(f'[data-unit="{uid}"]').click()
            self.page.locator("#depth-8").wait_for()
            self.assertEqual(self.page.locator("#main [data-example]").count(),2)
            self.assertEqual(self.page.locator("#main [data-value]").count(),4)
            self.assertEqual(self.page.locator("#depth-quiz fieldset").count(),5)
            svg_count+=self.page.locator("#main .learning-figure svg[role=img]").count()
        self.assertEqual(svg_count,39)

    def test_all_labs(self):
        self.route("lab")
        select=self.page.locator("#lab-select")
        keys=select.locator("option").evaluate_all("(xs)=>xs.map(x=>x.value)")
        self.assertEqual(len(keys),33)
        for key in keys:
            select.select_option(key)
            self.page.locator("#lab-host [data-run]").click()
            out=self.page.locator("#lab-host [data-out]")
            self.assertTrue(out.inner_text().strip(),key)
            self.assertGreater(out.locator("table, .gantt, p, .gridcells").count(),0,key)

    def test_pdf_and_notes_persistence(self):
        self.route("lesson/2")
        self.page.locator("#pdf").set_input_files({"name":"synthetic.pdf","mimeType":"application/pdf","buffer":pdf_bytes()})
        self.page.locator("#pane iframe").wait_for()
        self.assertIn("#page=24",self.page.locator("#pane iframe").get_attribute("src"))
        self.page.locator('[data-pane="notes"]').click()
        self.page.locator("#notes").fill("Synthetic notes")
        self.page.reload()
        self.page.locator("#pane iframe").wait_for()
        self.page.locator('[data-pane="notes"]').click()
        self.assertEqual(self.page.locator("#notes").input_value(),"Synthetic notes")

    def test_projects_and_backup(self):
        self.route("projects")
        self.assertEqual(self.page.locator(".project-kit").count(),12)
        self.page.locator("#project-filter").select_option("xv6")
        self.assertEqual(self.page.locator('.project-kit:visible').count(),3)
        self.page.locator("#project-filter").select_option("all")
        p=self.page.locator("#project-utilities")
        p.locator("details").filter(has_text="Milestones and acceptance checklist").locator("summary").first.click()
        self.page.once("dialog",lambda dialog:dialog.accept())
        p.locator("[data-project-done]").click()
        self.assertFalse(p.locator("[data-project-done]").is_checked())
        for cb in p.locator("[data-project-kind]").all():
            cb.check()
        p.locator('[data-project-text="evidence"]').fill("Synthetic test transcript")
        p.locator("[data-project-done]").check()
        self.assertTrue(self.state()["projects"]["0"]["done"])
        self.route("settings")
        with self.page.expect_download() as info:
            self.page.locator("#export").click()
        exported=json.loads(Path(info.value.path()).read_text())
        self.assertTrue(exported["projects"]["0"]["done"])
        exported["projects"]["0"]["done"]=False
        self.page.once("dialog",lambda dialog:dialog.accept())
        self.page.locator("#import").set_input_files({"name":"backup.json","mimeType":"application/json","buffer":json.dumps(exported).encode()})
        self.page.wait_for_function("!JSON.parse(localStorage.getItem('personal-ostep-v1')).projects['0'].done")
        self.route("projects")
        self.assertIn("0 / 12",self.page.locator("#project-summary").inner_text())

    def test_offline_tutor_and_mock_ollama(self):
        self.route("settings")
        self.page.locator("#mode").select_option("offline")
        self.page.locator("#save-ai").click()
        self.route("lesson/2")
        self.page.locator('[data-practice-coach="d0"]').click()
        self.page.locator("#tutor-question").fill("B starts at time 4.")
        self.page.locator("#ask").click()
        self.page.locator("#ai-output").wait_for()
        self.assertIn("Offline study guidance",self.page.locator("#ai-status").inner_text())
        self.page.locator("#ai-reference").click()
        self.assertGreater(self.page.locator("#pane .step-focus").count(),0)
        self.route("settings")
        self.page.locator("#mode").select_option("ollama")
        self.page.locator("#model").fill("local:test")
        self.page.locator("#save-ai").click()
        # Route interception verifies UI wiring, not CORS or real inference.
        def ollama(route):
            if route.request.method == "OPTIONS":
                route.fulfill(status=204,headers={"access-control-allow-origin":"*","access-control-allow-methods":"GET, POST, OPTIONS","access-control-allow-headers":"content-type"})
            elif route.request.url.endswith("/api/tags"):
                route.fulfill(json={"models":[{"name":"local:test"}]},headers={"access-control-allow-origin":"*"})
            else:
                route.fulfill(json={"done":True,"message":{"content":"OSTEP_OK"}},headers={"access-control-allow-origin":"*"})
        self.page.route("http://127.0.0.1:11434/**",ollama)
        self.page.locator("#test-ai").click()
        self.page.wait_for_function("document.querySelector('#diagnostic').textContent.includes('PASS:')")
        self.assertIn("OSTEP_OK",self.page.locator("#diagnostic").inner_text())

    def test_mobile_layout(self):
        self.page.set_viewport_size({"width":390,"height":844})
        self.route("lesson/2")
        self.assertTrue(self.page.locator("#depth-0").is_visible())
        self.assertTrue(self.page.locator("#reference").is_visible())
        self.assertFalse(self.page.locator("#split").is_visible())
        self.assertLessEqual(self.page.evaluate("document.documentElement.scrollWidth"),400)

if __name__=="__main__":
    unittest.main(verbosity=2)
