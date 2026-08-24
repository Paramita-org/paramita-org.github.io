/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/paginas/paramita-grupos.js — Comportamientos propios de «Grupos»
   ───────────────────────────────────────────────────────────────────────────
   Lo transversal ya lo aportan los componentes del sistema:
     · reveal (data-reveal → .is-in) ....... paramita-reveal.js
     · testimonios (.voz → .in) ............ paramita-testimonios.js
     · FAQ (acordeón + buscador) ........... paramita-faq.js
   Aquí solo vive lo específico de la página:
     1) Buscador «encuentra el tuyo» (índice filtrable estático · Grid FLIP)
     2) Vídeo cinematográfico Khenpo (zoom elástico + parallax) — ref. 06/00
     3) Mapa de presencia (esporas que derivan y brillan)
     4) Preparación del «dibujado» de los pictogramas (longitud de trazo)
     5) Divisor «río» (SVG stroke dashoffset con scroll)
   Datos del directorio: de muestra. En producción, leer un JSON de los ~164.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  /* ── 1 · BUSCADOR (Grid FLIP · estado inicial vacío) ─────────────────── */
  const DATOS = [
    // España
    {t:'Centro Paramita · Pedreguer', s:'Sede · presencial', pais:'España', modo:'presencial'},
    {t:'Círculo de Estudio · Madrid', s:'Presencial · semanal', pais:'España', modo:'presencial'},
    {t:'Grupo Paramita · Valencia', s:'Híbrido · quincenal', pais:'España', modo:'presencial'},
    {t:'Círculo de Estudio · Barcelona', s:'Presencial · semanal', pais:'España', modo:'presencial'},
    // Argentina
    {t:'Grupo Paramita · Buenos Aires', s:'Híbrido · semanal', pais:'Argentina', modo:'presencial'},
    {t:'Círculo de Estudio · Mendoza', s:'Presencial · quincenal', pais:'Argentina', modo:'presencial'},
    // Bolivia
    {t:'Centro Sakya Rinchen Ling · La Paz', s:'Presencial · semanal', pais:'Bolivia', modo:'presencial'},
    {t:'Círculo de Estudio · Cochabamba', s:'Presencial · quincenal', pais:'Bolivia', modo:'presencial'},
    // Canadá
    {t:'Círculo de Estudio · Montreal', s:'Presencial · quincenal', pais:'Canadá', modo:'presencial'},
    {t:'Círculo de Estudio · Victoria–Vancouver', s:'Presencial · mensual', pais:'Canadá', modo:'presencial'},
    // Centro América
    {t:'Círculo de Estudio · Panamá', s:'Presencial · quincenal', pais:'Centro América', modo:'presencial'},
    {t:'Círculo de Estudio · República Dominicana', s:'Presencial · mensual', pais:'Centro América', modo:'presencial'},
    // Chile
    {t:'Círculo de Estudio · Santiago', s:'Presencial · quincenal', pais:'Chile', modo:'presencial'},
    // Colombia
    {t:'Círculo de Estudio · Bogotá', s:'Presencial · semanal', pais:'Colombia', modo:'presencial'},
    {t:'Grupo Paramita · Medellín', s:'Híbrido · quincenal', pais:'Colombia', modo:'presencial'},
    // Costa Rica
    {t:'Grupo Paramita · San José', s:'Presencial · semanal', pais:'Costa Rica', modo:'presencial'},
    // Ecuador
    {t:'Grupo Paramita · Quito', s:'Presencial · quincenal', pais:'Ecuador', modo:'presencial'},
    {t:'Círculo de Estudio · Guayaquil', s:'Presencial · mensual', pais:'Ecuador', modo:'presencial'},
    // EEUU
    {t:'Círculo de Estudio · Nueva York', s:'Presencial · quincenal', pais:'EEUU', modo:'presencial'},
    {t:'Círculo de Estudio · Florida', s:'Presencial · mensual', pais:'EEUU', modo:'presencial'},
    // Europa
    {t:'Círculo Online · Europa', s:'Videollamada · quincenal', pais:'Europa', modo:'online'},
    // México
    {t:'Círculo de Estudio · Ciudad de México', s:'Presencial · quincenal', pais:'México', modo:'presencial'},
    {t:'Círculo de Estudio · Guadalajara', s:'Presencial · semanal', pais:'México', modo:'presencial'},
    {t:'Círculo de Estudio · Monterrey', s:'Presencial · quincenal', pais:'México', modo:'presencial'},
    // Perú
    {t:'Grupo Paramita · Lima', s:'Presencial · quincenal', pais:'Perú', modo:'presencial'},
    // Puerto Rico
    {t:'Grupo Paramita · San Juan', s:'Presencial · semanal', pais:'Puerto Rico', modo:'presencial'},
    // Uruguay
    {t:'Grupo Paramita · Montevideo', s:'Presencial · semanal', pais:'Uruguay', modo:'presencial'},
    {t:'Círculo de Estudio · Punta del Este', s:'Presencial · mensual', pais:'Uruguay', modo:'presencial'},
    // Venezuela
    {t:'Círculo de Estudio · Venezuela', s:'Presencial · quincenal', pais:'Venezuela', modo:'presencial'},
    // Online (red de seguridad)
    {t:'Círculo Online · España y Latinoamérica', s:'Videollamada · para quien no tiene grupo cerca', pais:'Online', modo:'online'},
  ];
  const cont  = $('#resultados');
  const input = $('#busca');
  const chips = $('#chips');
  if(cont && chips){
    let filtro='todos', texto='', touched=false;
    const coincide = d => {
      const okChip = filtro==='todos' ? true
        : (filtro==='presencial'||filtro==='online') ? d.modo===filtro
        : d.pais===filtro;
      const okTxt = !texto || (d.t+' '+d.pais).toLowerCase().includes(texto.toLowerCase());
      return okChip && okTxt;
    };
    function render(){
      if(!touched){
        cont.innerHTML='<div class="res__prompt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><span>Elige tu país o escribe tu ciudad para ver los círculos.</span></div>';
        return;
      }
      const first = new Map();
      $$('.res', cont).forEach(ch=>{ if(ch.dataset.k) first.set(ch.dataset.k, ch.getBoundingClientRect()); });
      const lista = DATOS.filter(coincide);
      cont.innerHTML='';
      if(!lista.length){
        const v=document.createElement('div'); v.className='res__vacio';
        v.textContent='No hay grupos con ese filtro todavía — prueba «Online» para empezar cerca de cualquiera.';
        cont.appendChild(v); return;
      }
      lista.forEach(d=>{
        const el=document.createElement('div'); el.className='res'; el.dataset.k=d.t;
        el.innerHTML='<span class="res__dot '+(d.modo==='online'?'online':'')+'"></span>'+
          '<div><div class="res__t">'+d.t+'</div><div class="res__s">'+d.s+'</div></div>'+
          '<span class="res__go">Contactar →</span>';
        cont.appendChild(el);
      });
      if(!reduce){
        $$('.res', cont).forEach(ch=>{
          const k=ch.dataset.k; if(!k) return;
          const prev=first.get(k), now=ch.getBoundingClientRect();
          if(prev){
            const dy=prev.top-now.top;
            if(dy){ ch.style.transform='translateY('+dy+'px)'; ch.style.transition='none';
              requestAnimationFrame(()=>{ ch.style.transition='transform .5s cubic-bezier(.22,1,.36,1)'; ch.style.transform=''; }); }
          } else {
            ch.style.opacity='0'; ch.style.transform='translateY(10px)';
            requestAnimationFrame(()=>{ ch.style.transition='opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)'; ch.style.opacity=''; ch.style.transform=''; });
          }
        });
      }
    }
    chips.addEventListener('click', e=>{
      const b=e.target.closest('.chip'); if(!b) return;
      $$('.chip', chips).forEach(c=>c.classList.remove('on')); b.classList.add('on');
      filtro=b.dataset.f; touched=true; render();
    });
    if(input) input.addEventListener('input', ()=>{ texto=input.value; touched = touched || texto.trim().length>0; render(); });
    const cerca = $('#cerca');
    if(cerca) cerca.addEventListener('click', ()=>{
      // Demo: prioriza España. En producción → geolocalización (Nivel B) opcional.
      texto=''; if(input) input.value=''; filtro='España'; touched=true;
      $$('.chip', chips).forEach(c=>c.classList.toggle('on', c.dataset.f==='España'));
      render();
    });
    render();
  }

  /* ── 2 · VÍDEO CINEMATOGRÁFICO (muelle elástico + parallax) ──────────── */
  const cine = $('#cineKhenpo'), cineMedia = $('#cineKhenpoMedia');
  if(cine && cineMedia && !reduce){
    let s=1, v=0, sTarget=1, tx=0, ty=0, cx=0, cy=0, raf=null, idle=0;
    function loop(){
      v += (sTarget - s)*0.08; v *= 0.72; s += v;
      cx += (tx-cx)*0.12; cy += (ty-cy)*0.12;
      cineMedia.style.transform = 'translate('+cx.toFixed(2)+'px,'+cy.toFixed(2)+'px) scale('+s.toFixed(4)+')';
      const quieto = Math.abs(sTarget-s)<0.0005 && Math.abs(v)<0.0005 && Math.abs(tx-cx)<0.05 && Math.abs(ty-cy)<0.05;
      idle = quieto ? idle+1 : 0;
      if(idle>8){ raf=null; return; }
      raf=requestAnimationFrame(loop);
    }
    const kick = ()=>{ if(!raf) raf=requestAnimationFrame(loop); };
    const pop  = ()=>{ sTarget=1.16; kick(); setTimeout(()=>{ sTarget=1.06; kick(); }, 520); };
    cine.addEventListener('click', pop);
    cine.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pop(); } });
    cine.addEventListener('pointerenter', ()=>{ sTarget=Math.max(sTarget,1.06); kick(); });
    cine.addEventListener('pointermove', e=>{ const r=cine.getBoundingClientRect();
      tx=(e.clientX-r.left-r.width/2)*0.045; ty=(e.clientY-r.top-r.height/2)*0.045; kick(); });
    cine.addEventListener('pointerleave', ()=>{ sTarget=1; tx=0; ty=0; kick(); });
  }

  /* ── 3 · MAPA DE PRESENCIA ─────────────────────────────────────────────── */

  /* 3a · Esporas de fondo · flotan y brillan (ambiental, detrás del mapa)
     Redondas siempre: el lienzo se dimensiona a px CSS × densidad de píxel y
     se reconstruye con ResizeObserver cuando la sección cambia de alto (antes
     el canvas se estiraba por CSS y los círculos salían ovalados). */
  const esp = $('#mapaEsporas');
  if(esp){
    const ctx = esp.getContext('2d'); let w=0,h=0,pts=[];
    const clusters=[[0.12,0.30,16],[0.24,0.66,18],[0.40,0.24,16],[0.50,0.72,18],[0.62,0.40,16],[0.76,0.68,17],[0.86,0.30,15],[0.70,0.20,12]];
    const nuevo=(x0,y0)=>({ x0,y0, base:0.22+Math.random()*0.30, ph:Math.random()*Math.PI*2, sp:0.0006+Math.random()*0.0011,
      dph:Math.random()*Math.PI*2, dsp:0.00018+Math.random()*0.00035, damp:6+Math.random()*16, r:1.8+Math.random()*1.6 });
    function build(){
      const dpr = Math.min(devicePixelRatio||1, 2);
      w=esp.offsetWidth; h=esp.offsetHeight;
      if(!w||!h) return;
      esp.width=Math.round(w*dpr); esp.height=Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);   /* dibujar en px CSS → círculo = círculo */
      pts=[];
      clusters.forEach(([cx,cy,n])=>{ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, rad=Math.random()*0.1;
        pts.push(nuevo((cx+Math.cos(a)*rad)*w,(cy+Math.sin(a)*rad)*h)); } });
      for(let i=0;i<90;i++){ pts.push(nuevo((0.04+Math.random()*0.92)*w,(0.10+Math.random()*0.80)*h)); }
    }
    function paint(t){
      ctx.clearRect(0,0,w,h);
      pts.forEach(p=>{
        const tw = reduce ? p.base : p.base + Math.sin(t*p.sp+p.ph)*0.14;
        const dx = reduce ? 0 : Math.cos(t*p.dsp+p.dph)*p.damp;
        const dy = reduce ? 0 : Math.sin(t*p.dsp*1.24+p.dph)*p.damp;
        ctx.beginPath(); ctx.arc(p.x0+dx, p.y0+dy, p.r, 0, Math.PI*2);
        ctx.fillStyle='oklch(78% .155 68 / '+Math.max(0,tw).toFixed(3)+')'; ctx.fill();
      });
      if(!reduce) requestAnimationFrame(paint);
    }
    if('ResizeObserver' in window){ new ResizeObserver(()=>build()).observe(esp); }
    else { addEventListener('resize', build, {passive:true}); }
    build(); reduce ? paint(0) : requestAnimationFrame(paint);
  }

  /* 3b · MAPA · SVG aparte (fetch+inject) · glow tranquilo, sin marcadores.
     Los países con presencia ya vienen iluminados (class "pais pais--on") en el
     propio SVG; el filtrado vive en el buscador de abajo. */
  const mapaBox = document.querySelector('.mapa[data-src]');
  if(mapaBox){
    fetch(mapaBox.getAttribute('data-src')).then(r=> r.ok ? r.text() : Promise.reject()).then(txt=>{
      mapaBox.innerHTML = txt;
      const svg = mapaBox.querySelector('svg');
      if(svg) svg.classList.add('mapa__svg');
    }).catch(()=>{ /* si la carga falla, el bloque conserva esporas + cifra */ });
  }

  /* ── 4 · Pictogramas: longitud de trazo para el «dibujado» ───────────── */
  $$('.picto .pico svg path, .picto .pico svg circle').forEach(el=>{
    try{ el.style.setProperty('--pl', Math.ceil(el.getTotalLength())); }catch(e){}
  });

  /* ── 5 · Divisor «río»: dibujar con el scroll (ref. 06c) ─────────────── */
  const rios = $$('.rio path');
  rios.forEach(p=>{ p.style.setProperty('--len', p.getTotalLength()); });
  if(!reduce && rios.length){
    const draw = ()=>{
      rios.forEach(p=>{
        const r = p.closest('svg').getBoundingClientRect(), vh = innerHeight;
        let prog = (vh - r.top) / (vh*0.65); prog = Math.max(0, Math.min(1, prog));
        const L = parseFloat(p.style.getPropertyValue('--len'));
        p.style.strokeDashoffset = L*(1-prog);
      });
    };
    addEventListener('scroll', ()=>requestAnimationFrame(draw), {passive:true});
    draw();
  }
  /* Nota · el revelado en cascada de las .voz (.voz → .in) lo gestiona el
     componente del proyecto paramita-testimonios.js (observa .bloque-voces).
     Aquí NO se duplica para no competir con su animación escalonada. */

  /* ── 7 · Testimonios en vídeo (Vimeo) · facade con miniatura + click-to-play ─
     paramita-video.js solo cubre YouTube (data-yt). Aquí se cubre Vimeo
     (data-vimeo): miniatura vía oEmbed (CORS) e iframe de player.vimeo.com al
     interactuar. Reutiliza el CSS de .video-facade / __thumb / __play. */
  $$('.video-facade[data-vimeo]').forEach(el=>{
    const id = el.getAttribute('data-vimeo');
    if(!id) return;
    const thumb = document.createElement('img');
    thumb.className='video-facade__thumb'; thumb.alt=''; thumb.loading='lazy'; thumb.decoding='async';
    const custom = el.getAttribute('data-thumb');
    if(custom){ thumb.src=custom; el.insertBefore(thumb, el.firstChild); }
    else{
      fetch('https://vimeo.com/api/oembed.json?width=800&url=https://vimeo.com/'+id)
        .then(r=> r.ok ? r.json() : Promise.reject())
        .then(d=>{ if(d && d.thumbnail_url){ thumb.src=d.thumbnail_url; el.insertBefore(thumb, el.firstChild); } })
        .catch(()=>{ /* sin miniatura: queda el degradado de marca del facade */ });
    }
    const play = ()=>{
      if(el.dataset.cargado) return; el.dataset.cargado='1'; el.classList.add('is-playing');
      const ifr=document.createElement('iframe');
      ifr.src='https://player.vimeo.com/video/'+id+'?autoplay=1&title=0&byline=0&portrait=0&dnt=1';
      ifr.title=el.getAttribute('aria-label')||'Testimonio en vídeo · Paramita';
      ifr.allow='autoplay; fullscreen; picture-in-picture';
      ifr.allowFullscreen=true; ifr.loading='lazy';
      el.appendChild(ifr);
    };
    el.addEventListener('click', play);
    el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); play(); } });
  });
})();
