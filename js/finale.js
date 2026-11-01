/* Birthday finale: party-blower sound, confetti, five stars, then "Next". */
(function(){
'use strict';
var COL=['#c4502f','#d9a93f','#7fa9aa','#e3a99a','#8fa27a','#f2c24a','#6e3b1d'];
function horn(){
 if(!window.Player)return;
 window.Player.fx(function(ctx,out){
  function toot(at,dur,f0,f1){
   var t=ctx.currentTime+at,o=ctx.createOscillator(),lfo=ctx.createOscillator(),lg=ctx.createGain(),f=ctx.createBiquadFilter(),g=ctx.createGain();
   o.type='sawtooth';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur*.35);o.frequency.exponentialRampToValueAtTime(f0*1.1,t+dur);
   lfo.frequency.value=22;lg.gain.value=16;lfo.connect(lg);lg.connect(o.frequency);
   f.type='bandpass';f.frequency.value=1500;f.Q.value=1.3;
   g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.34,t+.03);g.gain.setValueAtTime(.34,t+dur-.08);g.gain.linearRampToValueAtTime(0,t+dur);
   o.connect(f);f.connect(g);g.connect(out);o.start(t);lfo.start(t);o.stop(t+dur+.05);lfo.stop(t+dur+.05)}
  toot(0,.28,300,560);toot(.38,.28,320,600);toot(.78,.9,300,680)})}
function confetti(cv){
 var c=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1),W,H,ps=[],alive=true,t0=performance.now();
 function size(){W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr}size();addEventListener('resize',size);
 function burst(x,y,n,ang,spread){for(var i=0;i<n;i++){var a=ang+(Math.random()-.5)*spread,v=(9+Math.random()*13)*dpr;
  ps.push({x:x*dpr,y:y*dpr,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,w:(6+Math.random()*7)*dpr,h:(3+Math.random()*5)*dpr,c:COL[Math.random()*COL.length|0],round:Math.random()<.25})}}
 function rain(){for(var i=0;i<6;i++)ps.push({x:Math.random()*W,y:-10*dpr,vx:(Math.random()-.5)*2*dpr,vy:(2+Math.random()*3)*dpr,r:Math.random()*6.28,vr:(Math.random()-.5)*.3,w:(6+Math.random()*6)*dpr,h:(3+Math.random()*4)*dpr,c:COL[Math.random()*COL.length|0],round:Math.random()<.25})}
 setTimeout(function(){burst(innerWidth*.15,innerHeight*.92,70,-1.1,.9);burst(innerWidth*.85,innerHeight*.92,70,-2.05,.9)},120);
 setTimeout(function(){burst(innerWidth*.5,innerHeight*.9,80,-1.57,1.3)},620);
 setTimeout(function(){burst(innerWidth*.2,innerHeight*.9,50,-1.2,.9);burst(innerWidth*.8,innerHeight*.9,50,-1.95,.9)},1250);
 (function loop(now){
  if(!alive)return;c.clearRect(0,0,W,H);
  if(now-t0<7000&&Math.random()<.5)rain();
  ps=ps.filter(function(p){return p.y<H+40*dpr});
  ps.forEach(function(p){p.vy+=.32*dpr;p.vx*=.992;p.vy*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
   c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;
   if(p.round){c.beginPath();c.arc(0,0,p.h,0,6.28);c.fill()}else c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore()});
  requestAnimationFrame(loop)})(t0);
 return function(){alive=false;removeEventListener('resize',size)}}
function star(i){return'<span class="fstar" style="--i:'+i+'"><svg viewBox="0 0 100 96" aria-hidden="true"><path d="M50 6L62 36L94 38L69 58L78 90L50 72L22 90L31 58L6 38L38 36Z" fill="#f2c24a" stroke="#b9782c" stroke-width="5" stroke-linejoin="round"/><path d="M50 18L58 38L76 40" fill="none" stroke="#fff4cf" stroke-width="4" stroke-linecap="round" opacity=".8"/></svg></span>'}
window.Finale={show:function(o){
 var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,C=window.CONTENT||{},el=document.createElement('div');
 el.className='fin';
 el.innerHTML='<canvas class="conf" aria-hidden="true"></canvas><div class="finbox"><div class="stars" aria-label="Five stars">'+[0,1,2,3,4].map(star).join('')+'</div><h2>You caught all '+o.total+'!</h2><p class="hb">Happy Birthday<b>'+(C.name||'')+'</b></p><button class="pill primary fnext" type="button">Next</button></div>';
 document.body.appendChild(el);
 var stop=RM?function(){}:confetti(el.querySelector('canvas'));
 if(!RM)horn();
 el.querySelector('.fnext').onclick=function(){el.classList.add('out');stop();setTimeout(function(){el.remove();if(o.onNext)o.onNext()},RM?1:500)}}};
})();
