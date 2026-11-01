(function(){
'use strict';
var ORDER=['music','cabinet','game'];
var app=document.getElementById('app');
var i=-1,busy=false;
window.Sections=window.Sections||{};
var ctx={next:function(){go(i+1)}};
function load(n){return new Promise(function(ok){
 if(window.Sections[n])return ok(true);
 var s=document.createElement('script');s.src='sections/'+n+'.js';
 s.onload=function(){ok(!!window.Sections[n])};s.onerror=function(){ok(false)};
 document.head.appendChild(s)})}
function soon(n,last){var el=document.createElement('div');el.className='sec';
 el.innerHTML='<h1>Coming soon</h1><p class="sub">The "'+n+'" part is not built yet.</p>';
 if(!last){var b=document.createElement('button');b.className='pill';b.type='button';b.textContent='Next';b.onclick=ctx.next;el.appendChild(b)}
 app.appendChild(el)}
async function go(n){
 if(busy||n>=ORDER.length)return;busy=true;
 try{
  var old=app.firstElementChild;
  if(old){old.classList.add('leave');await new Promise(function(r){setTimeout(r,450)})}
  app.innerHTML='';i=n;
  var name=ORDER[n];
  if(await load(name))window.Sections[name].mount(app,ctx);else soon(name,n===ORDER.length-1);
 }finally{busy=false}
}
window.Gramo.init();window.Panel.init();window.FX.init();
go(0);
})();
