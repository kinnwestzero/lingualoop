import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors={"Access-Control-Allow-Origin":"https://kinnwestzero.github.io","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-sync-token","Access-Control-Allow-Methods":"POST, OPTIONS"};
const hex=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return new Response("Method not allowed",{status:405,headers:cors});
 const token=req.headers.get("x-sync-token")||""; if(token.length<24)return Response.json({error:"unauthorized"},{status:401,headers:cors});
 const id=await hex(token), url=Deno.env.get("SUPABASE_URL")!, service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, openai=Deno.env.get("OPENAI_API_KEY");
 if(!openai)return Response.json({error:"AI is not configured"},{status:503,headers:cors});
 const auth={apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"};
 const state=await fetch(url+"/rest/v1/lingualoop_state?id=eq."+id+"&select=id",{headers:auth});
 if(!state.ok)return Response.json({error:"state lookup failed"},{status:502,headers:cors});
 const rows=await state.json(); if(!Array.isArray(rows)||!rows.length)return Response.json({error:"sync profile not found"},{status:401,headers:cors});
 const today=new Date().toISOString().slice(0,10), q=await fetch(url+"/rest/v1/lingualoop_ai_usage?id=eq."+id+"&day=eq."+today+"&select=calls",{headers:auth}), qr=await q.json(), used=qr[0]?.calls||0, limit=10;
 if(used>=limit)return Response.json({error:"daily limit reached"},{status:429,headers:cors});
 const body=await req.json(), mode=body.mode==="correct"?"correct":"chat", language=body.lang||"en", text=String(body.text||"").slice(0,2000);
 const system=mode==="correct"?"You are LinguaLoop, a concise language coach. Correct the learner's wording, explain the most important error briefly in Korean, give one natural alternative, and preserve the intended meaning. For Academic English, prioritize academic register.":"You are LinguaLoop, a conversation tutor. Reply mainly in the target language, keep the exchange natural and concise, then add one short Korean coaching note. Do not overwhelm the learner.";
 const ai=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+openai,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-5-mini",input:[{role:"system",content:system+" Target language code: "+language+". Scene: "+String(body.context||"")},{role:"user",content:text}],max_output_tokens:350})});
 const data=await ai.json(); if(!ai.ok)return Response.json({error:"AI provider error"},{status:502,headers:cors});
 const reply=data.output_text||data.output?.flatMap((x:any)=>x.content||[]).filter((x:any)=>x.type==="output_text"||typeof x.text==="string").map((x:any)=>x.text||"").join("\n").trim()||"";
 if(!reply){console.error("Empty OpenAI response",JSON.stringify(data));return Response.json({error:"OpenAI returned an empty response"},{status:502,headers:cors});}
 await fetch(url+"/rest/v1/lingualoop_ai_usage",{method:"POST",headers:{...auth,Prefer:"resolution=merge-duplicates"},body:JSON.stringify({id,day:today,calls:used+1})});
 return Response.json({reply,remaining:limit-used-1},{headers:{...cors,"Content-Type":"application/json"}});
});