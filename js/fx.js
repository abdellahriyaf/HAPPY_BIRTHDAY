/* Floating things (butterflies, stars, sparkles, petals, flowers, little clouds) cut from the illustrations.
   Shown on the cabinet, the music picker and the music panel; hidden inside rooms and popups. */
window.FX=(function(){
'use strict';
var A=window.FXATLAS,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,holds=0,layers=[],mas=[],panels=0;
/* mascots (baby Mimi + angel) are fixed beside the cabinet: hidden while a room, popup or the music panel is open */
function syncMas(){mas=mas.filter(function(m){return document.body.contains(m)});var off=holds>0||panels>0;mas.forEach(function(m){m.classList.toggle('off',off)})}
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(c){var l=A.sprites[c];return l[Math.random()*l.length|0]}
function spr(cat,w,cls){
 var r=pick(cat),s=w/r[2],e=document.createElement('span');e.className='fxs '+(cls||'');
 e.style.cssText='width:'+w.toFixed(1)+'px;height:'+(r[3]*s).toFixed(1)+'px;background-size:'+(A.w*s).toFixed(1)+'px '+(A.h*s).toFixed(1)+'px;background-position:-'+(r[0]*s).toFixed(1)+'px -'+(r[1]*s).toFixed(1)+'px';return e}
function wrap(cls,style,inner){var d=document.createElement('div');d.className=cls;d.style.cssText=style;if(inner)d.appendChild(inner);return d}
var MAKE={
 butterfly:function(){
  var d=rnd(24,40),sw=wrap('wx','--wx:'+rnd(10,28).toFixed(0)+'px;--dw:'+rnd(3.5,6.5).toFixed(1)+'s;animation-delay:-'+rnd(0,5).toFixed(1)+'s',spr('butterfly',rnd(38,64),'flap'));
  return wrap('fx fx-fly','left:'+rnd(-4,96).toFixed(0)+'vw;top:0;--sx:'+rnd(-28,28).toFixed(0)+'vw;--d:'+d.toFixed(1)+'s;animation-delay:-'+rnd(0,d).toFixed(1)+'s',sw)},
 flower:function(){
  var d=rnd(30,48),sw=wrap('wx','--wx:'+rnd(18,40).toFixed(0)+'px;--dw:'+rnd(5,8).toFixed(1)+'s',spr('flower',rnd(30,48),'spin'));
  sw.firstChild.style.setProperty('--ds',rnd(14,26).toFixed(0)+'s');
  return wrap('fx fx-fall','left:'+rnd(0,94).toFixed(0)+'vw;top:0;--sx:'+rnd(-14,14).toFixed(0)+'vw;--d:'+d.toFixed(1)+'s;animation-delay:-'+rnd(0,d).toFixed(1)+'s',sw)},
 sparkle:function(){return twk('sparkle',rnd(20,36))},
 star:function(){return twk('star',rnd(16,30))},
 tinystar:function(){return twk('tinystar',rnd(10,18))},
 cloud:function(){
  var d=rnd(90,150);return wrap('fx fx-cloud','left:0;top:'+rnd(4,60).toFixed(0)+'vh;--d:'+d.toFixed(0)+'s;animation-delay:-'+rnd(0,d).toFixed(0)+'s',spr('cloud',rnd(100,170)))}
};
function twk(cat,w){var d=rnd(2.4,5.2);return wrap('fx fx-twk','left:'+rnd(1,97).toFixed(0)+'vw;top:'+rnd(2,92).toFixed(0)+'vh;--d:'+d.toFixed(1)+'s;animation-delay:-'+rnd(0,d).toFixed(1)+'s',spr(cat,w))}
function fill(el,plan){Object.keys(plan).forEach(function(k){for(var i=0;i<plan[k];i++)el.appendChild(MAKE[k]())})}
function mkLayer(cls,plan,parent){
 var el=document.createElement('div');el.className='fxlayer '+cls;el.setAttribute('aria-hidden','true');
 if(holds)el.classList.add('off');fill(el,plan);(parent||document.body).appendChild(el);layers.push(el);return el}
window.addEventListener('visibilitychange',function(){document.body.classList.toggle('fxpause',document.hidden)});
return{
 init:function(){
  if(RM||!A)return;
  mkLayer('fx-back',{cloud:2,star:6,tinystar:5});
  mkLayer('fx-front',{butterfly:5,flower:2,sparkle:3})},
 /* hide the layers while a room or popup is open; every hold() must be released once */
 hold:function(){
  holds++;layers.forEach(function(l){l.classList.add('off')});syncMas();var done=false;
  return function(){if(done)return;done=true;holds=Math.max(0,holds-1);if(!holds)layers.forEach(function(l){l.classList.remove('off')});syncMas()}},
 /* register the element that holds baby Mimi and the angel */
 mascot:function(el){mas.push(el);syncMas()},
 /* a layer inside the music panel */
 panel:function(parent){
  panels++;syncMas();var shut=false;function unhide(){if(shut)return;shut=true;panels=Math.max(0,panels-1);syncMas()}
  if(RM||!A)return unhide;
  var el=mkLayer('fx-panel',{star:3,tinystar:3,butterfly:3,flower:1,sparkle:3},parent);
  return function(){unhide();layers.splice(layers.indexOf(el),1);el.classList.add('off');setTimeout(function(){el.remove()},800)}}
};
})();
