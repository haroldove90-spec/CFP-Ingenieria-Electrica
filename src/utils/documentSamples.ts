/**
 * Sample SVG Data URLs for:
 * 1. Diagrama Unifilar General (Subestación y Centro de Carga)
 * 2. Cédula Profesional del Perito (SEP - DGP)
 * 3. Certificado de Perito Dictaminador de Instalaciones Eléctricas en Media y Baja Tensión (CFP)
 */

export const SAMPLE_DIAGRAM_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" width="1400" height="900" style="background:#ffffff; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background Grid -->
  <rect width="1400" height="900" fill="#ffffff" />
  <rect width="1400" height="900" fill="url(#grid)" />

  <!-- Outer Technical Blueprint Border -->
  <rect x="25" y="25" width="1350" height="850" fill="none" stroke="#1e293b" stroke-width="3" />
  <rect x="33" y="33" width="1334" height="834" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,4" />

  <!-- Title & Header Bar -->
  <rect x="35" y="35" width="1330" height="70" fill="#0f172a" />
  <text x="60" y="65" fill="#f8fafc" font-size="20" font-weight="800" letter-spacing="1">COLEGIO FEDERAL DE PERITOS • INGENIERÍA ELÉCTRICA</text>
  <text x="60" y="88" fill="#93c5fd" font-size="13" font-weight="600">PLANO: DIAGRAMA UNIFILAR GENERAL DE SUBESTACIÓN Y DISTRIBUCIÓN • NOM-001-SEDE-2012</text>
  <text x="1100" y="65" fill="#e2e8f0" font-size="14" font-weight="700">EXP: CFP0125/PCIEMBT/IOA/0071</text>
  <text x="1100" y="88" fill="#cbd5e1" font-size="12">FOLIO: 359/2026 • REVISIÓN: 01</text>

  <!-- Left: Acometida MT CFE -->
  <g transform="translate(80, 160)">
    <!-- Acometida Label -->
    <rect x="0" y="0" width="220" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
    <text x="110" y="26" text-anchor="middle" fill="#1e3a8a" font-size="12" font-weight="800">ACOMETIDA CFE 13.2 kV</text>
    <text x="110" y="45" text-anchor="middle" fill="#1e40af" font-size="11">3 Fases - 3 Hilos • 60 Hz</text>

    <!-- Line down -->
    <line x1="110" y1="60" x2="110" y2="110" stroke="#0f172a" stroke-width="3" />
    <text x="120" y="90" fill="#64748b" font-size="10" font-weight="600">3-1/0 ACSR</text>

    <!-- Cortacircuito Fusible CCF -->
    <line x1="100" y1="110" x2="120" y2="110" stroke="#0f172a" stroke-width="3" />
    <circle cx="110" cy="125" r="15" fill="none" stroke="#ef4444" stroke-width="2.5" />
    <text x="110" y="130" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="800">CCF</text>
    <text x="135" y="128" fill="#475569" font-size="10">15 kV, 100 A, Fusible 5A</text>
    <line x1="110" y1="140" x2="110" y2="180" stroke="#0f172a" stroke-width="3" />

    <!-- Apartarrayos -->
    <rect x="95" y="180" width="30" height="20" fill="#fee2e2" stroke="#dc2626" stroke-width="2" />
    <text x="110" y="194" text-anchor="middle" fill="#991b1b" font-size="9" font-weight="700">AP</text>
    <text x="135" y="194" fill="#475569" font-size="10">10 kV, 10 kA Óxido Metálico</text>
    <line x1="110" y1="200" x2="110" y2="240" stroke="#0f172a" stroke-width="3" />

    <!-- Transformador Pedestal -->
    <rect x="20" y="240" width="180" height="110" rx="8" fill="#f8fafc" stroke="#0284c7" stroke-width="3" />
    <circle cx="110" cy="280" r="22" fill="none" stroke="#0284c7" stroke-width="2" />
    <circle cx="110" cy="305" r="22" fill="none" stroke="#0284c7" stroke-width="2" />
    <text x="110" y="275" text-anchor="middle" fill="#0369a1" font-size="10" font-weight="700">Δ PRIM 13,200 V</text>
    <text x="110" y="322" text-anchor="middle" fill="#0369a1" font-size="10" font-weight="700">Y SEC 220/127 V</text>
    <text x="110" y="342" text-anchor="middle" fill="#0f172a" font-size="12" font-weight="800">TRANSFORMADOR 75 kVA</text>
    <text x="110" y="365" text-anchor="middle" fill="#64748b" font-size="9">Tipo Pedestal • ONAN • Z%=2.45%</text>

    <!-- Line down to Secundary -->
    <line x1="110" y1="350" x2="110" y2="430" stroke="#0f172a" stroke-width="4" />
    <text x="120" y="395" fill="#475569" font-size="10" font-weight="700">3F-4H + TIERRA</text>
    <text x="120" y="410" fill="#64748b" font-size="9">3-3/0 + 1-1/0N + 1-2G Cu THW-LS</text>

    <!-- Interruptor Principal 3x200A -->
    <rect x="50" y="430" width="120" height="50" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
    <text x="110" y="452" text-anchor="middle" fill="#92400e" font-size="12" font-weight="800">INT. PRINCIPAL</text>
    <text x="110" y="470" text-anchor="middle" fill="#b45309" font-size="11" font-weight="700">3P x 200 A, 22 kA I.C.</text>

    <line x1="110" y1="480" x2="110" y2="520" stroke="#0f172a" stroke-width="4" />
  </g>

  <!-- Middle: Main Distribution Busbar TGD -->
  <g transform="translate(360, 200)">
    <!-- Busbar container -->
    <rect x="0" y="0" width="600" height="490" rx="8" fill="#ffffff" stroke="#334155" stroke-width="2" />
    <rect x="0" y="0" width="600" height="40" rx="6" fill="#334155" />
    <text x="300" y="26" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="800" letter-spacing="1">TABLERO GENERAL DE DISTRIBUCIÓN (TGD) 220/127 V - 3F - 4H</text>

    <!-- Busbars Lines -->
    <line x1="50" y1="70" x2="550" y2="70" stroke="#ef4444" stroke-width="5" />
    <text x="560" y="75" fill="#ef4444" font-size="11" font-weight="800">FASE A</text>

    <line x1="50" y1="90" x2="550" y2="90" stroke="#3b82f6" stroke-width="5" />
    <text x="560" y="95" fill="#3b82f6" font-size="11" font-weight="800">FASE B</text>

    <line x1="50" y1="110" x2="550" y2="110" stroke="#10b981" stroke-width="5" />
    <text x="560" y="115" fill="#10b981" font-size="11" font-weight="800">FASE C</text>

    <line x1="50" y1="130" x2="550" y2="130" stroke="#64748b" stroke-width="4" stroke-dasharray="6,4" />
    <text x="560" y="135" fill="#64748b" font-size="11" font-weight="800">NEUTRO</text>

    <line x1="50" y1="150" x2="550" y2="150" stroke="#eab308" stroke-width="4" />
    <text x="560" y="155" fill="#ca8a04" font-size="11" font-weight="800">TIERRA</text>

    <!-- Branch Circuit 1: Alumbrado y Contactos -->
    <g transform="translate(60, 180)">
      <line x1="30" y1="0" x2="30" y2="40" stroke="#0f172a" stroke-width="2.5" />
      <rect x="0" y="40" width="60" height="40" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
      <text x="30" y="60" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="800">3x50A</text>
      <text x="30" y="74" text-anchor="middle" fill="#64748b" font-size="9">3P QO</text>
      <line x1="30" y1="80" x2="30" y2="140" stroke="#0f172a" stroke-width="2" />
      <rect x="-15" y="140" width="90" height="80" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="30" y="160" text-anchor="middle" fill="#0f172a" font-size="10" font-weight="800">TABLERO 'A'</text>
      <text x="30" y="175" text-anchor="middle" fill="#475569" font-size="9">ALUMBRADO</text>
      <text x="30" y="190" text-anchor="middle" fill="#64748b" font-size="8">12 Circuitos</text>
      <text x="30" y="205" text-anchor="middle" fill="#0284c7" font-size="9" font-weight="700">7.8 kW</text>
    </g>

    <!-- Branch Circuit 2: Refrigeración Comercial -->
    <g transform="translate(190, 180)">
      <line x1="30" y1="0" x2="30" y2="40" stroke="#0f172a" stroke-width="2.5" />
      <rect x="0" y="40" width="60" height="40" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
      <text x="30" y="60" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="800">3x60A</text>
      <text x="30" y="74" text-anchor="middle" fill="#64748b" font-size="9">3P QO</text>
      <line x1="30" y1="80" x2="30" y2="140" stroke="#0f172a" stroke-width="2" />
      <rect x="-15" y="140" width="90" height="80" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="30" y="160" text-anchor="middle" fill="#0f172a" font-size="10" font-weight="800">TABLERO 'R'</text>
      <text x="30" y="175" text-anchor="middle" fill="#475569" font-size="9">REFRIGERACIÓN</text>
      <text x="30" y="190" text-anchor="middle" fill="#64748b" font-size="8">Cámaras y vitrinas</text>
      <text x="30" y="205" text-anchor="middle" fill="#0284c7" font-size="9" font-weight="700">12.4 kW</text>
    </g>

    <!-- Branch Circuit 3: Aire Acondicionado / Climas -->
    <g transform="translate(320, 180)">
      <line x1="30" y1="0" x2="30" y2="40" stroke="#0f172a" stroke-width="2.5" />
      <rect x="0" y="40" width="60" height="40" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
      <text x="30" y="60" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="800">2x40A</text>
      <text x="30" y="74" text-anchor="middle" fill="#64748b" font-size="9">2P QO</text>
      <line x1="30" y1="80" x2="30" y2="140" stroke="#0f172a" stroke-width="2" />
      <rect x="-15" y="140" width="90" height="80" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="30" y="160" text-anchor="middle" fill="#0f172a" font-size="10" font-weight="800">TABLERO 'AC'</text>
      <text x="30" y="175" text-anchor="middle" fill="#475569" font-size="9">CLIMAS</text>
      <text x="30" y="190" text-anchor="middle" fill="#64748b" font-size="8">Minisplits 220V</text>
      <text x="30" y="205" text-anchor="middle" fill="#0284c7" font-size="9" font-weight="700">5.5 kW</text>
    </g>

    <!-- Branch Circuit 4: Reserva / Futura Ampliación -->
    <g transform="translate(450, 180)">
      <line x1="30" y1="0" x2="30" y2="40" stroke="#0f172a" stroke-width="2.5" stroke-dasharray="4,4" />
      <rect x="0" y="40" width="60" height="40" rx="4" fill="#fef2f2" stroke="#f87171" stroke-width="1.5" stroke-dasharray="3,3" />
      <text x="30" y="60" text-anchor="middle" fill="#991b1b" font-size="11" font-weight="800">3x50A</text>
      <text x="30" y="74" text-anchor="middle" fill="#b91c1c" font-size="9">RESERVA</text>
      <line x1="30" y1="80" x2="30" y2="140" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4" />
      <rect x="-15" y="140" width="90" height="80" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3" />
      <text x="30" y="165" text-anchor="middle" fill="#64748b" font-size="10" font-weight="700">ESPACIO</text>
      <text x="30" y="185" text-anchor="middle" fill="#94a3b8" font-size="9">DISPONIBLE</text>
    </g>

    <!-- Footer Summary of Loads inside TGD -->
    <rect x="20" y="430" width="560" height="45" rx="4" fill="#f8fafc" stroke="#e2e8f0" />
    <text x="40" y="456" fill="#334155" font-size="11" font-weight="700">CARGA TOTAL INSTALADA: 27.25 kW • DEMANDA MÁXIMA ESTIMADA: 21.80 kW • F.D. = 0.80</text>
  </g>

  <!-- Right: SPAT Grounding System & Pericial Card -->
  <g transform="translate(990, 160)">
    <!-- SPAT Section Box -->
    <rect x="0" y="0" width="370" height="240" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
    <rect x="0" y="0" width="370" height="35" rx="6" fill="#16a34a" />
    <text x="185" y="24" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="800">SISTEMA DE PUESTA A TIERRA (SPAT)</text>
    
    <text x="20" y="65" fill="#14532d" font-size="11" font-weight="700">• Electrodo: Varilla Copperweld 5/8" x 3.00 m</text>
    <text x="20" y="85" fill="#14532d" font-size="11" font-weight="700">• Conductor de electrodo de puesta a tierra: 2 AWG Cu</text>
    <text x="20" y="105" fill="#14532d" font-size="11" font-weight="700">• Conexiones exotérmicas tipo Cadweld</text>
    <text x="20" y="125" fill="#14532d" font-size="11" font-weight="700">• Registro con tapa de concreto e inspección</text>

    <!-- Measured resistance badge -->
    <rect x="20" y="150" width="330" height="70" rx="6" fill="#ffffff" stroke="#86efac" stroke-width="1.5" />
    <text x="40" y="175" fill="#15803d" font-size="12" font-weight="800">RESISTENCIA MEDIDA EN SITIO: 4.8 Ω</text>
    <text x="40" y="195" fill="#166534" font-size="11">Límite Normativo NOM-001-SEDE-2012 Art. 250: ≤ 25 Ω</text>
    <text x="40" y="210" fill="#047857" font-size="11" font-weight="800">ESTADO: CUMPLE SATISFACTORIAMENTE</text>

    <!-- Technical Cuadro de Datos (Membrete del Perito) -->
    <g transform="translate(0, 260)">
      <rect x="0" y="0" width="370" height="430" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
      <rect x="0" y="0" width="370" height="32" rx="6" fill="#0f172a" />
      <text x="185" y="22" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="800">CUADRO DE DATOS Y ACREDITACIÓN</text>

      <text x="20" y="55" fill="#64748b" font-size="9" font-weight="700">PROYECTO / INSTALACIÓN:</text>
      <text x="20" y="72" fill="#0f172a" font-size="11" font-weight="800">ABARROTES AZTECA SUC. TIJERAS</text>

      <text x="20" y="95" fill="#64748b" font-size="9" font-weight="700">UBICACIÓN:</text>
      <text x="20" y="110" fill="#334155" font-size="10">JUAN DE BAEZA #600, COL. 18 DE MAYO</text>
      <text x="20" y="125" fill="#334155" font-size="10">MORELIA, MICHOACÁN • C.P. 58258</text>

      <line x1="20" y1="140" x2="350" y2="140" stroke="#e2e8f0" stroke-width="1" />

      <text x="20" y="160" fill="#64748b" font-size="9" font-weight="700">PERITO DICTAMINADOR RESPONSABLE:</text>
      <text x="20" y="178" fill="#0f172a" font-size="13" font-weight="800">ING. ISRAEL OROZCO ARIAS</text>
      <text x="20" y="195" fill="#0369a1" font-size="10" font-weight="700">CÉDULA PROFESIONAL: 15240154</text>
      <text x="20" y="210" fill="#475569" font-size="10">REGISTRO CFP: CFP0125/PCIEMBT/IOA/0071/14XII20</text>
      <text x="20" y="225" fill="#475569" font-size="10">TEL: 443 174 8638 • EMAIL: israel9b@hotmail.com</text>

      <line x1="20" y1="240" x2="350" y2="240" stroke="#e2e8f0" stroke-width="1" />

      <text x="20" y="260" fill="#64748b" font-size="9" font-weight="700">ESPECIFICACIONES TÉCNICAS:</text>
      <text x="20" y="278" fill="#334155" font-size="10">• Tensión: 13,200 V / 220-127 V • 60 Hz</text>
      <text x="20" y="295" fill="#334155" font-size="10">• Capacidad Subestación: 75 kVA</text>
      <text x="20" y="312" fill="#334155" font-size="10">• Norma: NOM-001-SEDE-2012</text>
      <text x="20" y="329" fill="#334155" font-size="10">• Fecha: 02-oct-2026</text>

      <!-- Signature space -->
      <line x1="60" y1="395" x2="310" y2="395" stroke="#94a3b8" stroke-width="1.5" />
      <text x="185" y="415" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">FIRMA Y SELLO DEL PERITO DICTAMINADOR</text>
    </g>
  </g>

  <!-- Bottom Technical Legend Bar -->
  <rect x="35" y="810" width="1330" height="55" fill="#f8fafc" stroke="#cbd5e1" />
  <text x="50" y="835" fill="#475569" font-size="10" font-weight="700">NOTAS GENERALES: TODO EL MATERIAL Y EQUIPO EMPLEADO CUMPLE CON NORMAS OFICIALES MEXICANAS (NOM / NMX) Y ES DE CONDUCTOR DE COBRE ELECTROLÍTICO 100% PURO.</text>
  <text x="50" y="852" fill="#64748b" font-size="9">EL PRESENTE DIAGRAMA FORMA PARTE INTEGRAL DEL EXPEDIENTE DEL DICTAMEN PERICIAL EMITIDO POR EL COLEGIO FEDERAL DE PERITOS.</text>
</svg>
`)}`;

export const SAMPLE_CEDULA_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="1200" height="760" style="background:#ffffff; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="sepGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9d743a" />
      <stop offset="50%" stop-color="#caa562" />
      <stop offset="100%" stop-color="#805b26" />
    </linearGradient>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
  </defs>

  <!-- Card Container -->
  <rect x="20" y="20" width="1160" height="720" rx="16" fill="url(#cardBg)" stroke="#cbd5e1" stroke-width="2" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" />

  <!-- Security Wave Guilloche Header Pattern -->
  <rect x="22" y="22" width="1156" height="110" rx="14" fill="#0c3c26" />
  
  <!-- Institutional Header Texts -->
  <text x="600" y="60" text-anchor="middle" fill="#d4af37" font-size="22" font-weight="900" letter-spacing="3">ESTADOS UNIDOS MEXICANOS</text>
  <text x="600" y="88" text-anchor="middle" fill="#ffffff" font-size="16" font-weight="700" letter-spacing="1">SECRETARÍA DE EDUCACIÓN PÚBLICA</text>
  <text x="600" y="112" text-anchor="middle" fill="#9ae6b4" font-size="12" font-weight="600" letter-spacing="2">DIRECCIÓN GENERAL DE PROFESIONES</text>

  <!-- Gold Ribbon -->
  <rect x="22" y="132" width="1156" height="8" fill="url(#sepGold)" />

  <!-- Title -->
  <text x="600" y="175" text-anchor="middle" fill="#1e293b" font-size="18" font-weight="800" letter-spacing="2">CÉDULA PROFESIONAL ELECTRÓNICA</text>
  <text x="600" y="196" text-anchor="middle" fill="#64748b" font-size="12" font-weight="600">CON EFECTOS DE PATENTE PARA EL EJERCICIO PROFESIONAL</text>

  <!-- Photo Box & Seal on the Left -->
  <g transform="translate(60, 220)">
    <!-- Photo Frame -->
    <rect x="0" y="0" width="220" height="280" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
    <!-- Avatar silhouette -->
    <circle cx="110" cy="100" r="45" fill="#64748b" />
    <path d="M 40 250 C 40 170, 180 170, 180 250 Z" fill="#64748b" />
    <text x="110" y="270" text-anchor="middle" fill="#475569" font-size="11" font-weight="700">FOTOGRAFÍA OFICIAL</text>

    <!-- Holographic Security Badge -->
    <rect x="15" y="300" width="190" height="70" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
    <text x="110" y="325" text-anchor="middle" fill="#1e40af" font-size="11" font-weight="800">GOBIERNO DE MÉXICO</text>
    <text x="110" y="345" text-anchor="middle" fill="#2563eb" font-size="10">SELLO DIGITAL AUTÉNTICO</text>
    <text x="110" y="360" text-anchor="middle" fill="#64748b" font-size="9">VALIDADO ANTE LA DGP</text>
  </g>

  <!-- Professional Details (Middle & Right) -->
  <g transform="translate(320, 230)">
    <!-- Cédula Number Badge -->
    <rect x="0" y="0" width="460" height="55" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" />
    <text x="20" y="25" fill="#15803d" font-size="11" font-weight="700">NÚMERO DE CÉDULA PROFESIONAL:</text>
    <text x="20" y="46" fill="#14532d" font-size="22" font-weight="900" letter-spacing="3">15240154</text>

    <!-- Professional Name -->
    <text x="0" y="90" fill="#64748b" font-size="11" font-weight="700">NOMBRE DEL PROFESIONISTA:</text>
    <text x="0" y="120" fill="#0f172a" font-size="24" font-weight="900" letter-spacing="1">ING. ISRAEL OROZCO ARIAS</text>

    <!-- Career / Título -->
    <text x="0" y="160" fill="#64748b" font-size="11" font-weight="700">TÍTULO O ESPECIALIDAD:</text>
    <text x="0" y="190" fill="#1e3a8a" font-size="20" font-weight="800">INGENIERO MECÁNICO ELECTRICISTA</text>

    <!-- Institution -->
    <text x="0" y="225" fill="#64748b" font-size="11" font-weight="700">INSTITUCIÓN EDUCATIVA DE EGRESO:</text>
    <text x="0" y="248" fill="#334155" font-size="14" font-weight="700">INSTITUTO TECNOLÓGICO DE MORELIA</text>

    <!-- Details Grid -->
    <g transform="translate(0, 275)">
      <text x="0" y="18" fill="#64748b" font-size="11" font-weight="700">FECHA DE EXPEDICIÓN:</text>
      <text x="0" y="36" fill="#0f172a" font-size="13" font-weight="800">18 DE MAYO DE 2018</text>

      <text x="220" y="18" fill="#64748b" font-size="11" font-weight="700">FOLIO DE REGISTRO:</text>
      <text x="220" y="36" fill="#0f172a" font-size="13" font-weight="800">DGP-2018-MEX-88419</text>
    </g>

    <g transform="translate(0, 335)">
      <text x="0" y="18" fill="#64748b" font-size="11" font-weight="700">CURP:</text>
      <text x="0" y="36" fill="#0f172a" font-size="13" font-weight="800">OOAI820414HMNRSR08</text>

      <text x="220" y="18" fill="#64748b" font-size="11" font-weight="700">LIBRO / FOJA:</text>
      <text x="220" y="36" fill="#0f172a" font-size="13" font-weight="800">LIBRO 412 / FOJA 89</text>
    </g>
  </g>

  <!-- Right: Verification QR & Official Stamp -->
  <g transform="translate(860, 230)">
    <!-- QR Card -->
    <rect x="0" y="0" width="260" height="340" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
    <rect x="30" y="30" width="200" height="200" rx="8" fill="#0f172a" />
    <!-- QR pattern simulation -->
    <rect x="45" y="45" width="45" height="45" fill="#ffffff" />
    <rect x="52" y="52" width="31" height="31" fill="#0f172a" />
    <rect x="170" y="45" width="45" height="45" fill="#ffffff" />
    <rect x="177" y="52" width="31" height="31" fill="#0f172a" />
    <rect x="45" y="170" width="45" height="45" fill="#ffffff" />
    <rect x="52" y="177" width="31" height="31" fill="#0f172a" />
    <!-- Data dots -->
    <rect x="110" y="60" width="20" height="20" fill="#ffffff" />
    <rect x="140" y="80" width="15" height="15" fill="#ffffff" />
    <rect x="110" y="110" width="40" height="40" fill="#ffffff" />
    <rect x="120" y="120" width="20" height="20" fill="#0f172a" />
    <rect x="170" y="140" width="25" height="25" fill="#ffffff" />
    <rect x="80" y="140" width="15" height="15" fill="#ffffff" />
    <rect x="110" y="180" width="25" height="25" fill="#ffffff" />
    <rect x="150" y="190" width="30" height="20" fill="#ffffff" />

    <text x="130" y="260" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="800">CÓDIGO QR DE AUTENTICIDAD</text>
    <text x="130" y="280" text-anchor="middle" fill="#64748b" font-size="10">Escanee para verificar validez</text>
    <text x="130" y="295" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="600">cedulaprofesional.sep.gob.mx</text>
  </g>

  <!-- Bottom Official Footer -->
  <rect x="22" y="640" width="1156" height="98" rx="12" fill="#0f172a" />
  <text x="50" y="675" fill="#e2e8f0" font-size="11" font-weight="700">CADENA ORIGINAL DEL TIMBRE FISCAL Y SELLO DIGITAL DE LA DIRECCIÓN GENERAL DE PROFESIONES:</text>
  <text x="50" y="695" fill="#94a3b8" font-size="9" font-family="monospace">||1.1|15240154|ING. ISRAEL OROZCO ARIAS|MECÁNICO ELECTRICISTA|2018-05-18|DGP-MEX-88419|SEP-DGP-CERT||</text>
  <text x="50" y="715" fill="#cbd5e1" font-size="10" font-weight="600">DOCUMENTO OFICIAL VALIDADOR PARA DICTÁMENES DE INSTALACIONES ELÉCTRICAS EN BAJA Y MEDIA TENSIÓN.</text>
</svg>
`)}`;

export const SAMPLE_CERTIFICADO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600" style="background:#ffffff; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b48236" />
      <stop offset="50%" stop-color="#f1cf8a" />
      <stop offset="100%" stop-color="#996515" />
    </linearGradient>
    <linearGradient id="blueBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0a2540" />
      <stop offset="50%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#0a2540" />
    </linearGradient>
  </defs>

  <!-- Ornamental Border -->
  <rect x="30" y="30" width="1140" height="1540" fill="#ffffff" stroke="#996515" stroke-width="4" rx="12" />
  <rect x="42" y="42" width="1116" height="1516" fill="none" stroke="#d4af37" stroke-width="2" rx="8" />
  <rect x="52" y="52" width="1096" height="1496" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="6,6" />

  <!-- Corner Ornaments -->
  <g fill="#996515">
    <polygon points="52,52 90,52 52,90" />
    <polygon points="1148,52 1110,52 1148,90" />
    <polygon points="52,1548 90,1548 52,1510" />
    <polygon points="1148,1548 1110,1548 1148,1510" />
  </g>

  <!-- Institutional Crest / Emblem -->
  <g transform="translate(600, 160)">
    <circle cx="0" cy="0" r="60" fill="url(#goldGrad)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
    <circle cx="0" cy="0" r="50" fill="#0a2540" />
    <text x="0" y="-8" text-anchor="middle" fill="#f1cf8a" font-size="28" font-weight="900" letter-spacing="2">CFP</text>
    <text x="0" y="16" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">MÉXICO</text>
    <!-- Laurel Wreath -->
    <path d="M -40 25 C -50 -10 -40 -40 0 -48 C 40 -40 50 -10 40 25" fill="none" stroke="#f1cf8a" stroke-width="3" />
  </g>

  <!-- Institutional Name -->
  <text x="600" y="275" text-anchor="middle" fill="#0f172a" font-size="34" font-weight="900" letter-spacing="3">COLEGIO FEDERAL DE PERITOS</text>
  <text x="600" y="310" text-anchor="middle" fill="#b48236" font-size="16" font-weight="800" letter-spacing="4">ASOCIACIÓN CIVIL • MÉXICO</text>
  <text x="600" y="335" text-anchor="middle" fill="#64748b" font-size="12" font-weight="600" letter-spacing="2">ÓRGANO NACIONAL DE INVESTIGACIÓN, CERTIFICACIÓN Y DICTAMINACIÓN PERICIAL</text>

  <!-- Horizontal Gold Divider -->
  <line x1="200" y1="365" x2="1000" y2="365" stroke="url(#goldGrad)" stroke-width="3" />

  <!-- Granting text -->
  <text x="600" y="420" text-anchor="middle" fill="#475569" font-size="16" font-style="italic" letter-spacing="1">Por acuerdo del Consejo Directivo Nacional y con fundamento en los estatutos vigentes, se otorga el presente:</text>

  <!-- Certificate Title Banner -->
  <g transform="translate(100, 460)">
    <rect x="0" y="0" width="1000" height="120" rx="10" fill="url(#blueBanner)" />
    <rect x="6" y="6" width="988" height="108" rx="8" fill="none" stroke="url(#goldGrad)" stroke-width="2" />
    <text x="500" y="45" text-anchor="middle" fill="#f1cf8a" font-size="16" font-weight="800" letter-spacing="3">CERTIFICADO COMO</text>
    <text x="500" y="78" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="900" letter-spacing="1">PERITO DICTAMINADOR DE INSTALACIONES ELÉCTRICAS</text>
    <text x="500" y="102" text-anchor="middle" fill="#93c5fd" font-size="16" font-weight="800" letter-spacing="2">EN MEDIA Y BAJA TENSIÓN</text>
  </g>

  <!-- In Favor of -->
  <text x="600" y="640" text-anchor="middle" fill="#64748b" font-size="14" font-weight="700" letter-spacing="3">AL CIUDADANO:</text>
  <text x="600" y="695" text-anchor="middle" fill="#0a2540" font-size="36" font-weight="900" letter-spacing="2">ING. ISRAEL OROZCO ARIAS</text>

  <line x1="300" y1="720" x2="900" y2="720" stroke="#cbd5e1" stroke-width="2" />

  <!-- Justification paragraph -->
  <g transform="translate(150, 755)">
    <text x="450" y="0" text-anchor="middle" fill="#334155" font-size="15" font-weight="500">
      Por haber demostrado capacidad técnica, solvencia profesional y acreditación
    </text>
    <text x="450" y="25" text-anchor="middle" fill="#334155" font-size="15" font-weight="500">
      conforme a los requerimientos de la <tspan font-weight="800">NOM-001-SEDE-2012</tspan> (Instalaciones Eléctricas - Utilización),
    </text>
    <text x="450" y="50" text-anchor="middle" fill="#334155" font-size="15" font-weight="500">
      Código de Red y normativas oficiales aplicables en los Estados Unidos Mexicanos.
    </text>
  </g>

  <!-- Official Accreditation Data Box -->
  <g transform="translate(150, 860)">
    <rect x="0" y="0" width="900" height="150" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
    
    <g transform="translate(50, 35)">
      <text x="0" y="0" fill="#64748b" font-size="11" font-weight="700">REGISTRO DE AFILIACIÓN PERICIAL:</text>
      <text x="0" y="25" fill="#0f172a" font-size="16" font-weight="900">CFP0125/PCIEMBT/IOA/0071/14XII20</text>

      <text x="0" y="65" fill="#64748b" font-size="11" font-weight="700">CÉDULA PROFESIONAL FEDERAL:</text>
      <text x="0" y="90" fill="#0f172a" font-size="16" font-weight="900">15240154</text>
    </g>

    <g transform="translate(500, 35)">
      <text x="0" y="0" fill="#64748b" font-size="11" font-weight="700">ESPECIALIDAD ACREDITADA:</text>
      <text x="0" y="25" fill="#1e40af" font-size="16" font-weight="900">MEDIA Y BAJA TENSIÓN</text>

      <text x="0" y="65" fill="#64748b" font-size="11" font-weight="700">ESTATUS Y VIGENCIA:</text>
      <text x="0" y="90" fill="#15803d" font-size="16" font-weight="900">VIGENTE (2026 - 2028)</text>
    </g>
  </g>

  <!-- Signatures Grid -->
  <g transform="translate(150, 1140)">
    <!-- Perito Titular -->
    <g transform="translate(80, 0)">
      <line x1="0" y1="0" x2="260" y2="0" stroke="#0f172a" stroke-width="2" />
      <text x="130" y="25" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">ING. ISRAEL OROZCO ARIAS</text>
      <text x="130" y="45" text-anchor="middle" fill="#64748b" font-size="11" font-weight="600">Perito Dictaminador Titular</text>
      <text x="130" y="62" text-anchor="middle" fill="#94a3b8" font-size="10">Cédula Prof. 15240154</text>
    </g>

    <!-- Presidente del Colegio -->
    <g transform="translate(480, 0)">
      <line x1="0" y1="0" x2="260" y2="0" stroke="#0f172a" stroke-width="2" />
      <text x="130" y="25" text-anchor="middle" fill="#0f172a" font-size="13" font-weight="800">PRESIDENCIA NACIONAL</text>
      <text x="130" y="45" text-anchor="middle" fill="#64748b" font-size="11" font-weight="600">Colegio Federal de Peritos A.C.</text>
      <text x="130" y="62" text-anchor="middle" fill="#94a3b8" font-size="10">Consejo Directivo de Certificación</text>
    </g>
  </g>

  <!-- Golden Seal Stamp & QR Bottom Section -->
  <g transform="translate(150, 1310)">
    <!-- QR Code Block -->
    <rect x="0" y="0" width="130" height="130" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
    <rect x="15" y="15" width="100" height="100" fill="#0f172a" />
    <rect x="25" y="25" width="25" height="25" fill="#ffffff" />
    <rect x="29" y="29" width="17" height="17" fill="#0f172a" />
    <rect x="75" y="25" width="25" height="25" fill="#ffffff" />
    <rect x="79" y="29" width="17" height="17" fill="#0f172a" />
    <rect x="25" y="75" width="25" height="25" fill="#ffffff" />
    <rect x="29" y="79" width="17" height="17" fill="#0f172a" />
    <rect x="58" y="45" width="15" height="15" fill="#ffffff" />
    <rect x="58" y="75" width="15" height="15" fill="#ffffff" />

    <!-- Certification Text -->
    <g transform="translate(160, 20)">
      <text x="0" y="0" fill="#0f172a" font-size="12" font-weight="800">VALIDACIÓN INSTITUCIONAL Y REGISTRO EN LÍNEA</text>
      <text x="0" y="20" fill="#64748b" font-size="11">Este documento cuenta con firma electrónica avanzada y sello criptográfico del CFP.</text>
      <text x="0" y="40" fill="#0369a1" font-size="11" font-weight="600">Portal de consulta pericial: www.colegiofederaldeperitos.org/validar</text>
      <text x="0" y="65" fill="#94a3b8" font-size="10" font-family="monospace">HASH-SHA256: e8f921a48c03b8e762df1a4bc89f0234a981cde5472b</text>
    </g>
  </g>

  <!-- Official Footer -->
  <text x="600" y="1520" text-anchor="middle" fill="#64748b" font-size="11" font-weight="600">EXPEDIDO EN MORELIA, MICHOACÁN EL 14 DE DICIEMBRE DE 2020 • COLEGIO FEDERAL DE PERITOS A.C.</text>
</svg>
`)}`;
