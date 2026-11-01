window.Sections=window.Sections||{};
window.Sections.music={mount:function(host,ctx){
 var T=window.TRACKS||[],RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var s=document.createElement('section');s.className='sec music';
 s.innerHTML='<div class="gspace"></div><p class="cap">Choose your songs, in the order you want to hear them</p><div class="discs"></div><p class="note" role="status"></p><div class="actions"><button class="pill" type="button" id="mreset" disabled>Reset</button><button class="pill primary" type="button" id="mgo" disabled>Confirm</button></div><button class="link" type="button" id="mfx">Sound effects</button>';
 host.appendChild(s);
 var sp=s.querySelector('.gspace'),cap=s.querySelector('.cap'),note=s.querySelector('.note'),rs=s.querySelector('#mreset'),go=s.querySelector('#mgo'),fx=s.querySelector('#mfx');
 setTimeout(function(){window.Gramo.show(sp)},RM?0:700);
 function fly(b){
  var v=b.querySelector('.vinyl'),lab=document.getElementById('lab');if(!v||!lab||RM)return;
  var f=v.getBoundingClientRect(),to=lab.getBoundingClientRect(),c=v.cloneNode(true);
  c.className='vinyl fly';
  c.style.cssText='position:fixed;left:'+f.left+'px;top:'+f.top+'px;width:'+f.width+'px;height:'+f.height+'px;z-index:30;pointer-events:none;margin:0';
  document.body.appendChild(c);
  var dx=to.left+to.width/2-(f.left+f.width/2),dy=to.top+to.height/2-(f.top+f.height/2),sx=to.width*3.08/f.width,
   end='translate('+dx+'px,'+dy+'px) scale('+sx+','+sx*.28+')';
  c.animate([{transform:'none',opacity:1},{transform:end,opacity:1,offset:.85},{transform:end,opacity:0}],{duration:850,easing:'cubic-bezier(.5,0,.3,1)',fill:'forwards'}).onfinish=function(){c.remove()}}
 window.UI.discs(s.querySelector('.discs'),function(i,b){
  if(window.Player.state.queue.indexOf(i)>-1)return;
  note.textContent='';b.classList.add('loading');
  window.Player.enqueue(i).then(function(){b.classList.remove('loading');fly(b)},function(){
   b.classList.remove('loading');note.textContent='"'+T[i].title+'" is not uploaded yet.'})});
 var off=window.Player.on(function(st){
  var n=st.queue.length;rs.disabled=go.disabled=!n;
  cap.textContent=!n?'Choose your songs, in the order you want to hear them':n<T.length?'Add more to the queue, or confirm when you are happy':'That is everything. Confirm when you are ready'});
 rs.onclick=function(){note.textContent='';window.Player.reset()};
 fx.onclick=function(){window.Panel.open(fx)};
 go.onclick=function(){off();window.Gramo.dock();ctx.next()}
}};
