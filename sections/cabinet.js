window.Sections=window.Sections||{};
window.Sections.cabinet={mount:function(host,ctx){
 var M=window.CABMAP,Z=M.zones,B=M.box,R=window.ROOMS,CT=window.CONTENT||{},IC=window.Icons,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var TOTAL=R.reduce(function(n,r){return n+r.photos.length},0);
 if(TOTAL!==19&&window.console)console.warn('Photos in js/photos.js: '+TOTAL+' (the plan says 19)');
 var KEY='arn-cab-v2',S={};
 try{S=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
 if(/[?&]reset/.test(location.search))S={};
 S.caught=S.caught||[];
 function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
 function A(el,kf,o){o=o||{};if(!o.fill)o.fill='forwards';if(RM){o.duration=1;o.delay=0}return el.animate(kf,o).finished.catch(function(){})}
 function wait(ms){return new Promise(function(r){setTimeout(r,RM?1:ms)})}
 function tween(ms,fn){return new Promise(function(res){if(RM){fn(1);return res()}var t0=performance.now();(function f(n){var p=Math.min(1,(n-t0)/ms);fn(p);p<1?requestAnimationFrame(f):res()})(t0)})}
 function bbox(pts,g){g=g||0;var xs=pts.map(function(p){return p[0]}),ys=pts.map(function(p){return p[1]});var x=Math.min.apply(0,xs)-g,y=Math.min.apply(0,ys)-g;return{x:x,y:y,w:Math.max.apply(0,xs)+g-x,h:Math.max.apply(0,ys)+g-y}}
 function pos(b){return'left:'+((b.x-B[0])/B[2]*100)+'%;top:'+((b.y-B[1])/B[3]*100)+'%;width:'+(b.w/B[2]*100)+'%;height:'+(b.h/B[3]*100)+'%'}
 function soft(p,r){var n=p.length,d='';
  for(var i=0;i<n;i++){var a=p[(i+n-1)%n],b=p[i],c=p[(i+1)%n];
   function u(q){var dx=q[0]-b[0],dy=q[1]-b[1],l=Math.sqrt(dx*dx+dy*dy)||1;return[dx/l,dy/l,l]}
   var v1=u(a),v2=u(c),l1=Math.min(r,v1[2]/2),l2=Math.min(r,v2[2]/2);
   d+=(i?'L':'M')+(b[0]+v1[0]*l1).toFixed(1)+' '+(b[1]+v1[1]*l1).toFixed(1)+'Q'+b[0]+' '+b[1]+' '+(b[0]+v2[0]*l2).toFixed(1)+' '+(b[1]+v2[1]*l2).toFixed(1)}
  return d+'Z'}
 function caughtIn(r){return r.photos.filter(function(p,i){return S.caught.indexOf(r.id+'-'+i)>-1}).length}
 function allDone(){return S.caught.length>=TOTAL}
 var KEYIMG='<img src="key.webp" alt="" draggable="false">';
 var SCROLLSVG='<svg viewBox="0 0 80 70" aria-hidden="true"><rect x="8" y="14" width="64" height="44" rx="4" fill="#f5e8c6" stroke="#6b4a32" stroke-width="2.4"/><rect x="4" y="10" width="72" height="9" rx="4.5" fill="#ecd9a6" stroke="#6b4a32" stroke-width="2.4"/><rect x="4" y="53" width="72" height="9" rx="4.5" fill="#ecd9a6" stroke="#6b4a32" stroke-width="2.4"/><rect x="34" y="8" width="12" height="56" fill="#d9684c" stroke="#6b4a32" stroke-width="2"/></svg>';
 var SPECIAL={envelope:'The letter',clouds:'The cloudy drawer',castle:'Our story',lock:'The locked drawer'};
 var s=document.createElement('section');s.className='sec cabsec';s.dataset.phase='explore';
 var zones='',fogs='';
 R.forEach(function(r,i){zones+='<path class="zone room" data-r="'+i+'" tabindex="0" role="button" aria-label="Open '+r.title+'" d="'+soft(Z[r.zone],10)+'"/>'});
 var FOGPLAN={
  envelope:[[1,.26,.5,1.0],[1,.74,.46,1.0],[3,.5,.5,.78]],
  clouds:[[2,.5,.24,1.05],[2,.5,.72,1.05],[4,.5,.5,.92]],
  castle:[[3,.5,.1,1.4],[3,.5,.33,1.4],[3,.5,.57,1.4],[3,.5,.84,1.4]],
  lock:[[4,.5,.3,1.2],[4,.5,.7,1.2]]};
 var cs=7;
 Object.keys(SPECIAL).forEach(function(k){
  zones+='<path class="zone special off" data-z="'+k+'" tabindex="-1" role="button" aria-label="'+SPECIAL[k]+'" d="'+soft(Z[k],10)+'"/>';
  var b=bbox(Z[k],0),cl='';
  var prev=0;
  FOGPLAN[k].forEach(function(c,ci){cs=(cs*37+11)%101;var sg=c[1]<.5?-1:c[1]>.5?1:(cs%2?1:-1);
   var im=((c[0]+ci+cs)%4)+1;if(im===prev)im=im%4+1;prev=im;
   var fl=cs%2?-1:1,rt=(cs%19)-9,hu=(cs%35)-17,sz=(.92+(cs%15)/100)*({envelope:.7,clouds:.8,castle:.72,lock:.8}[k]),jx=((cs%7)-3)/100,jy=((cs%7)-3)/100;
   cl+='<img class="fc" src="fx/cloud'+im+'.webp" alt="" draggable="false" style="left:'+((c[1]+jx)*100)+'%;top:'+((c[2]+jy)*100)+'%;width:'+(c[3]*sz*100)+'%;translate:'+(fl<0?'-100% 0':'0 0')+';scale:'+fl+' 1;rotate:'+rt+'deg;filter:hue-rotate('+hu+'deg) saturate('+(.9+(cs%20)/100)+') drop-shadow(0 3px 5px rgba(70,50,100,.3));--bx:'+(sg*(3+cs%5))+'%;--by:'+((cs%7)-3)+'%;--d:'+(6+cs%5)+'s;--lx:'+(sg*(90+cs%40))+'%;--ly:'+(((cs%9)-4)*12)+'%;animation-delay:-'+(cs%6)+'s">'});
  fogs+='<div class="fog" data-f="'+k+'" style="'+pos(b)+'">'+cl+'</div>'});
 zones+='<path class="zone dateZone" data-z="date" tabindex="0" role="button" aria-label="The day, engraved on the cabinet" d="'+soft(Z.date,6)+'"/>';
 var lb=bbox(Z.lock),LW=lb.w,LH=lb.h;
 var MT=CT.moon||'the day when the moon brightens',DT=MT+' \u00b7 '+MT+' \u00b7 ';
 var WR=[3,11,27].map(function(sd,n){return'<filter id="wr'+n+'" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="2" seed="'+sd+'"/><feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>'}).join('');
 var WT=[0,1,2].map(function(n){return'<text class="wt" style="filter:url(#wr'+n+');--i:'+n+'"><textPath href="#mr">'+DT+'</textPath></text>'}).join('');
 var MOON='<svg class="moonring" viewBox="-110 -110 220 220" aria-hidden="true"><defs><path id="mr" d="M0 -91A91 91 0 1 1 -0.1 -91"/>'+WR+'</defs>'+WT+'</svg>'+'<img class="moonimg" src="fx/moon.webp" alt="" draggable="false">';
 s.innerHTML='<div class="cabbox"><div class="moonbg">'+MOON+'</div><div class="keybadge" hidden aria-label="You have the key">'+KEYIMG+'</div><div class="cab" id="cab"><img class="cabimg" src="cabinet.webp" alt="A painted wooden cabinet full of little rooms" draggable="false">'
  +'<div class="lockbay" style="'+pos(lb)+'"><svg class="lockside" viewBox="0 0 '+LW+' '+LH+'" aria-hidden="true"><defs><pattern id="lkw" patternUnits="userSpaceOnUse" width="90" height="194"><image href="wood.webp" width="90" height="194" preserveAspectRatio="none"/></pattern><clipPath id="lkc"><polygon class="lkclip" points="0,0 0,0 0,0 0,0"/></clipPath></defs><polygon class="lkside" fill="url(#lkw)" style="filter:brightness(.74)" stroke="#6b4a32" stroke-width="1.6" stroke-linejoin="round" points="0,0 0,0 0,0 0,0"/><polygon class="lktop" fill="url(#lkw)" style="filter:brightness(.82)" stroke="#6b4a32" stroke-width="1.6" stroke-linejoin="round" points="0,0 0,0 0,0 0,0"/><image class="lkcloud" href="fx/cloud4.webp" clip-path="url(#lkc)" x="0" y="0" width="0" height="0" preserveAspectRatio="none"/></svg><img class="lockfront" src="lockfront.webp" alt="" draggable="false"></div>'
  +'<svg class="map" viewBox="'+B.join(' ')+'">'+zones+'</svg>'+fogs+'</div></div><p class="cabcap"></p><p class="tally"></p><button class="pill primary" id="cont" type="button" hidden>Play the game</button><div class="mascots" aria-hidden="true"><div class="mmi"><img class="mimi-img" src="fx/mimi.svg" alt="" draggable="false"><div class="mang"><img src="fx/angel.svg" alt="" draggable="false"></div></div></div>';
 host.appendChild(s);
 /* baby Mimi + her guardian angel: float beside the cabinet (tucked onto its top corner on narrow screens) */
 (function(){var m=s.querySelector('.mascots');
  function fit(){var r=s.getBoundingClientRect(),side=innerWidth-r.right,over=side<130;m.style.setProperty('--mw',(over?104:Math.max(92,Math.min(250,side-22,r.width*.62)))+'px');m.classList.toggle('over',over)}
  fit();addEventListener('resize',fit);window.FX.mascot(m)})();
 (function(){var ts=s.querySelectorAll('.moonring text'),t=ts[0];if(t){var n=t.textContent.length,L=t.getComputedTextLength(),C=2*Math.PI*91;if(L>0)[].forEach.call(ts,function(x){x.setAttribute('letter-spacing',((C-L)/n).toFixed(2))})}})();
 var cab=s.querySelector('#cab'),cap=s.querySelector('.cabcap'),tally=s.querySelector('.tally'),cont=s.querySelector('#cont'),badge=s.querySelector('.keybadge'),bay=s.querySelector('.lockbay'),front=s.querySelector('.lockfront'),lkSide=s.querySelector('.lkside'),lkTop=s.querySelector('.lktop'),lkCl=s.querySelector('.lkclip'),lkImg=s.querySelector('.lkcloud');
 function zone(k){return s.querySelector('.zone[data-z="'+k+'"]')}
 function roomZone(i){return s.querySelector('.zone.room[data-r="'+i+'"]')}
 function enable(k,pulse){var z=zone(k);z.classList.remove('off');z.tabIndex=0;z.classList.toggle('pulse',!!pulse)}
 function lift(k,instant){var f=s.querySelector('.fog[data-f="'+k+'"]');if(f){if(instant)f.remove();else{f.classList.add('lift');setTimeout(function(){f.remove()},3600)}}}
 function stage(p){
  s.dataset.phase=p;
  var T={letter:'The mist over the envelope has cleared',poem:'The cloudy drawer is open now',story:'The castle is waiting for you',lock:'One last drawer is still locked',done:'Every room is still open, if you want to wander back'};
  cap.textContent=T[p]||'';tally.textContent='';
  ['envelope','clouds','castle','lock'].forEach(function(k){var z=zone(k);if(z)z.classList.remove('pulse')})}
 function refresh(){
  R.forEach(function(r,i){roomZone(i).classList.toggle('done',caughtIn(r)===r.photos.length)});
  if(s.dataset.phase==='explore'){cap.textContent='Open every room and catch all the photos';tally.textContent='Caught '+S.caught.length+' / '+TOTAL}}
 refresh();
 function act(el,fn){el.addEventListener('click',fn);el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}})}
 var room=null,busy=false,roomFx=null;
 R.forEach(function(r,i){act(roomZone(i),function(){if(!room&&!busy)openRoom(i)})});

 /* ---------- rooms (always open, also at the end) ---------- */
 function openRoom(i){
  var r=R[i],cell=bbox(Z[r.zone]),cr=cab.getBoundingClientRect(),sc=cr.width/B[2];
  var ox=(cell.x+cell.w/2-B[0])*sc,oy=(cell.y+cell.h/2-B[1])*sc,cx=cr.left+ox,cy=cr.top+oy;
  var k=Math.min(9,Math.min(innerWidth/(cell.w*sc),innerHeight/(cell.h*sc))*1.08);
  var revisit=caughtIn(r)===r.photos.length;
  var show=r.photos.map(function(p,n){return n}).filter(function(n){return revisit||S.caught.indexOf(r.id+'-'+n)<0});
  var el=document.createElement('div');el.className='room';el.setAttribute('data-room',r.id);el.style.setProperty('--c',r.color);
  el.innerHTML='<div class="rbackdrop"><img src="rooms/'+r.id+'.webp" alt="" draggable="false"></div><div class="rshade"></div><header class="rbar"><button class="pill rbtn" type="button">'+IC.get('arrowL',16)+' Cabinet</button><div class="rtitle"></div><div class="rcount"><b></b> / '+r.photos.length+'</div></header><div class="rfield"></div><p class="rmsg" role="status"></p>';
  el.querySelector('.rtitle').textContent=r.title;
  document.body.appendChild(el);
  room={i:i,el:el,k:k,tx:innerWidth/2-cx,ty:innerHeight/2-cy};roomFx=FX.hold();
  cab.style.transformOrigin=ox+'px '+oy+'px';
  function cnt(){el.querySelector('.rcount b').textContent=caughtIn(r)}cnt();
  var gi=0;for(var q=0;q<i;q++)gi+=R[q].photos.length;
  var field=el.querySelector('.rfield'),rnd=mulberry(i*31+7),cols=2,rows=Math.ceil(show.length/cols);
  show.forEach(function(n,j){
   var p=r.photos[n],b=document.createElement('button');b.type='button';b.className='fp';b.setAttribute('aria-label','Photo '+(n+1)+' in '+r.title);
   var col=j%cols,row=Math.floor(j/cols),x=10+col*44+(show.length%2&&j===show.length-1?22:0)+rnd()*6,y=16+row*(66/Math.max(rows,1))+rnd()*4;
   b.style.cssText='left:'+x+'%;top:'+y+'%;--r:'+(rnd()*8-4).toFixed(1)+'deg;--ax:'+(rnd()*60-30).toFixed(0)+'px;--ay:'+(rnd()*50-25).toFixed(0)+'px;--bx:'+(rnd()*70-35).toFixed(0)+'px;--by:'+(rnd()*60-30).toFixed(0)+'px;--cx:'+(rnd()*50-25).toFixed(0)+'px;--cy:'+(rnd()*50-25).toFixed(0)+'px;--d:'+(16+rnd()*10).toFixed(1)+'s;--dl:-'+(rnd()*12).toFixed(1)+'s';
   b.setAttribute('data-v',n%3);b.setAttribute('data-c',gi+n);b.style.setProperty('--hu',((gi+n)*53)%360);
   b.innerHTML='<span class="tape"></span><span class="pimg"><img alt="" src="'+p.src+'" onerror="this.remove()"></span>';
   b.onclick=function(){openViewer(r,n,b,cnt,revisit)};field.appendChild(b);
   A(b,[{opacity:0},{opacity:1}],{duration:600,delay:650+j*160,fill:'both'})});
  A(cab,[{transform:'none',filter:'blur(0px)'},{transform:'translate('+room.tx+'px,'+room.ty+'px) scale('+k+')',filter:'blur(10px)'}],{duration:720,easing:'cubic-bezier(.65,0,.85,.4)'});
  wait(440).then(function(){A(el,[{opacity:0},{opacity:1}],{duration:340})});
  /* the room comes into focus slowly, like stepping in from the dark */
  A(el.querySelector('.rbackdrop img'),[{filter:'blur(18px)',transform:'scale(1.12)'},{filter:'blur(0px)',transform:'scale(1)'}],{duration:1500,delay:420,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
  var mine=room;wait(800).then(function(){if(room&&room===mine)cab.style.visibility='hidden'});
  el.querySelector('.rbtn').onclick=function(){closeRoom()}}
 function closeRoom(){
  if(!room)return Promise.resolve();var rm=room;room=null;if(roomFx){roomFx();roomFx=null}
  cab.style.visibility='';
  A(rm.el,[{opacity:1},{opacity:0}],{duration:320});
  A(cab,[{transform:'translate('+rm.tx+'px,'+rm.ty+'px) scale('+rm.k+')',filter:'blur(10px)'},{transform:'none',filter:'blur(0px)'}],{duration:650,easing:'cubic-bezier(.15,.6,.35,1)'}).then(function(){rm.el.remove();refresh()});
  return wait(650)}
 function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

 /* ---------- photo viewer ---------- */
 function openViewer(r,n,fp,cnt,revisit){
  var p=r.photos[n],v=document.createElement('div');v.className='viewer';
  v.innerHTML='<figure class="big"><span class="pimg"><img alt="" src="'+p.src+'" onerror="this.remove()"></span><figcaption></figcaption></figure><button class="pill primary keep" type="button">'+(revisit?'Close':'Keep it '+IC.get('heart',18))+'</button>';
  v.querySelector('figcaption').textContent=p.note||'';
  document.body.appendChild(v);
  var fig=v.querySelector('.big'),f=fp.getBoundingClientRect(),t=fig.getBoundingClientRect();
  var back='translate('+(f.left+f.width/2-t.left-t.width/2)+'px,'+(f.top+f.height/2-t.top-t.height/2)+'px) scale('+(f.width/t.width)+')';
  fp.style.visibility='hidden';
  A(v,[{opacity:0},{opacity:1}],{duration:260});
  A(fig,[{transform:back},{transform:'none'}],{duration:520,easing:'cubic-bezier(.25,1.2,.4,1)'});
  var done=false;
  function close(){
   if(done)return;done=true;removeEventListener('keydown',esc);
   if(revisit){
    A(fig,[{transform:'none'},{transform:back}],{duration:460,easing:'cubic-bezier(.5,0,.3,1)'});
    A(v,[{opacity:1},{opacity:0}],{duration:300,delay:200}).then(function(){v.remove();fp.style.visibility='visible'});return}
   var target=room&&room.el.querySelector('.rcount').getBoundingClientRect(),b=fig.getBoundingClientRect();
   var rr=room;S.caught.push(r.id+'-'+n);save();
   if(target)A(fig,[{transform:'none',opacity:1},{transform:'translate('+(target.left+target.width/2-b.left-b.width/2)+'px,'+(target.top+target.height/2-b.top-b.height/2)+'px) scale(.12)',opacity:0}],{duration:560,easing:'cubic-bezier(.5,0,.3,1)'});
   A(v,[{opacity:1},{opacity:0}],{duration:380,delay:200}).then(function(){v.remove()});
   fp.remove();
   wait(560).then(function(){
    cnt();var rc=room&&room.el.querySelector('.rcount');if(rc)A(rc,[{transform:'scale(1)'},{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:360});
    var left=r.photos.length-caughtIn(r),msg=room&&room.el.querySelector('.rmsg');
    if(!left&&room&&room===rr){msg.innerHTML=(allDone()?'That was the last one!':'All found in this room')+' '+IC.get('sparkle',22);A(msg,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:400});
     wait(1500).then(function(){if(allDone()){S.fin=1;save();busy=true;var ff=FX.hold();Finale.show({total:TOTAL,onNext:function(){ff();closeRoom().then(function(){wait(300).then(function(){busy=false;beginLetter()})})}})}else if(room===rr)closeRoom()})}})}
  v.querySelector('.keep').onclick=close;v.onclick=function(e){if(e.target===v)close()}
  function esc(e){if(e.key==='Escape')close()}addEventListener('keydown',esc)}

 /* ---------- paper overlays: letter, poem, story, the date ---------- */
 function paper(kind,pages,img,last){
  return new Promise(function(done){
   var T=CT[kind]||{},ov=document.createElement('div'),i=0;ov.className='ov';
   ov.innerHTML='<div class="paper '+kind+'" dir="'+(T.dir||'ltr')+'">'+(img?'<div class="phead"><img src="'+img+'" alt="" draggable="false"></div>':'')+'<div class="ptxt"></div><button class="pill primary pbtn" type="button"></button></div>';
   var box=ov.querySelector('.ptxt'),b=ov.querySelector('.pbtn');
   function render(){box.innerHTML='';var pg=pages[i],h=document.createElement('h3');if(pg.html)h.innerHTML=pg.title;else h.textContent=pg.title||'';box.appendChild(h);
    (pg.lines||[]).forEach(function(t){if(!t)return;var p=document.createElement('p');p.textContent=t;box.appendChild(p)});
    box.scrollTop=0;b.textContent=i<pages.length-1?'Next':last}
   render();document.body.appendChild(ov);
   A(ov,[{opacity:0},{opacity:1}],{duration:320});
   A(ov.firstChild,[{transform:'translateY(40px) scale(.92)',opacity:0},{transform:'none',opacity:1}],{duration:520,easing:'cubic-bezier(.25,1.2,.4,1)'});
   b.onclick=function(){
    if(i<pages.length-1){i++;render();return}
    b.disabled=true;A(ov,[{opacity:1},{opacity:0}],{duration:340}).then(function(){ov.remove();done()})}})}
 function center(el){var r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
 function sprite(cls,html,w){var e=document.createElement('div');e.className=cls;e.innerHTML=html;e.style.width=w+'px';document.body.appendChild(e);return e}
 function put(e,x,y){e.style.left=(x-e.offsetWidth/2)+'px';e.style.top=(y-e.offsetHeight/2)+'px'}
 function unitToScreen(ux,uy){var cr=cab.getBoundingClientRect(),sc=cr.width/B[2];return{x:cr.left+(ux-B[0])*sc,y:cr.top+(uy-B[1])*sc,sc:sc}}
 function click(){window.Player&&window.Player.fx(function(c,out){var t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(300,t+.09);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(out);o.start(t);o.stop(t+.14)})}

 /* ---------- the story, in the order you described ---------- */
 function beginLetter(){stage('letter');lift('envelope');enable('envelope',true)}
 act(zone('envelope'),async function(){
  if(busy||room)return;busy=true;
  zone('envelope').classList.remove('pulse');
  var r=FX.hold();await Overlays.letter(CT.letter||{});r();
  if(!S.lr)await foundKey();
  busy=false});
 async function foundKey(){
  S.lr=1;save();
  var e=center(zone('envelope')),k=sprite('keyspr',KEYIMG,40);put(k,e.x,e.y);
  await A(k,[{transform:'scale(0) rotate(-35deg)',opacity:0},{transform:'scale(1.5) rotate(6deg)',opacity:1,offset:.65},{transform:'scale(1.25) rotate(0deg)',opacity:1}],{duration:800,easing:'ease-out'});
  await A(k,[{transform:'scale(1.25) translateY(0)'},{transform:'scale(1.3) translateY(-26px)'}],{duration:700,easing:'ease-in-out'});
  badge.hidden=false;var b=center(badge);
  await A(k,[{transform:'scale(1.3) translateY(-26px)'},{transform:'translate('+(b.x-e.x)+'px,'+(b.y-e.y)+'px) scale(.34) rotate(40deg)',opacity:.95}],{duration:950,easing:'cubic-bezier(.5,0,.3,1)'});
  k.remove();A(badge,[{transform:'scale(0)'},{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:450});
  S.kb=1;save();stage('poem');lift('clouds');enable('clouds',true)}
 act(zone('clouds'),async function(){
  if(busy||room)return;busy=true;zone('clouds').classList.remove('pulse');
  var r=FX.hold();await Overlays.poem(CT.poem||{});r();
  if(!S.pm){S.pm=1;save();stage('story');lift('castle');enable('castle',true)}
  busy=false});
 act(zone('castle'),async function(){
  if(busy||room)return;busy=true;zone('castle').classList.remove('pulse');
  var r=FX.hold();await Overlays.story(CT.story||{pages:[]});r();
  if(!S.st){S.st=1;save();stage('lock');lift('lock');enable('lock',true)}
  busy=false});
 act(zone('date'),async function(){
  if(busy||room)return;busy=true;
  var r=FX.hold();await paper('date',[{html:1,title:(CT.date||'')+' '+IC.get('heart',34),lines:[CT.dateNote||'']}],null,'Close');r();
  busy=false});

 /* the drawer travels along the cabinet's own depth: toward the viewer, right and down, like the open cloud drawer */
 var DX=LW*.46,DY=LW*.21;
 function pull(t){
  var dx=DX*t,dy=DY*t,sp='0,0 '+dx+','+dy+' '+dx+','+(dy+LH)+' 0,'+LH,tp='0,0 '+LW+',0 '+(LW+dx)+','+dy+' '+dx+','+dy;
  lkSide.setAttribute('points',sp);lkTop.setAttribute('points',tp);lkCl.setAttribute('points',tp);
  var ch=dy*1.05,cw=ch*2.43;lkImg.setAttribute('width',cw);lkImg.setAttribute('height',ch);lkImg.setAttribute('x',(LW+dx)/2-cw/2);lkImg.setAttribute('y',dy/2-ch/2);
  front.style.transform='translate('+(dx/LW*100)+'%,'+(dy/LH*100)+'%) scale('+(1+.05*t)+')'}
 act(zone('lock'),async function(){
  if(busy||room||S.dr)return;busy=true;S.dr=1;save();zone('lock').classList.remove('pulse');
  var kh=unitToScreen(617,404),b=center(badge),sc=kh.sc;
  var clip=document.createElement('div');clip.style.cssText='position:fixed;left:0;top:0;height:100%;width:100vw;overflow:hidden;z-index:32;pointer-events:none';
  document.body.appendChild(clip);
  var k=sprite('keyspr',KEYIMG,40);clip.appendChild(k);k.style.position='absolute';put(k,b.x,b.y);
  badge.hidden=true;k.style.transformOrigin='50% 100%';
  var KH=k.offsetHeight||104,Lx=b.x,Ly=b.y+KH/2;
  function tipAt(cx,cy,rot,s){var a=rot*Math.PI/180,h=KH*s/2;return{x:cx-h*Math.sin(a),y:cy+h*Math.cos(a)}}
  function setK(x,y,rot,s){k.style.transform='translate('+(x-Lx)+'px,'+(y-Ly)+'px) rotate('+rot+'deg) scale('+s+')'}
  function ease(p){return p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2}
  var s1=.62,p0=tipAt(b.x,b.y,40,.34),p1={x:kh.x+16,y:kh.y},pc={x:(p0.x+p1.x)/2+30,y:Math.min(p0.y,p1.y)-90};
  setK(p0.x,p0.y,40,.34);
  /* 1. it flies over and lies perfectly horizontal: tip to the left, teeth pointing down, facing the keyhole */
  await tween(1100,function(t){var e=ease(t),u=1-e;setK(u*u*p0.x+2*u*e*pc.x+e*e*p1.x,u*u*p0.y+2*u*e*pc.y+e*e*p1.y,40+50*e,.34+(s1-.34)*e+.3*Math.sin(Math.PI*e)*(1-e))});
  await wait(120);
  /* 2. it slides straight into the lock, right to left: whatever passes the keyhole is hidden */
  clip.style.clipPath='inset(0 0 0 '+kh.x+'px)';
  var ins=KH*s1*.62;
  await tween(750,function(t){setK(p1.x-(ins+16)*ease(t),p1.y,90,s1)});
  await wait(100);
  /* 3. it turns in the lock */
  var vx=ins,fd=-24,fa=fd*Math.PI/180;
  await tween(420,function(t){var e=1-Math.pow(1-t,3),d=fd*e,a=d*Math.PI/180;setK(kh.x-vx*Math.cos(a),kh.y-vx*Math.sin(a),90+d,s1)});
  click();
  /* 4. the drawer slides out and the key rides with it */
  bay.style.visibility='visible';
  var tx=kh.x-vx*Math.cos(fa),ty=kh.y-vx*Math.sin(fa);
  await tween(900,function(t){var e=1-Math.pow(1-t,3);pull(e);var dx=DX*e*sc,dy=DY*e*sc;setK(tx+dx,ty+dy,90+fd,s1);clip.style.clipPath='inset(0 0 0 '+(kh.x+dx)+'px)'});
  A(k,[{opacity:1},{opacity:0}],{duration:450}).then(function(){clip.remove()});
  await wait(600);busy=false;finish()});
 function finish(){stage('done');cont.hidden=false;A(cont,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:500})}
 cont.onclick=function(){ctx.next()};

 /* ---------- resume where she left off ---------- */
 function opened(){bay.style.visibility='visible';pull(1)}
 if(S.kb&&!S.dr)badge.hidden=false;
 if(S.dr){['envelope','clouds','castle','lock'].forEach(function(k){lift(k,true);enable(k)});opened();finish()}
 else if(S.st){['envelope','clouds','castle'].forEach(function(k){lift(k,true);enable(k)});lift('lock',true);enable('lock',true);stage('lock')}
 else if(S.pm){['envelope','clouds'].forEach(function(k){lift(k,true);enable(k)});lift('castle',true);enable('castle',true);stage('story')}
 else if(S.lr){lift('envelope',true);enable('envelope');lift('clouds',true);enable('clouds',true);stage('poem');badge.hidden=false}
 else if(allDone()){
  if(S.fin)wait(600).then(beginLetter);
  else wait(800).then(function(){busy=true;var ff=FX.hold();Finale.show({total:TOTAL,onNext:function(){ff();S.fin=1;save();wait(300).then(function(){busy=false;beginLetter()})}})})}
}};
