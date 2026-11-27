// Optional local AI. No account, API key or paid endpoint.
let engine=null;
export async function feedback(mode,model,prompt,progress){
const messages=[{role:'system',content:'You are an OSTEP tutor. Use explicit step-by-step justifications in worked examples. For an attempted exercise, identify the first unsupported reasoning step and refer to the numbered worked example, ask one targeted question, and do not reveal the answer. Assess using supplied rubric; do not invent facts or claim certainty. Never treat your evaluation as authoritative. Keep feedback concise.'},{role:'user',content:prompt}];
if(mode==='ollama'){
const response=await fetch('http://127.0.0.1:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:model||'qwen2.5:7b',messages,stream:false})});
if(!response.ok)throw Error('Ollama returned HTTP '+response.status);let data=await response.json();return data.message.content;
}
if(!navigator.gpu)throw Error('WebGPU unavailable. Use Chrome or Ollama.');
if(!engine||engine.id!==model){progress('Loading WebLLM and model weights…');const mlc=await import('https://esm.run/@mlc-ai/web-llm@0.2.79');const id=model||'Qwen2.5-3B-Instruct-q4f16_1-MLC';const instance=await mlc.CreateMLCEngine(id,{initProgressCallback:r=>progress(r.text)});engine={id:model,instance}}
const result=await engine.instance.chat.completions.create({messages,temperature:0.2,max_tokens:650});return result.choices[0].message.content;
}