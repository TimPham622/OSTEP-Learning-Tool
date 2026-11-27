#!/usr/bin/env python3
"""Original OSTEP project checker. Python stdlib, macOS/Linux, no third-party packages."""
import argparse
import os
from pathlib import Path
import selectors
import shlex
import signal
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
NATIVE = ("utilities", "shell", "allocator", "hash", "pool", "fsimage", "scheduler", "pager", "rpc")

def stop(p):
    try:
        os.killpg(p.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    p.wait()

def run(args, cwd, data=None, seconds=5):
    p = subprocess.Popen([str(x) for x in args], cwd=cwd, stdin=subprocess.PIPE,
                         stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    try:
        out, err = p.communicate(data, timeout=seconds)
    except subprocess.TimeoutExpired:
        stop(p)
        raise AssertionError("timeout: " + shlex.join(map(str, args)))
    finally:
        if p.poll() is None:
            stop(p)
    return p.returncode, out, err

def expect(exe, cwd, args=(), expected=b"", data=None, success=True):
    code, out, err = run([exe, *args], cwd, data)
    if success:
        assert code == 0, f"exit {code}: {err[:500]!r}"
        assert out == expected, f"expected {expected[:500]!r}, got {out[:500]!r}"
    else:
        assert code != 0, f"expected nonzero exit, got {out[:500]!r}"

def tests(name, exe, wd):
    def test(label, fn):
        try:
            fn()
        except (AssertionError, OSError, ValueError) as exc:
            print("FAIL", label, "-", exc)
            results.append(False)
        else:
            print("PASS", label)
            results.append(True)
    results = []
    def e(args=(), out=b"", data=None, success=True):
        expect(exe, wd, args, out, data, success)
    if name == "utilities":
        (wd/"a").write_bytes(b"A\x00B\n")
        (wd/"b").write_bytes(b"tail")
        (wd/"empty").write_bytes(b"")
        (wd/"text").write_bytes(b"alpha\nbeta\nalphabet\nlast alpha")
        (wd/"runs").write_bytes(b"x"*260 + b"\x00\x00y")
        test("cat binary + multiple files", lambda: e(["cat","a","empty","b"], b"A\x00B\ntail"))
        test("cat empty", lambda: e(["cat","empty"]))
        test("missing file", lambda: e(["cat","missing"], success=False))
        test("literal grep", lambda: e(["grep","alpha","text"], b"alpha\nalphabet\nlast alpha"))
        test("grep no matches", lambda: e(["grep","absent","text"]))
        test("rle empty", lambda: e(["rle","empty"]))
        test("rle long run and NUL", lambda: e(["rle","runs"], bytes([255,120,5,120,2,0,1,121])))
    elif name == "shell":
        (wd/"sub").mkdir()
        test("external command and exit", lambda: e(data=b"/bin/echo hello\nexit\n/bin/echo no\n", out=b"hello\n"))
        test("failed exec recovery", lambda: e(data=b"/no-such-ostep-executable\n/bin/echo ok\nexit\n", out=b"ok\n"))
        test("parent cd", lambda: e(data=b"cd sub\n/bin/pwd\nexit\n", out=os.fsencode(str((wd/"sub").resolve()))+b"\n"))
        def redirect():
            e(data=b"/bin/echo hello > output\nexit\n")
            assert (wd/"output").read_bytes() == b"hello\n"
        test("redirect", redirect)
        test("pipeline", lambda: e(data=b"/bin/echo pipe | /bin/cat\nexit\n", out=b"pipe\n"))
        test("repeated pipeline and EOF", lambda: e(data=b"/bin/echo x | /bin/cat\n"*30+b"exit\n",out=b"x\n"*30))
    elif name == "allocator":
        test("alignment and exhaustion", lambda: e(data=b"alloc 1\nalloc 9\nalloc 104\nalloc 8\ncheck\n",out=b"0\n8\n24\n-1\nok\n"))
        test("coalesce and reuse", lambda: e(data=b"alloc 32\nalloc 32\nalloc 64\nfree 32\nfree 0\nalloc 64\ncheck\n",out=b"0\n32\n64\nok\nok\n0\nok\n"))
        test("invalid and double free", lambda: e(data=b"alloc 0\nalloc 129\nalloc 8\nfree 1\nfree 0\nfree 0\ncheck\n",out=b"-1\n-1\n0\nerror\nok\nerror\nok\n"))
    elif name == "hash":
        for threads,iters,keys in [(1,8,3),(4,0,8),(6,10003,11),(8,20000,1)]:
            expected="".join(f"{k} {threads*(iters//keys + (k < iters%keys))}\n" for k in range(keys)).encode()
            test(f"hash {threads} workers {iters} iterations {keys} keys",lambda t=threads,i=iters,k=keys,o=expected:e([t,i,k],o))
    elif name == "pool":
        for workers,cap,n in [(1,1,0),(4,1,10),(8,3,2),(4,7,10000)]:
            expected=f"{n} {n*(n+1)//2}\n".encode()
            test(f"pool {workers} workers capacity {cap} tasks {n}",lambda w=workers,c=cap,t=n,o=expected:e([w,c,t],o))
    elif name == "fsimage":
        def fresh(image):
            e(["init",image])
        def basic():
            fresh("basic.img")
            e(["put","basic.img","a","hello"])
            e(["get","basic.img","a"],b"hello\n")
            e(["put","basic.img","a",""])
            e(["get","basic.img","a"],b"\n")
            e(["check","basic.img"],b"ok\n")
            e(["rm","basic.img","a"])
            e(["get","basic.img","a"],success=False)
        def capacity():
            fresh("capacity.img")
            for i in range(8): e(["put","capacity.img",f"f{i}","x"])
            e(["put","capacity.img","extra","x"],success=False)
            e(["rm","capacity.img","f0"])
            e(["put","capacity.img","extra","y"])
            e(["check","capacity.img"],b"ok\n")
        def crash():
            fresh("crash.img")
            e(["put","crash.img","a","old"])
            e(["put-crash","crash.img","a","new","before"])
            e(["get","crash.img","a"],b"old\n")
            e(["check","crash.img"],b"ok\n")
            e(["put-crash","crash.img","a","new","after"])
            e(["get","crash.img","a"],b"new\n")
            e(["check","crash.img"],b"ok\n")
        def truncated():
            (wd/"bad.img").write_bytes(b"X")
            e(["check","bad.img"],success=False)
        test("persistent create/read/replace/remove",basic)
        test("inode capacity and reuse",capacity)
        test("simulated atomic publication",crash)
        test("truncated image",truncated)
    elif name == "scheduler":
        test("FIFO",lambda:e(["FIFO",2,"0:8","0:4","0:2"],b"0 8 0\n1 12 8\n2 14 12\n"))
        test("SJF",lambda:e(["SJF",2,"0:8","0:4","0:2"],b"0 14 6\n1 6 2\n2 2 0\n"))
        test("STCF preemption",lambda:e(["STCF",2,"0:8","2:2"],b"0 10 0\n1 4 0\n"))
        test("RR",lambda:e(["RR",2,"0:5","0:3"],b"0 8 0\n1 7 2\n"))
        test("RR arrivals before requeue",lambda:e(["RR",2,"0:4","2:1"],b"0 5 0\n1 3 0\n"))
        test("idle gap",lambda:e(["FIFO",1,"4:2","9:1"],b"0 6 0\n1 10 0\n"))
        test("invalid zero burst",lambda:e(["SJF",1,"0:0"],success=False))
    elif name == "pager":
        for policy,cap,refs,miss in [("FIFO",2,[1,2,1,3,1],4),("LRU",2,[1,2,1,3,1],3),
                                     ("OPT",2,[1,2,1,3,1],3),("CLOCK",2,[1,2,1,3,1],4),
                                     ("LRU",3,[1,2,3,1,2,3],3),("FIFO",1,[4,4,5,4],3),("OPT",2,[],0)]:
            test(f"{policy} cap {cap} refs {refs}",lambda p=policy,c=cap,r=refs,m=miss:e([p,c,*r],f"{m}\n".encode()))
        test("invalid capacity",lambda:e(["FIFO",0,1],success=False))
    elif name == "rpc":
        def session(mode):
            p=subprocess.Popen([str(exe),"server",mode],cwd=wd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True)
            try:
                # Bound startup and read a single port line, avoiding indefinite readline.
                with selectors.DefaultSelector() as sel:
                    sel.register(p.stdout,selectors.EVENT_READ)
                    buf=b""
                    while b"\n" not in buf and len(buf)<16:
                        assert sel.select(timeout=2),"server did not announce port"
                        chunk=os.read(p.stdout.fileno(),16)
                        assert chunk,"server exited before port"
                        buf+=chunk
                port=int(buf.split(b"\n",1)[0])
                assert 1<=port<=65535,"bad port"
                e(["client",port,10,"inc"],b"1\n")
                e(["client",port,10,"inc"],b"1\n")
                e(["client",port,11,"inc"],b"2\n")
                e(["client",port,12,"set"],b"1\n")
                e(["client",port,11,"inc"],b"2\n") # cached result, not current counter
                e(["client",port,13,"inc"],b"2\n")
            finally:
                stop(p)
                p.stdout.close()
                p.stderr.close()
        test("normal RPC, duplicate and cached result",lambda:session("normal"))
        test("lost first reply, retry without duplicate effect",lambda:session("drop-first"))
    return results

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("project",choices=(*NATIVE,"all"))
    ap.add_argument("--source",type=Path,help="edited C source for a single project")
    ap.add_argument("--smoke",action="store_true",help="compile only; starters are intentionally incomplete")
    ap.add_argument("--sanitize",action="store_true",help="enable ASan/UBSan if supported")
    args=ap.parse_args()
    if args.source and args.project=="all":
        ap.error("--source requires a single project")
    if args.source and not args.source.is_file():
        ap.error("source file missing")
    all_results=[]
    for name in NATIVE if args.project=="all" else (args.project,):
        print("\n==",name,"==",flush=True)
        with tempfile.TemporaryDirectory(prefix="ostep-") as tmp:
            wd=Path(tmp).resolve()
            source=(args.source or ROOT/name/"starter.c").resolve()
            exe=wd/"program"
            flags=["-std=c11","-Wall","-Wextra","-Werror","-g","-pthread"]
            if args.sanitize: flags+=["-fsanitize=address,undefined","-fno-omit-frame-pointer"]
            code,out,err=run([*shlex.split(os.environ.get("CC","cc")),*flags,source,"-o",exe],wd,seconds=30)
            if code:
                print("FAIL compilation",err.decode(errors="replace"));all_results.append(False);continue
            print("PASS compilation");all_results.append(True)
            if not args.smoke: all_results.extend(tests(name,exe,wd))
    print(f"\n{sum(all_results)}/{len(all_results)} checks passed")
    return 0 if all(all_results) else 1
if __name__=="__main__":
    raise SystemExit(main())
