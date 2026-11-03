import React from 'react';
import { 
  FullDictamenExpediente,
  RevisionReport,
  ServiceRequest,
  SafetyEvaluationReport,
  ElectricalMeasurementsReport,
  SingleLineDiagram,
  PeritoCedula,
  PeritoCertificado
} from '../types';
import { CfpLogo } from './CfpLogo';
import { generateQrMatrixSvg } from '../utils/barcode';
import { ShieldCheck, CheckCircle2, Award, Zap, FileText } from 'lucide-react';

interface Full10PageDictamenDocumentProps {
  dictamen: FullDictamenExpediente;
  securityBgStyle?: 'guilloche' | 'clean';
  containerPrefix?: string;
  currentPageOnly?: number; // 1 to 10, or undefined for all 10 pages
  onSignatureClick?: () => void;
}

export const Full10PageDictamenDocument: React.FC<Full10PageDictamenDocumentProps> = ({
  dictamen,
  securityBgStyle = 'guilloche',
  containerPrefix = 'full-dictamen',
  currentPageOnly,
  onSignatureClick
}) => {
  const isDigitalSecurity = securityBgStyle === 'guilloche';

  // Fallback module data extracted or defaulted from dictamen
  const rev: RevisionReport = dictamen.revisionData || {
    id: `rev-${dictamen.id}`,
    folio: dictamen.folio,
    claveExpediente: dictamen.claveExpediente,
    fecha: dictamen.fecha,
    tipoInstalacionPrincipal: 'Media y Baja Tensión',
    giroInstalacion: 'COMERCIO Y SERVICIOS',
    tensionSuministro: '1000 V o más',
    clasificacionInstalacion: 'Lugar de concentración pública',
    tipoServicio: 'Revisión periódica',
    capacidadSubestacionKva: 75,
    cargaInstaladaKw: 27.25,
    titularNombreComercial: dictamen.titularNombreComercial || 'COMERCIO',
    titularRazonSocial: dictamen.titularRazonSocial || 'EMPRESA S.A. DE C.V.',
    titularRfc: dictamen.titularRfc || 'RFC123456789',
    titularCalleNumero: dictamen.titularCalleNumero || 'CALLE PRINCIPAL #100',
    titularColonia: dictamen.titularColonia || 'CENTRO',
    titularMunicipio: dictamen.titularMunicipio || 'MORELIA',
    titularCiudadEstado: dictamen.titularCiudadEstado || 'MORELIA, MICHOACÁN',
    titularCodigoPostal: dictamen.titularCodigoPostal || '58000',
    titularTelefono: dictamen.titularTelefono || '4431234567',
    solicitanteNombre: dictamen.solicitanteNombre || 'REPRESENTANTE',
    solicitanteTelefono: dictamen.solicitanteTelefono || '4431234567',
    peritoNombre: dictamen.peritoNombre || 'Ing. Israel Orozco Arias',
    peritoAfiliacion: dictamen.peritoAfiliacion || 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: dictamen.peritoCedula || '15240154',
    peritoEmail: dictamen.peritoEmail || 'israel9b@hotmail.com',
    peritoTelefono: dictamen.peritoTelefono || '4431748638',
    resultadoDictamen: 'Favorable (Aprobado)',
    observaciones: 'Cumplimiento satisfactorio de la NOM-001-SEDE-2012.',
    vigenciaHasta: '02-oct-27',
  };

  const req: ServiceRequest = dictamen.solicitudData || {
    id: `req-${dictamen.id}`,
    folio: dictamen.folio,
    fechaVisita: dictamen.fecha,
    peritoRegistroCfp: dictamen.peritoAfiliacion,
    peritoCedula: dictamen.peritoCedula,
    peritoTelefono: dictamen.peritoTelefono,
    peritoEmail: dictamen.peritoEmail,
    peritoNombre: dictamen.peritoNombre,
    nombreComercial: dictamen.titularNombreComercial,
    nombreRazonSocial: dictamen.titularRazonSocial,
    rfc: dictamen.titularRfc,
    calleNumero: dictamen.titularCalleNumero,
    coloniaPoblacion: dictamen.titularColonia,
    municipioDelegacion: dictamen.titularMunicipio,
    ciudadEstado: dictamen.titularCiudadEstado,
    codigoPostal: dictamen.titularCodigoPostal,
    telefonoInstalacion: dictamen.titularTelefono,
    solicitanteNombre: dictamen.solicitanteNombre,
    solicitanteTelefono: dictamen.solicitanteTelefono,
  };

  const safe: SafetyEvaluationReport = dictamen.evaluacionData || {
    id: `safe-${dictamen.id}`,
    folio: dictamen.folio,
    claveExpediente: dictamen.claveExpediente,
    fechaEvaluacion: dictamen.fecha,
    razonSocial: dictamen.titularRazonSocial,
    nombreComercial: dictamen.titularNombreComercial,
    rfc: dictamen.titularRfc,
    giro: 'COMERCIAL / INDUSTRIAL',
    calleNumero: dictamen.titularCalleNumero,
    colonia: dictamen.titularColonia,
    municipio: dictamen.titularMunicipio,
    ciudadEstado: dictamen.titularCiudadEstado,
    codigoPostal: dictamen.titularCodigoPostal,
    telefono: dictamen.titularTelefono,
    representanteLegal: dictamen.solicitanteNombre,
    companiaSuministradora: 'Comisión Federal de Electricidad (CFE SSB)',
    noServicioRpu: '892140502194',
    tarifaSuministro: 'GDMTO (Gran Demanda Media Tensión Ordinaria)',
    tensionSuministro: '13,200 V / 220-127 V',
    frecuenciaHz: 60,
    fasesHilos: '3 Fases - 4 Hilos',
    tipoSubestacion: 'Pedestal',
    capacidadTransformadorKva: 75,
    marcaNumeroSerie: 'PROLEC GE / SERIE 219803',
    tipoEnfriamiento: 'OA (Enfriamiento Natural)',
    nivelEstadoAceite: 'Normal / Aceptable',
    proteccionFisicaCercaCandado: 'Conforme',
    electrodoTierraConexion: 'Conforme',
    resistenciaTierraMedidaOhms: 6.8,
    sistemaPararrayosBajantes: 'Instalado y Conforme',
    gabineteTipoNema: 'NEMA 1 Interior / NEMA 3R Intemperie',
    directorioCircuitosIdentificado: '100% Identificado y Legible',
    cubiertaFrontalProteccionContacto: 'Completa y Ajustada',
    espacioReservaEspaciosVacios: 'Con tapas ciegas',
    interruptorPrincipalCapacidadA: 200,
    coordinacionProtecciones: 'Adecuada y Selectiva',
    proteccionFallaTierraGfci: 'Instalada en Zonas Húmedas',
    estadoInterruptoresTermomagneticos: 'Buen estado operativo',
    tipoConductorAislamiento: 'THW-LS 600V 75°C / 90°C Antiflama',
    codigoColoresNormativo: 'Conforme NOM-001',
    canalizacionesTuberiasCharolas: 'Tubería Conduit PG/PD Hermética',
    factorLlenadoCanalizaciones: 'Conforme (<40%)',
    espacioTrabajoTableros: 'Conforme (>90cm despejado)',
    puertasAccesoEscape: 'Libres y con apertura hacia afuera',
    senalesAdvertenciaRiesgoElectrico: 'Completas y Visibles',
    diagramaUnifilarActualizado: 'Disponible y Visible en Tablero',
    tapetesDielectricosAislantes: 'Colocados en tableros principales',
    iluminacionNormalYEmergencia: 'Luminarias normales y de emergencia operativas',
    extintorTipoCo2PqsCercano: 'Extintor CO2 / PQS vigente y despejado',
    disponibilidadEppDielectrico: 'Completo (Guantes, careta arc-flash, calzado)',
    medicionTensionFasesV: 'F1-F2: 220V, F2-F3: 221V, F3-F1: 219V, F-N: 127V',
    pruebaAislamientoMegger: 'Conforme (>100 MΩ)',
    termografiaInfrarroja: 'Sin puntos calientes',
    evidencias: [],
    noConformidadesDetectadas: 'Ninguna desviación crítica detectada.',
    medidasCorrectivasInmediatas: 'Continuar con el programa de mantenimiento preventivo anual.',
    plazoSubsanacionDias: 0,
    calificacionSeguridad: 'Instalación Eléctrica Segura (Aprobada)',
    peritoNombre: dictamen.peritoNombre,
    peritoAfiliacion: dictamen.peritoAfiliacion,
    peritoCedula: dictamen.peritoCedula,
    peritoTelefono: dictamen.peritoTelefono,
    peritoEmail: dictamen.peritoEmail,
  };

  const med: ElectricalMeasurementsReport = dictamen.medicionesData || {
    id: `med-${dictamen.id}`,
    folio: dictamen.folio,
    claveExpediente: dictamen.claveExpediente,
    fechaMedicion: dictamen.fecha,
    nombreRazonSocial: dictamen.titularRazonSocial,
    nombreComercial: dictamen.titularNombreComercial,
    rfc: dictamen.titularRfc,
    domicilioCompleto: `${dictamen.titularCalleNumero}, COL. ${dictamen.titularColonia}`,
    municipioEstado: dictamen.titularCiudadEstado,
    codigoPostal: dictamen.titularCodigoPostal,
    telefono: dictamen.titularTelefono,
    solicitante: dictamen.solicitanteNombre,
    solicitanteTelefono: dictamen.solicitanteTelefono,
    giro: 'COMERCIO Y SERVICIOS',
    instrumentoNombre: 'Analizador de Redes y Multímetro Digital Industrial',
    instrumentoMarca: 'FLUKE',
    instrumentoModelo: '435-II / 376 FC True RMS',
    instrumentoSerie: 'FLK-4352-8921',
    instrumentoCalibracion: 'Vigente al 15-Nov-2027 (Cert. EMA-EL-2024)',
    tensionF1F2: 220.0,
    tensionF2F3: 221.0,
    tensionF3F1: 219.0,
    tensionPromedioFF: 220.0,
    tensionF1N: 127.5,
    tensionF2N: 126.8,
    tensionF3N: 127.2,
    tensionPromedioFN: 127.2,
    tensionNT: 1.2,
    evaluacionTension: 'Conforme NOM-001-SEDE',
    corrienteF1: 68.5,
    corrienteF2: 71.2,
    corrienteF3: 65.8,
    corrienteNeutro: 14.2,
    desbalanceCorrientePorcentaje: 4.2,
    evaluacionCorriente: 'Carga Balanceada (<10%)',
    potenciaActivaKw: 27.26,
    potenciaReactivaKvar: 13.62,
    potenciaAparenteKva: 30.48,
    factorPotenciaF1: 0.89,
    factorPotenciaF2: 0.91,
    factorPotenciaF3: 0.90,
    factorPotenciaTotal: 0.90,
    capacidadSubestacionKva: 75,
    porcentajeUtilizacionCapacidad: 49.99,
    evaluacionFactorPotencia: 'Aceptable CFE (>0.90)',
    polaridadContactos: 'Correcta (Fase en ranura corta, Neutro en ranura larga, Tierra conectada)',
    pruebaGfciDisparo: 'Disparo Correcto (<25ms)',
    spatMetodo: 'Caída de Potencial (Método Wenner 3 Puntas)',
    spatPuntoMedicion: 'Pozo de Tierra Principal - Subestación',
    spatResistenciaMedidaOhms: 4.8,
    spatValorMaximoPermitidoOhms: 25,
    spatDictamen: 'CUMPLE NORMATIVA (≤ 25 Ω)',
    descripcionTecnica: 'Parámetros eléctricos dentro de los rangos normativos de la NOM-001-SEDE-2012.',
    evidencias: [],
    peritoNombre: dictamen.peritoNombre,
    peritoAfiliacion: dictamen.peritoAfiliacion,
    peritoCedula: dictamen.peritoCedula,
    peritoTelefono: dictamen.peritoTelefono,
    peritoEmail: dictamen.peritoEmail,
  };

  const diag: SingleLineDiagram = dictamen.diagramaData || {
    id: `diag-${dictamen.id}`,
    folio: dictamen.folio,
    claveExpediente: dictamen.claveExpediente,
    titulo: 'DIAGRAMA UNIFILAR GENERAL DE INSTALACIÓN ELÉCTRICA',
    fecha: dictamen.fecha,
    titularNombreComercial: dictamen.titularNombreComercial,
    titularRazonSocial: dictamen.titularRazonSocial,
    titularRfc: dictamen.titularRfc,
    titularDireccion: `${dictamen.titularCalleNumero}, ${dictamen.titularColonia}, ${dictamen.titularCiudadEstado}`,
    peritoNombre: dictamen.peritoNombre,
    peritoAfiliacion: dictamen.peritoAfiliacion,
    peritoCedula: dictamen.peritoCedula,
    imagenDataUrl: '/assets/aistudio/image_490a9fb5.png',
    orientacion: 'horizontal',
    ajusteModo: 'carta_completa',
  };

  const ced: PeritoCedula = dictamen.cedulaData || {
    id: `ced-${dictamen.id}`,
    peritoNombre: dictamen.peritoNombre,
    numeroCedula: dictamen.peritoCedula,
    profesion: 'INGENIERO ELECTRICISTA',
    institucionEmisora: 'DIRECCIÓN GENERAL DE PROFESIONES - SECRETARÍA DE EDUCACIÓN PÚBLICA',
    fechaExpedicion: '14 DE DICIEMBRE DE 2020',
    curp: 'OOAI781215HMNRRS01',
    imagenDataUrl: '/assets/aistudio/image_f6b8baaf.png',
    anchoCompleto: true,
  };

  const cert: PeritoCertificado = dictamen.certificadoData || {
    id: `cert-${dictamen.id}`,
    tituloCertificado: 'CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELÉCTRICAS EN MEDIA Y BAJA TENSIÓN',
    colegioEmisor: 'COLEGIO FEDERAL DE PERITOS A.C.',
    peritoNombre: dictamen.peritoNombre,
    numeroRegistro: dictamen.peritoAfiliacion,
    numeroCedula: dictamen.peritoCedula,
    especialidad: 'INSTALACIONES ELÉCTRICAS EN MEDIA Y BAJA TENSIÓN',
    vigencia: '2026 - 2028',
    fechaEmision: '14 de Diciembre de 2020',
    imagenDataUrl: '/assets/aistudio/image_f15453e2.png',
    ajusteCompleto: true,
  };

  // Helper styles for page sheet
  const pageSheetStyle: React.CSSProperties = {
    backgroundColor: isDigitalSecurity ? 'transparent' : '#ffffff',
    backgroundImage: isDigitalSecurity ? "url('/seguridad.png')" : 'none',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  const shouldRenderPage = (pageNum: number) => {
    return currentPageOnly === undefined || currentPageOnly === pageNum;
  };

  return (
    <div className="space-y-12 print:space-y-0 text-slate-900 font-sans">
      
      {/* =========================================================================
          PÁGINA 1: REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD (NOM-001)
          ========================================================================= */}
      {shouldRenderPage(1) && (
        <div
          id={`${containerPrefix}-page-1`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            {/* Header Document Title */}
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-lg font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                REVISION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
              </h1>
              <p className="text-[10px] sm:text-xs font-serif italic text-slate-700 mt-1">
                CONFORME A LA NORMA OFICIAL MEXICANA NOM-001-SEDE-2012, INSTALACIONES ELÉCTRICAS (UTILIZACIÓN)
              </p>
            </div>

            {/* Top row: Checkbox and Crest */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Tipo de instalación:</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-900 flex items-center justify-center font-bold text-sm bg-transparent">
                    {rev.tipoInstalacionPrincipal === 'Baja Tensión' ? 'X' : ''}
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Instalación Eléctrica de Baja Tensión</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-900 flex items-center justify-center font-bold text-sm bg-transparent">
                    {rev.tipoInstalacionPrincipal === 'Media y Baja Tensión' ? 'X' : ''}
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Instalación Eléctrica de Media y Baja Tensión</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <CfpLogo size={72} />
                <div className="flex flex-col text-left leading-tight font-serif">
                  <span className="font-bold text-slate-900 tracking-wider text-sm sm:text-base">CFP</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase">COLEGIO FEDERAL</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 uppercase">DE PERITOS</span>
                  <span className="text-[7.5px] font-semibold text-slate-500 uppercase tracking-tighter">INGENIERÍA ELÉCTRICA</span>
                </div>
              </div>
            </div>

            {/* Table of Suministro, Carga, Clasificación */}
            <div className="border-2 border-slate-900 divide-y-2 divide-slate-900 bg-transparent">
              <div className="p-2 space-y-1 text-xs">
                <span className="font-bold block uppercase text-[11px]">Giro de la instalación:</span>
                <p className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">{rev.giroInstalacion}</p>
              </div>

              <div className="grid grid-cols-2 divide-x-2 divide-slate-900 p-2 text-xs">
                <div>
                  <span className="font-bold block uppercase text-[10px]">Tensión de suministro:</span>
                  <span className="font-bold text-slate-900">{rev.tensionSuministro}</span>
                </div>
                <div className="pl-2">
                  <span className="font-bold block uppercase text-[10px]">Clasificación:</span>
                  <span className="font-bold text-slate-900">{rev.clasificacionInstalacion}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x-2 divide-slate-900 p-2 text-xs">
                <div>
                  <span className="font-bold block uppercase text-[10px]">Tipo de Servicio:</span>
                  <span className="font-bold text-slate-900">{rev.tipoServicio}</span>
                </div>
                <div className="px-2">
                  <span className="font-bold block uppercase text-[10px]">Capacidad Subestación:</span>
                  <span className="font-bold text-slate-900">{rev.capacidadSubestacionKva} kVA</span>
                </div>
                <div className="pl-2">
                  <span className="font-bold block uppercase text-[10px]">Carga Instalada:</span>
                  <span className="font-bold text-slate-900">{rev.cargaInstaladaKw} kW</span>
                </div>
              </div>

              {/* Titular */}
              <div className="p-2 space-y-1 text-xs">
                <span className="font-bold block uppercase text-[11px]">Datos del Titular:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-600 block">Nombre Comercial:</span>
                    <span className="font-bold text-slate-900 uppercase">{rev.titularNombreComercial}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 block">Razón Social:</span>
                    <span className="font-bold text-slate-900 uppercase">{rev.titularRazonSocial}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-600 block">RFC:</span>
                    <span className="font-mono font-bold text-slate-900">{rev.titularRfc}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 block">Domicilio:</span>
                    <span className="font-bold text-slate-900 uppercase">{rev.titularCalleNumero}, {rev.titularColonia}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 block">Municipio / Estado:</span>
                    <span className="font-bold text-slate-900 uppercase">{rev.titularCiudadEstado}</span>
                  </div>
                </div>
              </div>

              {/* Solicitante */}
              <div className="p-2 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold uppercase text-[10px] block">Solicitante del Servicio:</span>
                  <span className="font-bold text-slate-900 uppercase">{rev.solicitanteNombre}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold uppercase text-[10px] block">Teléfono Solicitante:</span>
                  <span className="font-mono font-bold text-slate-900">{rev.solicitanteTelefono}</span>
                </div>
              </div>
            </div>

            {/* Perito Responsable & QR */}
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div
                  className="p-1 bg-white border border-slate-300 rounded shadow-sm"
                  dangerouslySetInnerHTML={{
                    __html: generateQrMatrixSvg(
                      `CFP-VERIFY:${dictamen.folio}:${dictamen.claveExpediente}:${dictamen.titularRfc}`,
                      85
                    ),
                  }}
                />
                <div className="text-[10px] space-y-0.5 font-serif">
                  <div className="font-bold text-slate-900">PERITO RESPONSABLE:</div>
                  <div className="font-bold text-slate-900 uppercase text-xs">{rev.peritoNombre}</div>
                  <div>Afiliación: <span className="font-mono font-bold">{rev.peritoAfiliacion}</span></div>
                  <div>Cédula Profesional: <span className="font-mono font-bold">{rev.peritoCedula}</span></div>
                  <div>Email: <span className="font-mono">{rev.peritoEmail}</span></div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-600 uppercase">FOLIO DICTAMEN:</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-rose-600">#{dictamen.folio}</div>
                <div className="text-[9px] text-slate-500 font-mono mt-1">Fecha: {dictamen.fecha}</div>
              </div>
            </div>

            {/* Page Footer Stamp */}
            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CFP • INGENIERÍA ELÉCTRICA • NOM-001-SEDE-2012</span>
              <span className="font-bold text-slate-800">Página 1 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PÁGINA 2: SOLICITUD DE SERVICIOS Y FOTO DE FACHADA
          ========================================================================= */}
      {shouldRenderPage(2) && (
        <div
          id={`${containerPrefix}-page-2`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            {/* Header Document Title */}
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-lg font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                SOLICITUD DE SERVICIOS
              </h1>
              <p className="text-[10px] sm:text-xs font-serif italic text-slate-700 mt-1">
                COLEGIO FEDERAL DE PERITOS • DELEGACIÓN MICHOACÁN
              </p>
            </div>

            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <CfpLogo size={56} />
                <div className="font-serif">
                  <div className="font-bold text-xs uppercase text-slate-900">Ingeniería Eléctrica CFP</div>
                  <div className="text-[10px] text-slate-600">Inspección y Dictámenes Periciales</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700">FECHA DE VISITA: </span>
                <span className="font-bold font-mono text-slate-900 text-sm">{req.fechaVisita}</span>
                <div className="text-rose-600 font-mono font-bold text-sm">FOLIO: #{dictamen.folio}</div>
              </div>
            </div>

            {/* Datos del Inmueble y Solicitante */}
            <div className="border-2 border-slate-900 p-3 space-y-2 bg-transparent text-xs">
              <div className="font-black text-slate-900 uppercase border-b border-slate-300 pb-1">
                DATOS DE LA INSTALACIÓN Y CENTRO DE TRABAJO:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-bold">Nombre Comercial:</span> <span className="uppercase">{req.nombreComercial}</span></div>
                <div><span className="font-bold">Razón Social:</span> <span className="uppercase">{req.nombreRazonSocial}</span></div>
                <div><span className="font-bold">RFC:</span> <span className="font-mono font-bold">{req.rfc}</span></div>
                <div><span className="font-bold">Teléfono:</span> <span className="font-mono">{req.telefonoInstalacion}</span></div>
                <div className="col-span-2"><span className="font-bold">Dirección:</span> <span className="uppercase">{req.calleNumero}, COL. {req.coloniaPoblacion}, {req.ciudadEstado} CP {req.codigoPostal}</span></div>
              </div>

              <div className="font-black text-slate-900 uppercase border-b border-slate-300 pb-1 pt-2">
                DATOS DEL SOLICITANTE:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-bold">Nombre:</span> <span className="uppercase">{req.solicitanteNombre}</span></div>
                <div><span className="font-bold">Teléfono:</span> <span className="font-mono">{req.solicitanteTelefono}</span></div>
              </div>
            </div>

            {/* Foto de Referencia / Fachada del Inmueble */}
            <div className="border-2 border-slate-900 p-3 bg-transparent text-center space-y-2">
              <div className="font-bold uppercase text-xs text-slate-800">
                EVIDENCIA FOTOGRÁFICA DE IDENTIFICACIÓN / FACHADA DEL INMUEBLE
              </div>
              <div className="w-full h-56 sm:h-72 bg-slate-100 border border-slate-300 rounded flex items-center justify-center overflow-hidden">
                {req.fotoReferencia ? (
                  <img src={req.fotoReferencia} alt="Fachada del Inmueble" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FileText className="w-10 h-10" />
                    <span className="text-xs">Registro fotográfico pericial de la fachada en sitio</span>
                  </div>
                )}
              </div>
            </div>

            {/* Firmas Perito y Solicitante */}
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="text-center space-y-1">
                <div className="h-16 flex items-center justify-center border-b-2 border-slate-900">
                  <span className="font-serif italic font-bold text-slate-800">{rev.peritoNombre}</span>
                </div>
                <div className="font-bold text-xs uppercase text-slate-900">{rev.peritoNombre}</div>
                <div className="text-[10px] text-slate-600">Perito Dictaminador CFP</div>
              </div>

              <div className="text-center space-y-1">
                <div className="h-16 flex items-center justify-center border-b-2 border-slate-900">
                  <span className="font-serif italic font-bold text-slate-800">{req.solicitanteNombre}</span>
                </div>
                <div className="font-bold text-xs uppercase text-slate-900">{req.solicitanteNombre}</div>
                <div className="text-[10px] text-slate-600">Firma del Solicitante</div>
              </div>
            </div>

            {/* Page Footer Stamp */}
            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>SOLICITUD DE SERVICIOS • CFP MICHOACÁN</span>
              <span className="font-bold text-slate-800">Página 2 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PÁGINAS 3 A 6: FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
          ========================================================================= */}
      {/* PÁGINA 3 (Evaluación - Parte 1: Suministro y Subestación) */}
      {shouldRenderPage(3) && (
        <div
          id={`${containerPrefix}-page-3`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
              </h1>
              <p className="text-[10px] font-serif italic text-slate-700 mt-0.5">
                PÁGINA 1 DE 4 DE EVALUACIÓN TÉCNICA • SUMINISTRO, SUBESTACIÓN Y PUESTA A TIERRA
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-slate-300 pb-1 text-xs">
              <div><span className="font-bold">Centro de Trabajo:</span> <span className="font-black uppercase">{safe.nombreComercial}</span></div>
              <div className="font-mono text-rose-600 font-bold">EXP: #{dictamen.folio}</div>
            </div>

            {/* Sección Suministro CFE */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">1. SUMINISTRO DE ENERGÍA ELÉCTRICA (CFE)</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Compañía:</span> {safe.companiaSuministradora}</div>
                <div><span className="font-bold">RPU / No. Servicio:</span> <span className="font-mono font-bold">{safe.noServicioRpu}</span></div>
                <div><span className="font-bold">Tarifa:</span> {safe.tarifaSuministro}</div>
                <div><span className="font-bold">Tensión de Suministro:</span> <span className="font-bold">{safe.tensionSuministro}</span></div>
                <div><span className="font-bold">Frecuencia:</span> {safe.frecuenciaHz} Hz</div>
                <div><span className="font-bold">Configuración:</span> {safe.fasesHilos}</div>
              </div>
            </div>

            {/* Sección Subestación y Transformador */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">2. SUBESTACIÓN ELÉCTRICA Y TRANSFORMADOR DE POTENCIA</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Tipo de Subestación:</span> {safe.tipoSubestacion}</div>
                <div><span className="font-bold">Capacidad Transformador:</span> <span className="font-bold">{safe.capacidadTransformadorKva} kVA</span></div>
                <div><span className="font-bold">Marca y Serie:</span> {safe.marcaNumeroSerie}</div>
                <div><span className="font-bold">Enfriamiento:</span> {safe.tipoEnfriamiento}</div>
                <div><span className="font-bold">Nivel / Estado Aceite:</span> {safe.nivelEstadoAceite}</div>
                <div><span className="font-bold">Protección Física (Cerca / Candado):</span> <span className="font-bold text-emerald-800">{safe.proteccionFisicaCercaCandado}</span></div>
              </div>
            </div>

            {/* Sección Puesta a Tierra y Pararrayos */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">3. SISTEMA DE PUESTA A TIERRA Y PARARRAYOS (NOM-001 / NOM-022)</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Electrodo de Tierra y Conexión:</span> <span className="font-bold text-emerald-800">{safe.electrodoTierraConexion}</span></div>
                <div><span className="font-bold">Resistencia Medida:</span> <span className="font-mono font-bold text-slate-900">{safe.resistenciaTierraMedidaOhms} Ω</span> (Permitido ≤ 25 Ω)</div>
                <div className="col-span-2"><span className="font-bold">Sistema Pararrayos:</span> {safe.sistemaPararrayosBajantes}</div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CFP EVALUACIÓN DE SEGURIDAD • NOM-001-SEDE-2012</span>
              <span className="font-bold text-slate-800">Página 3 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* PÁGINA 4 (Evaluación - Parte 2: Tableros, Protecciones y Canalizaciones) */}
      {shouldRenderPage(4) && (
        <div
          id={`${containerPrefix}-page-4`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
              </h1>
              <p className="text-[10px] font-serif italic text-slate-700 mt-0.5">
                PÁGINA 2 DE 4 DE EVALUACIÓN TÉCNICA • TABLEROS, PROTECCIONES Y CANALIZACIONES
              </p>
            </div>

            {/* Tableros de Distribución */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">4. TABLEROS PRINCIPALES Y DE DISTRIBUCIÓN</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Gabinete / NEMA:</span> {safe.gabineteTipoNema}</div>
                <div><span className="font-bold">Directorio de Circuitos:</span> <span className="font-bold">{safe.directorioCircuitosIdentificado}</span></div>
                <div><span className="font-bold">Cubierta Frontal (Tapas):</span> {safe.cubiertaFrontalProteccionContacto}</div>
                <div><span className="font-bold">Espacios de Reserva:</span> {safe.espacioReservaEspaciosVacios}</div>
              </div>
            </div>

            {/* Dispositivos de Sobrecorriente e Interruptores */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">5. DISPOSITIVOS DE SOBRECORRIENTE E INTERRUPTORES</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Interruptor Principal:</span> <span className="font-mono font-bold">{safe.interruptorPrincipalCapacidadA} A</span></div>
                <div><span className="font-bold">Coordinación de Protecciones:</span> {safe.coordinacionProtecciones}</div>
                <div><span className="font-bold">Protección GFCI en Zonas Húmedas:</span> <span className="font-bold">{safe.proteccionFallaTierraGfci}</span></div>
                <div><span className="font-bold">Estado Termomagnéticos:</span> {safe.estadoInterruptoresTermomagneticos}</div>
              </div>
            </div>

            {/* Conductores y Canalizaciones */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">6. CONDUCTORES Y CANALIZACIONES ELÉCTRICAS</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Tipo de Conductor:</span> {safe.tipoConductorAislamiento}</div>
                <div><span className="font-bold">Código de Colores:</span> <span className="font-bold text-emerald-800">{safe.codigoColoresNormativo}</span></div>
                <div><span className="font-bold">Canalizaciones / Tuberías:</span> {safe.canalizacionesTuberiasCharolas}</div>
                <div><span className="font-bold">Factor de Llenado:</span> {safe.factorLlenadoCanalizaciones}</div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CFP EVALUACIÓN DE SEGURIDAD • NOM-001-SEDE-2012</span>
              <span className="font-bold text-slate-800">Página 4 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* PÁGINA 5 (Evaluación - Parte 3: Seguridad Laboral NOM-029/026) */}
      {shouldRenderPage(5) && (
        <div
          id={`${containerPrefix}-page-5`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
              </h1>
              <p className="text-[10px] font-serif italic text-slate-700 mt-0.5">
                PÁGINA 3 DE 4 DE EVALUACIÓN TÉCNICA • CONDICIONES DE SEGURIDAD LABORAL (NOM-029-STPS / NOM-026-STPS)
              </p>
            </div>

            {/* Espacios de Trabajo y Accesibilidad */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">7. ESPACIOS DE TRABAJO Y ACCESIBILIDAD (ART. 110-26)</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Espacio de Trabajo Tableros:</span> <span className="font-bold text-emerald-800">{safe.espacioTrabajoTableros}</span></div>
                <div><span className="font-bold">Puertas de Acceso y Escape:</span> {safe.puertasAccesoEscape}</div>
              </div>
            </div>

            {/* Señalización de Seguridad */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">8. SEÑALIZACIÓN DE RIESGO ELÉCTRICO (NOM-026-STPS)</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Señales de Advertencia:</span> <span className="font-bold">{safe.senalesAdvertenciaRiesgoElectrico}</span></div>
                <div><span className="font-bold">Diagrama Unifilar en Sitio:</span> {safe.diagramaUnifilarActualizado}</div>
              </div>
            </div>

            {/* Medidas Preventivas y Tapetes */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">9. PROTECCIÓN CONTRA CONTACTO Y EQUIPO DE SEGURIDAD</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Tapetes Dieléctricos:</span> {safe.tapetesDielectricosAislantes}</div>
                <div><span className="font-bold">Iluminación Normal y de Emergencia:</span> {safe.iluminacionNormalYEmergencia}</div>
                <div><span className="font-bold">Extintor CO2 / PQS:</span> <span className="font-bold text-emerald-800">{safe.extintorTipoCo2PqsCercano}</span></div>
                <div><span className="font-bold">Disponibilidad de EPP:</span> {safe.disponibilidadEppDielectrico}</div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CFP EVALUACIÓN DE SEGURIDAD • NOM-001-SEDE-2012</span>
              <span className="font-bold text-slate-800">Página 5 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* PÁGINA 6 (Evaluación - Parte 4: Pruebas, Veredicto Global y Firma) */}
      {shouldRenderPage(6) && (
        <div
          id={`${containerPrefix}-page-6`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                FORMATO PARA EVALUACION DE INSTALACIONES ELECTRICAS EN MATERIA DE SEGURIDAD
              </h1>
              <p className="text-[10px] font-serif italic text-slate-700 mt-0.5">
                PÁGINA 4 DE 4 DE EVALUACIÓN TÉCNICA • PRUEBAS, DICTAMEN FINAL Y FIRMA PERICIAL
              </p>
            </div>

            {/* Pruebas Eléctricas */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">10. PRUEBAS INSTRUMENTALES Y TERMOGRAFÍA</div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div><span className="font-bold">Tensión entre Fases:</span> {safe.medicionTensionFasesV}</div>
                <div><span className="font-bold">Prueba de Aislamiento Megger:</span> <span className="font-bold text-emerald-800">{safe.pruebaAislamientoMegger}</span></div>
                <div className="col-span-2"><span className="font-bold">Inspección Termográfica:</span> {safe.termografiaInfrarroja}</div>
              </div>
            </div>

            {/* Conclusión y Plan de Corrección */}
            <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
              <div className="font-black uppercase text-[11px] bg-slate-100 p-1">11. OBSERVACIONES Y MEDIDAS CORRECTIVAS</div>
              <p className="text-slate-800"><span className="font-bold">Observaciones / No Conformidades:</span> {safe.noConformidadesDetectadas}</p>
              <p className="text-slate-800"><span className="font-bold">Acciones Correctivas:</span> {safe.medidasCorrectivasInmediatas}</p>
            </div>

            {/* Veredicto de Seguridad Global */}
            <div className="border-2 border-emerald-900 bg-emerald-50/80 p-3 text-center space-y-1 rounded">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">CALIFICACIÓN Y VEREDICTO DE SEGURIDAD ELÉCTRICA:</span>
              <div className="text-sm sm:text-base font-black text-emerald-900 uppercase">
                {safe.calificacionSeguridad}
              </div>
            </div>

            {/* Firma del Perito */}
            <div className="pt-4 text-center space-y-1">
              <div className="h-16 flex items-center justify-center border-b-2 border-slate-900 w-72 mx-auto">
                <span className="font-serif italic font-bold text-slate-800">{rev.peritoNombre}</span>
              </div>
              <div className="font-bold text-xs uppercase text-slate-900">{rev.peritoNombre}</div>
              <div className="text-[10px] text-slate-600 font-mono">Cédula: {rev.peritoCedula} • Reg. CFP: {rev.peritoAfiliacion}</div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CFP EVALUACIÓN DE SEGURIDAD • NOM-001-SEDE-2012</span>
              <span className="font-bold text-slate-800">Página 6 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PÁGINA 7: FORMATO TECNICO DE MEDICIONES DE VARIABLES ELECTRICAS
          ========================================================================= */}
      {shouldRenderPage(7) && (
        <div
          id={`${containerPrefix}-page-7`}
          className="w-full max-w-4xl mx-auto p-6 sm:p-10 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-4 text-xs sm:text-sm">
            <div className="text-center pb-2">
              <h1 className="text-sm sm:text-lg font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-1 inline-block">
                FORMATO TECNICO DE MEDICIONES DE VARIABLES ELECTRICAS
              </h1>
              <p className="text-[10px] sm:text-xs font-serif italic text-slate-700 mt-1">
                TENSIÓN, CORRIENTE, FACTOR DE POTENCIA, POLARIDAD Y RESISTENCIA DE PUESTA A TIERRA (SPAT)
              </p>
            </div>

            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
              <div>
                <span className="font-bold text-slate-900 uppercase">{med.nombreComercial}</span>
                <div className="text-[10px] text-slate-600 font-mono">RFC: {med.rfc} • {med.municipioEstado}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700">FECHA: </span>
                <span className="font-bold font-mono text-slate-900">{med.fechaMedicion}</span>
                <div className="text-rose-600 font-mono font-bold text-sm">FOLIO: #{dictamen.folio}</div>
              </div>
            </div>

            {/* Instrumentación */}
            <div className="border border-slate-800 p-2 text-xs bg-slate-50/60 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800">Instrumento de Medición: </span>
                <span>{med.instrumentoMarca} {med.instrumentoModelo} ({med.instrumentoNombre})</span>
              </div>
              <div className="font-mono text-[10px] text-slate-600">
                Calibración: {med.instrumentoCalibracion}
              </div>
            </div>

            {/* Tabla de Tensiones y Corrientes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
                <div className="font-bold uppercase text-[11px] bg-slate-100 p-1">1. MEDICIÓN DE TENSIÓN (VOLTS)</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span>Fase 1 - Fase 2:</span> <span className="font-bold">{med.tensionF1F2} V</span></div>
                  <div className="flex justify-between"><span>Fase 2 - Fase 3:</span> <span className="font-bold">{med.tensionF2F3} V</span></div>
                  <div className="flex justify-between"><span>Fase 3 - Fase 1:</span> <span className="font-bold">{med.tensionF3F1} V</span></div>
                  <div className="flex justify-between border-t border-slate-300 pt-0.5"><span>Fase - Neutro Prom.:</span> <span className="font-bold">{med.tensionPromedioFN} V</span></div>
                  <div className="flex justify-between"><span>Neutro - Tierra:</span> <span className="font-bold">{med.tensionNT} V</span></div>
                </div>
              </div>

              <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
                <div className="font-bold uppercase text-[11px] bg-slate-100 p-1">2. MEDICIÓN DE CORRIENTE (AMPERES)</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span>Fase 1:</span> <span className="font-bold">{med.corrienteF1} A</span></div>
                  <div className="flex justify-between"><span>Fase 2:</span> <span className="font-bold">{med.corrienteF2} A</span></div>
                  <div className="flex justify-between"><span>Fase 3:</span> <span className="font-bold">{med.corrienteF3} A</span></div>
                  <div className="flex justify-between border-t border-slate-300 pt-0.5"><span>Neutro:</span> <span className="font-bold">{med.corrienteNeutro} A</span></div>
                  <div className="flex justify-between text-emerald-800 font-bold"><span>Desbalance:</span> <span>{med.desbalanceCorrientePorcentaje}%</span></div>
                </div>
              </div>
            </div>

            {/* Potencia, Factor de Potencia y Tierras SPAT */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
                <div className="font-bold uppercase text-[11px] bg-slate-100 p-1">3. POTENCIA Y FACTOR DE POTENCIA</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span>Potencia Activa:</span> <span className="font-bold">{med.potenciaActivaKw} kW</span></div>
                  <div className="flex justify-between"><span>Potencia Reactiva:</span> <span>{med.potenciaReactivaKvar} kVAR</span></div>
                  <div className="flex justify-between"><span>Factor de Potencia Total:</span> <span className="font-bold text-emerald-800">{med.factorPotenciaTotal}</span></div>
                  <div className="flex justify-between border-t border-slate-300 pt-0.5"><span>Utilización de Subestación:</span> <span>{med.porcentajeUtilizacionCapacidad}%</span></div>
                </div>
              </div>

              <div className="border-2 border-slate-900 p-2.5 space-y-1.5 text-xs">
                <div className="font-bold uppercase text-[11px] bg-slate-100 p-1">4. SISTEMA DE TIERRAS (SPAT)</div>
                <div className="space-y-1 text-[11px]">
                  <div><span className="font-bold">Método:</span> {med.spatMetodo}</div>
                  <div><span className="font-bold">Punto:</span> {med.spatPuntoMedicion}</div>
                  <div className="flex justify-between border-t border-slate-300 pt-1 font-mono">
                    <span className="font-bold">Resistencia Medida:</span>
                    <span className="font-black text-emerald-800 text-sm">{med.spatResistenciaMedidaOhms} Ω</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 p-1 rounded text-center">
                    {med.spatDictamen}
                  </div>
                </div>
              </div>
            </div>

            {/* Firma Perito */}
            <div className="pt-4 text-center space-y-1">
              <div className="h-14 flex items-center justify-center border-b-2 border-slate-900 w-72 mx-auto">
                <span className="font-serif italic font-bold text-slate-800">{rev.peritoNombre}</span>
              </div>
              <div className="font-bold text-xs uppercase text-slate-900">{rev.peritoNombre}</div>
              <div className="text-[10px] text-slate-600 font-mono">Cédula: {rev.peritoCedula} • Reg. CFP: {rev.peritoAfiliacion}</div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>FORMATO TÉCNICO DE MEDICIONES ELÉCTRICAS • NOM-001-SEDE-2012</span>
              <span className="font-bold text-slate-800">Página 7 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PÁGINA 8: DIAGRAMA UNIFILAR GENERAL (EN TAMAÑO CARTA A TODO LO ANCHO)
          ========================================================================= */}
      {shouldRenderPage(8) && (
        <div
          id={`${containerPrefix}-page-8`}
          className="w-full max-w-4xl mx-auto p-4 sm:p-6 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-3 text-xs">
            {/* Header Title */}
            <div className="text-center pb-1">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-0.5 inline-block">
                DIAGRAMA UNIFILAR GENERAL
              </h1>
              <p className="text-[9.5px] font-serif italic text-slate-700">
                REPRESENTACIÓN ESQUEMÁTICA Y CUADRO DE DISTRIBUCIÓN DE CARGAS
              </p>
            </div>

            {/* Top Bar with Titular */}
            <div className="flex justify-between items-center border border-slate-400 p-2 bg-slate-50/70 text-[11px]">
              <div>
                <span className="font-bold uppercase text-slate-900">{diag.titularNombreComercial}</span>
                <span className="text-slate-600 ml-2 font-mono">RFC: {diag.titularRfc}</span>
              </div>
              <div className="font-mono font-bold text-rose-600">
                FOLIO #{dictamen.folio}
              </div>
            </div>

            {/* Diagram Viewport spanning full sheet width */}
            <div className="w-full bg-white border-2 border-slate-900 rounded p-2 flex items-center justify-center min-h-[480px] sm:min-h-[580px] overflow-hidden">
              <img
                src={diag.imagenDataUrl || '/assets/aistudio/image_490a9fb5.png'}
                alt="Diagrama Unifilar General"
                className="max-h-[560px] w-full object-contain"
              />
            </div>

            {/* Membrete Pericial at Bottom */}
            <div className="border border-slate-900 p-2 grid grid-cols-3 gap-2 text-[10px] font-serif bg-slate-50/60">
              <div>
                <span className="font-bold text-slate-900 block">PROYECTO / INSTALACIÓN:</span>
                <span className="uppercase text-slate-800">{diag.titulo}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">PERITO RESPONSABLE:</span>
                <span className="uppercase text-slate-800 font-bold">{diag.peritoNombre}</span>
                <span className="block font-mono text-[9px]">Cédula: {diag.peritoCedula}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">FECHA DE EMISIÓN:</span>
                <span className="font-mono text-slate-800">{diag.fecha}</span>
                <span className="block text-slate-600 font-mono text-[9px]">Escala: Sin Escala (Esquemático)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>DIAGRAMA UNIFILAR • CFP INGENIERÍA ELÉCTRICA</span>
              <span className="font-bold text-slate-800">Página 8 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PÁGINA 9: CÉDULA PROFESIONAL DEL PERITO (SEP / DGP A TODO LO ANCHO)
          ========================================================================= */}
      {shouldRenderPage(9) && (
        <div
          id={`${containerPrefix}-page-9`}
          className="w-full max-w-4xl mx-auto p-4 sm:p-6 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-3 text-xs">
            {/* Header Document Title */}
            <div className="text-center pb-1">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-0.5 inline-block">
                CÉDULA PROFESIONAL DEL PERITO
              </h1>
              <p className="text-[10px] font-serif italic text-slate-700">
                DIRECCIÓN GENERAL DE PROFESIONES • SECRETARÍA DE EDUCACIÓN PÚBLICA
              </p>
            </div>

            {/* Header Info */}
            <div className="flex justify-between items-center border border-slate-400 p-2 bg-slate-50/70 text-[11px]">
              <div>
                <span className="font-bold text-slate-900">Perito: </span>
                <span className="uppercase font-bold text-slate-900">{ced.peritoNombre}</span>
              </div>
              <div className="font-mono font-bold text-slate-900">
                CÉDULA NO. <span className="text-rose-600">{ced.numeroCedula}</span>
              </div>
            </div>

            {/* Cédula Image spanning full width */}
            <div className="w-full bg-white border-2 border-slate-900 rounded p-2 flex items-center justify-center min-h-[500px] sm:min-h-[600px] overflow-hidden">
              <img
                src={ced.imagenDataUrl || '/assets/aistudio/image_f6b8baaf.png'}
                alt="Cédula Profesional del Perito"
                className="max-h-[580px] w-full object-contain"
              />
            </div>

            {/* Legal Certification Note */}
            <div className="border border-slate-900 p-2 bg-slate-50/60 text-[10px] text-justify space-y-0.5">
              <span className="font-bold text-slate-900 block uppercase">VALIDEZ OFICIAL Y ACREDITACIÓN:</span>
              <p className="text-slate-700">
                El presente documento certifica la acreditación profesional emitida por la Dirección General de Profesiones de la Secretaría de Educación Pública (SEP), habilitando legalmente al titular para dictaminar instalaciones eléctricas en el territorio nacional conforme a la Ley de Profesiones y la NOM-001-SEDE-2012.
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CÉDULA PROFESIONAL SEP • INGENIERÍA ELÉCTRICA CFP</span>
              <span className="font-bold text-slate-800">Página 9 de 10</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PÁGINA 10: CERTIFICADO COMO PERITO DICTAMINADOR EN MEDIA Y BAJA TENSIÓN
          ========================================================================= */}
      {shouldRenderPage(10) && (
        <div
          id={`${containerPrefix}-page-10`}
          className="w-full max-w-4xl mx-auto p-4 sm:p-6 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-2 bg-white"
          style={pageSheetStyle}
        >
          <div className="relative z-10 space-y-3 text-xs">
            {/* Header Document Title */}
            <div className="text-center pb-1">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-slate-900 uppercase border-b-2 border-slate-900 pb-0.5 inline-block">
                CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELECTRICAS EN MEDIA Y BAJA TENSION
              </h1>
              <p className="text-[10px] font-serif italic text-slate-700">
                COLEGIO FEDERAL DE PERITOS A.C. • ACREDITACIÓN PERICIAL ESPECIALIZADA
              </p>
            </div>

            {/* Certificate Header Bar */}
            <div className="flex justify-between items-center border border-slate-400 p-2 bg-slate-50/70 text-[11px]">
              <div>
                <span className="font-bold text-slate-900">Perito Dictaminador: </span>
                <span className="uppercase font-bold text-slate-900">{cert.peritoNombre}</span>
              </div>
              <div className="font-mono font-bold text-slate-900">
                REGISTRO CFP: <span className="text-rose-600">{cert.numeroRegistro}</span>
              </div>
            </div>

            {/* Certificate Image spanning full width and height */}
            <div className="w-full bg-white border-2 border-slate-900 rounded p-2 flex items-center justify-center min-h-[500px] sm:min-h-[600px] overflow-hidden">
              <img
                src={cert.imagenDataUrl || '/assets/aistudio/image_f15453e2.png'}
                alt="Certificado como Perito Dictaminador CFP"
                className="max-h-[580px] w-full object-contain"
              />
            </div>

            {/* Colegio Federal de Peritos Seal */}
            <div className="border border-slate-900 p-2 bg-slate-50/60 flex items-center justify-between text-[10px] font-serif">
              <div className="flex items-center gap-2">
                <CfpLogo size={36} />
                <div>
                  <span className="font-bold text-slate-900 block">COLEGIO FEDERAL DE PERITOS A.C.</span>
                  <span className="text-slate-600 text-[9px]">Comité de Acreditación y Evaluación Pericial</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">VIGENCIA: </span>
                <span className="font-bold text-emerald-800">{cert.vigencia}</span>
                <div className="text-[9px] text-slate-500 font-mono">Emisión: {cert.fechaEmision}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-[9px] font-mono text-slate-500 border-t border-slate-300">
              <span>CERTIFICADO OFICIAL CFP • PERITO DICTAMINADOR EN M.T. Y B.T.</span>
              <span className="font-bold text-slate-800">Página 10 de 10</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
