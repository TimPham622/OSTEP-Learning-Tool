import test from 'node:test';
import assert from 'node:assert/strict';
import {cpu} from '../cpu-depth.js';
import {memory} from '../memory-depth.js';
import {concurrency} from '../concurrency-depth.js';
import {persistence} from '../persistence-depth.js';
import {distribution} from '../distribution-depth.js';
import {pdfRanges} from '../reading.js';
import {matches,unitState,unitPassed,chapterPassed,unitUnlocked,gradeQuiz,selectedUnit,detailed,renderExamples} from '../depth.js';
import {exerciseReference,stepHint,quizChoices,mappings,anatomyNotes,transferTasks,auditUnits} from '../pedagogy-audit.js';
import {figures,renderFigure} from '../figures.js';
import {schedule,replace,walkTwoLevel,clockReplace,allocateTrace,segmentTranslate,lockTrace,ticketTrace,semaphoreTrace,conditionTrace,eventTrace,diskTiming,raidMap,xorParity,inodeTrace,appendCrash,journalCrash,logTrace,checksum,verifyBlock,retryTrace,nfsHandleTrace,stableWrite,cacheTrace,afsCost} from '../labs.js';

const all=Object.values(detailed).flat();
test('detailed units cover introduction, CPU, memory, concurrency, persistence and distribution chapters with unique IDs',()=>{
 assert.deepEqual(Object.keys(cpu).map(Number),[2,4,5,6,7,8,9,10]);
 assert.equal(new Set(all.map(u=>u.id)).size,all.length);
 assert.deepEqual(Object.keys(memory).map(Number),[13,14,15,16,17,18,19,20,21,22,23]);
 assert.equal(Object.values(cpu).flat().length,16);assert.equal(Object.values(memory).flat().length,24);assert.deepEqual(Object.keys(concurrency).map(Number),[26,27,28,29,30,31,32,33]);assert.equal(Object.values(concurrency).flat().length,20);assert.deepEqual(Object.keys(persistence).map(Number),[36,37,38,39,40,41,42,43,44]);assert.equal(Object.values(persistence).flat().length,21);assert.deepEqual(Object.keys(distribution).map(Number),[47,48,49]);assert.equal(Object.values(distribution).flat().length,9);assert.equal(all.length,90);
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
 assert.ok(u.anatomy&&u.coach.length===2);
 assert.ok(u.examples.every(ex=>ex.slice(1).every(s=>/\{[^}]+\}/.test(s))));
 for(const key of ['d0','d1','v0','v1']){const ref=exerciseReference(u,key);assert.ok(ref.label&&stepHint(u,key));if(key.startsWith('d'))assert.ok(ref.example);if(ref.example)assert.ok(ref.steps.every(n=>n>=1&&n<u.examples[ref.example-1].length));}
 assert.ok(renderExamples(u).includes('data-step="1"'));
 for(let j=0;j<5;j++){assert.deepEqual([...quizChoices(u.id,j,0)].sort(),[1,2,3,4]);assert.deepEqual([...quizChoices(u.id,j,1)].sort(),[1,2,3,4]);}
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

test('HDD timing converts RPM and throughput units',()=>{
 const r=diskTiming(6000,4,100000,100);
 assert.equal(r.rotationMs,5);assert.equal(r.transferMs,1);assert.equal(r.totalMs,10);assert.equal(r.effectiveMB,10);
});
test('RAID mapping, rotating parity and XOR recovery',()=>{
 assert.deepEqual(raidMap(0,4,11),{logical:11,row:2,members:[3],parity:null,width:4});
 assert.deepEqual(raidMap(1,4,3).members,[2,3]);
 assert.equal(raidMap(4,4,4).parity,3);
 assert.equal(raidMap(5,4,0).parity,3);assert.equal(raidMap(5,4,3).parity,2);
 for(let i=0;i<12;i++){let r=raidMap(5,4,i);assert.equal(r.members.includes(r.parity),false)}
 assert.equal(xorParity([6,3,5]),0);assert.equal(xorParity([0,6,5]),3);assert.equal(xorParity([0,6,7]),1);
});
test('inode and block bitmap allocation, failure, reclamation',()=>{
 const r=inodeTrace(2,2,[{op:'create',name:'a'},{op:'append',name:'a'},{op:'create',name:'b'},{op:'append',name:'b'},{op:'append',name:'a'},{op:'unlink',name:'a'},{op:'append',name:'b'}]);
 assert.equal(r[3].inodeBitmap,'11');assert.equal(r[3].dataBitmap,'11');assert.equal(r[4].result,'no free block');
 assert.equal(r[5].inodeBitmap,'01');assert.equal(r[5].dataBitmap,'01');assert.deepEqual(r[6].files,[{name:'b',inode:1,blocks:[1,0]}]);
});
test('all append crash subsets and journal recovery',()=>{
 let consistent=0;for(const i of [false,true])for(const b of [false,true])for(const d of [false,true]){const r=appendCrash(i,b,d);if(r.consistent)consistent++;assert.equal(r.freeReferenced,i&&!b);assert.equal(r.leak,b&&!i);assert.equal(r.stale,i&&!d)}
 assert.equal(consistent,3);
 for(const mode of ['data','ordered']){assert.equal(journalCrash(mode,2).committed,false);assert.equal(journalCrash(mode,3).replay,true);assert.equal(journalCrash(mode,4).stale,false);assert.equal(journalCrash(mode,5).replay,false)}
 assert.equal(journalCrash('unsafe',3).stale,true);assert.equal(journalCrash('unsafe',5).stale,false);
});
test('log liveness follows most recent logical mapping',()=>{
 const r=logTrace([{key:'a',value:'x'},{key:'b',value:'y'},{key:'a',value:'z'}]);
 assert.equal(r.live,2);assert.equal(r.obsolete,1);assert.deepEqual(r.records.map(x=>x.live),[false,true,true]);
});
test('checksum collision, CRC reference vector, address and version checks',()=>{
 assert.equal(checksum([3,5]),checksum([4,4]));assert.equal(checksum([3,5],'CRC32')===checksum([4,4],'CRC32'),false);
 assert.equal(checksum([49,50,51,52,53,54,55,56,57],'CRC32'),0xcbf43926);
 assert.deepEqual(verifyBlock({address:'A',version:2},{address:'B',version:1,bytes:[3,5],checksum:8}),{content:true,address:false,version:false});
});

test('retry ambiguity, deduplication and lost volatile state',()=>{
 let r=retryTrace(['request lost','reply lost','ok'],'increment',true);
 assert.equal(r.value,1);assert.equal(r.deliveries,1);assert.equal(r.completed,true);assert.equal(r.rows[2].effect,'duplicate suppressed');
 r=retryTrace(['reply lost','ok'],'increment',false);assert.equal(r.value,2);
 assert.equal(retryTrace(['reply lost','ok'],'set',false).value,1);
 assert.equal(retryTrace(['reply lost','restart','ok'],'increment',true).value,2);
 assert.equal(retryTrace(['server down','request lost'],'message',true).completed,false);
});
test('NFS handle survives restart but not inode reuse',()=>{
 const r=nfsHandleTrace(['lookup','read','restart','read','reuse','read','lookup','read']);
 assert.equal(r[1].result,'AB');assert.equal(r[3].result,'CD');assert.equal(r[3].offset,4);assert.equal(r[5].result,'stale or missing handle');assert.equal(r[7].result,'WX');
});
test('NFS stable acknowledgment survives crash',()=>{
 assert.equal(stableWrite('stable').at(-1).disk,'ABC');assert.equal(stableWrite('volatile').at(-1).disk,'AYC');
});
const open=id=>({id,op:'open'}),read=id=>({id,op:'read'}),write=(id,value)=>({id,op:'write',value}),close=id=>({id,op:'close'}),tick=amount=>({op:'tick',amount});
test('NFS visibility and attribute expiration',()=>{
 const actions=[open('B'),close('B'),open('A'),write('A','V2'),open('C'),read('C'),close('C'),close('A'),tick(2),open('B'),read('B'),close('B'),tick(1),open('B'),read('B')];
 let r=cacheTrace('NFS',3,actions);
 assert.equal(r.rows[5].result,'read V1');assert.equal(r.rows[10].result,'read V1');assert.equal(r.rows[14].result,'read V2');assert.equal(r.server,'V2');
 assert.equal(cacheTrace('NFS',0,actions).rows[10].result,'read V2');
});
test('AFS callbacks, last closer wins, restart validation',()=>{
 let r=cacheTrace('AFS',0,[open('A'),open('B'),write('A','X'),write('B','Y'),close('B'),close('A'),open('B'),read('B'),close('B'),{op:'restart'},open('B'),read('B')]);
 assert.equal(r.server,'X');assert.equal(r.rows[7].result,'read X');assert.equal(r.rows[11].result,'read X');assert.equal(r.stores,2);assert.equal(r.validations,2);
 r=cacheTrace('AFS',0,[open('A'),close('A'),open('A'),close('A')]);assert.equal(r.fetches,1);assert.equal(r.validations,0);
});
test('historical NFS/AFS workload costs',()=>{
 assert.deepEqual(afsCost(100,10,2,.1,'disk','reread'),{nfs:1000,afs:200,ratio:.2});
 assert.deepEqual(afsCost(100,10,2,.1,'disk','single write'),{nfs:10,afs:2000,ratio:200});
 assert.deepEqual(afsCost(100,10,2,.1,'memory','reread'),{nfs:10,afs:10,ratio:1});
});

test('audited page coverage includes every physical page in the assigned chapter ranges',()=>{
 for(const [ch,units] of Object.entries(detailed))for(let p=pdfRanges[ch][0];p<=pdfRanges[ch][1];p++)assert.ok(units.some(u=>u.pages[0]<=p&&u.pages[1]>=p));
});
test('one accessible original SVG per substantive chapter',()=>{
 assert.equal(Object.keys(figures).length,39);
 assert.deepEqual([...new Set(Object.keys(figures).map(k=>Number(k.replace(/[a-z]+$/,''))))].sort((a,b)=>a-b),Object.keys(detailed).map(Number));
 for(const id of Object.keys(figures)){assert.ok(all.some(u=>u.id===id));let html=renderFigure(id);assert.ok(html.includes('<svg')&&html.includes('role="img"')&&html.includes('aria-label=')&&html.includes('<figcaption>')&&html.includes('</svg>'));}
 assert.equal(renderFigure('unknown'),'');
});
test('audit references, anatomy and optional full traces preserve source material',()=>{
 assert.equal(Object.keys(mappings).length,90);assert.equal(Object.keys(anatomyNotes).length,90);assert.equal(Object.keys(transferTasks).length,16);
 assert.equal(all.filter(u=>u.transfer).length,16);
 for(const u of all.filter(u=>u.transfer))assert.equal(u.transfer.length,4);
 const original=cpu[4][0];const before=JSON.stringify(original);const copy=auditUnits({4:cpu[4]});assert.equal(JSON.stringify(original),before);assert.ok(copy[4][0]!==original);
});
test('quiz choices are reproducible within attempt and vary across retries',()=>{
 assert.deepEqual(quizChoices('7a',0,1),quizChoices('7a',0,1));
 assert.ok(new Set(Array.from({length:10},(_,i)=>quizChoices('7a',0,i).join(','))).size>1);
});

test('scheduler ties follow project ID convention, RR arrival boundary and input validation',()=>{assert.deepEqual(schedule([2,4,1],[1,0,0],'SJF').jobs.map(j=>j.end),[3,7,1]);assert.deepEqual(schedule([2,4],[2,0],'STCF').jobs.map(j=>j.end),[4,6]);assert.deepEqual(schedule([4,1],[0,2],'RR',2).jobs.map(j=>j.end),[5,3]);});
test('fixed frame slots and OPT tie convention',()=>{const r=replace([1,2,3,4],2,'OPT');assert.equal(r.rows[2][2],1);assert.equal(r.rows[3][2],3);assert.equal(r.rows[3][3],'4, 2');});
test('quiz rejects non-answer coercions',()=>{assert.equal(gradeQuiz([['q']], [false]).score,0);assert.equal(gradeQuiz([['q']], [' ']).score,0);assert.equal(gradeQuiz([['q']], [0]).score,100)});
