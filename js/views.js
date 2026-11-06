function cover(p,i=0,reveal=true){
  const inner=p.image?`<img src="${esc(p.image)}" alt="${esc(pname(p))} cover" loading="lazy" decoding="async">`
   :`<div class="art t${i%3}"><s><span>FREAK</span><span>${esc(p.category)}</span></s><em>${esc(p.volume||'')}</em><b>${esc(p.name.replace(/^FREAK\s*/i,''))}${p.volume?'<br>VOL.'+esc(p.volume):''}</b></div>`;
  return `<span class="cover ${reveal?'reveal':''}">${inner}</span>`;
}
function card(p,i){
  return `<article class="card${soon(p)?' soon':''}">${soon(p)?cover(p,i):`<a href="#/kit/${p.slug}" aria-label="${esc(pname(p))}">${cover(p,i)}</a>`}
  <div class="row"><h3>${esc(pname(p))}</h3><span class="price">${soon(p)?'':esc(p.price)}</span></div>
  <p>${esc(p.description)}</p>
  <div class="meta"><span>${esc(p.category)}</span><span>${cnt(p)}</span></div>
  <div class="acts">${soon(p)?'<span class="btn off">COMING SOON</span>':`${dlBtn(p)}<a class="btn" href="#/kit/${p.slug}">Details</a>`}</div></article>`;
}
const grid=list=>list.length?`<div class="grid">${list.map(card).join('')}</div>`:
 `<p class="soonbig" aria-label="Coming soon">COMING SOON<span class="dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></p>`;

function loop(){
  if(S.heroVideo)return `<video class="loop" src="${esc(S.heroVideo)}" autoplay muted loop playsinline aria-hidden="true"></video>`;
  return `<div class="loop eq" aria-hidden="true">${Array.from({length:56},(_,i)=>`<i style="animation-duration:${(4+((i*37)%17)/4).toFixed(2)}s;animation-delay:-${(i*53)%23}s"></i>`).join('')}</div>`;
}
function heroSec(){
  const ps=P.filter(p=>p.type==='nejma'&&p.cut&&!soon(p)).slice(0,2);
  const fl=ps.map((p,i)=>`<a class="fl f${i}" href="#/kit/${p.slug}" aria-label="${esc(pname(p))}"><img src="${esc(p.cut)}" alt="${esc(pname(p))}" decoding="async"></a>`).join('');
  return `<section class="hero lt">${loop()}<div><div class="label" style="margin-bottom:22px">NEJMA Edition · Free drum kits</div><h1>BUILT FOR<br>THE SOUND.</h1>
  <p>Original sounds. Distinctive textures. Everything you need to create your next sound.</p>
  <div class="cta"><a class="btn solid" href="#/c/nejma">EXPLORE NEJMA KITS</a></div></div>
  <div class="floaters">${fl}</div><div class="hero-word" aria-hidden="true">${[...'FREAK'].map((c,i)=>`<span style="transition-delay:${.5+i*.07}s">${c}</span>`).join('')}</div></section>`;
}
function featSec(){
  const f=P.find(p=>p.slug==='ice-blood')||P.find(p=>p.featured)||P[0];
  return `<section class="feat"><div class="newwrap"><a href="#/kit/${f.slug}" aria-label="${esc(pname(f))}">${cover(f,0,false)}</a><span class="new">NEW!</span></div><div>
  <h2>YOUR NEXT SOUND STARTS HERE.</h2><div class="label">${esc(pname(f))}</div>
  <p style="margin-top:12px;max-width:40ch">${esc(f.description)}</p>
  
  <dl><dt>Sounds</dt><dd>${cnt(f)}</dd><dt>Genres</dt><dd>${esc(f.category)}</dd><dt>Works with</dt><dd>${esc(f.compat)}</dd></dl>
  ${dlBtn(f)}</div></section>`;
}
function aboutSec(){return `<section class="why first" id="about"><h2>MORE THAN JUST SAMPLES.</h2>
  <div class="about-intro"><div><div class="label">About FREAK</div>
  <p class="lead">FREAK is an independent sound library built for music producers. It is a home for original drum kits, sound packs and presets, made for people who want their music to sound like them and not like everyone else.</p></div>
  <div class="body">
  <p><strong>The subject.</strong> FREAK is about sound design for modern beatmaking. Every release is built around the genres shaping today's production: trap, dark trap and rage. Hard-hitting 808s, tight kicks and snares, claps, dusty hi-hats, percussion, loops, FX and one-shots, all crafted to drop straight into a session.</p>
  <p><strong>The objective.</strong> The goal is simple: save producers time and give them a stronger starting point. Instead of digging through thousands of random samples, you get focused, organized collections where every sound has a purpose. Each kit shows its genre, sound count, included categories, format and compatibility, so you know exactly what you are getting before you download.</p>
  <p><strong>How it works.</strong> The current kits are delivered as 24-bit WAV files and work in FL Studio, Ableton Live, Logic Pro and any other DAW. Some kits are free and others are paid, and every product page shows the price and the details. The library grows with each new volume, building on the same identity while pushing the sound further.</p>
  <p><strong>The community.</strong> FREAK is also a place to connect. Join the Discord server to meet other producers, share your work and discover new sounds, follow the channel on YouTube, and reach out by email for collaborations, business inquiries or any questions.</p>
  </div></div>
  <div class="three">
  <div><svg viewBox="0 0 32 32"><path d="M2 16h4l3-10 5 20 4-14 3 4h9"/></svg><h3>Original sounds</h3><p>Unique sound selection designed for creative producers.</p></div>
  <div><svg viewBox="0 0 32 32"><rect x="3" y="5" width="26" height="22"/><path d="M3 12h26M11 12v15"/></svg><h3>Built for producers</h3><p>Organized sounds designed for practical music production workflows.</p></div>
  <div><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12"/><path d="M16 4v24M4 16h24"/></svg><h3>No unnecessary limits</h3><p>A collection built to inspire experimentation and creativity.</p></div></div></section>`}
function editSec(){return `<section class="edit">${S.editorialImage?`<div class="bg" style="background-image:url('${esc(S.editorialImage)}')"></div>`:`<div class="bg gen" aria-hidden="true">${Array.from({length:48},(_,i)=>`<i style="height:${8+Math.abs(Math.sin(i*.55)*Math.cos(i*.17))*70}%"></i>`).join('')}</div>`}
  <h2>CREATE YOUR OWN FREQUENCY.</h2><p>Find your sound. Break the patterns. Create something different.</p>
  <div><a class="btn" href="#/c/nejma">EXPLORE THE COLLECTION</a></div></section>`}
function contactSec(){return `<section class="contact first" id="contact"><h2>LET'S CONNECT.</h2><p>Found a bug or have a question? For collaborations, business inquiries or any problem, get in touch.</p><div class="cta2"><a class="btn solid" href="${gmail}" target="_blank" rel="noopener">REPORT A PROBLEM OR CONTACT WITH US!</a></div></section>`}
function collSec(){return `<section class="why first"><h2>THE COLLECTION.</h2><p style="margin-top:18px;max-width:46ch;color:#c9c8c3">Drop your beat here and we send you straight to the FREAK project on UNTITLED, where you upload it and listen to every beat inside.</p>
  <div class="drop" id="drop" role="button" tabindex="0"><span id="dropT">DROP YOUR BEAT HERE</span><small id="dropS">or click to choose your beat</small></div>
  <input type="file" id="dropF" accept="audio/*,.mp3,.wav,.flac,.m4a,.zip" hidden>
  <div class="cta2"><a class="btn solid" href="${esc(S.untitled)}" target="_blank" rel="noopener">OPEN THE COLLECTION</a></div></section>`}
function ticker(){const t='<img src="assets/images/img-7.png" alt="">'.repeat(5);return `<div class="tick" aria-hidden="true"><div>${t}</div><div>${t}</div></div>`}
function home(){return heroSec()+featSec()}
function cat(t){return `<div class="pagehead"><h1>${TYPES[t]}</h1></div><section>${grid(P.filter(p=>p.type===t))}</section>`;}
function detail(p){
  const i=P.indexOf(p);
  return `<div class="detail"><div>${cover(p,i)}</div><div><a class="back label" href="#/c/${p.type}">Back to ${TYPES[p.type]}</a>
  <h1>${esc(pname(p))}</h1><p style="max-width:44ch;color:#c9c8c3">${esc(p.description)}</p>${p.note?`<p class="pnote">${esc(p.note)}</p>`:''}
  <dl><dt>Price</dt><dd>${esc(p.price)}</dd><dt>Sounds</dt><dd>${cnt(p)}</dd><dt>Genre</dt><dd>${esc(p.category)}</dd>
  <dt>Categories</dt><dd>${p.includes.map(esc).join(', ')}</dd><dt>Formats</dt><dd>${esc(p.formats)}</dd><dt>Compatibility</dt><dd>${esc(p.compat)}</dd></dl>
  ${dlBtn(p)}</div></div>`;
}
