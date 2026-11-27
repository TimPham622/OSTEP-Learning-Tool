import test from 'node:test';
import assert from 'node:assert/strict';
import {cpu} from '../cpu-depth.js';
import {pdfRanges} from '../reading.js';
import {matches,unitState,unitPassed,chapterPassed,unitUnlocked,gradeQuiz,selectedUnit} from '../depth.js';
import {schedule,replace} from '../labs.js';

const all=Object.values(cpu).flat();
test('detailed units cover introduction and CPU chapters with unique IDs',()=>{
 assert.deepEqual(Object.keys(cpu).map(Number),[2,4,5,6,7,8,9,10]);
 assert.equal(new Set(all.map(u=>u.id)).size,all.length);
 assert.equal(all.length,16);
});
for(const [ch,units] of Object.entries(cpu))for(const u of units)test(u.id+' content structure and grading',()=>{
 assert.ok(u.pages[0]>=pdfRanges[ch][0]&&u.pages[1]<=pdfRanges[ch][1]);
 assert.equal(u.examples.length,2);assert.ok(u.examples.every(ex=>ex.length>=4));
 assert.equal(u.direct.length,2);assert.equal(u.variation.length,2);
 assert.ok(u.synthesis.length>=3&&u.rubric.length>=3);
 assert.equal(u.quiz.length,5);assert.ok(u.quiz.every(q=>q.length===5&&new Set(q.slice(1)).size===4));
 assert.equal(gradeQuiz(u.quiz,['0','0','0','0','1']).score,80);
 assert.equal(gradeQuiz(u.quiz,[null,'0','0','0','1']).score,60);
 for(const p of [...u.direct,...u.variation])assert.ok(matches(p[1].split('|')[0],p[1]));
 assert.equal(matches('',u.direct[0][1]),false);
});
test('mastery lock, pass gates, relock, and manual override',()=>{
 const r={},units=cpu[7],s=unitState(r,units[0]);
 assert.equal(selectedUnit(r,units).id,units[0].id);
 assert.equal(unitUnlocked(r,units,1),false);
 Object.assign(s,{read:true,opening:'attempt',written:true,synthesis:'reasoning',evidence:'evidence',practical:true,quiz:80,checks:{d0:true,d1:true,v0:true,v1:true},rubric:{0:true,1:true,2:true}});
 assert.equal(unitPassed(s,units[0]),true);assert.equal(unitUnlocked(r,units,1),true);
 assert.equal(chapterPassed(r,units),false);
 s.checks.v1=false;assert.equal(unitPassed(s,units[0]),false);s.checks.v1=true;
 s.quiz=60;assert.equal(unitPassed(s,units[0]),false);assert.equal(unitUnlocked(r,units,1),false);
 unitState(r,units[1]).override=true;assert.equal(unitUnlocked(r,units,1),true);assert.equal(chapterPassed(r,units),false);
 assert.equal(matches(' 25% ','25'),true);assert.equal(matches('PC','program counter|pc'),true);
});
test('CPU scheduling representative completion traces',()=>{
 assert.deepEqual(schedule([8,4,2],[0,0,0],'SJF').jobs.map(j=>j.end),[14,6,2]);
 assert.deepEqual(schedule([5,3],[0,0],'RR',2).jobs.map(j=>j.end),[8,7]);
 assert.deepEqual(schedule([8,2],[0,2],'STCF').jobs.map(j=>j.end),[10,4]);
});
test('page replacement sample',()=>{
 assert.equal(replace([1,2,1,3,1],2,'FIFO').miss,4);
 assert.equal(replace([1,2,1,3,1],2,'LRU').miss,3);
});
