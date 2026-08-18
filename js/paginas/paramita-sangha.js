/* ═══════════════════════════════════════════════════════════════════════
   paramita-sangha.js — Comportamientos de /sobre/sangha-monastica/
   ───────────────────────────────────────────────────────────────────────
   Solo lo específico de esta página:
     · Tira de rostros: arrastre, rueda→horizontal con inercia (cede a la
       página en los extremos), flechas, barra de progreso, muro completo,
       y panel/reel que se abre en su sitio (fachada de vídeo, nunca autoplay).
     · Ofrenda única (dāna): importes sin preselección + acuse.
   El revelado [data-reveal]→.is-in lo da js/primitivos/paramita-reveal.js.
   La FAQ (toggle) la da js/componentes/paramita-faq.js.
   La cita se revela vía data-reveal (.is-in) — sin JS aquí.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Datos de la sangha (16 · Khenpo + 15) ───────────────────────────
     Copy PROVISIONAL pendiente de Ale/Khenpo. Fotos en
     /assets/img/comunidad monastica/ · verificar casing exacto (GitHub
     Pages distingue mayúsculas). */
  const SANGHA = [
    {n:"Ven. Khenpo Rinchen",l:"Director de la Fundación",f:"Khenpo-mirada-retoque-low.jpg",bio:"Director de la Fundación Sakya y maestro residente en España. Graduado en Arte y Psicología, nombrado Maestro Tántrico y Khenpo. Fundó Paramita para difundir el Dharma en español.",q:"Creo que nuestros mayores defectos se pueden convertir en nuestras mayores virtudes."},
    {n:"Ven. Choky Dronme",l:"Ordenada · 2024",f:"Choky-Retoque-low.jpg",bio:"Monja ordenada en 2024 por S.E. Luding Khen Rinpoché. Abogada de formación, desde 2017 sigue la guía del Ven. Khenpo Rinchen. Colabora en España y Bolivia.",q:"Habito una alegría indescriptible, bajo la guía de mi Maestro."},
    {n:"Ven. Damcho Dorje",l:"Uruguay · 2025",f:"Danchö-Dorje-retoque-low.jpg",bio:"Residente en Uruguay. Tras años enseñando Yoga y Reiki, inició su formación con el Ven. Khenpo Rinchen. Ordenado en Bodh Gaya en 2025.",q:""},
    {n:"Ven. Damcho Gyaltsen",l:"Psicología · 2019",f:"Gyaltsen-Retoque-low.jpg",bio:"Monje residente y doctor en Psicología. Votos en 2019; sirve como traductor e intérprete y guía meditaciones. Profundiza su formación en India y Nepal.",q:"Que donde el idioma separa, yo pueda tender un puente."},
    {n:"Ven. Damcho Rinchen",l:"Bolivia",f:"Damcho-Retoque-low.jpg",bio:"Monje boliviano. Estudia filosofía budista y lengua tibetana en el Sakya College de India. Ingeniero electrónico al servicio del Dharma.",q:"Que sea una isla para quienes la buscan, una lámpara para quienes la luz anhelan."},
    {n:"Ven. Gawe Dorje",l:"Pedreguer · 2024",f:"Dorje-Retoque-low.jpg",bio:"Monje residente en Pedreguer. Ordenado en 2024 por S.E. Luding Khen Rimpoché. Guía meditaciones y grupos de reflexión.",q:"El mejor regalo que podemos hacer al mundo es nuestro propio cambio interno."},
    {n:"Ven. Jamyang Chokiyd",l:"Argentina",f:"Jamyang-Chokiyd-retoque-low.jpg",bio:"Residente en San Juan, Argentina, y responsable del Centro Paramita local. Organiza encuentros de meditación y coordina grupos de estudio.",q:"Soy una bodhisattva in training."},
    {n:"Ven. Kunga Dolkar",l:"Puerto Rico",f:"Kunga-retoque-low.jpg",bio:"Colabora con el Centro Sakya guiando meditaciones y recibiendo a los visitantes. Viaja a Puerto Rico y EE. UU. para guiar retiros.",q:"Todos tenemos el potencial de ser plenamente felices."},
    {n:"Ven. Kunga Tseten",l:"Bodh Gaya · 2025",f:"Tseten-retoque-low.jpg",bio:"Recibió la ordenación en Bodh Gaya en diciembre de 2025. A sus 33 años, dedica su vida al servicio del Dharma en Paramita.",q:""},
    {n:"Ven. Kunga Yampa",l:"Pedreguer",f:"Yampa-retoque-low.jpg",bio:"Residente en el Centro Paramita de Pedreguer. Colabora en mantenimiento y onboarding, y apoya nuevos proyectos.",q:"Por más lindo que sea el sueño… es mejor despertar."},
    {n:"Ven. Lobsang Dolkar",l:"India · 2024",f:"Lobsang-Dolkar-Retoque-low.jpg",bio:"Psicóloga y fisioterapeuta, especializada en rehabilitación neurocognitiva. Ordenada en 2024, estudia en un convento en India.",q:"No hace falta ser astronautas para ver las cosas desde otra perspectiva."},
    {n:"Ven. Lobsang Dorje",l:"Ordenado · 2025",f:"Lobsang-retoque-low.jpg",bio:"Monje residente en el Centro Budista Sakya. Combina el servicio con el estudio de la lengua tibetana. Ordenado en 2025.",q:"Esta vida acabará algún día. ¿No es mejor dedicarla a los demás?"},
    {n:"Ven. Ngawang Gyatso",l:"Pedreguer · 2025",f:"Gyatso-retoque-low.jpg",bio:"Reside en Pedreguer. Ordenado en 2025, combina el estudio con el servicio tecnológico: ciberseguridad y soporte para tutorías y grupos.",q:"No se trata de brillar por fuera, sino de transformar desde adentro."},
    {n:"Ven. Ngawang Monlam",l:"Residente",f:"Monlam-Retoque-low.jpg",bio:"Monje residente en el Centro Budista Sakya, donde guía meditaciones y modera grupos de estudio. Participa en diversos proyectos.",q:""},
    {n:"Ven. Ngawang Pema",l:"Pedreguer · 2019",f:"Pema-Retoque-low.jpg",bio:"Monja residente en Pedreguer, ordenada en 2019 en Bodh Gaya. Bióloga y psicóloga, guía meditaciones y coordina grupos de reflexión.",q:"Mi vida es un camino de aprendizaje y entrega al Dharma."},
    {n:"Ven. Yeshe Dolkar",l:"Uruguay",f:"Yeshe-retoque-low.jpg",bio:"Monja residente en Uruguay y coordinadora de grupos de estudio. Su presencia en el Cono Sur fortalece la red de Paramita.",q:"Siempre que hablamos es bueno embellecer la conversación."}
  ];
  const DISPAR = [["#B79A6A","#8A6B3A"],["#8FA0B8","#5A6B85"],["#4E6E52","#2A3E2C"],["#3A5566","#1E323E"],["#2E3A2C","#171F16"],["#6B4A55","#3A2530"],["#C0724A","#7E4326"],["#4A4E6B","#272A44"],["#7C8A6A","#4E5A3E"],["#B85C5C","#7A3636"],["#3C6E70","#1F4446"],["#9A8CA8","#5F546E"],["#5A5148","#332E28"],["#6A88A0","#3E5566"],["#54463C","#2C231C"],["#3E5551","#1E2E2B"]];
  const PBASE = "/assets/img/comunidad monastica/";
  const fotoURL = i => encodeURI(PBASE + SANGHA[i].f);
  const BUST = '<svg viewBox="0 0 100 118" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><circle cx="50" cy="42" r="23"/><path d="M6 118 C6 84 26 72 50 72 C74 72 94 84 94 118 Z"/></svg>';

  /* ── Tira ──────────────────────────────────────────────────────────── */
  const pista = document.getElementById("sangha-tira");
  if (!pista) return;
  const fila = document.getElementById("sangha-tira-fila");
  const panel = document.getElementById("sangha-panel");
  const btnAnt = document.getElementById("sangha-ant");
  const btnSig = document.getElementById("sangha-sig");
  const btnMuro = document.getElementById("sangha-muro");
  const prog = document.getElementById("sangha-prog");
  const progFill = document.getElementById("sangha-prog-fill");
  const total = document.getElementById("sangha-total");
  if (total) total.textContent = SANGHA.length;

  let suppress = false;
  SANGHA.forEach((p, i) => {
    const [a, b] = DISPAR[i % DISPAR.length];
    const dot = document.createElement("button");
    dot.className = "sangha-dot";
    dot.dataset.i = i;
    dot.setAttribute("role", "option");
    dot.setAttribute("aria-current", "false");
    dot.innerHTML =
      '<span class="sangha-cara">' +
        '<span class="sangha-cara__base" style="background:linear-gradient(155deg,' + a + ',' + b + ')">' + BUST + '</span>' +
        '<img class="sangha-cara__foto" src="' + fotoURL(i) + '" alt="" loading="lazy" onerror="this.remove()">' +
        '<span class="sangha-cara__tm"></span><span class="sangha-cara__ts"></span><span class="sangha-cara__velo"></span>' +
      '</span>' +
      '<span class="sangha-dot__n">' + p.n + '</span>' +
      '<span class="sangha-dot__l">' + p.l + '</span>';
    dot.addEventListener("click", () => { if (suppress) return; abrir(i); });
    pista.appendChild(dot);
  });
  const dots = [...pista.querySelectorAll(".sangha-dot")];

  /* Arrastre */
  let down = false, sx = 0, sl = 0, moved = 0;
  pista.addEventListener("pointerdown", e => { down = true; moved = 0; sx = e.clientX; sl = pista.scrollLeft; pista.classList.add("is-drag"); });
  window.addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) { moved = Math.abs(dx); pista.scrollLeft = sl - dx; } });
  window.addEventListener("pointerup", () => { if (!down) return; down = false; pista.classList.remove("is-drag"); suppress = moved > 6; setTimeout(() => { suppress = false; }, 80); });

  /* Rueda → horizontal con inercia (cede a la página en los extremos) */
  let wTarget = null, wRaf = null;
  function wStep() {
    if (wTarget === null) { wRaf = null; pista.classList.remove("is-smooth"); return; }
    const cur = pista.scrollLeft, diff = wTarget - cur;
    if (Math.abs(diff) < 0.5) { pista.scrollLeft = wTarget; wTarget = null; wRaf = null; pista.classList.remove("is-smooth"); return; }
    pista.scrollLeft = cur + diff * 0.16;
    wRaf = requestAnimationFrame(wStep);
  }
  pista.addEventListener("wheel", e => {
    if (pista.classList.contains("is-muro")) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; /* trackpad horizontal: nativo */
    const max = pista.scrollWidth - pista.clientWidth;
    const base = wTarget === null ? pista.scrollLeft : wTarget;
    const bajando = e.deltaY > 0, atStart = base <= 0, atEnd = base >= max - 1;
    if ((bajando && atEnd) || (!bajando && atStart)) return; /* cede */
    e.preventDefault();
    if (reduce) { pista.scrollLeft = Math.max(0, Math.min(max, base + e.deltaY)); return; }
    wTarget = Math.max(0, Math.min(max, base + e.deltaY * 1.1));
    pista.classList.add("is-smooth");
    if (!wRaf) wRaf = requestAnimationFrame(wStep);
  }, { passive: false });

  /* Flechas + progreso */
  function paso(d) { pista.scrollBy({ left: d * 320, behavior: reduce ? "auto" : "smooth" }); }
  if (btnAnt) btnAnt.addEventListener("click", () => paso(-1));
  if (btnSig) btnSig.addEventListener("click", () => paso(1));
  function actualizarProg() {
    if (!prog || !progFill) return;
    const sw = pista.scrollWidth, cw = pista.clientWidth;
    if (sw <= cw + 2) { prog.classList.add("is-off"); return; }
    prog.classList.remove("is-off");
    const frac = cw / sw, pos = (sw - cw) ? pista.scrollLeft / (sw - cw) : 0;
    progFill.style.width = (frac * 100) + "%";
    progFill.style.marginLeft = (pos * (1 - frac) * 100) + "%";
  }
  function flechas() {
    const max = pista.scrollWidth - pista.clientWidth - 2;
    if (btnAnt) btnAnt.classList.toggle("is-off", pista.scrollLeft <= 2);
    if (btnSig) btnSig.classList.toggle("is-off", pista.scrollLeft >= max || max <= 0);
    actualizarProg();
  }
  pista.addEventListener("scroll", flechas, { passive: true });
  window.addEventListener("resize", flechas);

  /* Muro completo */
  if (btnMuro) btnMuro.addEventListener("click", () => {
    const on = pista.classList.toggle("is-muro");
    btnMuro.textContent = on ? "Ver como tira" : "Ver el muro completo";
    if (btnAnt) btnAnt.hidden = on;
    if (btnSig) btnSig.hidden = on;
    if (prog) prog.classList.toggle("is-off", on);
    if (!on) flechas();
  });

  /* Panel / reel */
  let cur = -1;
  function panelHTML(i) {
    const p = SANGHA[i], [a, b] = DISPAR[i % DISPAR.length], src = fotoURL(i);
    const frase = p.q
      ? '<p class="sangha-txtcol__frase">«' + p.q + '»</p>'
      : '<span style="font-family:\'JetBrains Mono\',monospace;font-size:.62rem;color:var(--texto-tenue)">— sin frase publicada —</span>';
    return '<div class="sangha-panel__in sangha-swap">' +
      '<div class="sangha-reelcol"><div class="sangha-reel">' +
        '<div class="sangha-reel__base" style="background:linear-gradient(160deg,' + a + ',' + b + ')">' + BUST + '</div>' +
        '<img class="sangha-reel__foto" src="' + src + '" alt="' + p.n + '" onerror="this.remove()">' +
        '<button class="sangha-reel__play" aria-label="Reproducir vídeo"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>' +
        '<span class="sangha-reel__hint">color pleno · al abrir</span>' +
        '<div class="sangha-reel__grad"></div>' +
        '<div class="sangha-reel__cap"><h3>' + p.n + '</h3><div class="rl">' + p.l + '</div></div>' +
      '</div></div>' +
      '<div class="sangha-txtcol">' +
        '<button class="sangha-cerrar" aria-label="Cerrar">✕</button>' +
        '<h3>' + p.n + '</h3><p class="sangha-txtcol__sub">' + p.l + '</p>' +
        '<p class="sangha-txtcol__bio">' + p.bio + '</p>' + frase +
        '<div class="sangha-panelnav"><button class="pv" aria-label="Anterior">‹</button>' +
        '<span class="pos">' + (i + 1) + ' / ' + SANGHA.length + '</span>' +
        '<button class="nx" aria-label="Siguiente">›</button></div>' +
      '</div></div>';
  }
  function cablear(i) {
    panel.querySelector(".sangha-cerrar").addEventListener("click", cerrar);
    const pv = panel.querySelector(".pv"), nx = panel.querySelector(".nx");
    pv.disabled = i === 0; nx.disabled = i === SANGHA.length - 1;
    pv.addEventListener("click", () => abrir(i - 1));
    nx.addEventListener("click", () => abrir(i + 1));
    panel.querySelector(".sangha-reel__play").addEventListener("click", e => {
      e.currentTarget.closest(".sangha-reel").innerHTML =
        '<div class="sangha-reel__player"><span>▶ Aquí se cargaría el reproductor de vídeo — solo al pulsar (fachada). Nada se reproduce solo.</span></div>';
    });
  }
  function activar(i) {
    dots.forEach((d, k) => d.setAttribute("aria-current", k === i));
    dots[i].scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }
  function abrir(i) {
    if (i < 0 || i >= SANGHA.length) return;
    const first = cur === -1; cur = i; activar(i);
    if (first || reduce) {
      panel.innerHTML = panelHTML(i); panel.classList.add("is-open"); cablear(i);
      if (!first) panel.querySelector(".nx").focus();
    } else {
      const old = panel.querySelector(".sangha-panel__in"); if (old) old.classList.add("is-out");
      setTimeout(() => {
        panel.innerHTML = panelHTML(i); cablear(i);
        const nu = panel.querySelector(".sangha-panel__in"); nu.classList.add("is-out");
        requestAnimationFrame(() => requestAnimationFrame(() => nu.classList.remove("is-out")));
      }, 200);
    }
  }
  function cerrar() {
    if (!panel.classList.contains("is-open")) return;
    panel.classList.remove("is-open"); const c = cur;
    setTimeout(() => { panel.innerHTML = ""; }, reduce ? 0 : 450);
    dots.forEach(d => d.setAttribute("aria-current", "false"));
    if (c >= 0) dots[c].focus(); cur = -1;
  }
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrar();
    if (cur >= 0) {
      if (e.key === "ArrowRight") { e.preventDefault(); abrir(Math.min(cur + 1, SANGHA.length - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); abrir(Math.max(cur - 1, 0)); }
    }
  });
  flechas();

  /* ── Ofrenda (dāna) ──────────────────────────────────────────────────── */
  const imps = [...document.querySelectorAll(".sangha-importe")];
  const libre = document.getElementById("sangha-libre");
  const impacto = document.getElementById("sangha-impacto");
  imps.forEach(btn => btn.addEventListener("click", () => {
    imps.forEach(x => x.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    if (btn.dataset.imp === "otra") {
      if (libre) { libre.classList.add("is-show"); libre.focus(); }
      if (impacto) impacto.innerHTML = "Escribe la cantidad que quieras ofrecer.";
    } else {
      if (libre) libre.classList.remove("is-show");
      if (impacto) impacto.innerHTML = "<b>" + btn.dataset.imp + " €</b> " + btn.dataset.txt + ".";
    }
  }));
  const donar = document.getElementById("sangha-donar-btn");
  if (donar) donar.addEventListener("click", () => {
    const form = document.getElementById("sangha-form"), acuse = document.getElementById("sangha-acuse");
    if (form) form.style.display = "none";
    if (acuse) { acuse.classList.add("is-show"); acuse.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }
  });
})();
