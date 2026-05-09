import type { Block, Lesson } from "./types";

export const BLOCKS: Block[] = [
  { id: "01", title: "Cómo funciona el sonido", subtitle: "Lo que toda música tiene en común", emoji: "🌊" },
  { id: "02", title: "Empieza con Ableton", subtitle: "Tu DAW desde cero, sin miedo", emoji: "🎚" },
  { id: "03", title: "La batería del techno", subtitle: "El motor rítmico que mueve todo", emoji: "🥁" },
  { id: "04", title: "Síntesis sustractiva", subtitle: "Crear sonidos desde cero", emoji: "🎛" },
  { id: "05", title: "Sonidos del techno y melodic techno", subtitle: "Bajos, plucks, pads y leads de los grandes", emoji: "✨" },
  { id: "06", title: "Teoría musical útil", subtitle: "Solo lo que necesitas, nada más", emoji: "🎼" },
  { id: "07", title: "Mezcla básica", subtitle: "Que tu track suene profesional", emoji: "🎚️" },
  { id: "08", title: "Estructura del track", subtitle: "De loop a track de 7 minutos", emoji: "📐" },
  { id: "09", title: "Hacer tu primer track", subtitle: "Aplica todo en un proyecto real", emoji: "🚀" },
  { id: "10", title: "Más allá", subtitle: "Lo que viene después del primer track", emoji: "🌌" },
];

function l(
  id: string, blockId: string, order: number, title: string, summary: string,
  duration: string, kind: Lesson["kind"], rest: Partial<Lesson> = {},
): Lesson {
  return { id, blockId, order, title, summary, duration, kind, implemented: true, ...rest };
}

export const LESSONS: Lesson[] = [
  // ===== BLOQUE 1: Cómo funciona el sonido =====
  l("01-01", "01", 1, "¿Qué es el sonido?", "Frecuencia y amplitud — los dos controles de toda música.", "5 min", "practice", {
    concept: "El sonido son ondas que vibran en el aire. Tu oído percibe esas ondas y las interpreta como ‘música’.\n\nDos cosas controlan cómo lo oyes:\n\n**Frecuencia** (qué tan rápido vibra la onda) → si vibra rápido, suena agudo; si vibra lento, suena grave. Se mide en hertzios (Hz). Un kick de techno está alrededor de 50-60 Hz, un hat está arriba de 8000 Hz.\n\n**Amplitud** (qué tan fuerte vibra la onda) → más amplitud = más volumen.\n\nTodo lo que escuchas — el kick del techno, una voz de Anyma, un pluck de Mind Against, hasta el ruido del aire — son combinaciones de estas dos cosas.",
    practice: { componentId: "freq-slider", instruction: "Mueve la perilla y oye qué pasa. Bájala a 60 Hz (eso es un sub-kick). Súbela a 4000 Hz (el rango del lead). Súbela a 12000 Hz (un hat). Es siempre la misma onda — solo cambia qué tan rápido vibra." },
    check: { question: "Si subes la frecuencia, el sonido…", options: [{ label: "Suena más fuerte" }, { label: "Suena más agudo", correct: true }, { label: "Cambia de instrumento" }, { label: "No cambia" }], explanation: "Más frecuencia = onda vibra más rápido = más agudo. La amplitud es la que controla el volumen." },
  }),
  l("01-02", "01", 2, "Las notas y la octava", "12 notas en un círculo, y luego se repiten más arriba.", "5 min", "practice", {
    concept: "La música occidental tiene **12 notas** que se repiten infinitamente: C, C#, D, D#, E, F, F#, G, G#, A, A#, B. Después de B vuelves a C, pero una **octava** más arriba — la misma nota, sonando más aguda.\n\nUna octava es exactamente el **doble de frecuencia**. Si A4 vibra a 440 Hz, A5 vibra a 880 Hz.\n\nPiensa en el piano: cada conjunto de 7 teclas blancas + 5 negras es una octava. Casi todo el techno melódico se mueve en 2-3 octavas.",
    practice: { componentId: "octave-keys", instruction: "Toca C3, luego C4, luego C5. Es la misma nota, una octava más alta cada vez. Reconoces que es ‘la misma’ aunque suene más aguda." },
    check: { question: "Si una nota es A4 (440 Hz), su siguiente octava arriba es…", options: [{ label: "A5 (880 Hz)", correct: true }, { label: "B4" }, { label: "A4# (455 Hz)" }, { label: "C5" }], explanation: "Una octava arriba = misma nota, doble de frecuencia." },
  }),
  l("01-03", "01", 3, "Mayor vs menor — los dos humores", "Por qué el techno casi siempre suena ‘oscuro’.", "6 min", "practice", {
    concept: "Toda canción tiene un humor base, y la mayoría de la música usa uno de dos:\n\n**Mayor** = brillante, alegre, ‘feliz’.\n\n**Menor** = oscuro, emocional, introspectivo. **El techno y todas sus variantes (peak-time, melodic, progressive, hipnótico, hard) usan casi siempre menor** — por eso suenan profundos. Anyma, Tale of Us, Charlotte de Witte, Massano: todos en menor.\n\nNo necesitas teoría avanzada para reconocer la diferencia. Tu oído ya lo sabe.",
    practice: { componentId: "mode-ab", instruction: "Vas a oír dos progresiones: una en C mayor, otra en C menor. Mismas notas base, distinto humor. Pulsa cada una varias veces hasta sentir la diferencia." },
    check: { question: "El techno y sus variantes usan principalmente…", options: [{ label: "Mayor" }, { label: "Menor", correct: true }, { label: "Ambas por igual" }, { label: "Atonal" }], explanation: "Casi todo el techno está en menor. Variantes (dórico, frigio, menor armónica) son ‘sabores’ de menor." },
  }),
  l("01-04", "01", 4, "Ritmo, tempo y BPM", "El reloj que controla cada variante del techno.", "5 min", "practice", {
    concept: "**BPM = beats per minute** = cuántas pulsaciones tiene un track por minuto. Es el reloj de la canción.\n\nReferencias por estilo:\n- House / Deep House: 118-124 BPM\n- Melodic Techno (Anyma, Tale of Us): 120-126 BPM\n- Progressive Techno (Innellea, Massano): 122-128 BPM\n- Techno Peak-Time (Charlotte de Witte): 128-138 BPM\n- Hypnotic Techno: 130-140 BPM\n- Hard Techno: 140-160 BPM\n\nMás BPM ≠ ‘mejor’. Es energía distinta. Dentro del BPM, todo techno se organiza en **compases de 4/4** (4 pulsos = 1 compás). Casi siempre.",
    practice: { componentId: "tap-tempo", instruction: "Ponte audífonos. Pulsa la barra espaciadora a un ritmo constante — el que tu cuerpo pida. La app calcula tu BPM. Intenta llegar a ~124 (melodic techno) sin mirar." },
    check: { question: "Un track de hard techno típicamente está en…", options: [{ label: "100-110 BPM" }, { label: "120-126 BPM" }, { label: "140-160 BPM", correct: true }, { label: "180-200 BPM" }], explanation: "Hard techno (Sara Landry, I Hate Models) anda en 140-160 BPM. Cada variante tiene su rango." },
  }),

  // ===== BLOQUE 2: Empieza con Ableton =====
  l("02-01", "02", 5, "Conseguir Ableton Live", "Cómo descargar el DAW que vas a usar.", "5 min", "ableton", {
    concept: "Ableton Live es uno de los DAWs más usados en techno. Tale of Us, Mind Against, Massano, Innellea: muchos lo usan.\n\nVersiones: **Lite** (gratis con hardware), **Intro** ~€99, **Standard** ~€449, **Suite** ~€749.\n\nPara este curso: **trial gratuita de 90 días de Suite**. Te da todo durante 3 meses, suficiente para terminar.",
    abletonSteps: [
      { text: "Abre ableton.com/en/trial/ en tu navegador." },
      { text: "Crea una cuenta gratuita." },
      { text: "Descarga el instalador para Mac/Windows." },
      { text: "Instala (tarda unos minutos)." },
      { text: "Abre Ableton. Acepta los permisos de audio." },
    ],
    check: { question: "¿Qué versión vas a usar?", options: [{ label: "Trial 90 días de Suite", correct: true }, { label: "Solo Lite" }, { label: "Pirateada" }, { label: "Otra" }], explanation: "La trial te da Suite completo gratis 3 meses." },
  }),
  l("02-02", "02", 6, "La interfaz: Session vs Arrangement", "Las dos vistas que vas a usar todo el tiempo.", "8 min", "ableton", {
    concept: "Ableton tiene 2 vistas:\n\n**Session view** (rejilla): clips en columnas. Una columna = una pista. Una celda = un loop. Para improvisar, jamear, probar.\n\n**Arrangement view** (timeline): línea de tiempo horizontal. Aquí armas el track final con intro, build, drop, etc.\n\nFlujo típico: experimentas en Session, cuando algo funciona lo grabas/arrastras a Arrangement.\n\n**Atajo clave: TAB** alterna entre las dos.",
    abletonSteps: [
      { text: "Abre Ableton. Verás Session view por defecto." },
      { text: "Pulsa Tab. Cambias a Arrangement.", shortcut: "Tab" },
      { text: "Pulsa Tab otra vez. Vuelves.", shortcut: "Tab" },
      { text: "Familiarízate alternando." },
    ],
    check: { question: "¿Dónde armas el track final con secciones (intro, drop, etc)?", options: [{ label: "Session" }, { label: "Arrangement", correct: true }, { label: "Las dos" }, { label: "Da igual" }], explanation: "Session = ideas. Arrangement = track final." },
  }),
  l("02-03", "02", 7, "MIDI vs Audio — la diferencia clave", "Los dos tipos de pistas (y cuándo usar cada una).", "7 min", "theory", {
    concept: "**Pista MIDI** = guarda notas (qué nota, cuándo, qué tan fuerte). NO suena sola — necesita un instrumento (synth, drum rack). Ventaja: editas notas en cualquier momento.\n\n**Pista Audio** = guarda sonido grabado tal cual. Sample, voz, loop. No editas notas (es audio crudo) pero sí lo recortas, estiras, le pones efectos.\n\nRegla para techno: instrumentos virtuales (kick, bass, lead) → **MIDI**. Samples (vocales, FX, breaks) → **Audio**.",
    check: { question: "Quieres cambiar la melodía de tu lead 5 min después. ¿En qué tipo va?", options: [{ label: "Audio" }, { label: "MIDI", correct: true }, { label: "Da igual" }, { label: "Return" }], explanation: "MIDI guarda notas como datos editables." },
  }),
  l("02-04", "02", 8, "Tu primer kick en Ableton", "Crear pista MIDI con Drum Rack y poner un kick.", "10 min", "ableton", {
    concept: "Vamos a crear tu primera pista de batería.\n\nUn **Drum Rack** es un instrumento que contiene varios sonidos de batería organizados en una rejilla, uno por tecla MIDI.\n\nObjetivo: que sepas el camino — pista MIDI → cargar Drum Rack → poner kick → hacer que suene.",
    abletonSteps: [
      { text: "En Session view, crea pista MIDI: Cmd+Shift+T (Mac) / Ctrl+Shift+T (Windows).", shortcut: "Cmd+Shift+T" },
      { text: "En el Browser (lateral izquierdo): Drums → Drum Rack → arrastra ‘909 Core Kit.adg’ a la pista." },
      { text: "Pulsa la tecla A en tu teclado o el primer pad inferior izquierdo. Suena el kick." },
      { text: "Si no oyes nada: verifica el botón de audio Master abajo a la derecha." },
      { text: "Doble click en celda vacía → MIDI clip de 1 compás." },
      { text: "En el editor MIDI dibuja una nota en C1 (kick) en el primer beat. Play." },
    ],
    check: { question: "¿Cómo se llama el instrumento que contiene los drums?", options: [{ label: "Operator" }, { label: "Drum Rack", correct: true }, { label: "Sampler" }, { label: "Wavetable" }] },
  }),
  l("02-05", "02", 9, "Atajos esenciales y guardar", "Los 10 atajos que vas a usar todos los días.", "8 min", "ableton", {
    concept: "Los 10 atajos clave:\n\n- **Espacio** = Play/Pause\n- **Tab** = Session ↔ Arrangement\n- **Cmd+T** = nueva pista de audio\n- **Cmd+Shift+T** = nueva pista MIDI\n- **Cmd+S** = guardar (¡cada 5 minutos!)\n- **Cmd+Z** = deshacer\n- **Cmd+L** = activar loop\n- **Cmd+E** = cortar clip\n- **B** = Draw mode (dibujar notas/clips)\n- **Cmd+G** = agrupar pistas",
    abletonSteps: [
      { text: "Crea pista MIDI con Cmd+Shift+T.", shortcut: "Cmd+Shift+T" },
      { text: "Crea pista audio con Cmd+T.", shortcut: "Cmd+T" },
      { text: "Espacio para play/pause.", shortcut: "Space" },
      { text: "Cmd+S → guarda como ‘MusicTrainer Lección 2.5’.", shortcut: "Cmd+S" },
    ],
    check: { question: "¿Cuál es el atajo MÁS importante?", options: [{ label: "Espacio" }, { label: "Cmd+S (guardar)", correct: true }, { label: "Tab" }, { label: "Cmd+Z" }], explanation: "Pierde 4 horas por no guardar una vez y no se te olvida." },
  }),

  // ===== BLOQUE 3: La batería del techno =====
  l("03-01", "03", 10, "El kick — corazón del techno", "Por qué el kick es el sonido más importante.", "6 min", "theory", {
    concept: "En techno **el kick lo es todo**. Más que la melodía, más que la mezcla. Si tu kick está bien, el track funciona; si no, da igual lo demás.\n\nCaracterísticas según variante:\n- **Peak-time/Hard**: punchy, mucho ataque, clicky, poco sub (Charlotte de Witte, Sara Landry)\n- **Melodic/Progressive**: redondeado, balance entre punch y sub (Tale of Us, Innellea)\n- **Hipnótico**: subby, profundo, casi tribal (Massano, Reinier Zonneveld)\n- **House**: más corto, más ‘punchy’ (Honey Dijon, FISHER)\n\nEl kick siempre va en C1, F1 o G1 normalmente — bajo y poderoso.",
    check: { question: "¿Qué tipo de kick tiene MENOS sub y más click?", options: [{ label: "Melodic techno" }, { label: "Hard techno", correct: true }, { label: "House" }, { label: "Hypnotic" }], explanation: "Hard techno necesita kicks que corten en el club — mucho click, menos sub que un melodic kick." },
  }),
  l("03-02", "03", 11, "Four-on-the-floor", "El patrón rítmico que define el techno.", "8 min", "practice", {
    concept: "**Four-on-the-floor** = el kick toca en cada **negra** del compás. En 4/4, eso son 4 kicks por compás, en los pasos 1, 5, 9 y 13 de una rejilla de 16.\n\nEs el latido de TODO techno. Sin importar la variante (peak-time, melodic, hipnótico, hard, progressive) — el kick va four-on-the-floor 95% del tiempo.\n\nLa única excepción: cuando el track tiene un breakdown (kick fuera) o un fill rítmico (1-2 compases con variación).",
    practice: { componentId: "go-to-lab", instruction: "Ve al Groove Lab, selecciona el reto ‘Four on the floor’ y replícalo.", props: { href: "/groove" } },
    check: { question: "En un compás de 4/4 con four-on-the-floor, ¿cuántos kicks hay?", options: [{ label: "1" }, { label: "2" }, { label: "4", correct: true }, { label: "8" }] },
  }),
  l("03-03", "03", 12, "Backbeat: clap en 2 y 4", "Por qué el clap entra en los tiempos pares.", "6 min", "practice", {
    concept: "Mientras el kick va en cada negra (1, 2, 3, 4), el **clap o snare** entra solo en los tiempos **2 y 4** — los pasos 5 y 13 de una rejilla de 16. Esto es el **backbeat**.\n\nPor qué: crea contraste con el kick, da el típico ‘groove de baile’ que tu cuerpo reconoce. Está en techno, house, melodic, hard, casi todo.\n\nEn techno hipnótico a veces se quita el clap o se reemplaza por un sonido más sutil (hand drum, perc) para mantener la trance feeling.",
    practice: { componentId: "go-to-lab", instruction: "Ve al Groove Lab y haz el reto ‘Kick + clap (backbeat)’.", props: { href: "/groove" } },
    check: { question: "El clap clásico entra en los pasos…", options: [{ label: "1, 5, 9, 13" }, { label: "5 y 13 (tiempos 2 y 4)", correct: true }, { label: "3, 7, 11, 15" }, { label: "Cualquier paso" }], explanation: "Backbeat = solo en 2 y 4." },
  }),
  l("03-04", "03", 13, "Hats off-beat — la fórmula del empuje", "El truco de los hats entre los kicks.", "7 min", "practice", {
    concept: "Los **hats off-beat** entran en las **corcheas** que caen entre los kicks: pasos 3, 7, 11, 15 de la rejilla.\n\nResultado: kick-hat-kick-hat-kick-hat-kick-hat. Eso es lo que da el ‘empuje’ típico del techno (especialmente peak-time, hard, house). Tu cuerpo lo siente como ‘pa-cha-pa-cha’.\n\nEn melodic techno y progressive a veces se sustituyen por hats en 16ths (lección siguiente) para más fluidez.",
    practice: { componentId: "go-to-lab", instruction: "Ve al Groove Lab → reto ‘Off-beat hats’.", props: { href: "/groove" } },
    check: { question: "Hat off-beat entra en…", options: [{ label: "Mismos pasos que el kick" }, { label: "Pasos 3, 7, 11, 15 (entre kicks)", correct: true }, { label: "Solo en el paso 16" }, { label: "Cada semicorchea" }] },
  }),
  l("03-05", "03", 14, "Hats en 16ths + swing", "Hats en cada semicorchea con sensación humana.", "8 min", "practice", {
    concept: "**Hats en 16ths** = hats en cada paso de los 16 (cada semicorchea). Energía constante, fluida, hipnótica.\n\nProblema: si todos los hats son idénticos, suena rígido, robótico.\n\nSolución: **swing**. Es un retraso microscópico (5-15%) en las semicorcheas off (los pasos 2, 4, 6, 8…) que les da sensación humana. Casi todos los DAWs lo aplican como un parámetro global o por pista.\n\nMelodic techno y progressive usan mucho hats en 16ths con swing 8-15%. Hipnótico usa más swing (15-25%).",
    practice: { componentId: "go-to-lab", instruction: "Ve al Groove Lab → reto ‘Hats en 16ths’ y experimenta con el slider de swing.", props: { href: "/groove" } },
    check: { question: "¿Para qué sirve el swing?", options: [{ label: "Subir el volumen de los hats" }, { label: "Dar sensación humana retrasando las semicorcheas off", correct: true }, { label: "Cambiar el BPM" }, { label: "Quitar hats" }], explanation: "Sin swing, hats en 16ths suenan a máquina. Con swing, respiran." },
  }),
  l("03-06", "03", 15, "Open hat: el truco del &-de-4", "Cómo crear tensión justo antes del próximo kick.", "6 min", "practice", {
    concept: "El **open hat** (hat abierto) es un hat con decay largo. Se usa estratégicamente, no constantemente.\n\nTruco clásico: open hat en el **paso 15** (la corchea entre el 4 y el 1 del siguiente compás). Crea anticipación: la cola del open hat se prolonga hasta justo antes del kick siguiente, dando la sensación de ‘aquí viene’.\n\nEs uno de los detalles más reconocibles del techno bien hecho.",
    practice: { componentId: "go-to-lab", instruction: "Ve al Groove Lab → reto ‘Open hat en el &-de-4’.", props: { href: "/groove" } },
    check: { question: "El open hat clásico va en el paso…", options: [{ label: "1 (con el kick)" }, { label: "8 (a la mitad del compás)" }, { label: "15 (la corchea antes del próximo 1)", correct: true }, { label: "16" }] },
  }),
  l("03-07", "03", 16, "Percusión adicional y ghost notes", "Perc, rim, sutilezas que dan groove humano.", "7 min", "practice", {
    concept: "Una vez tienes kick + clap + hats, el groove crece sumando capas sutiles:\n\n- **Perc** (toms, woods, conga): puntos rítmicos dispersos que dan textura\n- **Rim shot**: click corto que llena espacios\n- **Ghost notes**: snares/claps a -20 dB que dan ‘humanidad’\n\nRegla: estas capas deben sentirse, no oírse. Si tu mamá las nota, están demasiado fuertes.\n\nEn melodic techno se usan mucho percusión étnica (Adriatique, Mathame). En hipnótico, golpes tribales repetidos (Reinier Zonneveld, Massano).",
    practice: { componentId: "go-to-lab", instruction: "Ve al Groove Lab → reto ‘Melodic techno groove’ que tiene 5+ voces.", props: { href: "/groove" } },
    check: { question: "Las ghost notes deben ir a…", options: [{ label: "0 dB (volumen completo)" }, { label: "-3 dB" }, { label: "-15 a -25 dB (apenas se oyen)", correct: true }, { label: "Silencio (mute)" }], explanation: "Si las notas que el oyente NO debe notar conscientemente las nota, mátalas con volumen." },
  }),
  l("03-08", "03", 17, "Replicar tu groove en Ableton", "Pasar el patrón del Groove Lab a Ableton.", "10 min", "ableton", {
    concept: "Ya hiciste un groove de techno en MusicTrainer. Ahora vamos a replicarlo en Ableton para tener tu primer pattern de drums real, listo para producir encima.",
    abletonSteps: [
      { text: "Crea nueva pista MIDI con Drum Rack ‘909 Core Kit’ (lección 2.4)." },
      { text: "Doble click en una celda Session → MIDI clip de 1 compás." },
      { text: "Set BPM a 124 (arriba a la izquierda)." },
      { text: "Dibuja kicks en C1 en los pasos 1, 5, 9, 13 (four-on-the-floor)." },
      { text: "Dibuja claps en D1 en pasos 5 y 13." },
      { text: "Dibuja closed hats en F#1 en pasos 3, 7, 11, 15 (off-beat)." },
      { text: "Click derecho en el clip → Loop (o Cmd+L). Play." },
      { text: "Si suena bien, guarda con Cmd+S." },
    ],
    check: { question: "¿En qué tecla MIDI suele estar el kick en un Drum Rack 909?", options: [{ label: "C3" }, { label: "C1", correct: true }, { label: "G5" }, { label: "Da igual" }], explanation: "Drum Racks de Ableton usan C1 para kick, D1 para snare/clap, F#1 para closed hat, A#1 para open hat — convención GM." },
  }),

  // ===== BLOQUE 4: Síntesis sustractiva =====
  l("04-01", "04", 18, "Las 4 ondas básicas", "Saw, square, triangle, sine — el ADN de todo synth.", "8 min", "practice", {
    concept: "Casi todo sonido sintetizado parte de **4 formas de onda**:\n\n- **Sine (sinusoide)**: pura, limpia, sin armónicos. Buena para sub-bass.\n- **Triangle (triángulo)**: suave, con pocos armónicos. Pads, leads suaves.\n- **Square (cuadrada)**: hueca, ‘chiptune’, retro. Bajos brillantes.\n- **Saw (sierra)**: brillante, agresiva, llena de armónicos. La estrella del techno: bajos, leads, plucks.\n\nMás del 80% de los sonidos del techno empiezan con saw o square. Los entiendes, entiendes el 80% del sound design.",
    practice: { componentId: "go-to-lab", instruction: "Ve al Sound Design Lab. En OSC 1 cambia entre Saw / Sqr / Tri / Sin tocando una nota. Oye las diferencias.", props: { href: "/synth" } },
    check: { question: "¿Qué onda es la más usada para bajos y leads de techno?", options: [{ label: "Sine" }, { label: "Triangle" }, { label: "Square" }, { label: "Saw", correct: true }], explanation: "Saw tiene todos los armónicos, lo que le da el carácter ‘brillante y agresivo’ típico del techno." },
  }),
  l("04-02", "04", 19, "La envolvente ADSR", "Cómo evoluciona el sonido en el tiempo.", "10 min", "practice", {
    concept: "Cuando tocas una tecla, el sonido **no es instantáneo ni constante**. Evoluciona en 4 fases:\n\n- **A — Attack**: cuánto tarda en llegar al volumen máximo (ms)\n- **D — Decay**: cuánto tarda en bajar del máximo al sustain\n- **S — Sustain**: el nivel que mantiene mientras sigues presionando\n- **R — Release**: cuánto tarda en apagarse cuando sueltas\n\nEjemplos:\n- **Pluck**: A=0ms, D=200ms, S=0%, R=200ms (corto, pega y se va)\n- **Pad**: A=2s, D=500ms, S=80%, R=2s (entra y sale lento)\n- **Bajo**: A=0ms, D=300ms, S=20%, R=100ms (punchy)",
    practice: { componentId: "go-to-lab", instruction: "Ve al Sound Design Lab. Toca una nota larga y mueve Attack, Decay, Sustain, Release. Siente cómo cada uno cambia el sonido.", props: { href: "/synth" } },
    check: { question: "Para hacer un pluck (sonido corto), el Sustain debe estar…", options: [{ label: "Al 100%" }, { label: "Al 0% o muy bajo", correct: true }, { label: "Al 50%" }, { label: "No importa" }], explanation: "Sustain bajo + Decay corto = el sonido pega y se va. Eso es un pluck." },
  }),
  l("04-03", "04", 20, "El filtro pasa-bajos (LPF)", "El control más importante del synth.", "8 min", "practice", {
    concept: "Un **filtro pasa-bajos (LPF)** deja pasar las frecuencias graves y corta las agudas. El control clave es **Cutoff** = a partir de qué frecuencia se cortan los agudos.\n\n- Cutoff alto (12 kHz): casi no corta nada, suena brillante\n- Cutoff bajo (200 Hz): corta casi todo, suena oscuro y muffled\n\n**Por qué es la perilla más importante**: te permite ‘abrir’ y ‘cerrar’ el sonido en automatización. Es el secreto detrás de los famosos *filter sweeps* de los builds.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → toca una nota larga → mueve la perilla Cutoff de 200 Hz a 12 kHz mientras suena.", props: { href: "/synth" } },
    check: { question: "Cutoff bajo en un LPF significa…", options: [{ label: "Sonido más brillante" }, { label: "Sonido más oscuro/muffled", correct: true }, { label: "Sonido más fuerte" }, { label: "Sonido más agudo" }], explanation: "LPF baja → corta agudos → queda solo lo grave → más oscuro." },
  }),
  l("04-04", "04", 21, "Resonancia", "El énfasis en la frecuencia de corte.", "7 min", "practice", {
    concept: "**Resonance (Resonancia / Q)** = subir el volumen de las frecuencias justo en el punto de cutoff. Crea un pico que ‘canta’.\n\n- Resonancia baja (Q=1): filtro suave, transparente\n- Resonancia media (Q=4): se siente un énfasis\n- Resonancia alta (Q=12+): casi suena como un silbido o un wah-wah — esto es el famoso *acid sound* (TB-303)\n\nUsada con automatización del cutoff, da el efecto de filter sweep clásico de techno.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga preset ‘Acid Lead’ y mueve la perilla Resonance. Oirás el ‘canto’.", props: { href: "/synth" } },
    check: { question: "Resonancia alta da…", options: [{ label: "Más graves" }, { label: "Énfasis en cutoff (sonido tipo silbido/wah)", correct: true }, { label: "Más volumen general" }, { label: "Distorsión" }] },
  }),
  l("04-05", "04", 22, "Envolvente del filtro", "Cómo el filtro cambia con el tiempo.", "9 min", "practice", {
    concept: "Hasta ahora el cutoff es estático. Pero la magia ocurre cuando el cutoff **se mueve solo en cada nota** — eso es la **filter envelope** (o filter ADSR).\n\nFunciona como la envelope del amplitude pero modulando el cutoff:\n- **Env Amount** controla cuánto abre/cierra el filtro la envelope\n- **Decay** del filter env corto + Sustain bajo + Env Amount alto = el clásico *bass acid* o *pluck plucky*\n\nEsto es lo que hace que un saw simple se convierta en un bajo techno con carácter.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Detuned Saw Bass’ → mira los valores de Filter envelope. Cambia Env Amount y Decay.", props: { href: "/synth" } },
    check: { question: "Filter envelope con Decay corto + Env Amount alto produce…", options: [{ label: "Pad lento" }, { label: "Bajo/pluck con punch", correct: true }, { label: "Lead largo" }, { label: "Sub" }] },
  }),
  l("04-06", "04", 23, "El sub-osc y el peso del bajo", "La capa que no oyes pero sí sientes.", "6 min", "practice", {
    concept: "El **sub-oscilador** es una sine wave una octava por debajo de tu nota principal. No tiene contenido melódico interesante — su rol es dar **peso físico** al bajo. La sientes en el pecho.\n\nEn techno bien mezclado, el sub vive en 30-80 Hz. Si lo subes mucho, el sistema satura. Si lo bajas, el track se siente ‘flaco’.\n\nLa relación kick + sub es el cimiento del techno. Más en lecciones de mezcla.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Detuned Saw Bass’ → mueve la perilla SUB de 0% a 80%. Oye cuánto cambia el peso.", props: { href: "/synth" } },
    check: { question: "El sub-osc está en…", options: [{ label: "30-80 Hz", correct: true }, { label: "200-500 Hz" }, { label: "1-3 kHz" }, { label: "8-15 kHz" }] },
  }),
  l("04-07", "04", 24, "Operator de Ableton — intro", "El synth de Ableton para sound design rápido.", "10 min", "ableton", {
    concept: "**Operator** es uno de los synths más usados de Ableton. Es híbrido: puede hacer sustractivo simple Y FM (más complejo). Para techno te basta con el modo sustractivo.\n\nVa por capas — A, B, C, D — donde puedes apilar osciladores. Tiene su propio filter, envelope, LFO. Toda la teoría que viste se aplica directamente.",
    abletonSteps: [
      { text: "Cmd+Shift+T → nueva pista MIDI." },
      { text: "Browser → Instruments → Operator → arrastra ‘Bass’ o ‘Lead’ preset que te guste." },
      { text: "Click derecho en MIDI clip → dibuja una nota larga (C3, 1 compás)." },
      { text: "En Operator: arriba ves los 4 osciladores. Click en cada uno y mira sus formas de onda." },
      { text: "Mueve el filter cutoff (en la sección Filter abajo)." },
      { text: "Mueve Attack/Decay/Sustain/Release de la envelope global." },
    ],
    check: { question: "¿Cuántos osciladores tiene Operator?", options: [{ label: "1" }, { label: "2" }, { label: "4 (A, B, C, D)", correct: true }, { label: "8" }] },
  }),
  l("04-08", "04", 25, "Wavetable de Ableton — intro", "El synth wavetable que viene con Suite.", "10 min", "ableton", {
    concept: "**Wavetable** es el synth wavetable de Ableton (solo en Suite). Una wavetable es una colección de wavenforms que puedes morphear en tiempo real. Sound design moderno = wavetables.\n\nMucho del techno actual (Massano, Innellea) usa wavetable para bajos y leads que cambian de carácter en el tiempo.",
    abletonSteps: [
      { text: "Cmd+Shift+T → pista MIDI." },
      { text: "Browser → Instruments → Wavetable → arrastra preset Bass." },
      { text: "Toca una nota larga." },
      { text: "Mueve Position en la wavetable (la perilla a la izquierda del display). Oye cómo morfea." },
      { text: "Activa Sub Osc abajo." },
      { text: "Experimenta con presets: Bass, Lead, Pad." },
    ],
    check: { question: "¿Qué hace especial a un wavetable synth?", options: [{ label: "Solo tiene 1 oscilador" }, { label: "Puedes morphear entre formas de onda en tiempo real", correct: true }, { label: "Es analógico" }, { label: "No tiene filtro" }] },
  }),
  l("04-09", "04", 26, "Crear un bajo desde cero", "Aplica todo en un bajo sólido de techno.", "12 min", "practice", {
    concept: "Receta de bajo de techno desde cero (en Ableton Operator o cualquier synth):\n\n1. **OSC A**: Saw, vol 0 dB\n2. **OSC B**: Saw, detune +7 cents (le da grosor), vol -3 dB\n3. **Sub**: Sine una octava abajo, vol -6 dB\n4. **Filter**: LPF, cutoff 600 Hz, resonance 3\n5. **Filter env**: Decay 200ms, Sustain 0%, Env Amount alto (60-80%) — el famoso *bass plucky*\n6. **Amp env**: Attack 0ms, Decay 300ms, Sustain 20%, Release 100ms\n7. **Drive**: 20-30%\n\nResultado: bajo con punch, carácter techno, listo para sentarse en el groove.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Detuned Saw Bass’ y compara con la receta. Toca con groove para oírlo.", props: { href: "/synth" } },
    check: { question: "El ‘bass plucky’ se logra principalmente con…", options: [{ label: "Reverb largo" }, { label: "Filter envelope corto + Env Amount alto", correct: true }, { label: "Attack alto" }, { label: "Mucho delay" }] },
  }),
  l("04-10", "04", 27, "Crear un pluck desde cero", "Pluck cristalino estilo melodic techno.", "12 min", "practice", {
    concept: "Receta de pluck para arpegios melodic techno:\n\n1. **OSC A**: Square, vol 0 dB\n2. **OSC B**: Triangle a una 5ª arriba (+700 cents), vol -6 dB\n3. **Filter**: LPF, cutoff 3000 Hz, resonance 1\n4. **Amp env**: Attack 0ms, Decay 250ms, Sustain 0%, Release 250ms\n5. **Delay**: 3/8 (dotted eighth), feedback 35%, mix 40%\n6. **Reverb**: hall, decay 4s, mix 50%\n\nEsta es la fórmula básica detrás de los plucks de Mind Against, Innellea, Massano.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Glassy Pluck’ → toca con groove activado.", props: { href: "/synth" } },
    check: { question: "Lo que hace que un pluck suene espacial y melódico es…", options: [{ label: "Sub" }, { label: "Resonancia alta" }, { label: "Delay sincronizado + reverb largo", correct: true }, { label: "Drive" }] },
  }),

  // ===== BLOQUE 5: Sonidos del techno y melodic techno =====
  l("05-01", "05", 28, "Bajo Massano-style", "Saws desafinadas + sub + envelope corto.", "10 min", "practice", {
    concept: "Massano (Antonio Bicchierri) usa bajos que son la firma del techno hipnótico moderno. Características:\n\n- Dos saws ligeramente desafinadas (~10 cents)\n- Sub potente al 60-70%\n- Filter cutoff bajo (500-700 Hz)\n- Filter envelope muy corta y agresiva (Decay <200ms)\n- Drive medio (25%)\n- Sin reverb, casi sin delay\n\nResultado: punchy, físico, hipnótico. Cada nota es un puñetazo.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Detuned Saw Bass’ → toca con groove activado en C minor.", props: { href: "/synth" } },
    check: { question: "El bajo Massano-style usa qué cantidad de reverb?", options: [{ label: "Mucho" }, { label: "Poco o nada", correct: true }, { label: "Solo en breakdown" }, { label: "Depende" }], explanation: "El techno hipnótico mantiene el bajo seco y físico. Reverb se reserva para los elementos atmosféricos." },
  }),
  l("05-02", "05", 29, "Pluck Mind Against-style", "Brillante, decay rápido, mucho delay.", "10 min", "practice", {
    concept: "Mind Against (Saverio y Alessandro Pasceri) hace plucks que son melodic techno puro:\n\n- Square + Triangle a una 5ª arriba\n- Decay 200-300ms\n- Sustain 0%\n- Delay 3/8 (clásico melodic techno)\n- Reverb hall mix 50-60%\n- Sin drive\n\nLo que hace especial: la 5ª arriba en el OSC 2. Le da ese ‘glassy’ característico.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Glassy Pluck’.", props: { href: "/synth" } },
    check: { question: "El intervalo entre OSC 1 y OSC 2 en este pluck es…", options: [{ label: "Octava (1200 cents)" }, { label: "5ª justa (700 cents)", correct: true }, { label: "Semitono" }, { label: "Mismo tono" }] },
  }),
  l("05-03", "05", 30, "Pad Bodzin-style", "Espacial, attack lento, LFO al filtro.", "10 min", "practice", {
    concept: "Stephan Bodzin: pads cinematográficos que son la firma del melodic techno emocional.\n\n- 2 saws ligeramente desafinadas\n- Attack 1.5-2s\n- Decay 500ms, Sustain 80%, Release 2s\n- LFO al filter cutoff a 0.4 Hz, depth 30%\n- Reverb hall 60%, decay 6s\n- Volume bajo (-14 dB) — el pad es atmósfera, no protagonista\n\nLa pieza clave: **LFO lento al filtro** = el pad ‘respira’ con el track.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Cinematic Pad’.", props: { href: "/synth" } },
    check: { question: "Qué le da al pad esa sensación de ‘respiración’?", options: [{ label: "Reverb" }, { label: "LFO lento modulando el filter cutoff", correct: true }, { label: "Distorsión" }, { label: "Sub-osc" }] },
  }),
  l("05-04", "05", 31, "Lead emocional Tale of Us-style", "El lead del breakdown que conmueve.", "12 min", "practice", {
    concept: "Tale of Us (ahora Anyma + Mrak) hicieron el playbook del lead emocional de breakdown:\n\n- Saw simple + sub\n- Attack 5-10ms (no 0 — un toque suave)\n- Sustain alto (60-70%)\n- Filter cutoff medio-alto (2-3 kHz)\n- Delay 3/8, mix 30%\n- Reverb 50%\n- Tocado lentamente, notas largas, escala menor\n\nEs el sonido del momento ‘pico emocional’ — funciona porque es simple y melódico.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → empieza desde Default, sube Attack a 10ms, Sustain 65%, Cutoff 2500 Hz, Delay mix 30%, Reverb 50%. Toca despacio en C minor.", props: { href: "/synth" } },
    check: { question: "El lead emocional típico tiene…", options: [{ label: "Attack 0ms (instantáneo)" }, { label: "Attack pequeño (5-10ms) para suavidad", correct: true }, { label: "Attack 1s (lento como pad)" }, { label: "Sin envelope" }] },
  }),
  l("05-05", "05", 32, "Stab corto y minor", "Un acorde corto que pega en el groove.", "8 min", "practice", {
    concept: "Un **stab** es un acorde corto y percusivo. En techno funciona como elemento rítmico-melódico simultáneo.\n\n- Square + Saw\n- Attack 0ms, Decay 180ms, Sustain 0%\n- Filter cutoff 1800 Hz\n- Delay 1/4, mix 30%\n- Reverb 35%\n\nTípicamente se toca en off-beats con acordes en menor (Cm, Dm, etc).",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Minor Stab’ → toca acordes (3-4 teclas a la vez) cortos.", props: { href: "/synth" } },
    check: { question: "Un stab típicamente dura…", options: [{ label: "1 segundo" }, { label: "150-300 ms (corto y punchy)", correct: true }, { label: "1 compás completo" }, { label: "Lo que pre­siones la tecla" }] },
  }),
  l("05-06", "05", 33, "Atmósferas y FX", "Reverbs largos, risers, impacts, texturas.", "10 min", "theory", {
    concept: "Tu track no se compone solo de elementos rítmicos y melódicos. Las **atmósferas** (atmos) y los **FX** llenan el espacio entre las notas y dan profundidad.\n\nTipos:\n- **Atmósfera/drone**: pad muy largo, casi inaudible, llenando el fondo\n- **Reverb tail / impact**: golpe con reverb largo en el primer beat de una nueva sección\n- **Riser** (sweep, white noise filtrado subiendo): construir tensión hacia el drop\n- **Downer**: lo opuesto, después del drop\n- **Vocal chops**: trozos cortos de voz humana procesada\n\nUsa atmos siempre, FX con criterio (no todo el tiempo).",
    check: { question: "Para qué sirve un riser?", options: [{ label: "Subir el volumen" }, { label: "Construir tensión hacia un drop o cambio de sección", correct: true }, { label: "Tocar una melodía" }, { label: "Mezclar el bajo" }] },
  }),

  // ===== BLOQUE 6: Teoría musical útil =====
  l("06-01", "06", 34, "La escala menor natural", "7 notas, infinitos riffs.", "8 min", "practice", {
    concept: "Una **escala** es una secuencia de notas que ‘suenan bien juntas’. El techno usa escalas menores casi siempre.\n\nLa **escala menor natural** desde C: **C, D, Eb, F, G, Ab, Bb**.\n\nPatrón en semitonos desde C (intervalos): **2-1-2-2-1-2-2** (T-S-T-T-S-T-T).\n\nEste patrón aplicado a cualquier nota raíz te da una escala menor. Si empiezas en A: A, B, C, D, E, F, G (la más común en piano porque solo usa teclas blancas).",
    practice: { componentId: "go-to-lab", instruction: "Ve al Entrenamiento de Oído → modo Escalas → identifica la menor natural varias veces hasta sentirla.", props: { href: "/ear" } },
    check: { question: "La escala menor natural en C es…", options: [{ label: "C D E F G A B" }, { label: "C D Eb F G Ab Bb", correct: true }, { label: "C Db Eb F Gb Ab Bb" }, { label: "C D Eb F# G Ab B" }], explanation: "Bemolizar 3, 6 y 7 desde C mayor te da C menor natural." },
  }),
  l("06-02", "06", 35, "Los 7 grados (números romanos)", "Cómo nombrar acordes sin perderte.", "8 min", "theory", {
    concept: "Cada nota de la escala es un **grado**. Se nombran con números romanos:\n\n- **I**: tónica (la nota raíz)\n- **ii**: 2º grado\n- **III**: 3º grado\n- **IV**: 4º grado\n- **V**: dominante\n- **VI**: 6º grado\n- **VII**: 7º grado\n\nEn menor: mayúscula = acorde mayor, minúscula = acorde menor. Por ejemplo en Cm:\n- **i** = Cm\n- **III** = Eb mayor\n- **iv** = Fm\n- **VI** = Ab mayor\n- **VII** = Bb mayor\n\n**Por qué esto importa**: te permite hablar de progresiones sin importar la tonalidad. ‘i-VI-III-VII’ funciona en cualquier menor.",
    check: { question: "En la tonalidad de A menor, el acorde ‘VI’ es…", options: [{ label: "Am" }, { label: "F mayor", correct: true }, { label: "C mayor" }, { label: "G mayor" }], explanation: "VI en A menor = el 6º grado de la escala A natural minor (A,B,C,D,E,F,G) = F. Mayúscula = mayor. F mayor." },
  }),
  l("06-03", "06", 36, "i-VI-III-VII — la épica del melodic techno", "La progresión más usada del melodic techno.", "10 min", "practice", {
    concept: "**i-VI-III-VII** en A menor: Am - F - C - G.\n\nEsta progresión se llama ‘axis of awesome’ — está literalmente en miles de canciones. En melodic techno es la más usada para los breakdowns y momentos épicos.\n\nPor qué funciona: alterna entre tristeza (i) y luz (VI, III) volviendo a la melancolía (VII).\n\nTracks famosos que la usan: Anyma & Argy ‘Higher Power’, Tale of Us ‘North Star’, Solomun ‘Nobody Is Not Loved’.",
    practice: { componentId: "progression-ab", instruction: "Escucha la progresión i-VI-III-VII en A menor. Pícale varias veces hasta memorizar el ‘viaje emocional’.", props: { progression: "i-VI-III-VII" } },
    check: { question: "Esta progresión también se conoce como…", options: [{ label: "Blues progression" }, { label: "Axis of Awesome", correct: true }, { label: "Bach progression" }, { label: "12-bar progression" }] },
  }),
  l("06-04", "06", 37, "Modo dórico", "Menor con un giro de luz.", "8 min", "practice", {
    concept: "El **modo dórico** es como menor natural pero con la **6ª subida** (Bbb → B en C dórico).\n\nC dórico: **C, D, Eb, F, G, A, Bb**.\n\nLe da un sabor ligeramente más brillante que menor natural — sigue siendo melancólico pero con un toque de esperanza. Usado en jazz, funk y mucho melodic techno (Mind Against, Adriatique).",
    practice: { componentId: "progression-ab", instruction: "Escucha la diferencia entre menor natural y dórico en la misma raíz.", props: { progression: "dorian" } },
    check: { question: "Qué nota distingue dórico de menor natural?", options: [{ label: "La 3ª" }, { label: "La 6ª (subida en dórico)", correct: true }, { label: "La 7ª" }, { label: "La tónica" }] },
  }),
  l("06-05", "06", 38, "Modo frigio", "El más oscuro — para techno hipnótico.", "8 min", "practice", {
    concept: "El **modo frigio** es como menor natural pero con la **2ª bajada** (D → Db en C frigio).\n\nC frigio: **C, Db, Eb, F, G, Ab, Bb**.\n\nEs el modo más oscuro y tenso. Da carácter ‘árabe’ o ‘mediterráneo oscuro’. Muy usado en techno hipnótico (Massano, Reinier Zonneveld) y en el flamenco.",
    practice: { componentId: "progression-ab", instruction: "Escucha frigio. Notarás esa tensión de la 2ª bajada.", props: { progression: "phrygian" } },
    check: { question: "Frigio se diferencia de menor natural por…", options: [{ label: "La 3ª subida" }, { label: "La 2ª bajada (semitono)", correct: true }, { label: "La 7ª subida" }, { label: "La 5ª disminuida" }] },
  }),
  l("06-06", "06", 39, "Triadas y voicings simples", "Cómo tocar acordes que no suenan amateur.", "10 min", "practice", {
    concept: "Una **triada** es un acorde de 3 notas: tónica + 3ª + 5ª.\n- Triada **mayor**: 1 + 3M + 5J → Ej: C-E-G\n- Triada **menor**: 1 + 3m + 5J → Ej: C-Eb-G\n\nProblema: tocar todas las triadas en posición cerrada (las 3 notas pegadas) suena amateur.\n\nSolución: **voicings** — separar las notas en distintas octavas. Ejemplo: C en bass + E-G en pluck arriba. Suena profesional inmediatamente.\n\nPara empezar: lleva la 5ª una octava arriba. Acorde Cm = C3 + Eb3 + G4 (en lugar de C3 + Eb3 + G3).",
    practice: { componentId: "go-to-lab", instruction: "Ve al Sound Design Lab y experimenta tocando triadas con voicings (3 teclas con separación de octavas).", props: { href: "/synth" } },
    check: { question: "Qué hace que una triada suene ‘profesional’?", options: [{ label: "Tocar las 3 notas pegadas" }, { label: "Distribuir las notas en distintas octavas (voicing)", correct: true }, { label: "Tocar muy fuerte" }, { label: "Usar reverb" }] },
  }),
  l("06-07", "06", 40, "Crear tu primer riff melódico", "Aplica todo en un riff de 8 notas.", "12 min", "practice", {
    concept: "Receta para tu primer riff de melodic techno:\n\n1. Elige tonalidad: C menor (las 7 notas: C D Eb F G Ab Bb)\n2. Elige progresión: i-VI-III-VII = Cm - Ab - Eb - Bb\n3. Para cada acorde, toca 2 notas de la escala que pertenezcan al acorde\n4. Ritmo: 8 notas (una por cada beat de los 2 compases)\n5. No pongas todas las notas iguales — varía altura. Usa saltos de 3ª y 4ª.\n\nEjemplo: Eb-G | Ab-C | G-Bb | F-D (8 notas en 2 compases).\n\nMisma idea en 4 compases distintos te da 32 notas → loop melódico básico de melodic techno.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga Hypnotic Arp y experimenta tocando manualmente.", props: { href: "/synth" } },
    check: { question: "El primer paso para crear un riff es…", options: [{ label: "Elegir el sonido" }, { label: "Elegir tonalidad y progresión", correct: true }, { label: "Subir el BPM" }, { label: "Improvisar" }] },
  }),

  // ===== BLOQUE 7: Mezcla básica =====
  l("07-01", "07", 41, "Niveles, headroom y gain staging", "Por qué tu master no debe pasar de -6 dB.", "8 min", "theory", {
    concept: "**Headroom** = espacio entre el nivel actual y el clipping (0 dB). Si llegas a 0 dB, distorsionas digitalmente — sonido feo y plano.\n\nReglas de oro:\n- Cada pista individual: pico alrededor de -12 dB\n- Bus (grupo de pistas): pico alrededor de -9 dB\n- Master: pico alrededor de **-6 dB** (deja espacio para el mastering)\n\n**Gain staging** = ajustar volúmenes a niveles consistentes desde el inicio, no esperar al final. Si haces gain staging bien, mezclar es la mitad de difícil.",
    check: { question: "Tu master debería picar máximo en…", options: [{ label: "0 dB" }, { label: "-3 dB" }, { label: "-6 dB", correct: true }, { label: "-30 dB" }], explanation: "-6 dB de headroom le deja espacio al mastering engineer (o a ti) para subir el volumen sin distorsionar." },
  }),
  l("07-02", "07", 42, "EQ — quitar antes de sumar", "El error #1 de todo principiante.", "10 min", "practice", {
    concept: "**EQ** (ecualización) = subir o bajar frecuencias específicas.\n\nLa regla más importante de mezcla: **quitar antes de sumar**. Si algo suena flaco, no subas su frecuencia favorita; mejor quita lo que la tapa.\n\nProcesos típicos en techno:\n- **High-pass filter** a 30 Hz en TODAS las pistas excepto kick y sub bass (limpia rumble)\n- **Low-pass** suave en hats si suenan duros (-3 dB en 16 kHz)\n- **Notch** en 200-400 Hz si el bajo está ‘boxy’\n- **Subir** ligeramente 8-12 kHz en hats/claps para ‘brillo’ — solo si lo necesitan\n\nEn Ableton: **EQ Eight** es tu amigo.",
    practice: { componentId: "go-to-lab", instruction: "Vuelve al Track Deconstructor, sube un track y mira el analizador de bandas. Identifica dónde está el bajo, los mids, los highs. Eso es lo que un EQ controla.", props: { href: "/deconstruct" } },
    check: { question: "Si tu bajo suena ‘boxy’ o sucio, primero…", options: [{ label: "Subes 100 Hz" }, { label: "Cortas 200-400 Hz para limpiar", correct: true }, { label: "Subes el master" }, { label: "Le pones reverb" }], explanation: "‘Quitar antes de sumar’ — los problemas suelen ser por exceso de cierta frecuencia, no por falta." },
  }),
  l("07-03", "07", 43, "Sidechain — el pump", "Cómo el bajo respira con el kick.", "10 min", "ableton", {
    concept: "**Sidechain compression** = un efecto que baja el volumen de una pista (ej. bajo) cuando otra (el kick) suena. Resultado: el bajo se ‘agacha’ cada vez que pega el kick. Eso da el famoso *pump* del techno.\n\nPor qué: sin sidechain, kick + bajo se pelean en las frecuencias bajas → ambos suenan flacos. Con sidechain, el kick respira solo en sus golpes.\n\nEs literalmente lo más reconocible del sonido del techno y house moderno.",
    abletonSteps: [
      { text: "En tu pista de bajo: arrastra ‘Compressor’ desde Audio Effects." },
      { text: "En el Compressor activa ‘Sidechain’ (botón a la izquierda)." },
      { text: "En ‘Audio From’ selecciona tu pista de Kick." },
      { text: "Threshold: -25 dB. Ratio: 4:1. Attack: 1ms. Release: 100ms." },
      { text: "Play. Verás el bajo bajando cada vez que pega el kick." },
      { text: "Ajusta Release: más largo = pump más exagerado. Más corto = sutil." },
    ],
    check: { question: "Sidechain del bajo con el kick sirve para…", options: [{ label: "Subir volumen" }, { label: "Que kick y bajo no se peleen + crear sensación de pump", correct: true }, { label: "Distorsionar" }, { label: "Cambiar el BPM" }] },
  }),
  l("07-04", "07", 44, "Compresión básica", "Domar dinámica sin matar el sonido.", "10 min", "practice", {
    concept: "Un **compresor** baja los picos de volumen. Hace que la pista suene más ‘pareja’.\n\nParámetros:\n- **Threshold**: a partir de qué dB empieza a comprimir\n- **Ratio**: cuánto comprime (4:1 típico, 10:1 agresivo)\n- **Attack**: cuán rápido reacciona (corto = pega rápido)\n- **Release**: cuánto tarda en soltar (corto = puede causar pump)\n- **Makeup**: vuelve a subir el volumen post-compresión\n\nEn techno: compresión sutil en kick, bass, drums. Compresión más fuerte en bus drums para ‘pegar todo junto’.",
    practice: { componentId: "go-to-lab", instruction: "En Ableton: pon Compressor en tu kick con Threshold -10dB, Ratio 3:1, Attack 5ms, Release 50ms. Compara con/sin.", props: { href: "/synth" } },
    check: { question: "Ratio 4:1 significa…", options: [{ label: "Por cada 4 dB que entra al threshold, sale 1 dB", correct: true }, { label: "Comprime 4 veces más fuerte que normal" }, { label: "El threshold es 4 dB" }, { label: "Multiplica el volumen por 4" }] },
  }),
  l("07-05", "07", 45, "Reverb — espacio sin barro", "Cuándo NO usar reverb (importante).", "8 min", "practice", {
    concept: "**Reverb** = simulación de espacio (cuarto, sala, hall). Le da profundidad al sonido.\n\nProblema: si pones reverb a TODO, todo se mezcla y nada se entiende. Resultado: ‘barro’.\n\nReglas:\n- **NO reverb** en kick (queda turbio)\n- **Sutil** en clap (sala pequeña, mix 10%)\n- **Más** en hats si quieres atmósfera\n- **Mucho** en lead/pluck/pad (es lo que les da emoción)\n- **Hall** para pads largos, **plate** para snares/claps, **room** para drums\n\nEn techno hipnótico: menos reverb. En melodic techno: más reverb (especialmente en breakdown).",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → mueve la perilla Reverb mix de 0% a 70% en un pluck. Aprende dónde es ‘mucho’.", props: { href: "/synth" } },
    check: { question: "El kick típicamente lleva…", options: [{ label: "Reverb hall largo" }, { label: "Plate reverb" }, { label: "Casi nada de reverb (queda turbio)", correct: true }, { label: "Reverb 100%" }] },
  }),
  l("07-06", "07", 46, "Delay — tiempo musical (1/4, 1/8, 3/16)", "Por qué los delays sincronizados al BPM suenan tan bien.", "8 min", "practice", {
    concept: "**Delay** = repetición del sonido con un tiempo de espera.\n\nLa magia: si el delay está **sincronizado al BPM** del track, las repeticiones caen exactamente en pasos del compás → suena musical.\n\nValores comunes:\n- **1/4** (negra): repetición lenta, espacial\n- **3/8** (corchea con puntillo): el clásico de melodic techno (Mind Against, Tale of Us)\n- **1/8** (corchea): rápido, eco\n- **3/16** (semicorchea con puntillo): muy rápido, ping-pong\n\nFeedback: cuántas veces se repite. 30-50% es buen rango.",
    practice: { componentId: "go-to-lab", instruction: "Sound Design Lab → carga ‘Glassy Pluck’ → mueve Delay time entre los valores. Oye qué cambia.", props: { href: "/synth" } },
    check: { question: "El delay clásico del melodic techno es…", options: [{ label: "1/2 (blanca)" }, { label: "1/4 (negra)" }, { label: "3/8 (corchea con puntillo)", correct: true }, { label: "1/16 (semicorchea)" }] },
  }),
  l("07-07", "07", 47, "Pan y campo estéreo", "Anchura sin perder el centro.", "7 min", "practice", {
    concept: "**Pan** = posición izquierda-derecha del sonido en el campo estéreo.\n\nReglas:\n- **Centro siempre**: kick, sub bass, lead principal, vocal principal\n- **Izquierda/derecha sutilmente** (-15 a +15): hats, percs, claps secundarios\n- **Bien abierto** (-50 a +50): atmósferas, ambientes\n- **Hard panned** (-100 / +100): efectos puntuales como sweeps\n\nUn truco: pannéa los hats off-beat ligeramente derecha (+10) y los hats en 16ths izquierda (-10). Los compares hacen el track sentirse ‘ancho’.",
    practice: { componentId: "go-to-lab", instruction: "En Ableton, en una pista de hats: mueve el knob Pan (la perilla pequeña arriba). Notarás el cambio de posición.", props: { href: "/synth" } },
    check: { question: "El kick siempre va en…", options: [{ label: "Izquierda dura" }, { label: "Derecha dura" }, { label: "Centro (0 pan)", correct: true }, { label: "Donde quieras" }], explanation: "Kick + sub + lead principal SIEMPRE en el centro. Da estabilidad al track." },
  }),
  l("07-08", "07", 48, "Mezclar tu loop en Ableton", "Aplica todo en tu loop de 8 compases.", "15 min", "ableton", {
    concept: "Vamos a aplicar todo lo del bloque 7 en tu loop real.",
    abletonSteps: [
      { text: "Abre tu proyecto. Asegúrate de tener kick, clap, hats, bass, un melódico." },
      { text: "Pista por pista, ajusta volumen para que NINGUNA pase de -6 dB en pico." },
      { text: "EQ Eight en cada pista (excepto kick y sub): high-pass filter en 30 Hz." },
      { text: "Compressor en bass con sidechain del kick (lección 7.3): threshold -25dB, ratio 4:1." },
      { text: "Pan: hats off-beat al +12, hats 16ths al -12. Centro: kick, bass, lead." },
      { text: "Reverb en una pista de Return: hall, decay 4s. Manda el lead 30%, el pluck 25%, el pad 50%." },
      { text: "Delay en otra Return: ping-pong, 3/8, feedback 35%. Manda el pluck 40%." },
      { text: "Master output debe picar en -6 dB. Si pasa, baja el master gain." },
      { text: "Cmd+S. Has hecho tu primera mezcla." },
    ],
    check: { question: "Si tu master pica a -2 dB, qué haces?", options: [{ label: "Lo dejas, no pasa nada" }, { label: "Bajas el master gain hasta picar en -6 dB", correct: true }, { label: "Subes todo" }, { label: "Le pones limiter al 0" }] },
  }),

  // ===== BLOQUE 8: Estructura del track =====
  l("08-01", "08", 49, "La forma del track techno", "Mapa general de un track de 6-8 minutos.", "8 min", "theory", {
    concept: "Un track de techno típico tiene 6-8 minutos y sigue esta estructura aproximada:\n\n1. **Intro** (16-32 bars): mezclable, solo drums + perc\n2. **Build groove** (16-32 bars): entran bass + un elemento\n3. **Build-up** (8-16 bars): riser, snare roll\n4. **Drop / Main** (32 bars): tutti\n5. **Breakdown** (32-48 bars): kick fuera, melodía protagonista\n6. **Drop 2** (32-48 bars): vuelve todo + variación\n7. **Outro** (16-32 bars): se quitan capas, kick + perc al final\n\nLa duración total y la proporción cambia según el estilo:\n- **Peak-time/Hard**: estructura más lineal, breakdowns cortos\n- **Melodic**: breakdown larguísimo (puede ser el momento más largo del track)\n- **Hipnótico**: cambios sutiles cada 16 bars, sin drops obvios",
    check: { question: "El breakdown de un track de melodic techno típicamente…", options: [{ label: "Dura 4 compases" }, { label: "Es la sección más larga del track (32-48 bars)", correct: true }, { label: "Va después del outro" }, { label: "No existe" }] },
  }),
  l("08-02", "08", 50, "Intro DJ-friendly (16-32 compases)", "Cómo arrancar para que tu track sea mezclable.", "8 min", "practice", {
    concept: "Si quieres que un DJ pueda mezclar tu track con otro, necesitas un **intro DJ-friendly**:\n\n- 16-32 compases\n- Solo drums (kick + perc + hats)\n- Sin elementos melódicos protagonistas\n- Volume llegando al final del intro a su nivel del drop\n\nEsto le da al DJ tiempo para hacer la transición desde el track anterior. Si tu track empieza con un drop épico desde el bar 1, ningún DJ lo puede mezclar bien.",
    practice: { componentId: "go-to-lab", instruction: "Ve al Arrangement Coach → mira la sección Intro de las plantillas.", props: { href: "/arrange" } },
    check: { question: "Un intro DJ-friendly NO debería incluir…", options: [{ label: "Kick" }, { label: "Hats" }, { label: "Lead/melodía protagonista", correct: true }, { label: "Perc" }], explanation: "El intro es ‘tools’ para el DJ. Sin protagonistas." },
  }),
  l("08-03", "08", 51, "El groove principal", "El loop que va a estar 80% del track.", "10 min", "practice", {
    concept: "Después del intro entra tu **main groove**: el loop que va a sostener la mayor parte del track. Típicamente 8 compases que se repiten.\n\nElementos:\n- Kick + clap + hats (lo del intro)\n- Bass loop (1-2 compases)\n- Un elemento atmosférico (pad lejano)\n- Tal vez una percusión adicional\n\nNo metas todo aún. El drop tiene que ser ‘más’ que esto.",
    practice: { componentId: "go-to-lab", instruction: "Arrangement Coach → click en la sección ‘Groove’ de las plantillas. Mira qué elementos se sugieren.", props: { href: "/arrange" } },
    check: { question: "El main groove típicamente dura…", options: [{ label: "1 compás" }, { label: "8 compases que se repiten", correct: true }, { label: "32 compases sin variación" }, { label: "Todo el track" }] },
  }),
  l("08-04", "08", 52, "Build-up", "Riser, snare roll, filter open — crear tensión.", "10 min", "practice", {
    concept: "Un **build-up** es un puente de tensión entre el groove y el drop. Típicamente 8-16 bars.\n\nElementos:\n- **Riser**: white noise filtrado subiendo de cutoff bajo a alto\n- **Snare roll**: snare/clap en 16ths que aceleran a 32ths al final\n- **Filter open**: cutoff del bass o lead subiendo gradualmente\n- **Pitch up**: una nota subiendo lentamente\n- **Stop a 1 bar antes**: silenciar todo justo antes del drop por más impacto\n\nNo metas TODOS — escoge 2-3.",
    practice: { componentId: "go-to-lab", instruction: "Arrangement Coach → mira sección ‘Build’ de las plantillas.", props: { href: "/arrange" } },
    check: { question: "Un riser sube de…", options: [{ label: "Volumen alto a bajo" }, { label: "Cutoff de filtro bajo a alto (white noise filtrado)", correct: true }, { label: "BPM lento a rápido" }, { label: "Reverb seco a húmedo" }] },
  }),
  l("08-05", "08", 53, "El drop", "Tutti — todas las capas a la vez.", "10 min", "practice", {
    concept: "El **drop** es el clímax energético. Aquí entran TODAS las capas + el lead protagonista.\n\nIngredientes típicos del drop de melodic techno:\n- Kick + sub + bass + clap (todo lo anterior)\n- Pluck/lead nuevo o variación del groove\n- Atmósfera fuerte (pad bien presente)\n- Sidechain marcado para ese pump\n- Hats en 16ths con swing\n\nDuración: 32 bars típico. Si lo haces de 16 sabe a poco; de 64 cansa.",
    practice: { componentId: "go-to-lab", instruction: "Arrangement Coach → revisa la sección ‘Drop’ de las plantillas.", props: { href: "/arrange" } },
    check: { question: "Un drop típico dura…", options: [{ label: "8 bars" }, { label: "32 bars", correct: true }, { label: "64 bars" }, { label: "Todo el track" }] },
  }),
  l("08-06", "08", 54, "Breakdown emocional", "El momento donde la gente se emociona.", "12 min", "practice", {
    concept: "El **breakdown** es el momento ‘emocional’: kick fuera, dejas que la melodía hable. En melodic techno es la sección más memorable.\n\nIngredientes:\n- **Kick fuera** (a veces el sub se queda)\n- **Lead protagonista**: melodía emocional, notas largas\n- **Pad creciendo**: subiendo en volumen poco a poco\n- **Atmosférico**: vocal chops, efectos espaciales\n- **Reverbs largos** (que en otros lados serían demasiado, aquí van bien)\n- **Termina con riser** o impacto de transición\n\nDuración: 32-48 bars en melodic techno. Más corto en peak-time/hard. Casi inexistente en hipnótico.",
    practice: { componentId: "go-to-lab", instruction: "Arrangement Coach → revisa la sección ‘Breakdown’ de la plantilla ‘Melodic Techno’.", props: { href: "/arrange" } },
    check: { question: "El elemento clave del breakdown es…", options: [{ label: "Más kick" }, { label: "Melodía protagonista sin kick", correct: true }, { label: "Más drums" }, { label: "Más hats" }] },
  }),
  l("08-07", "08", 55, "Outro DJ-friendly", "Cómo terminar bien.", "6 min", "practice", {
    concept: "Espejo del intro: 16-32 bars con elementos quitándose progresivamente.\n\n- Quitas el lead/pluck\n- Quitas el bass\n- Dejas kick + perc + hats\n- Al final: solo kick + perc para que el DJ mezcle al siguiente track\n\nNO hagas final ‘fade out’ ni un golpe seco. Eso no es DJ-friendly.",
    practice: { componentId: "go-to-lab", instruction: "Arrangement Coach → revisa Outro.", props: { href: "/arrange" } },
    check: { question: "El outro DJ-friendly termina típicamente con…", options: [{ label: "Fade out total" }, { label: "Solo kick + perc para mezclar al siguiente", correct: true }, { label: "Drop final" }, { label: "Vocal sample" }] },
  }),
  l("08-08", "08", 56, "Plantillas completas (3 estilos)", "Classic, melodic con breakdown, hipnótico.", "12 min", "theory", {
    concept: "**Plantilla 1 — Classic Techno (peak-time, ~6 min, 130 BPM)**: Intro 32 / Groove 32 / Build 16 / Drop 32 / Breakdown 32 / Drop 32 / Outro 16. Lineal, sin gran momento melódico.\n\n**Plantilla 2 — Melodic Breakdown-driven (~7-8 min, 124 BPM)**: Intro 16 / Groove 32 / Build 16 / Drop 32 / Breakdown 48 / Drop 48 / Outro 32. Énfasis en el breakdown larguísimo.\n\n**Plantilla 3 — Hypnotic (~8 min, 132 BPM)**: Intro 32 / Groove 32 / Groove con variación 32 / Build 16 / Drop 32 / Breakdown 32 / Drop con variación 48 / Outro 32. Cambios sutiles cada 16 bars, no hay un drop ‘grande’ — todo es flow.",
    check: { question: "La plantilla con el breakdown más largo es…", options: [{ label: "Classic Techno" }, { label: "Melodic Breakdown-driven", correct: true }, { label: "Hypnotic" }, { label: "Todas igual" }] },
  }),

  // ===== BLOQUE 9: Hacer tu primer track =====
  l("09-01", "09", 57, "Decidir BPM, tonalidad, vibe", "Las 3 decisiones que tomas antes de empezar.", "8 min", "theory", {
    concept: "Antes de tirar una sola nota, define 3 cosas:\n\n1. **BPM**: ¿qué subgénero? Melodic 122-126, Peak 128-132, Hipnótico 130-138.\n2. **Tonalidad**: empieza con A menor o C menor. Son las más fáciles para visualizar en piano.\n3. **Vibe / referencia**: pon 1-2 tracks que te encanten y que sean del estilo que quieres hacer. Tu objetivo no es copiarlos — es tener un norte.\n\nSin estas 3 decisiones empiezas a divagar. Con ellas, cada decisión posterior tiene contexto.",
    check: { question: "Antes de producir tu track debes definir…", options: [{ label: "Solo el BPM" }, { label: "BPM, tonalidad y referencia/vibe", correct: true }, { label: "El nombre del track" }, { label: "Nada, solo improvisar" }] },
  }),
  l("09-02", "09", 58, "Tu loop principal de 8 compases", "Kick + bass + percusión + un elemento melódico.", "20 min", "ableton", {
    concept: "Vamos a hacer tu primer loop sólido en Ableton. Objetivo: 8 compases que puedas escuchar 5 minutos sin aburrirte.",
    abletonSteps: [
      { text: "Set BPM (ej. 124). Tonalidad: A menor." },
      { text: "Pista 1 (Drum Rack 909): kick four-on-the-floor + clap en 2,4 + hats off-beat." },
      { text: "Pista 2 (Operator/Wavetable): bass siguiendo la nota raíz (A) en 16ths con notas cortas." },
      { text: "Pista 3 (Operator pluck): pluck siguiendo la progresión i-VI-III-VII = A-F-C-G, una nota por compás durante 2 compases." },
      { text: "Pista 4 (Pad): pad sosteniendo la misma progresión, mucho reverb." },
      { text: "Activa loop de 8 bars. Pulsa play. ¿Te aburres en 1 minuto? Algo está mal — vuelve a revisar." },
    ],
    check: { question: "El test del loop bueno es…", options: [{ label: "Que dure exactamente 8 bars" }, { label: "Que puedas escucharlo 5 min sin aburrirte", correct: true }, { label: "Que use 10+ pistas" }, { label: "Que tenga reverb en todo" }] },
  }),
  l("09-03", "09", 59, "Variaciones del loop (16, 32, 64 bars)", "Cómo evitar la monotonía sin perder el groove.", "15 min", "ableton", {
    concept: "Un loop de 8 bars repetido 4 veces = 32 bars idénticos. Aburre. Necesitas variaciones cada 8 o 16 bars.\n\nIdeas de variación (cada 8-16 bars añade UNA):\n- Quitar y volver a meter los hats\n- Añadir una percusión nueva\n- Modular el filter cutoff del bass\n- Añadir un fill rítmico en el último compás\n- Cambiar la nota del bass por un compás\n- Añadir un vocal chop o FX",
    abletonSteps: [
      { text: "Duplica tu clip de 8 bars 4 veces para hacer 32 bars." },
      { text: "En el bar 9-16, quita los hats." },
      { text: "En el bar 17-24, vuelve a meter los hats + suma un perc nuevo." },
      { text: "En el bar 25-32, añade un fill en el último compás (snare roll de 16ths)." },
      { text: "Loop. Reproduce. Si aún se siente repetitivo, añade más variaciones sutiles." },
    ],
    check: { question: "Variación cada cuántos bars típicamente?", options: [{ label: "Cada bar" }, { label: "Cada 8-16 bars", correct: true }, { label: "Solo al final" }, { label: "Nunca" }] },
  }),
  l("09-04", "09", 60, "Construir el drop de 32 bars", "Tu primer ‘momento’ del track.", "20 min", "ableton", {
    concept: "Si tu groove principal tiene kick + clap + hats + bass + pluck, el **drop** suma:\n- Lead nuevo o variación del pluck\n- Atmósfera más fuerte\n- Sidechain más marcado\n- Hats en 16ths con swing (si antes eran off-beat)\n- Maybe vocal chop puntual",
    abletonSteps: [
      { text: "Duplica el clip principal en una nueva sección a partir del bar 33." },
      { text: "Añade un lead nuevo (Operator preset Lead). Toca la melodía de la progresión i-VI-III-VII en notas largas." },
      { text: "Sube el bass +2dB y dale más resonancia con un EQ." },
      { text: "Cambia los hats off-beat a hats en 16ths con swing." },
      { text: "Reproduce desde el bar 1. Cuando llegue al bar 33 debe sentirse ‘más’." },
    ],
    check: { question: "El drop debe sentirse…", options: [{ label: "Igual que el groove" }, { label: "Más denso y energético que el groove", correct: true }, { label: "Más calmado" }, { label: "Solo con kick" }] },
  }),
  l("09-05", "09", 61, "Construir el breakdown", "Quitar el kick, dejar la melodía hablar.", "15 min", "ableton", {
    concept: "El breakdown es donde quitas casi todo y dejas la melodía respirar.",
    abletonSteps: [
      { text: "A partir del bar 65 (después de tu primer drop de 32 bars), borra los clips de kick, clap, hats." },
      { text: "Deja: bass (opcional), pad, lead emocional." },
      { text: "Lead: notas largas (1-2 bars cada una) siguiendo i-VI-III-VII." },
      { text: "Pad: súbelo +3dB respecto al groove." },
      { text: "Reverb: añade 30% más wet en lead y pad durante esta sección." },
      { text: "Últimos 8 bars: añade un riser que crezca hasta el siguiente drop." },
    ],
    check: { question: "Lo principal en un breakdown es…", options: [{ label: "Más kick que nunca" }, { label: "Quitar kick y dejar la melodía hablar", correct: true }, { label: "Subir todo" }, { label: "Pausar el track" }] },
  }),
  l("09-06", "09", 62, "Conectar las secciones", "Transiciones, fills, sweeps.", "15 min", "ableton", {
    concept: "Las **transiciones** entre secciones son lo que separa un track amateur de uno profesional. No saltes seco — conecta.\n\nElementos:\n- **Reverse cymbal**: 2 bars antes de un cambio, un platillo en reversa\n- **Filter sweep**: bajar cutoff progresivamente\n- **Snare roll**: 16ths → 32ths → silencio → drop\n- **Drum fill**: 1 bar de variación rítmica\n- **Stop**: silencio completo de 1 bar antes del drop",
    abletonSteps: [
      { text: "En el bar antes del primer drop (bar 32): añade un reverse cymbal en una pista de FX." },
      { text: "En los últimos 4 bars del groove: automatiza filter cutoff de 12 kHz a 1 kHz progresivamente." },
      { text: "En el último bar: snare roll en 16ths que acelera a 32ths al final." },
      { text: "Bar 32: silencio total de 1 beat antes del drop (impacto)." },
    ],
    check: { question: "El truco de ‘silencio total antes del drop’ sirve para…", options: [{ label: "Ahorrar espacio" }, { label: "Maximizar el impacto del drop por contraste", correct: true }, { label: "Que el DJ tenga tiempo" }, { label: "Es un error" }] },
  }),
  l("09-07", "09", 63, "Automation básica", "Filter sweeps, fade-ins, mover perillas en el tiempo.", "12 min", "ableton", {
    concept: "**Automation** = grabar movimientos de perillas para que cambien automáticamente en el tiempo.\n\nEjemplos clásicos:\n- Cutoff del bass abriéndose en el build (de 500 Hz a 5 kHz en 16 bars)\n- Reverb wet aumentando en el breakdown\n- Volume del lead haciendo fade-in de -∞ a 0 dB\n- Pan moviéndose lentamente de -50 a +50",
    abletonSteps: [
      { text: "En Arrangement view: selecciona tu pista de bass." },
      { text: "Haz click en la pequeña ‘A’ (Automation) o pulsa la letra A." },
      { text: "En el dropdown elige ‘Filter > Cutoff’." },
      { text: "Dibuja una línea que suba de bajo a alto durante el build (16 bars)." },
      { text: "Reproduce. El bass se abrirá automáticamente." },
    ],
    check: { question: "La automation sirve para…", options: [{ label: "Solo cambiar el volumen" }, { label: "Mover cualquier perilla automáticamente en el tiempo", correct: true }, { label: "Cambiar el BPM" }, { label: "Guardar presets" }] },
  }),
  l("09-08", "09", 64, "Mezcla final del track", "Repaso de todo lo del bloque 7 sobre tu propio track.", "20 min", "ableton", {
    concept: "Repite el flujo de la lección 7.8 en TU TRACK COMPLETO.",
    abletonSteps: [
      { text: "Reproduce todo el track de principio a fin con audífonos." },
      { text: "Ajusta volúmenes para que ninguna pista pase de -6 dB." },
      { text: "Añade EQ Eight a todas las pistas con high-pass en 30 Hz (excepto kick y sub)." },
      { text: "Sidechain del bass al kick (Compressor con sidechain)." },
      { text: "Pannéa hats e instrumentos secundarios." },
      { text: "Reverb en Return A: hall, decay 4s. Manda lead 30%, pluck 25%, pad 50%." },
      { text: "Delay en Return B: ping-pong 3/8, feedback 35%. Manda pluck 40%." },
      { text: "Master debe picar -6 dB." },
      { text: "Cmd+S." },
    ],
    check: { question: "El orden de mezcla es…", options: [{ label: "Reverb → EQ → volumen" }, { label: "Volumen → EQ → compresión → reverb/delay", correct: true }, { label: "No hay orden" }, { label: "Solo reverb importa" }] },
  }),
  l("09-09", "09", 65, "Polish — los detalles que importan", "Saturación, ambient, vocal chops sutiles.", "15 min", "ableton", {
    concept: "El **polish** son los pequeños detalles que separan un track decente de uno profesional. NO son obligatorios pero sí marcan diferencia.\n\nIdeas:\n- **Saturación sutil** en el master (Saturator de Ableton, drive 1-2)\n- **Vocal chops** en el breakdown (samples cortos de voz)\n- **Atmósfera de fondo**: noise filtrado a -25 dB todo el track\n- **Glue compressor** en el bus de drums (ratio 2:1, attack 30ms)\n- **Stereo widener** sutil en hats y atmos",
    abletonSteps: [
      { text: "En el master: añade Saturator > preset ‘Soft Sat’. Drive 1.5 dB." },
      { text: "Crea pista de noise: Operator con noise activado, volumen -25 dB, todo el track." },
      { text: "Si tienes vocal samples: pon uno chopeado en el breakdown a -10 dB con reverb 50%." },
    ],
    check: { question: "Para qué sirve la saturación sutil en el master?", options: [{ label: "Distorsionar todo" }, { label: "Dar calor y pegamento al sonido sin que se note", correct: true }, { label: "Subir el volumen a 0 dB" }, { label: "Cambiar el BPM" }] },
  }),
  l("09-10", "09", 66, "Exportar tu primer track", "Bounce a WAV, listo para SoundCloud.", "10 min", "ableton", {
    concept: "Hora de exportar tu primer track. NO usa MP3 todavía — exportas en alta calidad y luego conviertes si necesitas.",
    abletonSteps: [
      { text: "Define los marcadores In/Out en Arrangement: desde el bar 1 hasta el bar final + 4 bars (para que el reverb tail termine)." },
      { text: "File → Export Audio/Video (Cmd+Shift+R)." },
      { text: "Render Start: 1.1.1. Render Length: 7:00 (o lo que sea tu track)." },
      { text: "File Type: WAV. Sample Rate: 44100. Bit Depth: 24. Dither Options: Triangular." },
      { text: "Normalize: NO. (Lo harás luego en mastering si quieres.)" },
      { text: "Click Export. Guarda en una carpeta con el nombre del track." },
      { text: "Reproduce el WAV exportado de principio a fin para verificar que no haya errores." },
    ],
    check: { question: "Formato recomendado para exportar tu track maestro?", options: [{ label: "MP3 192 kbps" }, { label: "WAV 44.1 kHz 24-bit", correct: true }, { label: "AAC" }, { label: "FLAC 16-bit" }] },
  }),

  // ===== BLOQUE 10: Más allá =====
  l("10-01", "10", 67, "Polirritmos en techno hipnótico", "Cuando los hats no caen donde los esperas.", "12 min", "practice", {
    concept: "Un **polirritmo** es cuando dos patrones rítmicos de duración distinta corren al mismo tiempo, creando tensión.\n\nEjemplo en techno hipnótico (Massano, Reinier Zonneveld): el kick va four-on-the-floor (4 pulsos por compás) pero un perc va en grupos de 3, así que cada compás cae en un sitio distinto del kick. Resultado: trance, hipnosis.\n\nReceta simple:\n- Kick four-on-the-floor (cada negra)\n- Perc cada 3 corcheas (en lugar de cada 2 que sería off-beat normal)\n- Loop de 4 bars: el perc completa el ciclo cada 3 bars",
    practice: { componentId: "go-to-lab", instruction: "Groove Lab → toca con steps no-divisibles entre sí (ej. perc en 3, 7, 11, 15 contra kick en 1, 5, 9, 13).", props: { href: "/groove" } },
    check: { question: "Polirritmo es…", options: [{ label: "Tocar muy rápido" }, { label: "Dos patrones rítmicos de duración distinta corriendo al tiempo", correct: true }, { label: "Cambio de BPM" }, { label: "Tocar fuera de tiempo" }] },
  }),
  l("10-02", "10", 68, "Resampling — usar tu propio audio", "Convertir tu loop en sample y deformarlo.", "12 min", "ableton", {
    concept: "**Resampling** = grabar tu propio audio dentro del proyecto para usarlo como sample. Lo hace todo el techno avanzado.\n\nUsos:\n- Bouncear tu loop a audio para procesarlo masivamente (granular, time-stretch)\n- Crear texturas a partir de tus propios sonidos\n- Hacer un ‘chop’ percusivo de un lead largo",
    abletonSteps: [
      { text: "Crea pista de audio nueva (Cmd+T)." },
      { text: "En ‘Audio From’ pon ‘Master’. En ‘Monitor’ pon ‘Off’. Activa Record (botón rojo de la pista)." },
      { text: "Pulsa Record (botón rojo arriba). El track se reproduce y graba al mismo tiempo." },
      { text: "Detén. Tienes un clip de audio con tu mezcla." },
      { text: "Arrastra el audio a Sampler o Simpler para usarlo como instrumento procesable." },
    ],
    check: { question: "Resampling sirve para…", options: [{ label: "Cambiar el BPM" }, { label: "Convertir tu propio audio en sample procesable", correct: true }, { label: "Mejorar la calidad" }, { label: "Comprimir" }] },
  }),
  l("10-03", "10", 69, "Cómo terminar tracks (anti-procrastinación)", "El problema #1 del 90% de productores.", "10 min", "theory", {
    concept: "El 90% de productores nuevos no terminan tracks. Lo empiezan, hacen un loop genial, lo escuchan 100 veces, lo abandonan, empiezan otro.\n\n**Reglas para terminar**:\n\n1. **Deadlines duros**: ‘Termino este track el viernes’. Sin deadline, no hay urgencia.\n2. **Bouncear temprano**: cuando tu loop suena bien al 80%, exporta y muévelo a producción del track. No esperes el 100% (nunca llega).\n3. **Reglas de ‘bueno suficiente’**: si gastaste 4 horas en un sonido y sigue sin sonarte ‘perfecto’, suena perfecto. Sigue.\n4. **No reescuches obsesivamente**: pasa al siguiente paso aunque dudes.\n5. **Termina basura intencional**: tu primer track será malo. El 5º será meh. El 20º será bueno. Termina los primeros 19 sin obsesionar.\n\nEsta lección es la más importante del curso. Sin terminar, no aprendes.",
    check: { question: "El problema más común del productor nuevo es…", options: [{ label: "No saber teoría" }, { label: "No terminar tracks", correct: true }, { label: "No tener Ableton" }, { label: "No tener controlador MIDI" }] },
  }),
  l("10-04", "10", 70, "Subir a SoundCloud y mostrar tu track", "Mastering rápido + upload + descripción.", "10 min", "ableton", {
    concept: "Antes de subir a SoundCloud, **mastering rápido**. No es ‘mastering profesional’, pero sí pulir el master final.\n\nMaster en Ableton (en el master bus):\n- **Glue Compressor**: ratio 2:1, threshold suave (-2dB de reducción), makeup +1dB\n- **EQ Eight**: corte sutil en 200 Hz si es muddy, brillo sutil en 12 kHz si necesita\n- **Limiter**: threshold -1.5 dB, ceiling -0.3 dB\n\nExporta y sube:",
    abletonSteps: [
      { text: "Aplica el master chain de arriba en el master." },
      { text: "Reproduce el track entero. Master debería picar en -0.3 dB con limiter." },
      { text: "Exporta a WAV 44.1 / 24-bit / sin normalize." },
      { text: "Sube a SoundCloud. Privado primero — comparte solo con amigos confiables." },
      { text: "Pide feedback honesto a 3 personas que sepan." },
      { text: "Itera." },
    ],
    check: { question: "Antes de mostrar tu track públicamente debes…", options: [{ label: "Tirarlo a SoundCloud público" }, { label: "Hacer un master rápido + pedir feedback privado a 3 personas", correct: true }, { label: "Esperar 6 meses" }, { label: "Solo subirlo si es perfecto" }] },
  }),
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
export function getBlock(id: string): Block | undefined {
  return BLOCKS.find((b) => b.id === id);
}
export function getLessonsForBlock(blockId: string): Lesson[] {
  return LESSONS.filter((l) => l.blockId === blockId).sort((a, b) => a.order - b.order);
}
export function getNextLesson(id: string): Lesson | undefined {
  const lesson = getLesson(id);
  if (!lesson) return undefined;
  return LESSONS.find((l) => l.order === lesson.order + 1);
}
export function getPrevLesson(id: string): Lesson | undefined {
  const lesson = getLesson(id);
  if (!lesson) return undefined;
  return LESSONS.find((l) => l.order === lesson.order - 1);
}
