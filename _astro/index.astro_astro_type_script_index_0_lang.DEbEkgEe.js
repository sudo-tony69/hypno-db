var e=[],t={},n=`ALL`,r=-1,i=null,a=!1,o=document.getElementById(`track-grid`),s=document.getElementById(`empty-state`),c=document.getElementById(`search-input`),l=document.getElementById(`audience-filter`),u=document.getElementById(`sort-select`),d=document.getElementById(`tags-container`),ee=document.getElementById(`count-badge`),te=document.getElementById(`toast-container`),f=document.getElementById(`tel-tracks`),p=document.getElementById(`tel-duration`),m=document.getElementById(`tel-latest`),h=document.getElementById(`artist-name`),g=document.getElementById(`artist-genre`),_=document.getElementById(`artist-bio`),v=document.getElementById(`artist-avatar`),y=document.getElementById(`artist-banner`),b=document.getElementById(`detail-modal-overlay`),x=document.getElementById(`close-modal-btn`),S=document.getElementById(`modal-artwork-img`),C=document.getElementById(`modal-title`),w=document.getElementById(`modal-track-title`),T=document.getElementById(`modal-artist`),ne=document.getElementById(`modal-description`),re=document.getElementById(`modal-play-btn`),ie=document.getElementById(`modal-copy-id-btn`),ae=document.getElementById(`modal-share-btn`),oe=document.getElementById(`spec-id`),se=document.getElementById(`spec-release`),ce=document.getElementById(`spec-audience`),le=document.getElementById(`spec-duration`),E=document.getElementById(`spec-size`),D=document.getElementById(`spec-format`),O=document.getElementById(`spec-bitrate`),k=document.getElementById(`spec-bpm`),A=document.getElementById(`spec-key`),j=document.getElementById(`global-audio-element`),M=document.getElementById(`audio-player-bar`),N=document.getElementById(`player-img`),P=document.getElementById(`player-title`),F=document.getElementById(`player-artist`),I=document.getElementById(`player-format`),L=document.getElementById(`player-play-btn`),R=document.getElementById(`player-play-icon`),z=document.getElementById(`player-pause-icon`),B=document.getElementById(`player-prev-btn`),V=document.getElementById(`player-next-btn`),ue=document.getElementById(`player-current-time`),H=document.getElementById(`player-duration`),U=document.getElementById(`player-scrub-bar`),de=document.getElementById(`player-progress`);async function fe(){try{let[n,r]=await Promise.all([fetch(`./data/artist.json`).then(e=>e.json()),fetch(`./data/tracks.json`).then(e=>e.json())]);t=n,e=r,pe(),me(),J(),_e()}catch(e){console.error(`Failed to load JSON data:`,e),o.innerHTML=`
          <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h3>Unable to load audio database JSON</h3>
            <p>Ensure <code>public/data/tracks.json</code> exists.</p>
          </div>
        `}}function W(e){let t=document.createElement(`div`);t.className=`toast`,t.innerHTML=`<span>✨</span> <span>${e}</span>`,te.appendChild(t),setTimeout(()=>{t.remove()},3e3)}function pe(){h&&(h.textContent=t.name||`Artist Name`),g&&(g.textContent=t.genre||``),_&&(_.textContent=t.bio||``),v&&t.avatar&&(v.src=t.avatar),y&&t.banner&&(y.src=t.banner),f&&(f.textContent=`${e.length} Tracks`);let n=0;e.forEach(e=>n+=K(e.duration));let r=Math.floor(n/60),i=n%60;if(p&&(p.textContent=`${r}m ${i<10?`0`:``}${i}s`),e.length>0){let t=[...e].sort((e,t)=>new Date(t.releaseDate)-new Date(e.releaseDate));m&&(m.textContent=G(t[0].releaseDate))}}function me(){let t=new Set;e.forEach(e=>(e.tags||[]).forEach(e=>t.add(e))),d.innerHTML=`<span class="tag-title">Filter Tag:</span><button class="tag-btn active" data-tag="ALL">All</button>`,Array.from(t).sort().forEach(e=>{let t=document.createElement(`button`);t.className=`tag-btn`,t.dataset.tag=e,t.textContent=e,d.appendChild(t)})}function G(e){return e?new Date(e).toLocaleDateString(`en-US`,{year:`numeric`,month:`short`,day:`numeric`}):`Unknown`}function K(e){if(!e)return 0;let t=e.split(`:`).map(Number);return t.length===2?t[0]*60+t[1]:t[0]||0}function q(){let t=(c.value||``).toLowerCase().trim(),r=l.value,i=u.value,a=e.filter(e=>{let i=!t||e.title.toLowerCase().includes(t)||e.description&&e.description.toLowerCase().includes(t)||e.artist&&e.artist.toLowerCase().includes(t)||e.format&&e.format.toLowerCase().includes(t)||e.key&&e.key.toLowerCase().includes(t)||e.tags&&e.tags.some(e=>e.toLowerCase().includes(t)),a=r===`ALL`||e.audience===r,o=n===`ALL`||e.tags&&e.tags.includes(n);return i&&a&&o});return a.sort((e,t)=>i===`newest`?new Date(t.releaseDate)-new Date(e.releaseDate):i===`oldest`?new Date(e.releaseDate)-new Date(t.releaseDate):i===`title-asc`?e.title.localeCompare(t.title):i===`duration-desc`?K(t.duration)-K(e.duration):0),a}function J(){he(q())}function he(t){if(ee.textContent=`${t.length} Track${t.length===1?``:`s`}`,t.length===0){o.style.display=`none`,s.style.display=`block`;return}s.style.display=`none`,o.style.display=`grid`,o.innerHTML=t.map(t=>{let n=e.findIndex(e=>e.id===t.id),i=r===n&&a;return`
          <article class="track-card ${i?`is-active-playing`:``}" data-id="${t.id}" data-index="${n}">
            <div class="card-artwork-wrapper">
              <span class="card-id-code">#${t.id}</span>
              <span class="audience-pill audience-${t.audience}">${t.audience}</span>
              <img src="${t.artwork}" alt="${t.title} Cover Artwork" class="artwork-img" loading="lazy" />
              <div class="artwork-overlay"></div>

              <button class="play-overlay-btn ${i?`is-playing`:``}" data-action="toggle-play" data-id="${t.id}" aria-label="Play ${t.title}">
                <div class="play-circle">
                  ${i?`
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  `:`
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  `}
                </div>
              </button>
            </div>

            <div class="card-info-content">
              <h3 class="track-title">${Y(t.title)}</h3>
              <div class="track-artist">By ${Y(t.artist)}</div>
              <p class="track-description-preview">${Y(t.description||``)}</p>

              <!-- Waveform Spectrum Bar -->
              <div class="waveform-mini" title="Audio Amplitude Preview">
                <div class="wave-bar" style="--bar-h: 40%;"></div>
                <div class="wave-bar" style="--bar-h: 70%;"></div>
                <div class="wave-bar" style="--bar-h: 100%;"></div>
                <div class="wave-bar" style="--bar-h: 50%;"></div>
                <div class="wave-bar" style="--bar-h: 85%;"></div>
                <div class="wave-bar" style="--bar-h: 30%;"></div>
                <div class="wave-bar" style="--bar-h: 90%;"></div>
                <div class="wave-bar" style="--bar-h: 60%;"></div>
                <div class="wave-bar" style="--bar-h: 100%;"></div>
                <div class="wave-bar" style="--bar-h: 45%;"></div>
                <div class="wave-bar" style="--bar-h: 75%;"></div>
                <div class="wave-bar" style="--bar-h: 35%;"></div>
              </div>

              <!-- Micro Technical Spec Badges -->
              <div class="spec-badges-row">
                <span class="spec-badge" title="Duration">
                  <svg class="spec-icon" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  ${t.duration}
                </span>
                ${t.bpm?`
                  <span class="spec-badge" title="Tempo">
                    <svg class="spec-icon" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    ${t.bpm}
                  </span>
                `:``}
                ${t.format?`
                  <span class="spec-badge" title="Format">
                    <svg class="spec-icon" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 10v4"></path></svg>
                    ${t.format}
                  </span>
                `:``}
              </div>
            </div>

            <div class="card-footer">
              <button class="detail-link-btn" data-action="open-detail" data-id="${t.id}">
                <span>Inspect Details & Specs</span>
                <svg class="arrow-icon" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </article>
        `}).join(``)}function Y(e){return(e||``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function ge(t){let n=e.find(e=>e.id===t);n&&(i=n,S.src=n.artwork,C.textContent=n.title,w&&(w.textContent=n.title),T.textContent=`By ${n.artist}`,ne.textContent=n.description||`No detailed audio description provided.`,oe.textContent=`#${n.id}`,se.textContent=G(n.releaseDate),ce.textContent=n.audience,le.textContent=n.duration,E.textContent=n.fileSize||`N/A`,D.textContent=n.format||`Standard Audio`,O.textContent=n.bitrate||`24-bit / 96 kHz`,k.textContent=n.bpm||`Unspecified`,A.textContent=n.key||`Unspecified`,b.classList.add(`active`))}function X(){b.classList.remove(`active`)}function Z(t){if(t<0||t>=e.length)return;let n=e[t];r===t?j.paused?(j.play(),a=!0):(j.pause(),a=!1):(r=t,j.src=n.audioUrl,j.play().catch(e=>console.log(`Autoplay prevented:`,e)),a=!0,N.src=n.artwork,P.textContent=n.title,F.textContent=n.artist,I.textContent=`${n.format||`Audio`} • ${n.bitrate||`Lossless`}`,M.classList.add(`active`)),Q(),J()}function Q(){a?(R.style.display=`none`,z.style.display=`block`):(R.style.display=`block`,z.style.display=`none`)}function _e(){c.addEventListener(`input`,J),l.addEventListener(`change`,J),u.addEventListener(`change`,J),window.addEventListener(`keydown`,e=>{e.key===`/`&&document.activeElement!==c&&!b.classList.contains(`active`)&&(e.preventDefault(),c.focus()),e.key===`Escape`&&b.classList.contains(`active`)&&X()}),x.addEventListener(`click`,X),b.addEventListener(`click`,e=>{e.target===b&&X()}),re.addEventListener(`click`,()=>{i&&Z(e.findIndex(e=>e.id===i.id))}),ie.addEventListener(`click`,()=>{i&&navigator.clipboard.writeText(i.id).then(()=>{W(`Copied Track ID #${i.id}`)})}),ae.addEventListener(`click`,()=>{i&&navigator.clipboard.writeText(i.audioUrl).then(()=>{W(`Copied Audio URL to clipboard!`)})}),d.addEventListener(`click`,e=>{e.target.classList.contains(`tag-btn`)&&(document.querySelectorAll(`.tag-btn`).forEach(e=>e.classList.remove(`active`)),e.target.classList.add(`active`),n=e.target.dataset.tag,J())}),o.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="toggle-play"]`);if(t){e.stopPropagation();let n=t.closest(`.track-card`);Z(parseInt(n.dataset.index,10));return}let n=e.target.closest(`.track-card`);if(n){let e=n.dataset.id;ge(e)}}),L.addEventListener(`click`,()=>{r>=0?Z(r):e.length>0&&Z(0)}),B.addEventListener(`click`,()=>{r>0?Z(r-1):e.length>0&&Z(e.length-1)}),V.addEventListener(`click`,()=>{r>=0&&r<e.length-1?Z(r+1):e.length>0&&Z(0)}),j.addEventListener(`timeupdate`,()=>{if(j.duration){let e=j.currentTime/j.duration*100;de.style.width=`${e}%`,ue.textContent=$(j.currentTime),H.textContent=$(j.duration)}}),j.addEventListener(`ended`,()=>{r<e.length-1?Z(r+1):(a=!1,Q(),J())}),U.addEventListener(`click`,e=>{if(!j.duration)return;let t=U.getBoundingClientRect();j.currentTime=(e.clientX-t.left)/t.width*j.duration})}function $(e){if(isNaN(e))return`0:00`;let t=Math.floor(e/60),n=Math.floor(e%60);return`${t}:${n<10?`0`:``}${n}`}fe();