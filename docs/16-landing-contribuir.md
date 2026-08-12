# 16 · Landing de contribución (`/contribuir/`) — decisiones, estructura y estado

*Fase 7+ · agosto 2026. Documenta la refundación de la antigua `/amigos-de-la-fundacion/` (WordPress/Elementor) sobre el sistema de diseño moderno. El «porqué» de fondo vive en dos informes HTML: `informe-donativo-vs-membresia-2026.html` (marco) e `informe-donaciones-conversion-2026.html` (conversión/CRO). Este doc consolida qué se decidió y dónde está.*

---

## 1. Propósito y marco

La página recoge el apoyo económico a la fundación. La decisión de marco que condiciona todo lo demás: **no es un funnel de captación de socios, es una invitación a practicar dāna.** El nombre de la casa viene de las *pāramitās* y *dāna* —la generosidad— es la primera; la página tiene que sonar a eso, no a una tarifa con premios.

De ahí el rechazo, por ética y por evidencia, de las tácticas agresivas: cuenta atrás, culpa, casilla mensual premarcada, anclaje inflado, pop-up de salida, propina. El objetivo no es exprimir la conversión, sino que quien da quede **contento antes, durante y después**.

Segunda decisión de marco: **una sola landing, con dos puertas del mismo acto** —«dar una vez» y «sostener cada mes»—, no dos páginas separadas ni un menú de «planes de socio». Donativo y suscripción-con-contraprestación son marcos psicológicos distintos; al reencuadrar la recurrencia como *dāna sostenida* (y no como membresía con ventajas), dejan de ser dos cosas y caben en una misma casa.

---

## 2. Fundamento de datos

Las decisiones se apoyan en dos informes del proyecto, no en opinión:

- **Informe «El don y la pertenencia» (donativo vs. membresía):** el *crowding-out* —premiar un acto altruista puede reducirlo (Titmuss; Gneezy & Rustichini; Ariely-Bracha-Meier; Newman & Shen)—; el valor de la recurrencia (retención ~80–90 % en donantes mensuales frente a 43 % general; ~30 % de los ingresos online; modelo *sustainer*); el problema del escalafón de metales; y el coste fiscal de la contraprestación (Ley 49/2002).
- **Informe de donaciones · conversión 2026:** benchmarks de página de donación, carteras digitales (PayPal/GPay/ApplePay), y por qué la transparencia sustituye a los premios como incentivo legítimo.

---

## 3. Estructura de la página, bloque a bloque

Arco: **acoger → invitar a dar → mostrar a dónde va → dar confianza → abrir otras vías**. Scroll vertical.

1. **Navbar público** (partial real, con `aria-current` en Contribuir).
2. **Hero.** `.hero` real del sistema con fondo de foto (mujer y niño con loto) tratada como el vídeo del index (opacidad + velo cálido izquierda→derecha). Eyebrow + h1 con *em* dorado + lede de palo + dos CTAs (un primario «Hazte amigo/a» + un secundario «Donar una vez»).
3. **«Más amigos, más Dharma».** El porqué del apoyo.
4. **Cuotas mensuales.** Tres aportaciones (10 / 30 / 60 €) bajo una **identidad única** (ver §4).
5. **Donación única.** Chips de importe con estado de *luz*, línea de impacto y botón «Donar» con gesto procesando→acuse.
6. **¿A qué destinamos los fondos?** Seis destinos como **transparencia** (ver §4).
7. **Deducción fiscal.** La Ley 49/2002 como activo de confianza, no como gancho.
8. **Una tradición viva.** Cita de Khenpo + vídeo + tres testimonios reales (Amparo, Gabriel, César).
9. **Otras formas de acompañar.** Cuatro vías de acción (ver §4).
10. **Cierre.** Suscripción al boletín (secundario, no primario).
11. **Prefooter + Footer** (partials reales).

---

## 4. Decisiones de esta fase

**Identidad única en las cuotas, no escalafón de metales.**
*Decisión:* las tres cuotas son «Amigo/a de Paramita», idéntico para todas; la aportación cambia *lo que sostienes*, no *quién eres*. Cada tramo se nombra por lo que hace posible (cursos abiertos → becas → actividad del Centro). La del medio se destaca con luz + etiqueta «La más elegida».
*Descartado:* Bronce / Plata / Oro (codifican una jerarquía de estatus: quien da poco se lee «de bronce»); y también la vía «sin ningún nombre» (pierde el gesto cálido de nombrar la pertenencia).
*Implicación:* fuera los descuentos escalados (10/25/50 %), que reintroducían jerarquía y chocaban con el marco fiscal; en su lugar, líneas de impacto.

**Recurrencia sí, «suscripción» no.**
*Decisión:* se ofrece —y se destaca— el apoyo mensual, porque la recurrencia es lo más sostenible; pero enmarcado como generosidad renovada, no como cuota que compra ventajas.
*Descartado:* membresía con contraprestación tangible.
*Implicación:* protege la motivación intrínseca (crowding-out) y la deducibilidad fiscal (el donativo ha de ser liberalidad).

**Una landing con dos puertas.**
*Descartado:* (a) todo mezclado como «planes de socio» —arrastra el marco transaccional a toda la página—; (b) dos landings separadas —fragmenta a quien aún no ha decidido y duplica mantenimiento—.
*Implicación:* dentro de la página, los dos bloques (mensual / única) quedan claramente separados.

**Transparencia como bloque de información, acciones como tarjetas.**
*Decisión:* «¿A qué destinamos?» son bloques **sin tarjeta, guiados por pictograma** (información, sin acción); «Otras formas» son **tarjetas** (cada una con su enlace).
*Descartado:* ambas como tarjetas idénticas —se percibían como lo mismo—.
*Implicación:* jerarquía visual por intención (informar ≠ actuar).

**Crowdfunding en lugar de Transferencia/Bizum** en «Otras formas», con enlace a `crowdfunding.html` (pendiente de crear).

**Hero real, lede de palo.**
*Decisión:* se usa la estructura `.hero` del sistema (no un hero a medida), de donde heredan el lede (`var(--texto-lede)`), la fila de botones (`.actions`, gap 24px) y el ritmo. El lede va **siempre en Hanken de palo, normal** —nunca Fraunces cursiva; ésa se reserva a los *em* dorados de los títulos—.

**Pictogramas a talla *feature*.**
*Decisión:* los pictogramas que lideran un bloque usan tamaño *feature* (~44px destinos, ~34px tarjetas), no el `1.7rem` inline. Documentado en `informe-sistema-pictogramas-paramita.html` (§03 y §08). Se congela la revisión de la base hasta verlos en más landings.

---

## 5. Estado técnico e integración

La página está **integrada al sistema real**, no es maqueta suelta:

- Cabecera con **fuentes autoalojadas** (`css/tokens/paramita-fuentes.css`) y CSS por capas (tokens → base → componentes → página → responsive), con rutas relativas por profundidad (`../css/…`).
- Navbar, prefooter y footer con el **markup exacto de los partials**, para que `sync.py` los reconozca.
- Pictogramas vía `data-pico` (con SVG canónico inline como preview); ocho nuevos entregados para `partials/pictogramas/`.
- Revelado con `[data-reveal]`/`is-in` del sistema + red de seguridad inline.
- Vídeos con carga diferida (`youtube-nocookie`, accesible por teclado).

Archivos: `contribuir/contribuir.html` · `css/paginas/paramita-contribuir.css` · `js/paginas/paramita-contribuir.js` · 8 SVG en `partials/pictogramas/`.

---

## 6. Pendiente por concretar (datos y terceros)

- **Copy final** (Ale / Khenpo): todo el texto es provisional, incluida la etiqueta «La más elegida» (confirmar que es cierta o cambiarla por una fórmula sin afirmación).
- **Pasarela y endpoints** (Alberto): el botón «Donar» es un `setTimeout` de demo; el formulario de boletín y los CTAs «Hazte amigo/a» apuntan a `#`.
- **Cifras de impacto** por tramo de la donación única: de ejemplo. No inventar las reales.
- **Vídeo institucional:** su fachada tiene `data-yt` vacío; falta ID (o se retira). Los tres testimonios ya tienen su vídeo real.
- **Verificación fiscal:** que Paramita está acogida a la Ley 49/2002 y emite certificado; porcentajes vigentes; que ninguna puerta lleve contraprestación que rompa la deducibilidad. (No es asesoramiento fiscal.)
- **Imagen del hero:** confirmar que está en `/assets/img/` con el nombre exacto (lleva un espacio; si falla, `%20`).

---

## 7. Deuda técnica

- Crear `crowdfunding/crowdfunding.html` (destino de «Ver la campaña»).
- Colocar los 8 SVG en `partials/pictogramas/` y correr `sync.py --only-pictos`.
- Si se promueven las tallas: subir `.pico--lg` / `.pico--feature` a `paramita-pictogramas.css` como clases del sistema (ahora viven hardcodeadas, fuera de capa, en `paramita-contribuir.css`).
- Al migrar a 11ty: navbar/footer/pictogramas dejan de duplicarse; los `data-pico` pasan a `{% pico %}`.

---

## 8. Referencias en el código

- `contribuir/contribuir.html` — la página.
- `css/paginas/paramita-contribuir.css` — estilos propios (`@layer paginas` + bloque de tallas de picto fuera de capa).
- `js/paginas/paramita-contribuir.js` — selección de importe, gesto de donación (demo), fachadas de vídeo.
- `partials/navbar-publico.html`, `prefooter.html`, `footer.html` — partials reales.
- `informe-donativo-vs-membresia-2026.html` — marco (donativo vs. membresía, naming, fiscal).
- `informe-donaciones-conversion-2026.html` — conversión/CRO.
- `informe-sistema-pictogramas-paramita.html` — escala de tallas de pictograma (§03, §08).

---

*Añadir al `00-indice.md`, bajo «Arquitectura y trabajo activo»:*
`- **[16 · Landing de contribución](16-landing-contribuir.md)** — dāna sobre funnel; identidad única «Amigo/a de Paramita»; una landing con dos puertas; transparencia vs. acción; integración al sistema real.`
