import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors={"Access-Control-Allow-Origin":"https://kinnwestzero.github.io","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-sync-token","Access-Control-Allow-Methods":"POST, OPTIONS"};
const hex=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return Response.json({error:"method not allowed"},{status:405,headers:cors});
 const token=req.headers.get("x-sync-token")||"";
 if(token.length<24)return Response.json({error:"unauthorized"},{status:401,headers:cors});
 const url=Deno.env.get("SUPABASE_URL")!,service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,id=await hex(token);
 const headers={apikey:service,Authorization:"Bearer "+service,"Content-Type":"application/json"};
 const body=await req.json().catch(()=>({}));
 if(body.action==="pull"){const r=await fetch(url+"/rest/v1/lingualoop_state?id=eq."+id+"&select=state",{headers});if(!r.ok)return Response.json({error:"database read failed"},{status:502,headers:cors});const rows=await r.json();return Response.json({state:rows[0]?.state||null},{headers:cors})}
 if(body.action==="push"){if(!body.state||typeof body.state!=="object")return Response.json({error:"invalid state"},{status:400,headers:cors});const r=await fetch(url+"/rest/v1/lingualoop_state",{method:"POST",headers:{...headers,Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({id,state:body.state,updated_at:new Date().toISOString()})});if(!r.ok)return Response.json({error:"database write failed"},{status:502,headers:cors});return Response.json({ok:true},{headers:cors})}
 return Response.json({error:"invalid action"},{status:400,headers:cors});
});