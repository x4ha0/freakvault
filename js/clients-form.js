/* clients form */
(function(){
  const f=document.getElementById('cform'),m=document.getElementById('cmsg');if(!f)return;
  const SP=/^https?:\/\/open\.spotify\.com\/(intl-[a-z]{2}\/)?artist\/[A-Za-z0-9]{10,}/i,IG=/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]{2,}/i;
  const say=(t,bad)=>{m.textContent=t;m.classList.toggle('bad',!!bad)};
  f.onsubmit=async e=>{e.preventDefault();
    const sp=f.spotify.value.trim(),ig=f.instagram.value.trim();
    if(!sp&&!ig)return say('Paste your Spotify or Instagram URL first.',1);
    if(sp&&!SP.test(sp))return say('This Spotify link is not valid. Paste your artist profile link.',1);
    if(ig&&!IG.test(ig))return say('This Instagram link is not valid.',1);
    const msg=(sp?'Spotify: '+sp+'\n':'')+(ig?'Instagram: '+ig:'');
    if(S.formEndpoint){
      try{const r=await fetch(S.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({spotify:sp,instagram:ig,message:msg})});
        if(!r.ok)throw 0;say((sp?'Spotify link verified. ':'')+'Sent to FREAK. Thank you!');f.reset()}catch(_){say('Something went wrong. Try again.',1)}
    }else{window.open('https://mail.google.com/mail/?view=cm&fs=1&to='+S.email+'&su='+encodeURIComponent('FREAK client link')+'&body='+encodeURIComponent(msg),'_blank','noopener');say((sp?'Spotify link verified. ':'')+'Send the email to finish.')}
  };
})();
