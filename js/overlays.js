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

/* ---- letter ---- */
function letter(T){
 return new Promise(function(done){
  var ov=el('<div class="ov fxov"><div class="stage lstage" dir="'+(T.dir||'ltr')+'"><div class="fpage lpage"><div class="ptxt"></div><div class="lnav"><button class="pill lback" type="button">Back</button><span class="lcount"></span><button class="pill primary pbtn" type="button">Fold the letter</button></div></div><img class="bl bl-l" src="fx/blossom.webp" alt="" draggable="false"><img class="bl bl-r" src="fx/blossom.webp" alt="" draggable="false"></div></div>');
  document.body.appendChild(ov);
  var st=ov.firstChild,page=st.querySelector('.lpage'),L=st.querySelector('.bl-l'),R=st.querySelector('.bl-r'),b=st.querySelector('.pbtn');
  var fold=function(){b.disabled=true;close(ov,st).then(done)};
  if(T.paged){
   st.classList.add('arl');if(T.lang)st.lang=T.lang;
   var box=st.querySelector('.ptxt'),back=st.querySelector('.lback'),cnt=st.querySelector('.lcount'),pgs=[],pi=0,turning=false,rtl=(T.dir==='rtl');
   box.style.transformOrigin=rtl?'right center':'left center';
   var fill=function(ps){box.innerHTML='';ps.forEach(function(t){var p=document.createElement('p');p.textContent=t;box.appendChild(p)});box.scrollTop=0};
   var cap=0,fits=function(ps){fill(ps);return (box.lastChild.offsetTop+box.lastChild.offsetHeight)<=Math.min(cap||1e9,box.clientHeight)+1};
   var run=function(){
    var cur=[];pgs=[];
    T.paragraphs.filter(Boolean).forEach(function(para){
     var txt='';cur.push('');
     para.split(/\s+/).filter(Boolean).forEach(function(w){
      var t=txt?txt+' '+w:w;cur[cur.length-1]=t;
      if(fits(cur)){txt=t;return}
      if(txt)cur[cur.length-1]=txt;else cur.pop();
      pgs.push(cur);cur=[w];txt=w})});
    pgs.push(cur)};
   /* second pass: spread the text evenly so the last page is not a few orphan lines */
   var build=function(){
    cap=0;run();var n=pgs.length;if(n<2)return;
    var hs=0;pgs.forEach(function(ps){fill(ps);hs+=(box.lastChild.offsetTop+box.lastChild.offsetHeight)});
    var c=Math.min(box.clientHeight,Math.ceil(hs/n/32)*32+32),first=pgs;
    cap=c;run();if(pgs.length!==n)pgs=first;cap=0};
   var show=function(){fill(pgs[pi]);cnt.textContent=(pi+1)+' / '+pgs.length;back.style.visibility=pi?'visible':'hidden';b.textContent=pi<pgs.length-1?'Next':'Fold the letter'};
   var go=function(d){
    var n=pi+d;if(turning||n<0||n>=pgs.length)return;turning=true;var s=(rtl?-1:1)*d;
    A(box,[{opacity:1,transform:'perspective(900px) rotateY(0deg)'},{opacity:0,transform:'perspective(900px) rotateY('+(-s*75)+'deg)'}],{duration:280,easing:'ease-in'})
     .then(function(){pi=n;show();return A(box,[{opacity:0,transform:'perspective(900px) rotateY('+(s*35)+'deg)'},{opacity:1,transform:'perspective(900px) rotateY(0deg)'}],{duration:320,easing:'ease-out'})})
     .then(function(){turning=false})};
   b.onclick=function(){if(pi<pgs.length-1)go(1);else fold()};
   back.onclick=function(){go(-1)};
   back.style.visibility='hidden';
   var sample=T.paragraphs.join(' ').slice(0,60),ft=new Promise(function(r){setTimeout(r,1500)});
   Promise.race([Promise.all([document.fonts.load('400 1.14rem Amiri',sample)]).catch(function(){}),ft]).then(function(){build();show()});
  }else{
   st.querySelector('.lback').remove();st.querySelector('.lcount').remove();
   lines(st.querySelector('.ptxt'),{title:T.title,lines:T.paragraphs});
   b.onclick=fold}
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
  })}

/* ---- poem ---- */
function poem(T){
 return new Promise(function(done){
  var ov=el('<div class="ov fxov"><div class="pcol"><div class="stage pstage" dir="'+(T.dir||'ltr')+'"><img class="scroll" src="fx/scroll.webp" alt="" draggable="false"><div class="stxt"><div class="sin"></div></div><img class="bunny b1" src="fx/bunny1.webp" alt="" draggable="false"><img class="bunny b2" src="fx/bunny2.webp" alt="" draggable="false"></div><button class="pill primary pbtn" type="button">Close</button></div></div>');
  document.body.appendChild(ov);
  var st=ov.querySelector('.pstage'),scroll=st.querySelector('.scroll'),txt=st.querySelector('.stxt'),b1=st.querySelector('.b1'),b2=st.querySelector('.b2'),b=ov.querySelector('.pbtn');
  if(T.verses){var sin=st.querySelector('.sin'),h=document.createElement('h3');h.textContent=T.title||'';sin.appendChild(h);
   T.verses.forEach(function(v){if(v==='-'){var s=document.createElement('div');s.className='vsep';s.textContent='\u2726';sin.appendChild(s);return}
    var d=document.createElement('div');d.className='verse';v.forEach(function(t){var p=document.createElement('p');p.textContent=t;d.appendChild(p)});sin.appendChild(d)});
   st.classList.add('arp');if(T.lang)st.lang=T.lang}else lines(st.querySelector('.sin'),{title:T.title,lines:T.lines});
  A(ov,[{opacity:0},{opacity:1}],{duration:300});
  A(scroll,[{clipPath:'inset(0 0 100% 0)',opacity:0},{clipPath:'inset(0 0 100% 0)',opacity:0}],{duration:1});A(txt,[{opacity:0},{opacity:0}],{duration:1});A(b,[{opacity:0},{opacity:0}],{duration:1});
  Promise.all([ready(scroll),ready(b1),ready(b2)]).then(function(){
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
  var pages=T.pages||[],i=0;
  var ov=el('<div class="ov fxov"><div class="stage sstage" dir="'+(T.dir||'ltr')+'"><div class="fpage spage"><div class="ptxt"></div><button class="pill primary pbtn" type="button"></button></div><img class="cn cn-tl" src="fx/corner1.webp" alt="" draggable="false"><img class="cn cn-br" src="fx/corner2.webp" alt="" draggable="false"><img class="sun" src="fx/sun.webp" alt="" draggable="false"><img class="mn" src="fx/moonface.webp" alt="" draggable="false"></div></div>');
  document.body.appendChild(ov);
  var st=ov.firstChild,page=st.querySelector('.spage'),box=st.querySelector('.ptxt'),b=st.querySelector('.pbtn'),tl=st.querySelector('.cn-tl'),br=st.querySelector('.cn-br'),sun=st.querySelector('.sun'),mn=st.querySelector('.mn');
  function render(){lines(box,pages[i]);b.textContent=i<pages.length-1?'Next':'Close'}render();
  A(ov,[{opacity:0},{opacity:0}],{duration:1});A(ov,[{opacity:0},{opacity:1}],{duration:300});
  A(page,[{opacity:0,transform:'scale(.55)'},{opacity:0,transform:'scale(.55)'}],{duration:1});A(tl,[{opacity:0},{opacity:0}],{duration:1});A(br,[{opacity:0},{opacity:0}],{duration:1});
  Promise.all([ready(sun),ready(mn),ready(tl),ready(br)]).then(function(){
  var sc=center(st),cs=center(sun),cm=center(mn);
  var ds={x:sc.x-cs.x-34,y:sc.y-cs.y},dm={x:sc.x-cm.x+34,y:sc.y-cm.y};
  function pop(e,d,rot){return A(e,[{transform:'translate('+d.x+'px,'+d.y+'px) scale(0) rotate('+rot+'deg)',opacity:0},{transform:'translate('+d.x+'px,'+d.y+'px) scale(1.15) rotate(0)',opacity:1,offset:.65},{transform:'translate('+d.x+'px,'+d.y+'px) scale(1) rotate(0)',opacity:1}],{duration:650,easing:'ease-out'})}
  /* sun and moon pop together, part diagonally, then the blossom corners open the page */
  Promise.all([pop(sun,ds,-30),pop(mn,dm,30)]).then(function(){return wait(320)}).then(function(){
   A(sun,[{transform:'translate('+ds.x+'px,'+ds.y+'px)'},{transform:'translate(0,0)'}],{duration:950,easing:'cubic-bezier(.35,1.2,.5,1)'});
   A(mn,[{transform:'translate('+dm.x+'px,'+dm.y+'px)'},{transform:'translate(0,0)'}],{duration:950,easing:'cubic-bezier(.35,1.2,.5,1)'});
   var tc=center(tl),bc=center(br);
   A(tl,[{opacity:0,transform:'translate('+(sc.x-tc.x)+'px,'+(sc.y-tc.y)+'px) scale(.3) rotate(-20deg)'},{opacity:1,transform:'none'}],{duration:1000,delay:260,easing:'cubic-bezier(.3,1,.4,1)'});
   A(br,[{opacity:0,transform:'translate('+(sc.x-bc.x)+'px,'+(sc.y-bc.y)+'px) scale(.3) rotate(20deg)'},{opacity:1,transform:'none'}],{duration:1000,delay:260,easing:'cubic-bezier(.3,1,.4,1)'});
   A(page,[{opacity:0,transform:'scale(.55)'},{opacity:1,transform:'none'}],{duration:950,delay:260,easing:'cubic-bezier(.3,1,.4,1)'})})});
  b.onclick=function(){
   if(i<pages.length-1){i++;A(box,[{opacity:1},{opacity:0},{opacity:1}],{duration:380});setTimeout(render,190);return}
   b.disabled=true;close(ov,st).then(done)}})}
return{letter:letter,poem:poem,story:story};
})();
