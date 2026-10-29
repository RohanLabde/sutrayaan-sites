(function(){
  const API="https://script.google.com/macros/s/AKfycbyYwGXasel1oc08exteRvWOB1FTzNsU_Z9-euF3ASVmri06roiDyTP0OJnD5GO4TkK19Q/exec";
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

  // nav
  const menuBtn=$("#menuBtn"), nav=$("#mainNav");
  menuBtn.addEventListener("click",()=>{const o=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o)});
  const hdr=$("header.site");

  // the thread: a saffron line through every section knot, drawn as you scroll
  const main=$("#main"), path=$("#threadPath");
  let len=0;
  function layoutThread(){
    const knots=$$("[data-knot] .knot");
    if(!path||window.innerWidth<1000||knots.length<2){if(path)path.setAttribute("d","");len=0;return}
    const mb=main.getBoundingClientRect(); const x0=Math.max(18,(mb.width-1160)/2-26);
    const pts=knots.map(k=>{const r=k.getBoundingClientRect();return [r.left+r.width/2-mb.left, r.top+r.height/2-mb.top]});
    let d=`M${x0} 0 C ${x0} ${pts[0][1]*.5}, ${pts[0][0]} ${pts[0][1]*.5}, ${pts[0][0]} ${pts[0][1]}`;
    for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],dy=by-ay,sw=(i%2?-1:1)*Math.min(70,ax-6);
      d+=` C ${ax+sw} ${ay+dy*.35}, ${bx+sw} ${by-dy*.35}, ${bx} ${by}`;}
    path.setAttribute("d",d); len=path.getTotalLength(); path.style.strokeDasharray=len; draw();
  }
  const steps=$("#steps");
  function draw(){
    if(steps){const r=steps.getBoundingClientRect(); const q=reduce?1:Math.min(1,Math.max(0,(innerHeight*.8-r.top)/(innerHeight*.5))); steps.style.setProperty("--p",(q*100)+"%");}
    if(!len) return; if(reduce){path.style.strokeDashoffset=0;return}
    const mb=main.getBoundingClientRect(); const p=Math.min(1,Math.max(0,(innerHeight*.7-mb.top)/mb.height));
    path.style.strokeDashoffset=len*(1-p);
  }
  let tick=false;
  addEventListener("scroll",()=>{hdr.classList.toggle("scrolled",scrollY>8); if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;draw()})}},{passive:true});
  addEventListener("resize",layoutThread);
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(layoutThread,50));
  addEventListener("load",layoutThread);
  $$("details").forEach(d=>d.addEventListener("toggle",()=>setTimeout(layoutThread,10)));
  draw();

  // reveals
  if(!reduce && "IntersectionObserver" in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove("below");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
    $$(".sec-head,.demo,.case,.problems>div,.pack,.prow,.steps li,.quote,.faq,.audit-copy,form.card,.timebox,.promise,.principles>div,.ccard,.name-block,.note-box").forEach(el=>{el.classList.add("reveal"); if(el.getBoundingClientRect().top>innerHeight*.9) el.classList.add("below"); io.observe(el);});
    $$(".demos,.problems,.packs,.steps,.principles,.ccards").forEach(g=>[...g.children].forEach((c,i)=>c.style.transitionDelay=(i*90)+"ms"));
  }

  // audit form (home, free audit, contact)
  const form=$("#auditForm"); if(!form) return;
  function setErr(id,msg){const el=document.querySelector('.err[data-for="'+id+'"]');if(!el)return;el.hidden=!msg;el.textContent=msg||"";$("#"+id).classList.toggle("invalid",!!msg)}
  const v=id=>($("#"+id).value||"").trim();
  $$("#auditForm input").forEach(i=>i.addEventListener("input",()=>setErr(i.id,"")));
  form.addEventListener("submit",async e=>{
    e.preventDefault(); let ok=true;
    [["a_name","Enter your name."],["a_company","Enter your company name."]].forEach(([id,m])=>{const b=!v(id);setErr(id,b?m:"");if(b)ok=false});
    const ph=v("a_phone"), em=v("a_email"); setErr("a_phone",""); setErr("a_email","");
    if(!ph&&!em){setErr("a_phone","Give a phone number or an email so we can reply.");ok=false}
    if(em&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){setErr("a_email","This email address looks incomplete.");ok=false}
    if(ph&&ph.replace(/\D/g,"").length<8){setErr("a_phone","Include the full number.");ok=false}
    $("#aErr").hidden=ok; $("#aErr").textContent=ok?"":"Some details are missing. Check the highlighted fields.";
    if(!ok) return;
    const btn=$("#aBtn"); btn.classList.add("loading"); btn.textContent="Sending";
    try{
      const r=await fetch(API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"create",site:"sutrayaan",brand:"Sutrayaan",website:v("a_web"),type:form.dataset.type||"Free website audit",process:v("a_ind"),material:v("a_prob"),qty:"—",name:v("a_name"),company:v("a_company"),email:em,phone:ph,desc:"Current website: "+(v("a_site")||"none")+" · Sent from: "+location.pathname,files:[],nda:false})});
      const j=await r.json(); if(!j.ok) throw 0;
      $("#aRef").textContent=j.ref; form.hidden=true; $("#aDone").hidden=false; setTimeout(layoutThread,20);
    }catch(err){ $("#aErr").hidden=false; $("#aErr").textContent="We couldn't send that just now. Please WhatsApp us on +91 99675 55168."; }
    btn.classList.remove("loading"); btn.textContent="Send my audit request";
  });
})();
