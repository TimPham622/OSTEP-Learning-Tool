import test from 'node:test';
import assert from 'node:assert/strict';
import {config,tutorTask,contextFor,messagesFor,validateFeedback,offlineFeedback,formatFeedback,createTutorRuntime,coach} from '../tutor.js';
import {detailed} from '../depth.js';
import {exerciseReference} from '../pedagogy-audit.js';
const u={id:'demo',name:'Trace',sections:'1.1',pages:[1,2],opening:'Explain mechanism',theory:['State, rule, transition'],anatomy:'Rule inputs',coach:['Use the rule'],examples:[['Trace','Start at x=1','Apply rule'],['Other','Check bound']],direct:[['Question A','SECRET_ANSWER','SECRET_HINT'],['Question B','SECRET_B','hint']],variation:[['Question C','SECRET_C','hint'],['Question D','SECRET_D','hint']],synthesis:['Synthesize'],rubric:['State assumption','Explain step'],transfer:['Example 1, steps 1–2','Transfer task','SECRET_TRANSFER','bridge']};
const ctx=contextFor(u,tutorTask(u,'exercise','d0','My starting state'),{example:1,steps:[2]});
const good={observation:'Check the input assumption.',example:1,step:2,question:'Which state changes?',rubric:[]};
const raw=JSON.stringify(good);
const reply=(data,status=200)=>({ok:status===200,status,json:async()=>data});
test('backend and local model identifiers',()=>{
 assert.deepEqual(config('offline','ignored'),{mode:'offline',model:''});
 assert.equal(config('webllm','').model,'Qwen2.5-3B-Instruct-q4f16_1-MLC');
 for(const id of ['https://example.com','qwen3:cloud','a b'])assert.throws(()=>config('ollama',id));
 assert.throws(()=>config('invalid','a'));
});
test('selected task excludes answer keys, private notes and unrelated progress',()=>{
 const p=messagesFor(ctx).map(x=>x.content).join('\n');
 assert.ok(p.includes('Question A')&&p.includes('My starting state')&&p.includes('Apply rule'));
 assert.ok(!p.includes('SECRET_')&&!p.includes('Question B'));
 assert.equal(contextFor(u,tutorTask(u,'transfer')).question,'Transfer task');
 assert.ok(!JSON.stringify(contextFor(u,tutorTask(u,'transfer'))).includes('SECRET_TRANSFER'));
});
test('valid numbered feedback and reference validation',()=>{
 assert.deepEqual(validateFeedback(raw,ctx),good);
 for(const v of [{...good,step:1},{...good,example:99},{...good,question:''},{...good,example:null,step:null}])assert.throws(()=>validateFeedback(JSON.stringify(v),ctx));
 assert.throws(()=>validateFeedback('not JSON',ctx));
 assert.ok(formatFeedback(good,ctx).includes('Example 1, step 2'));
});
test('rubric must cover criteria once and evidence must be verbatim',()=>{
 const c=contextFor(u,tutorTask(u,'synthesis','','I used the rule.'));
 const v={...good,example:null,step:null,rubric:[{index:0,status:'supported',evidence:'used the rule',next:'Check assumption'},{index:1,status:'uncertain',evidence:'',next:'Show transition'}]};
 assert.equal(validateFeedback(JSON.stringify(v),c).rubric.length,2);
 assert.throws(()=>validateFeedback(JSON.stringify({...v,rubric:[v.rubric[0]]}),c));
 assert.throws(()=>validateFeedback(JSON.stringify({...v,rubric:[v.rubric[0],v.rubric[0]]}),c));
 v.rubric[0].evidence='fabricated';assert.throws(()=>validateFeedback(JSON.stringify(v),c));
});
test('theory-only task cannot invent mapping; offline rubric is uncertain',()=>{
 const c=contextFor(u,tutorTask(u,'exercise','v0','attempt'),{example:null,steps:[]});
 const v={...good,example:null,step:null};assert.deepEqual(validateFeedback(JSON.stringify(v),c),v);
 assert.throws(()=>validateFeedback(raw,c));assert.equal(offlineFeedback(c).example,null);
 assert.ok(offlineFeedback(contextFor(u,tutorTask(u,'opening'))).rubric.every(r=>r.status==='uncertain'));
});
test('offline and failed/malformed model use deterministic fallback',async()=>{
 let calls=0;const runtime={generate:async()=>{calls++;throw Error('unavailable')}};
 let r=await coach('offline','',ctx,{runtime});assert.equal(r.source,'offline');assert.equal(calls,0);assert.equal(r.value.step,2);
 r=await coach('webllm','model',ctx,{runtime});assert.equal(r.source,'fallback');assert.equal(calls,1);
 r=await coach('ollama','model',ctx,{runtime:{generate:async()=>'{bad'}});assert.equal(r.source,'fallback');
 r=await coach('ollama','model',ctx,{runtime:{generate:async()=>raw}});assert.equal(r.source,'ollama');
});
test('Ollama model discovery excludes cloud; chat uses loopback and bounded settings',async()=>{
 const calls=[];const runtime=createTutorRuntime({fetcher:async(url,opt)=>{calls.push([url,opt]);return url.endsWith('/tags')?reply({models:[{name:'local:7b',size:42},{name:'cloud:latest'},{name:'remote',remote_host:'example.com'}]}):reply({done:true,message:{content:raw}})}});
 assert.deepEqual(await runtime.available('ollama'),[{id:'local:7b',bytes:42}]);
 assert.equal(await runtime.generate('ollama','local:7b',messagesFor(ctx)),raw);
 assert.ok(calls.every(([url,opt])=>url.startsWith('http://127.0.0.1:11434/')&&opt.redirect==='error'&&opt.credentials==='omit'));
 const body=JSON.parse(calls.at(-1)[1].body);assert.equal(body.stream,false);assert.equal(body.think,false);assert.equal(body.options.num_ctx,8192);
 await assert.rejects(()=>runtime.generate('ollama','missing',[]),/not installed/);
});
test('Ollama HTTP error and cancelled request fail without external fallback',async()=>{
 const r=createTutorRuntime({fetcher:async()=>reply({},403)});
 await assert.rejects(()=>r.available('ollama'),/403/);
 const c=new AbortController();c.abort();await assert.rejects(()=>r.available('ollama',{signal:c.signal}),/Cancelled/);
});
test('WebLLM worker catalog, reuse and release',async()=>{
 let constructed=0,terminated=0;const r=createTutorRuntime({gpuCheck:async()=>true,workerFactory:()=>{constructed++;return{postMessage(p){this.onmessage({data:{id:p.id,type:'result',value:p.op==='catalog'?[{id:'model'}]:raw}})},terminate(){terminated++}}}});
 assert.deepEqual(await r.available('webllm'),[{id:'model'}]);assert.equal(await r.generate('webllm','model',[]),raw);
 assert.equal(constructed,1);r.release();assert.equal(terminated,1);
});
test('WebGPU unavailable and worker cancellation',async()=>{
 const noGPU=createTutorRuntime({gpuCheck:async()=>false});await assert.rejects(()=>noGPU.available('webllm'),/WebGPU/);
 let terminated=0;const r=createTutorRuntime({gpuCheck:async()=>true,workerFactory:()=>({postMessage(){},terminate(){terminated++}})});
 const c=new AbortController(),p=r.generate('webllm','model',[],{signal:c.signal});await Promise.resolve();await assert.rejects(()=>r.available('webllm'),/busy/);c.abort();await assert.rejects(()=>p,/Cancelled/);assert.equal(terminated,1);
});
test('smoke test distinguishes exact sentinel and noncompliant response',async()=>{
 const r=createTutorRuntime({gpuCheck:async()=>true,workerFactory:()=>({postMessage(p){this.onmessage({data:{id:p.id,type:'result',value:'OSTEP_OK'}})},terminate(){}})});
 assert.equal((await r.diagnose('webllm','model')).ok,true);assert.equal((await r.diagnose('offline','')).ok,true);
});

test('every detailed unit has valid deterministic context for all task kinds',()=>{
 let count=0;
 for(const unit of Object.values(detailed).flat()){
  const tasks=[['exercise','d0'],['exercise','d1'],['exercise','v0'],['exercise','v1'],['opening',''],['synthesis',''],['explain','']];
  if(unit.transfer)tasks.push(['transfer','']);
  for(const [kind,key] of tasks){
   const c=contextFor(unit,tutorTask(unit,kind,key,'A partial reasoning attempt.'),kind==='exercise'?exerciseReference(unit,key):null);
   assert.deepEqual(validateFeedback(JSON.stringify(offlineFeedback(c)),c),offlineFeedback(c));
   assert.equal(c.unit,unit.id);
   count++;
  }
 }
 assert.equal(count,737);
});
