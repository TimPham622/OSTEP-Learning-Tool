import test from 'node:test';
import assert from 'node:assert/strict';
import {cpu} from '../cpu-depth.js';
import {memory} from '../memory-depth.js';
import {concurrency} from '../concurrency-depth.js';
import {pdfRanges} from '../reading.js';
import {matches,unitState,unitPassed,chapterPassed,unitUnlocked,gradeQuiz,selectedUnit} from '../depth.js';
import {schedule,replace,walkTwoLevel,clockReplace,allocateTrace,segmentTranslate,lockTrace,ticketTrace,semaphoreTrace,conditionTrace,eventTrace} from '../labs.js';

const detailed={...cpu,...memory,...concurrency};
const all=Object.values(detailed).flat();
test('detailed units cover introduction, CPU, memory and concurrency chapters with unique IDs',()=>{
 assert.deepEqual(Object.keys(cpu).map(Number),[2,4,5,6,7,8,9,10]);
 assert.equal(new Set(all.map(u=>u.id)).size,all.length);
 assert.deepEqual(Object.keys(memory).map(Number),[13,14,15,16,17,18,19,20,21,22,23]);
 assert.equal(Object.values(cpu).flat().length,16);assert.equal(Object.values(memory).flat().length,24);assert.deepEqual(Object.keys(concurrency).map(Number),[26,27,28,29,30,31,32,33]);assert.equal(Object.values(concurrency).flat().length,20);assert.equal(all.length,60);
});
for(const [ch,units] of Object.entries(detailed))for(const u of units)test(u.id+' content structure and grading',()=>{
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

test('two-level walk: addresses, indices and invalid mappings',()=>{
 const r=walkTwoLevel(0x9123,256,4,4096,{2:8192},{'2:17':10});
 assert.deepEqual(r,{vpn:145,offset:35,directory:2,leaf:17,pdeAddress:4104,pteAddress:8260,pa:2595,status:'valid'});
 assert.equal(walkTwoLevel(0x9123,256,4,4096,{},{}).status,'missing directory');
 assert.equal(walkTwoLevel(0x9123,256,4,4096,{2:8192},{}).status,'invalid PTE');
 assert.equal(walkTwoLevel(64*64*256,256,4,4096,{},{}).status,'VA outside two-level address space');
});
test('clock replacement clears use bits and wraps the hand',()=>{
 const r=clockReplace([1,2,3,1,4,2,5],3);
 assert.equal(r.misses,5);
 assert.deepEqual(r.rows[4].scans,['clear 0','clear 1','clear 2','install 0']);
 assert.equal(r.rows[4].victim,1);
 assert.deepEqual(r.rows[4].bits,[1,0,0]);
 assert.equal(r.rows[6].victim,3);
 assert.deepEqual(r.rows[6].frames,[4,2,5]);
 assert.equal(r.rows[6].hand,0);
});
test('allocator splitting, coalescing, fragmented failure and fit policy',()=>{
 const alloc=(id,size)=>({type:'alloc',id,size}),free=id=>({type:'free',id});
 let r=allocateTrace(64,[alloc('A',16),alloc('B',20),free('A'),free('B')]);
 assert.deepEqual(r[0].holes,[{start:16,size:48}]);
 assert.deepEqual(r[2].holes,[{start:0,size:16},{start:36,size:28}]);
 assert.deepEqual(r[3].holes,[{start:0,size:64}]);
 let ops=[alloc('A',30),alloc('B',10),alloc('C',12),alloc('D',12),free('A'),free('C')];
 r=allocateTrace(64,[...ops,alloc('E',31)]);
 assert.equal(r.at(-1).result,'failed');assert.equal(r.at(-1).totalFree,42);assert.equal(r.at(-1).largest,30);
 assert.equal(allocateTrace(64,[...ops,alloc('E',10)],'best').at(-1).result,'allocated [40,50)');
 assert.equal(allocateTrace(64,[...ops,alloc('E',10)],'first').at(-1).result,'allocated [0,10)');
});
test('segmentation positive, negative and exclusive bounds',()=>{
 const s={1:{base:8000,length:200,down:false},3:{base:9000,length:64,down:true}};
 assert.equal(segmentTranslate(1100,10,s).pa,8076);
 assert.equal(segmentTranslate(1224,10,s).status,'bounds fault');
 assert.equal(segmentTranslate(4072,10,s).displacement,-24);
 assert.equal(segmentTranslate(4072,10,s).pa,8976);
 assert.equal(segmentTranslate(4032,10,s).pa,8936);
 assert.equal(segmentTranslate(4031,10,s).status,'bounds fault');
 assert.equal(segmentTranslate(0,10,s).status,'unmapped segment');
});

const ops=s=>s.split(',').map(x=>{const [id,op]=x.split(':');return{id,op}});
test('broken check/set permits two owners; atomic exchange does not',()=>{
 const broken=lockTrace(ops('A:check,B:check,B:acquire,A:acquire'),'check/set');
 assert.equal(broken.at(-1).violation,true);assert.equal(broken.at(-1).owners.length,2);
 const safe=lockTrace(ops('A:acquire,B:acquire,A:release,B:acquire'),'atomic');
 assert.equal(safe[1].result,'busy');assert.equal(safe.every(x=>!x.violation),true);assert.deepEqual(safe.at(-1).owners,['B']);
});
test('ticket lock preserves arrival order',()=>{
 const t=ticketTrace(ops('A:arrive,B:arrive,C:arrive,A:release,B:release,C:release'));
 assert.deepEqual(t.map(x=>x.owner),['A','A','A','B','C','—']);assert.equal(t.at(-1).turn,3);assert.equal(t.at(-1).next,3);
});
test('semaphore remembers an early post and hands permits to waiters',()=>{
 let r=semaphoreTrace(0,ops('A:post,B:wait'));
 assert.equal(r[0].permits,1);assert.equal(r[1].permits,0);assert.equal(r[1].result,'permit acquired');
 r=semaphoreTrace(0,ops('A:wait,B:wait,C:post,C:post'));
 assert.deepEqual(r[1].queue,['A','B']);assert.deepEqual(r[2].queue,['B']);assert.equal(r[3].permits,0);assert.deepEqual(r[3].queue,[]);
});
test('condition variable wakeup does not reserve an item',()=>{
 const r=conditionTrace(1,ops('C1:consume,P:produce,C2:consume,C1:consume'));
 assert.deepEqual(r[0].waiting,['C1']);assert.deepEqual(r[1].ready,['C1']);assert.equal(r[2].count,0);
 assert.deepEqual(r[3].waiting,['C1']);assert.deepEqual(r[3].ready,[]);assert.equal(r[3].count,0);
});
test('event loop blocking delays a ready request',()=>{
 const blocked=eventTrace(8,2,'blocking'),async=eventTrace(8,2,'async');
 assert.equal(blocked.otherDispatch,8);assert.equal(blocked.otherLatency,6);assert.equal(async.otherDispatch,2);assert.equal(async.otherLatency,0);
 assert.equal(eventTrace(3,8,'blocking').otherLatency,0);
});
