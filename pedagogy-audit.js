// Editorial audit: explicit exercise-to-example references, in d0,d1,v0,v1 order.
// e.s-t = example e, numbered steps s through t; T = theory/prerequisite, not an example.
const raw={
'2a':'1.1-4 2.1-4 T 2.2-4','2b':'1.1-4 2.1-4 1.1-4 2.1-4',
'4a':'1.1-4 2.1-4 2.1-4 T','4b':'1.1-5 1.1-5 2.1-4 1.1-5',
'5a':'1.1-4 1.1-4 1.1-4 2.1-4','5b':'1.1-4 2.1-4 1.1-4 2.1-4',
'6a':'1.1-5 2.1-3 2.1-3 1.1-5','6b':'1.1-5 2.1-3 1.1-5 1.1-5',
'7a':'1.1-4 2.1-4 1.1-4 1.1-4','7b':'1.1-5 1.1-5 2.1-4 1.1-5',
'7c':'1.1-5 1.1-5 2.1-4 1.1-5','8a':'1.1-4 1.1-4 1.1-4 2.1-4',
'8b':'1.1-4 2.1-4 1.1-4 2.1-4','9a':'1.1-4 2.1-5 1.1-4 2.1-5',
'10a':'1.1-4 2.1-4 1.1-4 2.1-4','10b':'1.1-4 2.1-4 2.1-4 2.1-4',
'13a':'1.1-4 2.1-4 1.1-4 2.1-4','14a':'1.1-5 1.1-5 2.1-4 1.1-5',
'14b':'1.1-4 2.1-4 T 2.1-4','15a':'1.1-4 2.1-4 1.1-4 1.1-4',
'15b':'1.1-5 2.1-4 2.1-4 2.1-4','16a':'1.1-5 1.1-5 1.1-5 2.1-4',
'16b':'1.1-4 1.1-4 1.1-4 2.1-4','17a':'1.1-4 2.1-4 2.1-4 T',
'17b':'1.1-4 1.1-4 2.1-5 2.1-5','18a':'1.1-5 1.1-5 1.1-5 2.1-4',
'18b':'1.1-4 2.1-5 1.1-4 2.1-5','19a':'1.1-4 1.1-4 2.1-4 2.1-4',
'19b':'1.1-4 2.1-4 1.1-4 T','20a':'1.1-4 2.1-4 T T',
'20b':'1.1-6 1.1-6 1.1-6 2.1-4','20c':'1.1-4 1.1-4 2.1-4 2.1-4',
'21a':'1.1-5 1.1-5 2.1-4 2.1-4','21b':'1.1-5 2.1-5 2.1-5 2.1-5',
'22a':'1.1-5 2.1-4 1.1-5 T','22b':'1.1-5 2.1-5 2.1-5 T',
'22c':'1.1-5 1.1-5 1.1-5 2.1-4','23a':'1.1-5 1.1-5 1.1-5 2.1-4',
'23b':'1.1-5 1.1-5 2.1-4 T','23c':'1.1-4 2.1-5 2.1-5 2.1-5',
'26a':'1.1-4 2.1-4 1.1-4 T','26b':'1.1-4 2.1-4 T 2.1-4',
'27a':'1.1-4 2.1-4 1.1-4 1.1-4','27b':'2.1-4 2.1-4 2.1-4 2.1-4',
'28a':'1.1-4 1.1-4 2.1-4 T','28b':'1.1-4 2.1-4 1.1-4 T',
'28c':'1.1-5 1.1-5 1.1-5 2.1-4','29a':'2.1-4 2.1-4 2.1-4 2.1-4',
'29b':'1.1-4 2.1-4 2.1-4 1.1-4','30a':'2.1-4 1.1-4 2.1-4 1.1-4',
'30b':'1.1-4 2.1-4 1.1-4 2.1-4','30c':'1.1-4 2.1-4 2.1-4 2.1-4',
'31a':'1.1-4 2.1-4 2.1-4 1.1-4','31b':'1.1-4 1.1-4 1.1-4 2.1-5',
'31c':'1.1-5 2.1-4 1.1-5 2.1-4','32a':'1.1-4 2.1-4 1.1-4 2.1-4',
'32b':'1.1-4 2.1-4 1.1-4 2.1-4','32c':'1.1-4 2.1-4 2.1-4 1.1-4',
'33a':'1.1-4 1.1-4 2.1-4 1.1-4','33b':'1.1-5 2.1-4 1.1-5 T',
'36a':'1.1-4 2.1-4 2.1-4 2.1-4','36b':'1.1-5 T 2.1-4 T',
'37a':'1.1-4 1.1-4 1.1-4 2.1-4','37b':'2.1-4 1.1-4 T 2.1-4',
'38a':'1.1-4 2.1-4 1.1-4 2.1-4','38b':'1.1-4 1.1-4 T 2.1-5',
'39a':'1.1-4 2.1-4 2.1-4 1.1-4','39b':'1.1-4 2.1-4 1.1-4 2.1-4',
'39c':'1.1-4 2.1-5 2.1-5 2.1-5','40a':'1.1-4 2.1-5 1.1-4 T',
'40b':'1.1-5 2.1-4 1.1-5 2.1-4','41a':'2.1-4 T T 2.1-4',
'41b':'2.1-4 2.1-4 1.1-4 1.1-4','42a':'1.1-4 2.1-4 1.1-4 1.1-4',
'42b':'1.1-5 1.1-5 1.1-5 2.1-5','42c':'2.1-5 1.1-4 1.1-4 2.1-5',
'43a':'1.1-4 2.1-5 1.1-4 T','43b':'1.1-5 2.1-5 2.1-5 1.1-5',
'43c':'1.1-4 2.1-5 2.1-5 2.1-5','44a':'1.1-4 1.1-4 2.1-4 2.1-4',
'44b':'1.1-4 2.1-5 2.1-5 2.1-5',
'47a':'1.1-4 2.1-4 1.1-4 T','47b':'2.1-4 T 1.1-4 2.1-4',
'47c':'1.1-4 2.1-5 1.1-4 2.1-5','48a':'1.1-5 1.1-5 2.1-4 1.1-5',
'48b':'1.1-4 1.1-4 2.1-5 T','48c':'1.1-4 2.1-4 2.1-4 2.1-4',
'49a':'1.1-4 2.1-4 2.1-4 T','49b':'1.1-5 2.1-5 2.1-5 2.1-5',
'49c':'1.1-4 1.1-4 2.1-4 2.1-4'};
export const mappings=Object.fromEntries(Object.entries(raw).map(([id,s])=>[id,s.split(' ')]));
// Add explicit prerequisites/examples where the first-order question had no matching calculation.
export const supplements={
'36b':{example:1,lines:['The driver may access controller registers via mapped addresses {MMIO selects device registers, not ordinary cacheable RAM}.']},
'41a':{example:2,lines:['FFS calls this placement unit a cylinder group {each group contains allocation metadata, inodes and data}.']},
'47b':{example:1,lines:['If the initial timer is 50 ms, a backoff doubles it to 100 ms after the first timeout {multiply by 2}.','A second timeout doubles it to 200 ms {repeat the rule on the new timer, not on the initial timer}.']},
'14b':{example:2,lines:['After free(p), any surviving alias to the released allocation is dangling {the allocation lifetime has ended}.']},
'4a':{example:2,lines:['The PC identifies the next instruction in this simplified execution model {the saved register allows resumption}.']},
'8a':{example:1,lines:['If two runnable jobs have equal priority, round robin chooses their order {the within-queue rule differs from between-queue priority}.']},
'31c':{pages:[370,378]}
};
mappings['36b'][1]='1.6-6';mappings['41a'][1]='2.5-5';mappings['47b'][1]='1.5-6';mappings['14b'][1]='2.5-5';mappings['4a'][1]='2.5-5';mappings['8a'][1]='1.5-5';
const annotations={'9a:2:3':'choose smallest pass; tie rule selects A; add A stride to A pass','22b:1:2':'both referenced pages are initially absent; fill free frames in reference order','41a:1:4':'the trace contains long metadata-to-data and data-to-metadata movements'};
export function auditUnits(detailed){for(const u of Object.values(detailed).flat()){
 let s=supplements[u.id];if(s?.pages)u.pages=[...s.pages];if(s?.lines)u.examples[s.example-1].push(...s.lines);
 u.examples=u.examples.map((ex,i)=>[ex[0],...ex.slice(1).map((line,j)=>/\{[^}]+\}/.test(line)?line:line+' {'+(annotations[u.id+':'+(i+1)+':'+(j+1)]||'given initial state for this trace')+'}')]);
}return detailed}
export function exerciseReference(u,key){const i=Number(key.slice(1))+(key[0]==='v'?2:0),r=mappings[u.id]?.[i];if(!r||r==='T')return{label:'Theory / prerequisite',example:null,steps:[]};let [e,range]=r.split('.'),[a,b]=range.split('-').map(Number);return{label:'Example '+e+', steps '+(a===b?a:a+'–'+b),example:Number(e),steps:Array.from({length:b-a+1},(_,j)=>a+j)}}
export function stepHint(u,key){let r=exerciseReference(u,key);if(!r.example)return 'Identify the definition or assumption in the theory that changes in this question. State it before applying it.';return 'Return to '+r.label+'. Write the new starting state, identify the matching rule, then recompute or replay only the changed inputs. Explain why the transition is legal.'}
export function quizChoices(id,index,attempt=0){let s=2166136261;for(const c of id+':'+index+':'+attempt){s=Math.imul(s^c.charCodeAt(0),16777619)>>>0}let a=[1,2,3,4];for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1664525)+1013904223)>>>0;let j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
