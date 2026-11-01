/* Audio engine: a queue of real tracks plus synthesised room sounds, all through one master gain. */
(function(){
'use strict';
var T=window.TRACKS||[],PREVIEW=/[?&]preview/.test(location.search);
var el=new Audio(),ctx=null,master=null,amb={},subs=[],errs=0;
el.preload='auto';
var st={queue:[],idx:0,playing:false,on:true,vol:.7,amb:{crackle:.3,rain:0,fire:0,steam:0}};
function emit(){subs.slice().forEach(function(f){f(st)})}
function noise(fill,type,freq){
 var n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate);fill(b.getChannelData(0),n);
 var s=ctx.createBufferSource();s.buffer=b;s.loop=true;
 var f=ctx.createBiquadFilter();f.type=type;f.frequency.value=freq;
 var g=ctx.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(master);s.start();return g}
function pink(d,n){var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
 for(var i=0;i<n;i++){var w=Math.random()*2-1;
  b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;
  d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.04;b6=w*.115926}}
function init(){
 if(!ctx){
  var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ctx=new AC();master=ctx.createGain();master.gain.value=st.on?st.vol:0;master.connect(ctx.destination);
  ctx.createMediaElementSource(el).connect(master);
  amb.crackle=noise(function(d,n){for(var i=0;i<n;i++)d[i]=Math.random()<.0004?(Math.random()*2-1)*.8:(Math.random()*2-1)*.03},'lowpass',3000);
  amb.rain=noise(pink,'lowpass',1200);
  amb.fire=noise(function(d,n){for(var i=0;i<n;i++)d[i]=Math.random()<.001?(Math.random()*2-1)*.9:(Math.random()*2-1)*.01},'bandpass',1800);
  amb.steam=noise(function(d,n){for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*.05},'highpass',3500);
  applyAmb()}
 if(ctx.state==='suspended')ctx.resume()}
function applyAmb(){
 if(!ctx)return;var t=ctx.currentTime;
 ['crackle','rain','fire','steam'].forEach(function(k){var v=st.amb[k];if(k==='crackle'&&!st.playing)v=0;amb[k].gain.setTargetAtTime(v,t,.1)})}
function load(){var t=T[st.queue[st.idx]];el.src=t.file;el.loop=st.queue.length<2;var p=el.play();return p&&p.then?p:Promise.resolve()}
function next(){if(!st.queue.length)return;st.idx=(st.idx+1)%st.queue.length;load().catch(function(){})}
el.addEventListener('playing',function(){errs=0;st.playing=true;applyAmb();emit()});
el.addEventListener('pause',function(){st.playing=false;applyAmb();emit()});
el.addEventListener('ended',next);
el.addEventListener('error',function(){
 if(!st.queue.length)return;errs++;
 if(st.queue.length>1&&errs<st.queue.length)next();else{st.playing=false;emit()}});
function enqueue(i){
 init();
 if(st.queue.indexOf(i)>-1)return Promise.resolve();
 if(!st.queue.length){
  st.queue.push(i);st.idx=0;
  return load().then(emit,function(e){
   if(PREVIEW){emit();return}
   st.queue=[];emit();throw e})}
 st.queue.push(i);el.loop=false;emit();return Promise.resolve()}
function reset(){
 st.queue=[];st.idx=0;el.pause();el.removeAttribute('src');el.load();st.playing=false;applyAmb();emit()}
function toggleSound(){
 init();st.on=!st.on;
 if(ctx)master.gain.setTargetAtTime(st.on?st.vol:0,ctx.currentTime,.08);
 if(!st.on)setTimeout(function(){if(!st.on)el.pause()},350);
 else if(st.queue.length){var p=el.play();if(p&&p.catch)p.catch(function(){})}
 emit()}
window.Player={
 state:st,init:init,enqueue:enqueue,reset:reset,toggleSound:toggleSound,
 setVol:function(v){st.vol=v;if(ctx&&st.on)master.gain.setTargetAtTime(v,ctx.currentTime,.05);emit()},
 setAmb:function(k,v){init();st.amb[k]=v;applyAmb()},
 current:function(){return T[st.queue[st.idx]]||null},
 fx:function(f){init();if(ctx)f(ctx,master)},
 on:function(f){subs.push(f);return function(){var i=subs.indexOf(f);if(i>-1)subs.splice(i,1)}}};
})();
