/* The rooms and the floating photos. One entry per photo: put the image in photos/<room>/ and write the comment.
   zone = which part of the cabinet drawing opens it (see js/cabinet-map.js). The room picture is rooms/<id>.webp.
   The total number of photos is the number of points (the plan is 19). */
(function(){
function ph(room,notes){return notes.map(function(t,i){return{src:'photos/'+room+'/'+(i+1)+'.jpg',note:t}})}
var N='Your comment for this photo goes here.';
window.ROOMS=[
 {id:'beauty',zone:'hand',title:'Her beauty',color:'#CF6F4A',photos:ph('beauty',[N,N,N])},
 {id:'gifts',zone:'shell',title:'Her gifts',color:'#6FA9AA',photos:ph('gifts',[N,N])},
 {id:'memories',zone:'curtain',title:'Her memories',color:'#E7B9A8',photos:ph('memories',[N,N,N])},
 {id:'dates',zone:'tea',title:'Our dates',color:'#8FA5B4',photos:ph('dates',[N,N,N])},
 {id:'crochet',zone:'door',title:'Her crochet',color:'#F0C860',photos:ph('crochet',[N,N])},
 {id:'photographs',zone:'forest',title:'Her photographs',color:'#4C6A38',photos:ph('photographs',[N,N])},
 {id:'art',zone:'swim',title:'Her art',color:'#BCD4C4',photos:ph('art',[N,N])},
 {id:'music',zone:'leaves',title:'Her music',color:'#7F9A52',photos:ph('music',[N,N])}
];
})();
