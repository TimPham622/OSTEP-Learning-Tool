import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {projectKits,projectScaffolds,projectReady,projectComplete} from '../project-kits.js';
import {projects} from '../curriculum.js';
import {detailed} from '../depth.js';
const unitIds=new Set(Object.values(detailed).flat().map(u=>u.id));
test('12 kits retain the first nine project identities',()=>{
 assert.equal(projectKits.length,12);
 assert.deepEqual(projectKits.slice(0,9).map(p=>p.name),projects.map(p=>p[0]));
 assert.equal(new Set(projectKits.map(p=>p.id)).size,12);
 assert.equal(projectKits.filter(p=>p.platform==='native').length,9);
 assert.equal(projectKits.filter(p=>p.platform==='xv6').length,3);
});
for(const p of projectKits)test(p.id+' kit source and completion rules',()=>{
 assert.ok(p.goal&&p.invariant&&p.extension);
 const scaffold=projectScaffolds[p.id];
 assert.ok(scaffold.units.every(id=>unitIds.has(id)));
 assert.ok(scaffold.trace.length>=3&&scaffold.bug&&scaffold.hint);
 assert.ok(p.milestones.length>=3&&p.checks.length>=3&&p.debug.length>=2);
 assert.ok(p.chapters.every(Number.isInteger));
 assert.ok(projectReady(p,()=>true));assert.equal(projectReady(p,()=>false),false);
 assert.equal(projectComplete(p,{}),false);
 const s={evidence:'test output',milestones:Object.fromEntries(p.milestones.map((_,i)=>[i,true])),checks:Object.fromEntries(p.checks.map((_,i)=>[i,true]))};
 assert.equal(projectComplete(p,s),true);
 s.checks[0]=false;assert.equal(projectComplete(p,s),false);
 assert.ok(existsSync(new URL('../projects/'+p.id+'/README.md',import.meta.url)));
 for(const file of p.files){const f=readFileSync(new URL('../projects/'+p.id+'/'+file,import.meta.url),'utf8');assert.ok(f.includes('int main('));}
});
test('native runner includes all native suites and timeout cleanup',()=>{
 const src=readFileSync(new URL('../projects/check.py',import.meta.url),'utf8');
 for(const p of projectKits.filter(p=>p.platform==='native'))assert.ok(src.includes('name == "'+p.id+'"'));
 assert.ok(src.includes('start_new_session=True')&&src.includes('os.killpg')&&src.includes('TemporaryDirectory'));
});
