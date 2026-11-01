/* Shared disc buttons, the sound on/off badge, and the full-screen control panel. */
(function(){
'use strict';
var T=window.TRACKS||[],V=window.VIGS||[],INK='#C8652C';
function disc(t,i){
 return'<button class="disc" type="button" data-i="'+i+'" style="--i:'+i+'" aria-label="Add '+t.title+' to the queue"><span class="vinyl"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#3E4348" stroke="#1f2326" stroke-width="2"/><circle cx="50" cy="50" r="38" fill="none" stroke="#7b8187" stroke-width=".8" stroke-dasharray="40 14" opacity=".8"/><circle cx="50" cy="50" r="29" fill="none" stroke="#7b8187" stroke-width=".8" stroke-dasharray="30 11" opacity=".8"/><circle cx="50" cy="50" r="19" fill="'+t.color+'" stroke="'+INK+'" stroke-width="1.6"/><circle cx="50" cy="50" r="2.4" fill="#5b3a24"/></svg><img class="thumb" src="'+t.thumb+'" alt="" onerror="this.remove()"></span><span class="ord" aria-hidden="true"></span><span class="t">'+t.title+'</span></button>'}
function sync(){
 var s=window.Player.state;
 [].forEach.call(document.querySelectorAll('.disc'),function(b){
  var i=+b.dataset.i,p=s.queue.indexOf(i);
  b.classList.toggle('q',p>-1);b.querySelector('.ord').textContent=p>-1?p+1:'';
  b.classList.toggle('now',p>-1&&p===s.idx&&s.playing&&s.on)})}
function fill(input){input.style.setProperty('--fill',((input.value-input.min)/(input.max-input.min)*100)+'%')}
window.UI={
 discs:function(box,onpick){
  box.innerHTML=T.map(disc).join('');
  [].forEach.call(box.children,function(b){b.onclick=function(){onpick(+b.dataset.i,b)}});sync()},
 sync:sync};

var P,opener=null,mute,fxOff=null;
function build(){
 P=document.createElement('aside');P.id='panel';P.className='panel';P.setAttribute('inert','');P.setAttribute('role','dialog');P.setAttribute('aria-modal','true');P.setAttribute('aria-label','Music and sounds');
 P.innerHTML='<div class="pbox"><button class="pclose" type="button" aria-label="Close">'+window.Icons.get('close',22)+'</button>'
 +'<h2>Music &amp; sounds</h2>'
 +'<section class="psec"><div class="prow"><label for="pv">Volume</label><input type="range" id="pv" min="0" max="1" step="0.01"><button class="pill" type="button" id="psound"></button></div></section>'
 +'<section class="psec"><h3>Your queue</h3><p class="np" id="pnp"></p><div class="pdiscs"></div><p class="hint">Tap the discs in the order you want to hear them.</p><p class="note" id="pnote" role="status"></p><button class="pill" type="button" id="preset">Reset queue</button></section>'
 +'<section class="psec"><h3>Atmosphere</h3><div class="mixgrid">'
 +V.map(function(v){return'<div class="mix">'+v.svg+'<div class="mixbar"><label for="vol-'+v.id+'">'+v.label+'</label><input type="range" id="vol-'+v.id+'" data-k="'+v.id+'" min="0" max="1" step="0.05" value="'+v.v+'"></div></div>'}).join('')
 +'</div></section><button class="pill primary pdone" type="button">Back to the page</button></div>';
 document.body.appendChild(P);
 var pv=P.querySelector('#pv'),snd=P.querySelector('#psound'),np=P.querySelector('#pnp'),note=P.querySelector('#pnote');
 pv.value=window.Player.state.vol;fill(pv);
 pv.oninput=function(){fill(pv);window.Player.init();window.Player.setVol(+pv.value)};
 snd.onclick=function(){window.Player.toggleSound()};
 [].forEach.call(P.querySelectorAll('[data-k]'),function(r){fill(r);r.oninput=function(){fill(r);window.Player.setAmb(r.dataset.k,+r.value)}});
 window.UI.discs(P.querySelector('.pdiscs'),function(i){
  note.textContent='';window.Player.enqueue(i).catch(function(){note.textContent='"'+T[i].title+'" is not uploaded yet.'})});
 P.querySelector('#preset').onclick=function(){note.textContent='';window.Player.reset()};
 P.querySelector('.pclose').onclick=close;P.querySelector('.pdone').onclick=close;
 addEventListener('keydown',function(e){if(e.key==='Escape'&&P.classList.contains('open'))close()});
 window.Player.on(function(s){
  var c=window.Player.current();
  np.textContent=c?(s.playing&&s.on?'Now playing: ':'Up next: ')+c.title:'Nothing in the queue yet.';
  snd.textContent=s.on?'Sound: on':'Sound: off';
  pv.value=s.vol;fill(pv);
  mute.classList.toggle('off',!s.on);mute.setAttribute('aria-pressed',String(!s.on));
  mute.setAttribute('aria-label',s.on?'Mute everything':'Unmute everything');
  sync()})}
function open(from){
 opener=from||null;
 var r=(from||document.body).getBoundingClientRect();
 P.style.setProperty('--ox',(from?r.left+r.width/2:innerWidth/2)+'px');
 P.style.setProperty('--oy',(from?r.top+r.height/2:innerHeight/2)+'px');
 P.removeAttribute('inert');void P.offsetWidth;P.classList.add('open');fxOff=window.FX.panel(P);
 setTimeout(function(){var c=P.querySelector('.pclose');if(c)c.focus()},450)}
function close(){
 P.classList.remove('open');P.setAttribute('inert','');if(fxOff){var f=fxOff;fxOff=null;setTimeout(f,500)}
 if(opener&&opener.focus)opener.focus()}
window.Panel={
 init:function(){
  mute=document.createElement('button');mute.id='mute';mute.type='button';mute.setAttribute('aria-label','Mute everything');
  mute.innerHTML=window.Icons.get('speaker',28)+window.Icons.get('speakerOff',28);
  mute.onclick=function(){window.Player.toggleSound()};
  document.body.appendChild(mute);
  build();
  window.Gramo.onClick(function(){open(window.Gramo.el())})},
 open:open,close:close};
})();
