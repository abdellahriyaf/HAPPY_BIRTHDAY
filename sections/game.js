/* Last section: Mimi climbs N clouds, the angel catches her if she slips, questions on some clouds,
   then the angel turns into the boy. Texts live in game/config.js, sprites in game/. */
(function(){
'use strict';
var D='game/',RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var GH={stand:150,jump:146,run:139,idle:106},AH=[0,158,199,195,199,200,196,189];
function S(n){return D+n+'.webp'}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function wait(ms){return new Promise(function(r){setTimeout(r,RM?Math.min(ms,40):ms)})}
function js(src){return new Promise(function(ok){var s=document.createElement('script');s.src=src;s.onload=function(){ok(1)};s.onerror=function(){ok(0)};document.head.appendChild(s)})}
function T(x,y){return 'translate('+x+'px,'+y+'px)'}
function put(e,x,y){e._p={x:x,y:y};e.style.transform=T(x,y)}
function go(e,pts,d,ease){
 var kf=[{transform:T(e._p.x,e._p.y)}].concat(pts.map(function(p){return{transform:T(p[0],p[1])}})),l=pts[pts.length-1];
 var an=e.animate(kf,{duration:RM?60:d,easing:ease||'ease-in-out',fill:'forwards'});
 return an.finished.then(function(){put(e,l[0],l[1]);an.cancel()})}
function pick(a,n){return a[n%a.length]}
window.Sections=window.Sections||{};
window.Sections.game={mount:async function(host,ctx){
 await js(D+'config.js');
 await new Promise(function(r){var l=el('link');l.rel='stylesheet';l.href='css/game.css';l.onload=r;l.onerror=r;document.head.appendChild(l)});
 var C=window.GAMECFG,N=C.clouds,E=C.end;
 ['bunny','girl_stand','girl_jump','girl_run','girl_idle','angel1','angel2','angel3','angel4','angel5','angel6','angel7'].forEach(function(n){new Image().src=S(n)});
 var root=el('div','gm','<div class="gsky"></div><div class="gcount"></div><div class="gworld"></div><div class="gui"></div><div class="gtap">Tap to jump</div>');
 document.body.appendChild(root);
 var W=root.clientWidth,H=root.clientHeight,step=Math.min(150,H*.2),world=root.querySelector('.gworld'),ui=root.querySelector('.gui'),count=root.querySelector('.gcount'),hint=root.querySelector('.gtap');
 function P(k){return{x:k===N?W/2+75:W*(k===0?.4:k%2?.7:.3),y:-k*step}}
 for(var k=0;k<N;k++){var p=P(k),c=el('img','gcl');c.src='fx/cloud'+(k%4+1)+'.webp';c.alt='';c.style.left=(p.x-85)+'px';c.style.top=(p.y-26)+'px';world.appendChild(c)}
 var mp=P(N),moon=el('img','gmoon');moon.src='fx/moon.webp';moon.alt='';moon.style.width='800px';moon.style.left=(W/2-425)+'px';moon.style.top=(mp.y-130)+'px';world.appendChild(moon);
 var gg=el('div','gg','<img class="gb" src="'+S('bunny')+'" alt=""><img class="gs" src="'+S('girl_stand')+'" alt="">'),gs=gg.querySelector('.gs'),bun=gg.querySelector('.gb');
 var ang=el('div','gang','<img src="'+S('angel1')+'" alt="">'),fig=el('div','gang','<img alt="">');fig.style.display='none';
 world.appendChild(gg);world.appendChild(ang);world.appendChild(fig);
 var i=+((/[?&]cloud=(\d+)/.exec(location.search)||[0,0])[1])||0;i=Math.min(i,N-1);
 function F(n){return .7+.57*n/N}var fac=F(i);
 function cam(n){world.style.transform='translateY('+(n*step)+'px)';root.style.setProperty('--p',n/N);count.textContent=n+' / '+N}
 function pose(n,idle){gs.src=S(n);gs.style.height=(GH[n.replace('girl_','')]*fac)+'px';bun.style.display=idle?'none':''}
 function card(h){var c=el('div','gcard',h);ui.innerHTML='';ui.appendChild(c);return c}
 var a0=P(i);pose('girl_stand');put(gg,a0.x,a0.y);put(ang,a0.x+70,a0.y-190);cam(i);
 function say(t){var o=count.textContent;count.textContent=t;setTimeout(function(){count.textContent=o},2600)}

 function dodge(nb,yb,px,py){
  var r=nb.getBoundingClientRect(),y=yb.getBoundingClientRect(),x0,y0,t=0,w=innerWidth,h=innerHeight;
  do{x0=12+Math.random()*(w-r.width-24);y0=12+Math.random()*(h-r.height-24);t++}
  while(t<40&&(Math.hypot(x0+r.width/2-px,y0+r.height/2-py)<150||(x0<y.right+10&&x0+r.width>y.left-10&&y0<y.bottom+10&&y0+r.height>y.top-10)));
  nb.style.left=x0+'px';nb.style.top=y0+'px'}
 function yesno(q,yes,no,msgs){return new Promise(function(done){
  var c=card('<h2>'+q+'</h2><div class="gyn"><button class="pill primary gy" type="button">'+yes+'</button></div><p class="note"></p>'),row=c.querySelector('.gyn'),yb=c.querySelector('.gy'),note=c.querySelector('.note'),nb=el('button','pill gno',no),n=0,fixed=false;
  nb.type='button';row.appendChild(nb);
  function run(e){
   if(e){e.preventDefault&&e.preventDefault();e.stopPropagation&&e.stopPropagation()}
   if(!fixed){var r=nb.getBoundingClientRect(),ph=el('span');ph.style.cssText='display:inline-block;width:'+r.width+'px;height:'+r.height+'px';row.appendChild(ph);
    nb.style.cssText='position:fixed;left:'+r.left+'px;top:'+r.top+'px;z-index:20';fixed=true;void nb.offsetWidth}
   dodge(nb,yb,e&&e.clientX!=null?e.clientX:-999,e&&e.clientY!=null?e.clientY:-999);note.textContent=pick(msgs,n++)}
  nb.addEventListener('pointerdown',run);nb.addEventListener('pointerenter',run);nb.addEventListener('click',run);nb.addEventListener('focus',run);
  var mv=function(e){var r=nb.getBoundingClientRect();if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))<90)run(e)};
  document.addEventListener('pointermove',mv);
  yb.onclick=function(){document.removeEventListener('pointermove',mv);nb.remove();ui.innerHTML='';done()}})}
 function scale(q,note,broke){return new Promise(function(done){
  var c=card('<h2>'+q+'</h2><div class="gtrack" tabindex="0"><div class="gfill"></div><div class="gknob"></div></div><p class="gval">0%</p><p class="note">'+note+'</p><button class="pill primary" type="button" disabled>Next</button>'),
   tr=c.querySelector('.gtrack'),val=c.querySelector('.gval'),nx=c.querySelector('button'),nt=c.querySelector('.note'),used=false;
  async function hit(){if(used)return;used=true;tr.classList.add('fast');val.textContent='100%';
   for(var s of ['250%','900%','99999%','∞']){await wait(260);val.textContent=s}
   tr.classList.add('broke');nt.textContent=broke;nx.disabled=false}
  var sx=null,kn=c.querySelector('.gknob');
  tr.addEventListener('pointerdown',function(e){if(used)return;sx=e.clientX;try{tr.setPointerCapture(e.pointerId)}catch(_){}});
  tr.addEventListener('pointermove',function(e){if(used||sx===null)return;var r0=tr.getBoundingClientRect();kn.style.left=Math.max(0,Math.min(e.clientX-r0.left,r0.width))+'px';if(Math.abs(e.clientX-sx)>6){kn.style.left='';hit()}});
  tr.addEventListener('pointerup',function(){sx=null});tr.addEventListener('keydown',function(e){if(e.key!=='Tab')hit()});
  nx.onclick=function(){ui.innerHTML='';done()}})}
 function word(){return new Promise(function(done){
  var w=C.word,o=w.options.slice().sort(function(){return Math.random()-.5});
  var c=card('<h2>'+w.q+'</h2><div class="gopts"></div><p class="note"></p>'),row=c.querySelector('.gopts'),nt=c.querySelector('.note');
  o.forEach(function(t){var b=el('button','pill',t);b.type='button';b.onclick=function(){
   if(t!==w.answer){nt.textContent=w.wrong;b.classList.remove('gwrong');void b.offsetWidth;b.classList.add('gwrong');return}
   var s=card('<h2>'+w.storyTitle+'</h2>'+w.story.map(function(x){return'<p>'+x+'</p>'}).join('')+'<button class="pill primary" type="button">Continue</button>');
   s.querySelector('button').onclick=function(){ui.innerHTML='';done()}};row.appendChild(b)})})}
 function hearts(){if(RM)return;for(var n=0;n<36;n++){var h=el('span','gheart','♥');h.style.left=Math.random()*100+'vw';h.style.animationDelay=Math.random()*1.4+'s';h.style.fontSize=18+Math.random()*26+'px';document.body.appendChild(h);setTimeout(function(e){e.remove()},5200,h)}}

 function shadow(x,y,w){var sh=el('div','gsh');sh.style.left=x+'px';sh.style.top=(y-3)+'px';sh.style.width=w+'px';world.insertBefore(sh,gg);void sh.offsetWidth;sh.style.opacity=1}
 function dust(x,y,n){if(RM)return;
  for(var k=0;k<n;k++){var d=el('span','gdust'),sz=6+Math.random()*12,far=k>=n*.65;
   d.style.cssText='left:'+(x+(Math.random()-.5)*70)+'px;top:'+(y-2-Math.random()*8)+'px;width:'+sz+'px;height:'+sz+'px';world.appendChild(d);
   var dx=(Math.random()-.5)*(far?90:190),dy=far?-(50+Math.random()*80):-(8+Math.random()*34);
   d.animate([{transform:'translate(0,0) scale(.4)',opacity:.95},{transform:'translate('+dx+'px,'+dy+'px) scale('+(far?1:1.7)+')',opacity:0}],{duration:(far?2400:900)+Math.random()*700,easing:'ease-out',delay:Math.random()*160}).onfinish=function(){this.effect.target.remove()}}}
 async function jump(to,slip){
  var a=P(i),b=P(to),dir=b.x<a.x?-1:1,x1=a.x+(b.x-a.x)*.2;
  fac=F(to);if(to===N)moon.style.opacity=1;gg.classList.toggle('fl',dir<0);pose('girl_run');bun.classList.add('hop');cam(to);
  await go(gg,[[x1,a.y]],200,'ease-in');pose('girl_jump');
  if(!slip){await go(gg,[[(x1+b.x)/2,Math.min(a.y,b.y)-110],[b.x,b.y]],650)}
  else{
   var mx=(x1+b.x)/2,my=Math.min(a.y,b.y)-70;
   await go(gg,[[mx,my]],330,'ease-out');await go(gg,[[mx,my+230]],520,'ease-in');
   say(C.slip);await go(ang,[[mx+50,my+90]],450);await wait(250);
   var d=go(gg,[[mx,my+100],[b.x,b.y]],1100);go(ang,[[mx+50,my-60],[b.x+50,b.y-110]],1100);await d}
  pose('girl_stand');bun.classList.remove('hop');if(to===N){shadow(b.x,b.y,100);dust(b.x,b.y,18)}
  await go(ang,[[b.x+(dir<0?-70:70),b.y-190]],500)}
 async function finale(){
  var b=P(N),bx=W/2-75;gg.classList.remove('fl');pose('girl_stand');
  fig.style.display='';put(fig,ang._p.x,ang._p.y);ang.style.display='none';
  var im=fig.querySelector('img');im.style.scale='-1 1';
  for(var f=1;f<=7;f++){im.src=S('angel'+f);im.style.height=AH[f]+'px';im.classList.add('gglow');setTimeout(function(){im.classList.remove('gglow')},150);
   if(f===2){go(fig,[[bx,b.y]],1000);setTimeout(function(){shadow(bx,b.y,120);dust(bx,b.y,18)},1000)}await wait(f<5?420:330)}
  await wait(500);hint.style.display='none';
  var c=card('<h2>'+E.go+'</h2><button class="pill primary" type="button">'+E.here+'</button>');
  await new Promise(function(r){c.querySelector('button').onclick=r});
  await scale(E.scaleQ,E.scaleNote,E.scaleBroke);
  await yesno(E.askQ,E.yes,E.no,E.dodge);
  hearts();card('<h2>'+E.done+'</h2><p>'+E.doneSub+'</p>')}
 async function plan(k){
  var qi=C.loveAt.indexOf(k);
  if(qi>-1||k===C.wordAt){pose('girl_idle',true);await wait(300);
   if(qi>-1)await yesno(C.love.q,pick(C.love.yes,qi),C.love.no,C.love.dodge);else await word();
   pose('girl_stand')}
  if(k===N)await finale()}
 var ready=true;
 async function tap(){
  if(!ready||i>=N)return;ready=false;hint.style.display='none';
  var to=i+1,slip=to>1&&to<N&&(to===7||to===13||Math.random()<.12);
  await jump(to,slip);i=to;await plan(to);ready=i<N}
 root.addEventListener('pointerdown',function(e){if(!e.target.closest('.gcard,.gno'))tap()});
 document.addEventListener('keydown',function(e){if(e.code==='Space'&&!e.target.closest('button,.gtrack'))tap()})
}};
})();
