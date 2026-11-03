/* The three popups, each with its own little animation:
   letter = a blossom splits in half and shows the page; poem = two bunnies part and unroll the scroll;
   story  = the sun and moon part diagonally, then blossom corners open the page. Each returns a promise. */
window.Overlays=(function(){
'use strict';
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function A(el,kf,o){o=o||{};if(!o.fill)o.fill='both';if(RM){o.duration=1;o.delay=0}return el.animate(kf,o).finished.catch(function(){})}
function wait(ms){return new Promise(function(r){setTimeout(r,RM?1:ms)})}
function el(html){var d=document.createElement('div');d.innerHTML=html;return d.firstElementChild}
function lines(box,pg){
 box.innerHTML='';var h=document.createElement('h3');h.textContent=pg.title||'';box.appendChild(h);
 (pg.lines||[]).forEach(function(t){if(!t)return;var p=document.createElement('p');p.textContent=t;box.appendChild(p)});box.scrollTop=0}
function ready(i){return i.complete&&i.naturalWidth?Promise.resolve():new Promise(function(r){i.onload=i.onerror=r})}
function center(n){var r=n.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height}}
function close(ov,inner){
 return Promise.all([A(inner,[{opacity:1,transform:'none'},{opacity:0,transform:'scale(.92) translateY(20px)'}],{duration:320}),A(ov,[{opacity:1},{opacity:0}],{duration:360})]).then(function(){ov.remove()})}


/* ---- the letter as pages that peel from the bottom-right corner ---- */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* a hand-torn outline: only ever cuts inward, so nothing leaves the page box */
function rag(seed,inset,amp){
 var r=mulberry(seed),p=[],n=22,i,J=function(){return(inset+r()*amp).toFixed(1)+'px'};
 for(i=0;i<=n;i++)p.push((i/n*100).toFixed(2)+'% '+J());
 for(i=1;i<=n*2;i++)p.push('calc(100% - '+J()+') '+(i/(n*2)*100).toFixed(2)+'%');
 for(i=1;i<=n;i++)p.push((100-i/n*100).toFixed(2)+'% calc(100% - '+J()+')');
 for(i=1;i<n*2;i++)p.push(J()+' '+(100-i/(n*2)*100).toFixed(2)+'%');
 return'polygon('+p.join(',')+')'}
function div(c,h){var d=document.createElement('div');d.className=c;if(h)d.innerHTML=h;return d}
function pagedLetter(st,page,b,T,fold){
 var rtl=T.dir==='rtl',pgs=[],pi=0,busyT=false,W=0,H=0,D=0,cap=0,drag=null;
 st.classList.add('arl');if(T.lang)st.lang=T.lang;
 page.className='lpg';page.innerHTML='';
 var vint=st.classList.contains('sstage'),edgeP=vint?rag(7,0,5.5):rag(7,0,2.4),paperP=vint?rag(11,4,5.5):rag(11,3.2,2.4);
 if(vint)st.classList.add('vint');
 function sheet(cls){var s=div('sheet '+cls,'<div class="edge"></div><div class="paper"></div><div class="ptxt"></div>');s.children[0].style.clipPath=edgeP;s.children[1].style.clipPath=paperP;return s}
 var shadow=div('lshadow'),stack=div('lstack'),under=sheet('s-under'),shade=div('lshade'),top=sheet('s-top'),flapw=div('flapw'),flap=div('flap','<div class="fb"><div class="ptxt"></div></div>');flapw.appendChild(flap);
 shadow.style.clipPath=edgeP;
 stack.appendChild(under);stack.appendChild(shade);stack.appendChild(top);stack.appendChild(flapw);
 var nav=div('lnav','<button class="pill lback" type="button" aria-label="Back">&lt;</button><span class="lcount"></span>'),back=nav.firstChild,cnt=nav.children[1];
 nav.appendChild(b);
 var dog=div('dogear','<i></i>');dog.setAttribute('role','button');dog.setAttribute('aria-label','Turn the page');
 page.appendChild(shadow);page.appendChild(stack);page.appendChild(nav);page.appendChild(dog);
 var uBox=under.querySelector('.ptxt'),tBox=top.querySelector('.ptxt'),fBox=flap.querySelector('.ptxt');
 /* ---------- page text ---------- */
 function fill(box,ps){box.innerHTML='';ps.forEach(function(t){var p=document.createElement('p');p.textContent=t;box.appendChild(p)})}
 function fits(ps){fill(uBox,ps);return uBox.lastChild.offsetTop+uBox.lastChild.offsetHeight<=Math.min(cap||1e9,uBox.clientHeight)+1}
 function run1(){
  var cur=[];pgs=[];
  T.paragraphs.filter(Boolean).forEach(function(para){
   var txt='';cur.push('');
   para.split(/\s+/).filter(Boolean).forEach(function(w){
    var t=txt?txt+' '+w:w;cur[cur.length-1]=t;
    if(fits(cur)){txt=t;return}
    if(txt)cur[cur.length-1]=txt;else cur.pop();
    pgs.push(cur);cur=[w];txt=w})});
  pgs.push(cur)}
 /* second pass: spread the text evenly so the last page is not a few orphan lines */
 function setF(f){[uBox,tBox,fBox].forEach(function(x){x.style.fontSize=f+'px';x.style.lineHeight=Math.round(f*1.85)+'px'})}
 function fitAll(){var f;for(f=19;f>=10;f-=.5){setF(f);if(pgs.every(function(pg){fill(uBox,pg);return uBox.scrollHeight<=uBox.clientHeight+1}))break}}
 function build(){
  if(T.three){pgs=T.paragraphs.filter(Boolean).map(function(p){return[p]});fitAll();return}
  cap=0;run1();var n=pgs.length;if(n<2)return;
  var hs=0;pgs.forEach(function(ps){fill(uBox,ps);hs+=uBox.lastChild.offsetTop+uBox.lastChild.offsetHeight});
  var first=pgs;cap=Math.min(uBox.clientHeight,Math.ceil(hs/n/32)*32+32);run1();
  if(pgs.length!==n)pgs=first;cap=0}
 /* ---------- the peel: fold line = perpendicular bisector between the corner and the finger ---------- */
 function dims(){W=page.clientWidth;H=page.clientHeight;D=Math.sqrt(W*W+H*H)}
 function diag(){return{x:-W/D,y:-H/D}}
 function smax(u){var m=0;[[0,0],[W,0],[0,H],[W,H]].forEach(function(c){var s=(c[0]-W)*u.x+(c[1]-H)*u.y;if(s>m)m=s});return m}
 function clip(pts,f,keepPos){
  var out=[],n=pts.length;
  for(var i=0;i<n;i++){var a=pts[i],c=pts[(i+1)%n],fa=f(a),fc=f(c),ia=keepPos?fa>=0:fa<=0,ic=keepPos?fc>=0:fc<=0;
   if(ia)out.push(a);
   if(ia!==ic){var t=fa/(fa-fc);out.push([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t])}}
  return out}
 function poly(pts){return pts.length<3?'polygon(0 0,0 0,0 0)':'polygon('+pts.map(function(p){return p[0].toFixed(1)+'px '+p[1].toFixed(1)+'px'}).join(',')+')'}
 function render(d,u){
  var R=[[0,0],[W,0],[W,H],[0,H]],s=function(p){return(p[0]-W)*u.x+(p[1]-H)*u.y-d};
  var A=clip(R,s,true),P=clip(R,s,false);
  top.style.clipPath=poly(A);
  var k=2*((W+d*u.x)*u.x+(H+d*u.y)*u.y);
  flap.style.clipPath=poly(P);
  flap.style.transform='matrix('+(1-2*u.x*u.x)+','+(-2*u.x*u.y)+','+(-2*u.x*u.y)+','+(1-2*u.y*u.y)+','+(k*u.x)+','+(k*u.y)+')';
  shade.style.clipPath=poly(P);
  var th=Math.atan2(-u.x,u.y)*180/Math.PI,Lg=W*Math.abs(u.x)+H*Math.abs(u.y),tf=Lg-d;
  var wd=Math.max(8,Math.min(2*d,150));flap.style.backgroundImage='linear-gradient('+th+'deg,#8a6228 '+tf+'px,#f2e0ae '+(tf+wd*.16)+'px,#dcc48c '+(tf+wd*.55)+'px,#ecd8a4 '+(tf+wd)+'px)';
  shade.style.background='linear-gradient('+th+'deg,rgba(45,22,6,.42) '+tf+'px,rgba(45,22,6,0) '+(tf+Math.min(d*1.4,80))+'px)'}
 function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
 function swing(u0,k){var a=Math.atan2(u0.y,u0.x)+k*.55,x=Math.cos(a),y=Math.sin(a);if(y>-.12)return u0;return{x:x,y:y}}
 function flip(rev,d0,ms,cb){
  var t0=null,tk=++hvTok;if(RM)ms=1;var u0=diag();
  (function f(now){if(t0===null)t0=now;var t=Math.min(1,(now-t0)/ms),e=ease(rev?1-t:t),u=swing(u0,e),m=smax(u);
   render(Math.max(d0*(1-e),0)+e*m*(rev?1:1),u);if(t<1)requestAnimationFrame(f);else if(cb)cb()})(performance.now())}
 var hv=0,hvTok=0;
 /* hover: the corner lifts a little toward the top-left, only the top sheet */
 function peek(to){
  if(busyT||drag||pi>=pgs.length-1)return;dims();var tk=++hvTok,from=hv,u=diag(),t0=null;
  if(to>0&&!hv){fill(tBox,pgs[pi]);fill(fBox,pgs[pi]);fill(uBox,pgs[pi+1]);layers(true)}
  (function f(now){if(tk!==hvTok)return;if(t0===null)t0=now;var t=Math.min(1,(now-t0)/260),e=1-Math.pow(1-t,3);hv=from+(to-from)*e;render(hv,u);
   if(t<1)requestAnimationFrame(f);else if(!to){hv=0;layers(false);fill(uBox,pgs[pi])}})(performance.now())}
 function run(u,from,to,ms,cb){
  var t0=null;if(RM)ms=1;
  (function f(now){if(t0===null)t0=now;var t=Math.min(1,(now-t0)/ms);render(from+(to-from)*ease(t),u);if(t<1)requestAnimationFrame(f);else if(cb)cb()})(performance.now())}
 function layers(on){var v=on?'block':'none';top.style.display=flapw.style.display=shade.style.display=v}
 function setUI(){var last=pi>=pgs.length-1;cnt.textContent=(pi+1)+' / '+pgs.length;back.style.visibility=pi?'visible':'hidden';b.innerHTML=last?'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>':'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';b.setAttribute('aria-label',last?'Close':'Next');dog.style.display=last?'none':''}
 function commit(i){hv=0;hvTok++;pi=i;fill(uBox,pgs[pi]);layers(false);setUI();busyT=false}
 function forward(u){
  if(busyT||pi>=pgs.length-1)return;busyT=true;dims();u=u||diag();
  var h0=hv;hvTok++;fill(tBox,pgs[pi]);fill(fBox,pgs[pi]);fill(uBox,pgs[pi+1]);render(h0,u);layers(true);
  flip(false,h0,1000,function(){commit(pi+1)})}
 function backward(){
  if(busyT||pi<1)return;busyT=true;dims();var u=diag(),m=smax(u);
  fill(tBox,pgs[pi-1]);fill(fBox,pgs[pi-1]);fill(uBox,pgs[pi]);render(m,u);layers(true);
  flip(true,0,1000,function(){commit(pi-1)})}
 b.onclick=function(){if(pi<pgs.length-1)forward();else fold()};
 back.onclick=backward;
 /* drag the corner with a finger or the mouse; a plain tap turns the whole page */
 dog.onpointerenter=function(e){if(e.pointerType==='mouse')peek(30)};
 dog.onpointerleave=function(){peek(0)};
 dog.onpointerdown=function(e){
  if(busyT||pi>=pgs.length-1)return;dims();hvTok++;
  drag={x:e.clientX,y:e.clientY,moved:false,r:page.getBoundingClientRect(),u:diag(),d:0};
  try{dog.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
 dog.onpointermove=function(e){
  if(!drag)return;
  if(!drag.moved){if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)<6)return;
   drag.moved=true;busyT=true;fill(tBox,pgs[pi]);fill(fBox,pgs[pi]);fill(uBox,pgs[pi+1]);layers(true)}
  var vx=Math.min(0,e.clientX-drag.r.left-W),vy=Math.min(0,e.clientY-drag.r.top-H),len=Math.sqrt(vx*vx+vy*vy);
  if(len<2){drag.d=0;drag.u=diag();render(0,drag.u);return}
  drag.u={x:vx/len,y:vy/len};drag.d=len/2;render(drag.d,drag.u)};
 dog.onpointerup=dog.onpointercancel=function(){
  if(!drag)return;var g=drag;drag=null;
  if(!g.moved){forward();return}
  var m=smax(g.u);
  if(g.d>D*.16)run(g.u,g.d,m,Math.max(260,520*(1-g.d/m)+260),function(){commit(pi+1)});
  else run(g.u,g.d,0,260,function(){commit(pi)})};
 /* ---------- start once the font is in, so the page breaks are measured on the real glyphs ---------- */
 back.style.visibility='hidden';layers(false);
 var sample=T.paragraphs.join(' ').slice(0,60),tmo=new Promise(function(r){setTimeout(r,1800)});
 Promise.race([document.fonts.load('400 1.12rem "Scheherazade New"',sample).catch(function(){}),tmo]).then(function(){dims();build();commit(0)})}

/* ---- letter ---- */
function letter(T){
 return new Promise(function(done){
  var ov=el('<div class="ov fxov"><div class="stage lstage" dir="'+(T.dir||'ltr')+'"><div class="fpage lpage"><div class="ptxt"></div><button class="pill primary pbtn" type="button">Fold the letter</button></div><img class="bl bl-l" src="fx/blossom.webp" alt="" draggable="false"><img class="bl bl-r" src="fx/blossom.webp" alt="" draggable="false"></div></div>');
  document.body.appendChild(ov);
  var st=ov.firstChild,page=st.querySelector('.lpage'),L=st.querySelector('.bl-l'),R=st.querySelector('.bl-r'),b=st.querySelector('.pbtn');
  var fold=function(){b.disabled=true;close(ov,st).then(done)};
  if(T.paged)pagedLetter(st,page,b,T,fold);else lines(st.querySelector('.ptxt'),{title:T.title,lines:T.paragraphs});
  A(ov,[{opacity:0},{opacity:1}],{duration:300});
  A(page,[{opacity:0,transform:'scaleY(.04)'},{opacity:0,transform:'scaleY(.04)'}],{duration:1});
  A(L,[{opacity:0},{opacity:0}],{duration:1});A(R,[{opacity:0},{opacity:0}],{duration:1});
  ready(L).then(function(){
  var pop=[{transform:'translate(-50%,-50%) scale(0) rotate(-50deg)',opacity:0},{transform:'translate(-50%,-50%) scale(1.08) rotate(6deg)',opacity:1,offset:.7},{transform:'translate(-50%,-50%) scale(1) rotate(0)',opacity:1}];
  A(L,pop,{duration:700,easing:'ease-out'});A(R,pop,{duration:700,easing:'ease-out'}).then(function(){return wait(380)}).then(function(){
   var sr=st.getBoundingClientRect(),hh=L.offsetHeight/2,bw=L.offsetWidth,dd=sr.height/2-24,
    sc=Math.max(.5,Math.min(1,Math.min(sr.top+24,innerHeight-sr.bottom+24)/hh*.98));
   function hold(e,sign,cx){return A(e,[{transform:'translate(-50%,-50%) translate(0px,0px) scale(1)'},{transform:'translate(-50%,-50%) translate('+(-(cx-.5)*bw*sc)+'px,'+(sign*dd)+'px) scale('+sc+')'}],{duration:1100,easing:'cubic-bezier(.5,0,.25,1)'})}
   hold(L,-1,.534);hold(R,1,.518);
   A(page,[{opacity:0,transform:'scaleY(.04)'},{opacity:1,transform:'scaleY(1)'}],{duration:1000,delay:120,easing:'cubic-bezier(.25,.9,.3,1)'})})});
  if(!T.paged)b.onclick=fold})}

/* ---- poem ---- */
function poem(T){
 return new Promise(function(done){
  var ov=el('<div class="ov fxov"><div class="pcol"><div class="stage pstage" dir="'+(T.dir||'ltr')+'"><img class="scroll" src="fx/scroll.webp" alt="" draggable="false"><div class="stxt"><div class="sin"></div></div><img class="bunny b1" src="fx/bunny1.webp" alt="" draggable="false"><img class="bunny b2" src="fx/bunny2.webp" alt="" draggable="false"></div><button class="pill primary pbtn" type="button">Close</button></div></div>');
  document.body.appendChild(ov);
  var st=ov.querySelector('.pstage'),scroll=st.querySelector('.scroll'),txt=st.querySelector('.stxt'),b1=st.querySelector('.b1'),b2=st.querySelector('.b2'),b=ov.querySelector('.pbtn');
  var sin=st.querySelector('.sin');
  if(T.verses){
   var h3=document.createElement('h3');h3.textContent=T.title||'';sin.appendChild(h3);
   T.verses.forEach(function(v){
    if(v==='-'){sin.appendChild(div('vsep','\u2726'));return}
    var d=div('verse');v.forEach(function(t){var p=document.createElement('p');p.textContent=t;d.appendChild(p)});sin.appendChild(d)});
   st.classList.add('arp');if(T.lang)st.lang=T.lang;
   var im=st.querySelector('img.scroll'),d9=div('scroll scroll9');im.parentNode.replaceChild(d9,im);scroll=d9;
   var pre=new Image();pre.src='fx/scroll.webp';
   /* every line must show at once: find the biggest font where the poem fits the scroll, no scrolling */
   var box=st.querySelector('.stxt'),rows=[].slice.call(sin.querySelectorAll('.verse'));
   var okSize=function(f){sin.style.fontSize=f+'px';
    if(sin.scrollHeight>box.clientHeight+1)return false;
    return rows.every(function(r){return[].every.call(r.children,function(p){return p.scrollWidth<=p.clientWidth+1})})};
   var fit=function(){var lo=8,hi=26,i,m;for(i=0;i<11;i++){m=(lo+hi)/2;if(okSize(m))lo=m;else hi=m}sin.style.fontSize=(lo*.96)+'px'};
   var onR=function(){if(!document.body.contains(ov)){removeEventListener('resize',onR);return}fit()};
   var smp=T.verses[0].join(' ');
   Promise.race([Promise.all([document.fonts.load('400 16px "Amiri"',smp),document.fonts.load('700 16px "Amiri"',T.title||'')]).catch(function(){}),new Promise(function(r){setTimeout(r,1800)})]).then(function(){fit();addEventListener('resize',onR);if(document.fonts.ready)document.fonts.ready.then(fit)});
  }else lines(sin,{title:T.title,lines:T.lines});
  A(ov,[{opacity:0},{opacity:1}],{duration:300});
  A(scroll,[{clipPath:'inset(0 0 100% 0)',opacity:0},{clipPath:'inset(0 0 100% 0)',opacity:0}],{duration:1});A(txt,[{opacity:0},{opacity:0}],{duration:1});A(b,[{opacity:0},{opacity:0}],{duration:1});
  Promise.all([T.verses?ready(pre):ready(scroll),ready(b1),ready(b2)]).then(function(){
  var sc=center(st),c1=center(b1),c2=center(b2);
  var d1={x:sc.x-c1.x,y:sc.y-c1.y},d2={x:sc.x-c2.x,y:sc.y-c2.y};
  function pop(e,d,rot){return A(e,[{transform:'translate('+d.x+'px,'+d.y+'px) scale(0) rotate('+rot+'deg)',opacity:0},{transform:'translate('+d.x+'px,'+d.y+'px) scale(1.15) rotate(0)',opacity:1,offset:.65},{transform:'translate('+d.x+'px,'+d.y+'px) scale(1) rotate(0)',opacity:1}],{duration:650,easing:'ease-out'})}
  /* both bunnies pop up in the middle, then part to the top-left and bottom-right while the scroll unrolls */
  Promise.all([pop(b1,{x:d1.x+18,y:d1.y+10},-25),pop(b2,{x:d2.x-18,y:d2.y-10},25)]).then(function(){return wait(260)}).then(function(){
   A(b1,[{transform:'translate('+(d1.x+18)+'px,'+(d1.y+10)+'px)'},{transform:'translate(0,0)'}],{duration:850,easing:'cubic-bezier(.3,1.3,.5,1)'});
   A(b2,[{transform:'translate('+(d2.x-18)+'px,'+(d2.y-10)+'px)'},{transform:'translate(0,0)'}],{duration:850,easing:'cubic-bezier(.3,1.3,.5,1)'});
   A(scroll,[{clipPath:'inset(0 0 100% 0)',opacity:1},{clipPath:'inset(0 0 0% 0)',opacity:1}],{duration:1000,delay:160,easing:'cubic-bezier(.3,.8,.3,1)'});
   A(txt,[{opacity:0},{opacity:1}],{duration:600,delay:900});A(b,[{opacity:0},{opacity:1}],{duration:500,delay:1100})})});
  b.onclick=function(){b.disabled=true;close(ov,ov.firstChild).then(done)}})}

/* ---- story ---- */
function story(T){
 return new Promise(function(done){
  var pages=T.pages||[{title:T.title,lines:T.paragraphs}],i=0;
  var ov=el('<div class="ov fxov"><div class="stage sstage" dir="'+(T.dir||'ltr')+'"><div class="fpage spage"><div class="ptxt"></div><button class="pill primary pbtn" type="button"></button></div><img class="sun" src="fx/sun.webp" alt="" draggable="false"><img class="mn" src="fx/moonface.webp" alt="" draggable="false"></div></div>');
  document.body.appendChild(ov);
  var st=ov.firstChild,page=st.querySelector('.spage'),box=st.querySelector('.ptxt'),b=st.querySelector('.pbtn'),sun=st.querySelector('.sun'),mn=st.querySelector('.mn');
  var fold=function(){b.disabled=true;close(ov,st).then(done)};
  function render(){lines(box,pages[i]);b.textContent=i<pages.length-1?'Next':'Close'}
  if(T.paged)pagedLetter(st,page,b,T,fold);else render();
  A(ov,[{opacity:0},{opacity:0}],{duration:1});A(ov,[{opacity:0},{opacity:1}],{duration:300});
  A(page,[{opacity:0,transform:'scale(.55)'},{opacity:0,transform:'scale(.55)'}],{duration:1});
  Promise.all([ready(sun),ready(mn)]).then(function(){
  var sc=center(st),cs=center(sun),cm=center(mn);
  var ds={x:sc.x-cs.x-34,y:sc.y-cs.y},dm={x:sc.x-cm.x+34,y:sc.y-cm.y};
  function pop(e,d,rot){return A(e,[{transform:'translate('+d.x+'px,'+d.y+'px) scale(0) rotate('+rot+'deg)',opacity:0},{transform:'translate('+d.x+'px,'+d.y+'px) scale(1.15) rotate(0)',opacity:1,offset:.65},{transform:'translate('+d.x+'px,'+d.y+'px) scale(1) rotate(0)',opacity:1}],{duration:650,easing:'ease-out'})}
  /* sun and moon pop together, part diagonally, then the page opens */
  Promise.all([pop(sun,ds,-30),pop(mn,dm,30)]).then(function(){return wait(320)}).then(function(){
   A(sun,[{transform:'translate('+ds.x+'px,'+ds.y+'px)'},{transform:'translate(0,0)'}],{duration:950,easing:'cubic-bezier(.35,1.2,.5,1)'});
   A(mn,[{transform:'translate('+dm.x+'px,'+dm.y+'px)'},{transform:'translate(0,0)'}],{duration:950,easing:'cubic-bezier(.35,1.2,.5,1)'});
   A(page,[{opacity:0,transform:'scale(.55)'},{opacity:1,transform:'none'}],{duration:950,delay:260,easing:'cubic-bezier(.3,1,.4,1)'})})});
  if(!T.paged)b.onclick=function(){
   if(i<pages.length-1){i++;A(box,[{opacity:1},{opacity:0},{opacity:1}],{duration:380});setTimeout(render,190);return}
   b.disabled=true;close(ov,st).then(done)}})}
return{letter:letter,poem:poem,story:story};
})();
