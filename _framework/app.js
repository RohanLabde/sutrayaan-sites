(function(){
  const S=window.SITE||{};
  const VIEWS=["home","capabilities","quality","about","quote","leads"];
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  let pendingPrefill=null;
  function show(name){
    if(!VIEWS.includes(name)) name="home";
    $$(".view").forEach(v=>v.classList.toggle("active",v.id==="v-"+name));
    $$("nav.main a").forEach(a=>{ if(a.dataset.nav===name) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
    $("#mainNav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded","false");
    if(name==="quote" && pendingPrefill==="docs"){ $("#f_type").value=S.docsType; }
    pendingPrefill=null;
    window.scrollTo(0,0);
  }
  document.addEventListener("click",e=>{const a=e.target.closest("a[data-prefill]"); if(a) pendingPrefill=a.dataset.prefill;});
  window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
  show(location.hash.slice(1)||"home");
  $("#menuBtn").addEventListener("click",()=>{const o=$("#mainNav").classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",o)});

  $$("[data-copy]").forEach(b=>b.addEventListener("click",()=>{
    const t=b.dataset.copy;
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{b.textContent="Copied";setTimeout(()=>b.textContent="Copy",1500)}).catch(()=>{b.textContent="Select text";});
  }));

  let files=[];
  const drop=$("#drop"), fin=$("#f_files");
  function renderFiles(){ $("#fileList").innerHTML=""; files.forEach(f=>{const d=document.createElement("div");d.textContent="▸ "+f.name+" · "+(f.size/1024/1024).toFixed(2)+" MB";$("#fileList").appendChild(d)}); }
  fin.addEventListener("change",()=>{files=[...fin.files];renderFiles()});
  ["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over")}));
  ["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over")}));
  drop.addEventListener("drop",e=>{files=[...e.dataTransfer.files];renderFiles()});

  const API=(S.api&&!/^__/.test(S.api))?S.api:"";
  async function api(body){ const r=await fetch(API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(body)}); const j=await r.json(); if(!j.ok) throw new Error(j.error||"failed"); return j; }

  function setErr(id,msg){const el=document.querySelector('.err[data-for="'+id+'"]');const inp=$("#"+id);if(!el)return;el.hidden=!msg;el.textContent=msg||"";inp.classList.toggle("invalid",!!msg)}
  function val(id){const el=$("#"+id);return el?(el.value||"").trim():""}
  $$("#rfq input,#rfq textarea").forEach(i=>i.addEventListener("input",()=>setErr(i.id,"")));
  $("#rfq").addEventListener("submit",async e=>{
    e.preventDefault();
    let ok=true;
    const isDocs=val("f_type")===S.docsType;
    [["f_name","Enter your name."],["f_company","Enter your company name."]].forEach(([id,m])=>{const bad=!val(id);setErr(id,bad?m:"");if(bad)ok=false});
    if(!isDocs){
      const bad=!val("f_qty"); setErr("f_qty",bad?S.qtyError:""); if(bad) ok=false;
      if(S.descRequired){const b2=!val("f_desc"); setErr("f_desc",b2?S.descError:""); if(b2) ok=false;}
    } else {setErr("f_qty","");setErr("f_desc","")}
    const email=val("f_email"), phone=val("f_phone");
    setErr("f_email",""); setErr("f_phone","");
    if(!email&&!phone){setErr("f_email","Give an email or a phone number so we can reply.");ok=false}
    else if(email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){setErr("f_email","This email address looks incomplete.");ok=false}
    if(phone&&phone.replace(/\D/g,"").length<8){setErr("f_phone","Include the full number with country code.");ok=false}
    $("#formErr").hidden=ok; $("#formErr").textContent=ok?"":"Some details are missing. Check the highlighted fields.";
    if(!ok) return;
    const extras=$$("[data-extra]").map(x=>{const v=(x.value||"").trim(); return v&&!/^(Not sure|Select)/.test(v)?x.dataset.extra+": "+v:""}).filter(Boolean);
    const desc=[extras.join(" · "),val("f_desc")].filter(Boolean).join("\n");
    const lead={site:S.slug,brand:S.brand,type:val("f_type"),process:val("f_proc"),name:val("f_name"),company:val("f_company"),email,phone,city:val("f_city"),material:val("f_material"),qty:val("f_qty"),neededBy:val("f_date"),desc,files:files.map(f=>f.name),nda:$("#f_nda").checked};
    const btn=$("#submitBtn"); btn.disabled=true; btn.textContent="Sending"; btn.classList.add("loading");
    let saved=false, ref="";
    if(API){ try{ const j=await api(Object.assign({action:"create",website:$("#f_web").value},lead)); ref=j.ref; saved=true; }catch(err){ saved=false } }
    btn.disabled=false; btn.classList.remove("loading"); btn.textContent="Send request";
    if(!saved){ $("#formErr").hidden=false; $("#formErr").textContent="We could not send this just now. Please email or WhatsApp us using the details on the right."; return; }
    $("#refNo").textContent=ref;
    $("#doneMsg").textContent=isDocs?S.docsDone:S.quoteDone;
    const note=$("#demoNote"); note.hidden=false;
    note.innerHTML='Demo: saved to the owner\'s Google Sheet and emailed to them. <a href="#leads">See it in the tracker →</a>';
    if(window.refreshLeads) setTimeout(window.refreshLeads,800);
    $("#rfq").hidden=true; $("#done").hidden=false; window.scrollTo(0,0);
  });
  $("#another").addEventListener("click",()=>{$("#rfq").reset();files=[];renderFiles();$("#rfq").hidden=false;$("#done").hidden=true;$("#formErr").hidden=true});

  const STATUSES=["New","Contacted","Quoted","Won","Lost"];
  function ago(iso){const m=Math.round((Date.now()-new Date(iso))/60000);if(m<60)return Math.max(m,0)+" min ago";const h=Math.round(m/60);if(h<48)return h+" h ago";return Math.round(h/24)+" days ago"}
  function esc(s){const d=document.createElement("div");d.textContent=s==null?"":String(s);return d.innerHTML}
  function render(leads,editable){
    const list=$("#leadList"); list.innerHTML="";
    const n=s=>leads.filter(l=>l.status===s).length;
    const late=leads.filter(l=>l.status==="New"&&Date.now()-new Date(l.createdAt)>864e5).length;
    $("#k-new b").textContent=n("New"); $("#k-late b").textContent=late; $("#k-quoted b").textContent=n("Quoted"); $("#k-won b").textContent=n("Won");
    $("#k-late").classList.toggle("alert",late>0);
    leads.forEach(l=>{
      const el=document.createElement("article"); el.className="lead";
      el.innerHTML='<div class="who"><b>'+esc(l.company)+' <span class="muted" style="font-weight:400">· '+esc(l.name)+'</span>'+(l.example?' <span class="tag">example</span>':'')+'</b>'+
        '<div class="meta"><span>'+esc(l.ref)+'</span><span>'+esc(ago(l.createdAt))+'</span><span>'+esc(l.type)+'</span>'+(l.city?'<span>'+esc(l.city)+'</span>':'')+'</div></div>'+
        '<div class="actions"><span class="pill s-'+esc(l.status)+'">'+esc(l.status)+'</span>'+
        (editable?'<select aria-label="Status for '+esc(l.ref)+'">'+STATUSES.map(s=>'<option'+(s===l.status?' selected':'')+'>'+s+'</option>').join("")+'</select>':'')+'</div>'+
        '<div class="detail"><span><b>'+esc(S.procLabel)+':</b> '+esc(l.process||"—")+' · <b>'+esc(S.materialLabel)+':</b> '+esc(l.material||"—")+' · <b>Qty:</b> '+esc(l.qty||"—")+'</span><span>'+esc(l.desc||"—")+'</span>'+
        (l.files&&l.files.length?'<span class="mono">Files: '+esc(l.files.join(", "))+'</span>':'')+'</div>';
      if(editable){
        const sel=el.querySelector("select");
        sel.addEventListener("change",async()=>{
          sel.disabled=true;
          try{await api({action:"status",ref:l.ref,status:sel.value}); l.status=sel.value; const p=el.querySelector(".pill"); p.className="pill s-"+sel.value; p.textContent=sel.value;}catch(e){sel.value=l.status}
          sel.disabled=false;
        });
      }
      list.appendChild(el);
    });
    const top=leads[0];
    if(top){ const t=new Date(top.createdAt);
      $("#waBubble").innerHTML='<b>New request · '+esc(top.ref)+'</b><span>'+esc(top.company)+' ('+esc(top.name)+')</span><span class="muted">'+esc(String(top.desc||top.type).slice(0,90))+'</span><span class="muted">Qty: '+esc(top.qty||"—")+'</span><span class="t">'+t.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})+'</span>'; }
  }
  function exampleLeads(){
    const now=Date.now();
    return (S.examples||[]).map((x,i)=>Object.assign({status:"New",example:true,files:[]},x,{createdAt:new Date(now-x.hoursAgo*36e5).toISOString()}));
  }
  function startTracker(){
    const notice=$("#trackerNotice");
    if(!API){ notice.hidden=false; notice.innerHTML='<b>You are seeing example data.</b><span class="muted">On a live site this page is private to the business owner.</span>'; render(exampleLeads(),false); return; }
    notice.hidden=false;
    notice.innerHTML='<b>Live demo.</b><span class="muted">Requests sent from this site appear here. Contact details are hidden on this public page; the owner sees them in Google Sheets.</span>';
    let busy=false;
    async function load(){ if(busy) return; busy=true;
      try{ const r=await fetch(API+"?site="+encodeURIComponent(S.slug)+"&t="+Date.now()); const j=await r.json();
        const leads=(j.leads||[]).filter(l=>l.site===S.slug);
        render(leads.length?leads:exampleLeads(),leads.length>0); }
      catch(e){ render(exampleLeads(),false); }
      busy=false; }
    window.refreshLeads=load;
    load(); setInterval(()=>{ if(document.querySelector("#v-leads.active")) load(); },15000);
    addEventListener("hashchange",()=>{ if(location.hash==="#leads") load(); });
  }
  startTracker();
})();
