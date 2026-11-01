/* Our own little icons, drawn to match the cabinet: brown hand-inked outline, flat paint colours. */
window.Icons=(function(){
var I='#6b4a32',st=' stroke="'+I+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
var D={
 heart:'<path d="M16 28C7 21.5 3.5 14.5 8 9.6C11.4 6 16 8.4 16 12.4C16 8.4 20.6 6 24 9.6C28.5 14.5 25 21.5 16 28Z" fill="#d9684c"'+st+'/><path d="M9.6 12.6C10.5 10.9 12.4 10.5 13.6 11.3" fill="none" stroke="#fbd9c8" stroke-width="2" stroke-linecap="round"/>',
 note:'<ellipse cx="11" cy="24" rx="5.4" ry="4.1" transform="rotate(-18 11 24)" fill="#7fa9aa"'+st+'/><path d="M15.8 22.6V6.8C19.4 8 22.6 9.8 24 14" fill="none"'+st+' stroke-width="2.6"/>',
 notes:'<ellipse cx="8.5" cy="24.5" rx="4.6" ry="3.6" transform="rotate(-18 8.5 24.5)" fill="#7fa9aa"'+st+'/><ellipse cx="22" cy="21.5" rx="4.6" ry="3.6" transform="rotate(-18 22 21.5)" fill="#7fa9aa"'+st+'/><path d="M12.7 23.4V8.6L26.3 5.6V20.4" fill="none"'+st+' stroke-width="2.6"/><path d="M12.7 12.6L26.3 9.6" fill="none"'+st+' stroke-width="3.4"/>',
 star:'<path d="M16 3.4L19.9 11.9L29.1 13L22.2 19.4L24.1 28.6L16 24L7.9 28.6L9.8 19.4L2.9 13L12.1 11.9Z" fill="#eab14a"'+st+'/><path d="M16 8L18 12.8L22 13.4" fill="none" stroke="#fff1c4" stroke-width="2" stroke-linecap="round"/>',
 sparkle:'<path d="M16 3C17.2 11 21 14.8 29 16C21 17.2 17.2 21 16 29C14.8 21 11 17.2 3 16C11 14.8 14.8 11 16 3Z" fill="#f6dc8a"'+st+'/>',
 arrowL:'<path d="M20.5 5.5L9.5 16L20.5 26.5" fill="none"'+st+' stroke-width="3.6"/>',
 close:'<path d="M7.5 7.5L24.5 24.5M24.5 7.5L7.5 24.5" fill="none"'+st+' stroke-width="3.6"/>',
 check:'<path d="M6.5 17L13 23.5L25.5 8.5" fill="none"'+st+' stroke-width="3.6"/>',
 speaker:'<path d="M4.5 12.5V19.5H9.5L16.5 25.5V6.5L9.5 12.5Z" fill="#f6e8c8"'+st+'/><path d="M21 12.2C23.2 14.4 23.2 17.6 21 19.8M24.6 8.8C28.4 13 28.4 19 24.6 23.2" fill="none"'+st+' stroke-width="2.4"/>',
 speakerOff:'<path d="M4.5 12.5V19.5H9.5L16.5 25.5V6.5L9.5 12.5Z" fill="#f6e8c8"'+st+'/><path d="M21.5 12L28.5 20M28.5 12L21.5 20" fill="none"'+st+' stroke-width="2.8"/>'
};
function get(n,s){s=s||20;return'<svg class="ic ic-'+n+'" viewBox="0 0 32 32" width="'+s+'" height="'+s+'" aria-hidden="true">'+D[n]+'</svg>'}
return{get:get,names:Object.keys(D)};
})();
