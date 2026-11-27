// Dedicated worker. Terminating it cancels loading/inference and releases the engine.
const CDN='https://esm.run/@mlc-ai/web-llm@0.2.79';
let mlc=null,engine=null,model=null;
self.onmessage=async e=>{
 const {id,op,model:requested,messages}=e.data;
 const send=(type,extra)=>self.postMessage({id,type,...extra});
 try{
  if(!mlc){send('progress',{text:'Loading pinned WebLLM library…'});mlc=await import(CDN)}
  const catalog=mlc.prebuiltAppConfig.model_list;
  if(op==='catalog'){send('result',{value:catalog.filter(m=>!m.model_type||m.model_type==='LLM'||m.model_type===0).map(m=>({id:m.model_id,vramMB:m.vram_required_MB,lowResource:m.low_resource_required}))});return}
  if(op!=='generate')throw Error('Unknown worker operation');
  if(!catalog.some(m=>m.model_id===requested))throw Error('Model is not in this pinned WebLLM catalog. Discover supported models in Preferences.');
  if(model!==requested||!engine){
   if(engine)await engine.unload();
   send('progress',{text:'Loading '+requested+'; first use downloads model weights…'});
   engine=await mlc.CreateMLCEngine(requested,{initProgressCallback:r=>send('progress',{text:r.text})});model=requested;
  }
  send('progress',{text:'Generating locally in WebGPU…'});
  const r=await engine.chat.completions.create({messages,temperature:0.2,max_tokens:650,stream:false});
  const value=r.choices?.[0]?.message?.content;
  if(typeof value!=='string'||!value.trim())throw Error('WebLLM returned empty text');
  send('result',{value});
 }catch(err){send('error',{error:String(err?.message||err)})}
};
