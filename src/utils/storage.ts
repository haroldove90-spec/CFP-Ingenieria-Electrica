import { 
  RevisionReport, 
  SupabaseSettings, 
  ServiceRequest, 
  OperatingConditionsReport, 
  SafetyEvaluationReport, 
  ElectricalMeasurementsReport,
  SingleLineDiagram,
  PeritoCedula,
  PeritoCertificado,
  Appointment,
  GeneratedQrCode
} from '../types';
import { 
  SAMPLE_DIAGRAM_DATA_URL, 
  SAMPLE_CEDULA_DATA_URL, 
  SAMPLE_CERTIFICADO_DATA_URL 
} from './documentSamples';

const STORAGE_KEY_REPORTS = 'cfp_revision_reports';
const STORAGE_KEY_SERVICE_REQUESTS = 'cfp_service_requests';
const STORAGE_KEY_OPERATING_CONDITIONS = 'cfp_operating_conditions';
const STORAGE_KEY_SAFETY_EVALUATIONS = 'cfp_safety_evaluations';
const STORAGE_KEY_ELECTRICAL_MEASUREMENTS = 'cfp_electrical_measurements';
const STORAGE_KEY_SINGLE_LINE_DIAGRAMS = 'cfp_single_line_diagrams';
const STORAGE_KEY_PERITO_CEDULA = 'cfp_perito_cedula';
const STORAGE_KEY_PERITO_CERTIFICADO = 'cfp_perito_certificado';
const STORAGE_KEY_APPOINTMENTS = 'cfp_agenda_citas';
const STORAGE_KEY_GENERATED_QRS = 'cfp_generated_qrs';
const STORAGE_KEY_HIDE_DEMO = 'cfp_hide_demo_data';
const STORAGE_KEY_SUPABASE = 'cfp_supabase_config';
const STORAGE_KEY_ACTIVE_ROLE = 'cfp_active_role';

export const SAMPLE_REPORTS: RevisionReport[] = [
  {
    id: 'rep-359',
    folio: '359',
    claveExpediente: 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026',
    fecha: '02-oct-26',
    tipoInstalacionPrincipal: 'Media y Baja Tensión',
    giroInstalacion: 'COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO',
    tensionSuministro: '1000 V o más',
    clasificacionInstalacion: 'Lugar de concentración pública',
    tipoServicio: 'Revisión periódica',
    capacidadSubestacionKva: 75,
    cargaInstaladaKw: 27.25,
    titularNombreComercial: 'ABARROTES AZTECA SUC. TIJERAS',
    titularRazonSocial: 'ABARROTES AZTECA TIJERAS S.A DE C.V',
    titularRfc: 'AAT170629U46',
    titularCalleNumero: 'JUAN DE BAEZA #600',
    titularColonia: 'DIECIOCHO DE MAYO',
    titularMunicipio: 'MORELIA',
    titularCiudadEstado: 'MORELIA, MICHOACÁN',
    titularCodigoPostal: '58258',
    titularTelefono: '4433234075',
    solicitanteNombre: 'VICTOR DANIEL RIOS RAMIREZ',
    solicitanteTelefono: '4438573253',
    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoEmail: 'israel9b@hotmail.com',
    peritoTelefono: '4431748638',
    resultadoDictamen: 'Favorable (Aprobado)',
    observaciones: 'Cumplimiento satisfactorio de la NOM-001-SEDE-2012. Sistema de puesta a tierra con electrodos calibrados en 8.2 ohms. Transformador tipo pedestal en condiciones óptimas.',
    vigenciaHasta: '02-oct-27',
    esMuestra: true,
  },
  {
    id: 'rep-360',
    folio: '360',
    claveExpediente: 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 360/2026',
    fecha: '05-oct-26',
    tipoInstalacionPrincipal: 'Media y Baja Tensión',
    giroInstalacion: 'INDUSTRIA PROCESADORA DE AGROALIMENTOS Y EMPACADORA',
    tensionSuministro: '1000 V o más',
    clasificacionInstalacion: 'Industria',
    tipoServicio: 'Modificación de instalación',
    capacidadSubestacionKva: 225,
    cargaInstaladaKw: 148.5,
    titularNombreComercial: 'AGROEXPORTADORA DEL VALLE',
    titularRazonSocial: 'AGROEXPORTADORA DEL VALLE S.P.R. DE R.L.',
    titularRfc: 'AVM190312KP8',
    titularCalleNumero: 'CARRETERA MORELIA-PATZCUARO KM 14.5',
    titularColonia: 'PARQUE INDUSTRIAL MORELIA',
    titularMunicipio: 'MORELIA',
    titularCiudadEstado: 'MORELIA, MICHOACÁN',
    titularCodigoPostal: '58340',
    titularTelefono: '4432198000',
    solicitanteNombre: 'ING. MARCELO DELGADO CÁRDENAS',
    solicitanteTelefono: '4439812345',
    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoEmail: 'israel9b@hotmail.com',
    peritoTelefono: '4431748638',
    resultadoDictamen: 'Favorable (Aprobado)',
    observaciones: 'Ampliación de tablero de distribución principal e incorporación de banco de capacitores automático de 45 kVAR.',
    vigenciaHasta: '05-oct-27',
    esMuestra: true,
  },
  {
    id: 'rep-361',
    folio: '361',
    claveExpediente: 'CFP0125/PCIEBT/IOA/0071/14XII20 - 361/2026',
    fecha: '09-oct-26',
    tipoInstalacionPrincipal: 'Baja Tensión',
    giroInstalacion: 'CENTRO MÉDICO CLÍNICO Y LABORATORIO DE ANÁLISIS',
    tensionSuministro: 'Menos de 1000 V',
    clasificacionInstalacion: 'Lugar de concentración pública',
    tipoServicio: 'Servicio Nuevo',
    capacidadSubestacionKva: 45,
    cargaInstaladaKw: 18.2,
    titularNombreComercial: 'CLÍNICA DE ESPECIALIDADES MÉDICAS DEL CENTRO',
    titularRazonSocial: 'SERVICIOS HOSPITALARIOS INTEGRALES S.A. DE C.V.',
    titularRfc: 'SHI140811TR4',
    titularCalleNumero: 'AV. ACUEDUCTO #1120',
    titularColonia: 'CHAPULTEPEC NORTE',
    titularMunicipio: 'MORELIA',
    titularCiudadEstado: 'MORELIA, MICHOACÁN',
    titularCodigoPostal: '58260',
    titularTelefono: '4433156789',
    solicitanteNombre: 'DRA. PATRICIA VARGAS MENDOZA',
    solicitanteTelefono: '4435678901',
    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoEmail: 'israel9b@hotmail.com',
    peritoTelefono: '4431748638',
    resultadoDictamen: 'Condicionado',
    observaciones: 'Requiere sustitución de 2 interruptores termomagnéticos por tipo GFCI en área húmeda de laboratorio antes de la emisión final definitiva.',
    vigenciaHasta: '09-nov-26',
    esMuestra: true,
  }
];

export function isDemoDataHidden(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_HIDE_DEMO) === 'true';
}

export function setDemoDataHidden(hidden: boolean): void {
  if (typeof window === 'undefined') return;
  if (hidden) {
    localStorage.setItem(STORAGE_KEY_HIDE_DEMO, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEY_HIDE_DEMO);
  }
}

export function getRevisionReports(): RevisionReport[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
  const hideDemo = isDemoDataHidden();

  if (!raw) {
    if (hideDemo) {
      return [];
    }
    // Seed sample reports
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(SAMPLE_REPORTS));
    return SAMPLE_REPORTS;
  }

  try {
    const list: RevisionReport[] = JSON.parse(raw);
    if (hideDemo) {
      // Filter out any demo data if hide flag is set
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_REPORTS;
  }
}

export function saveRevisionReport(report: RevisionReport): RevisionReport[] {
  const current = getRevisionReports();
  const existsIndex = current.findIndex(r => r.id === report.id || r.folio === report.folio);
  let updated: RevisionReport[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...report, esMuestra: false };
  } else {
    updated = [report, ...current];
  }

  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
  return updated;
}

export function deleteRevisionReport(id: string): RevisionReport[] {
  const current = getRevisionReports();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
  return updated;
}

export function deleteRevisionReports(ids: string[]): RevisionReport[] {
  const current = getRevisionReports();
  const idSet = new Set(ids);
  const updated = current.filter(r => !idSet.has(r.id));
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
  return updated;
}

export function clearSampleData(): { removedCount: number; remainingCount: number } {
  setDemoDataHidden(true);
  const current = getRevisionReports();
  const nonDemo = current.filter(r => !r.esMuestra);
  const removedCount = current.length - nonDemo.length;
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(nonDemo));

  // Service requests
  const srv = getServiceRequests().filter(r => !r.esMuestra);
  localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify(srv));

  // Operating conditions
  const op = getOperatingConditionsReports().filter(r => !r.esMuestra);
  localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify(op));

  // Safety evaluations
  const safe = getSafetyEvaluations().filter(r => !r.esMuestra);
  localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify(safe));

  // Electrical measurements (Página 9)
  const elec = getElectricalMeasurements().filter(r => !r.esMuestra);
  localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify(elec));

  // Single-line diagrams
  const diag = getSingleLineDiagrams().filter(r => !r.esMuestra);
  localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify(diag));

  // Appointments
  const citas = getAppointments().filter(r => !r.esMuestra);
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(citas));

  return { removedCount, remainingCount: nonDemo.length };
}

export function wipeAllReports(): void {
  setDemoDataHidden(true);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify([]));
}

export function restoreSampleData(): RevisionReport[] {
  setDemoDataHidden(false);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(SAMPLE_REPORTS));
  localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify(SAMPLE_SERVICE_REQUESTS));
  localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify(SAMPLE_OPERATING_CONDITIONS));
  localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify(SAMPLE_SAFETY_EVALUATIONS));
  localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify(SAMPLE_ELECTRICAL_MEASUREMENTS));
  localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify(SAMPLE_SINGLE_LINE_DIAGRAMS));
  localStorage.setItem(STORAGE_KEY_PERITO_CEDULA, JSON.stringify(SAMPLE_PERITO_CEDULA));
  localStorage.setItem(STORAGE_KEY_PERITO_CERTIFICADO, JSON.stringify(SAMPLE_PERITO_CERTIFICADO));
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(SAMPLE_APPOINTMENTS));
  return SAMPLE_REPORTS;
}

export function getActiveRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ROLE);
}

export function setActiveRole(role: string | null): void {
  if (typeof window === 'undefined') return;
  if (!role) {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ROLE);
  } else {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ROLE, role);
  }
}

// Supabase configuration storage and remote operations
export const DEFAULT_SUPABASE_SETTINGS: SupabaseSettings = {
  projectName: "are.com's Project",
  projectId: 'ggxliydxwcylilanitzk',
  url: 'https://ggxliydxwcylilanitzk.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneGxpeWR4d2N5bGlsYW5pdHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1NDAwOTMsImV4cCI6MjEwODExNjA5M30.v0JoPDzfG0kMNAaYMpn3hjFiEDLZxS8u8z6MVX6YdC8',
  tableName: 'revisiones_electricas',
  connected: false,
};

export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

export function getSupabaseSettings(): SupabaseSettings {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SUPABASE_SETTINGS };
  }
  const raw = localStorage.getItem(STORAGE_KEY_SUPABASE);
  if (!raw) {
    // Save defaults
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(DEFAULT_SUPABASE_SETTINGS));
    return { ...DEFAULT_SUPABASE_SETTINGS };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      projectName: parsed.projectName || DEFAULT_SUPABASE_SETTINGS.projectName,
      projectId: parsed.projectId || DEFAULT_SUPABASE_SETTINGS.projectId,
      url: parsed.url || DEFAULT_SUPABASE_SETTINGS.url,
      anonKey: parsed.anonKey || DEFAULT_SUPABASE_SETTINGS.anonKey,
      tableName: parsed.tableName || DEFAULT_SUPABASE_SETTINGS.tableName,
      connected: Boolean(parsed.connected),
      lastSync: parsed.lastSync,
    };
  } catch {
    return { ...DEFAULT_SUPABASE_SETTINGS };
  }
}

export function saveSupabaseSettings(settings: SupabaseSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(settings));
}

export async function testSupabaseConnection(settings: SupabaseSettings): Promise<{ success: boolean; tableExists: boolean; message: string }> {
  if (!settings.url || !settings.anonKey) {
    return { success: false, tableExists: false, message: 'URL o Clave Anónima de Supabase vacía.' };
  }
  try {
    const baseUrl = normalizeSupabaseUrl(settings.url);
    const endpoint = `${baseUrl}/rest/v1/${settings.tableName || 'revisiones_electricas'}?select=id&limit=1`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': settings.anonKey,
        'Authorization': `Bearer ${settings.anonKey}`,
      }
    });

    if (response.ok) {
      const updated = { ...settings, connected: true, lastSync: new Date().toISOString() };
      saveSupabaseSettings(updated);
      return { success: true, tableExists: true, message: '¡Conexión verificada con Supabase! La tabla existe y responde adecuadamente.' };
    } else {
      const errorText = await response.text();
      if (response.status === 404 || errorText.includes('relation') || errorText.includes('does not exist')) {
        return { 
          success: true, 
          tableExists: false, 
          message: 'Conexión con Supabase alcanzada, pero la tabla aún no existe en PostgreSQL. Ejecuta el Script SQL provisto en el SQL Editor de Supabase.' 
        };
      }
      return { success: false, tableExists: false, message: `Respuesta de Supabase (${response.status}): ${errorText}` };
    }
  } catch (err: any) {
    return { success: false, tableExists: false, message: `Error de red al conectar con Supabase: ${err.message || err}` };
  }
}

// ==========================================
// SUPABASE HELPERS: SERIALIZACIÓN Y DESERIALIZACIÓN (CASE-INSENSITIVE PARA POSTGRESQL)
// ==========================================

export const KNOWN_SAMPLE_IDS = new Set([
  'rep-359', 'rep-360', 'rep-361',
  'rep-sample-359', 'rep-sample-360', 'rep-sample-361',
  'sol-01', 'req-sample-088',
  'com-088', 'cond-sample-088',
  'eval-055',
  'med-359', 'med-sample-359',
  'diag-sample-01',
  'cedula-perito-01',
  'cert-perito-01',
  'cita-001', 'cita-002', 'cita-003', 'cita-004'
]);

export function isSampleRecord(id: string, esMuestra?: boolean): boolean {
  if (esMuestra === true) return true;
  return KNOWN_SAMPLE_IDS.has(id);
}

export function toSupabaseRow(tableName: string, data: any): any {
  if (!data) return {};
  const isMuestra = Boolean(data.esMuestra ?? data.esmuestra ?? isSampleRecord(data.id, data.esMuestra));

  switch (tableName) {
    case 'revisiones_electricas': {
      const r = data as RevisionReport;
      const commonRfc = r.titularRfc || (r as any).rfc || '';
      return {
        id: String(r.id),
        folio: String(r.folio || ''),
        claveexpediente: r.claveExpediente || '',
        fecha: r.fecha || '',
        tipoinstalacionprincipal: r.tipoInstalacionPrincipal || '',
        giroinstalacion: r.giroInstalacion || '',
        tensionsuministro: r.tensionSuministro || '',
        clasificacioninstalacion: r.clasificacionInstalacion || '',
        clasificacionotrodetalle: r.clasificacionOtroDetalle || '',
        tiposervicio: r.tipoServicio || '',
        capacidadsubestacionkva: Number(r.capacidadSubestacionKva) || 0,
        cargainstaladakw: Number(r.cargaInstaladaKw) || 0,
        titularnombrecomercial: r.titularNombreComercial || '',
        titularrazonsocial: r.titularRazonSocial || '',
        titularrfc: commonRfc,
        rfc: commonRfc,
        titularcallenumero: r.titularCalleNumero || '',
        titularcolonia: r.titularColonia || '',
        titularmunicipio: r.titularMunicipio || '',
        titularciudadestado: r.titularCiudadEstado || '',
        titularcodigopostal: r.titularCodigoPostal || '',
        titulartelefono: r.titularTelefono || '',
        solicitantenombre: r.solicitanteNombre || '',
        solicitantetelefono: r.solicitanteTelefono || '',
        peritonombre: r.peritoNombre || '',
        peritoafiliacion: r.peritoAfiliacion || '',
        peritocedula: r.peritoCedula || '',
        peritoemail: r.peritoEmail || '',
        peritotelefono: r.peritoTelefono || '',
        resultadodictamen: r.resultadoDictamen || '',
        observaciones: r.observaciones || '',
        vigenciahasta: r.vigenciaHasta || '',
        esmuestra: isMuestra,
        firmadigital: r.firmaDigital || ''
      };
    }

    case 'agenda_citas': {
      const a = data as Appointment;
      return {
        id: String(a.id),
        clientenombre: a.clienteNombre || (a as any).clientenombre || '',
        representante: a.representante || '',
        recomendadopor: a.recomendadoPor || (a as any).recomendadopor || '',
        direccionempresa: a.direccionEmpresa || (a as any).direccionempresa || '',
        telefonos: a.telefonos || '',
        whatsapp: a.whatsapp || '',
        correoelectronico: a.correoElectronico || (a as any).correoelectronico || '',
        fechacita: a.fechaCita || (a as any).fechacita || '',
        horacita: a.horaCita || (a as any).horacita || '',
        duracionminutos: Number(a.duracionMinutos ?? (a as any).duracionminutos ?? 60),
        tiposervicio: a.tipoServicio || (a as any).tiposervicio || '',
        motivonotas: a.motivoNotas || (a as any).motivonotas || '',
        peritoasignado: a.peritoAsignado || (a as any).peritoasignado || '',
        foliodictamenrelacionado: a.folioDictamenRelacionado || (a as any).foliodictamenrelacionado || '',
        estado: a.estado || 'Programada',
        recordatoriominutos: Number(a.recordatorioMinutos ?? (a as any).recordatoriominutos ?? 30),
        esmuestra: isMuestra
      };
    }

    case 'solicitudes_servicio': {
      const s = data as ServiceRequest;
      const commonRfc = s.rfc || (s as any).titularRfc || '';
      return {
        id: String(s.id),
        folio: String(s.folio || ''),
        fechavisita: s.fechaVisita || '',
        peritoregistrocfp: s.peritoRegistroCfp || '',
        peritocedula: s.peritoCedula || '',
        peritotelefono: s.peritoTelefono || '',
        peritoemail: s.peritoEmail || '',
        peritonombre: s.peritoNombre || '',
        nombrecomercial: s.nombreComercial || '',
        nombrerazonsocial: s.nombreRazonSocial || '',
        rfc: commonRfc,
        titularrfc: commonRfc,
        callenumero: s.calleNumero || '',
        coloniapoblacion: s.coloniaPoblacion || '',
        municipiodelegacion: s.municipioDelegacion || '',
        ciudadestado: s.ciudadEstado || '',
        codigopostal: s.codigoPostal || '',
        telefonoinstalacion: s.telefonoInstalacion || '',
        solicitantenombre: s.solicitanteNombre || '',
        solicitantetelefono: s.solicitanteTelefono || '',
        fotoreferencia: s.fotoReferencia || '',
        evidencias: s.evidencias || [],
        firmaperito: s.firmaPerito || '',
        firmasolicitante: s.firmaSolicitante || '',
        esmuestra: isMuestra
      };
    }

    case 'condiciones_operativas': {
      const c = data as OperatingConditionsReport;
      const commonRfc = c.rfc || (c as any).titularRfc || '';
      return {
        id: String(c.id),
        folio: String(c.folio || ''),
        claveexpediente: c.claveExpediente || '',
        fechainspeccion: c.fechaInspeccion || '',
        nombrecomercial: c.nombreComercial || '',
        razonsocial: c.razonSocial || '',
        rfc: commonRfc,
        titularrfc: commonRfc,
        giro: c.giro || '',
        callenumero: c.calleNumero || '',
        colonia: c.colonia || '',
        municipio: c.municipio || '',
        ciudadestado: c.ciudadEstado || '',
        codigopostal: c.codigoPostal || '',
        telefono: c.telefono || '',
        contacto: c.contacto || '',
        tipoinstalacion: c.tipoInstalacion || '',
        tensionoperacion: c.tensionOperacion || '',
        capacidadtransformadorkva: Number(c.capacidadTransformadorKva) || 0,
        demandamedidakw: Number(c.demandaMedidaKw) || 0,
        resistenciatierraohms: Number(c.resistenciaTierraOhms) || 0,
        estadosubestacion: c.estadoSubestacion || '',
        estadotableros: c.estadoTableros || '',
        estadoconductorescanalizaciones: c.estadoConductoresCanalizaciones || '',
        estadosistematierras: c.estadoSistemaTierras || '',
        estadoproteccionessobrecarga: c.estadoProteccionesSobrecarga || '',
        estadoalumbradoemergencia: c.estadoAlumbradoEmergencia || '',
        programamantenimientovigente: Boolean(c.programaMantenimientoVigente),
        ultimomantenimientofecha: c.ultimoMantenimientoFecha || '',
        responsablemantenimiento: c.responsableMantenimiento || '',
        pruebasaislamientomegger: c.pruebasAislamientoMegger || '',
        pruebastermografiainfrarroja: c.pruebasTermografiaInfrarroja || '',
        limpiezaordencuartoelectrico: c.limpiezaOrdenCuartoElectrico || '',
        equipoproteccionpersonalyrotulacion: c.equipoProteccionPersonalYRotulacion || '',
        dictamencondiciones: c.dictamenCondiciones || '',
        plazocorrecciondias: Number(c.plazoCorreccionDias) || 0,
        accionesrequeridas: c.accionesRequeridas || '',
        notasrecomendaciones: c.notasRecomendaciones || '',
        evidencias: c.evidencias || [],
        peritonombre: c.peritoNombre || '',
        peritoafiliacion: c.peritoAfiliacion || '',
        peritocedula: c.peritoCedula || '',
        peritotelefono: c.peritoTelefono || '',
        peritoemail: c.peritoEmail || '',
        firmadigital: c.firmaDigital || '',
        esmuestra: isMuestra
      };
    }

    case 'evaluaciones_seguridad': {
      const e = data as SafetyEvaluationReport;
      const commonRfc = e.rfc || (e as any).titularRfc || '';
      return {
        id: String(e.id),
        folio: String(e.folio || ''),
        claveexpediente: e.claveExpediente || '',
        fechaevaluacion: e.fechaEvaluacion || '',
        razonsocial: e.razonSocial || '',
        nombrecomercial: e.nombreComercial || '',
        rfc: commonRfc,
        titularrfc: commonRfc,
        giro: e.giro || '',
        callenumero: e.calleNumero || '',
        colonia: e.colonia || '',
        municipio: e.municipio || '',
        ciudadestado: e.ciudadEstado || '',
        codigopostal: e.codigoPostal || '',
        telefono: e.telefono || '',
        representantelegal: e.representanteLegal || '',
        companiasuministradora: e.companiaSuministradora || '',
        noserviciorpu: e.noServicioRpu || '',
        tarifasuministro: e.tarifaSuministro || '',
        tensionsuministro: e.tensionSuministro || '',
        frecuenciahz: Number(e.frecuenciaHz) || 60,
        faseshilos: e.fasesHilos || '',
        tiposubestacion: e.tipoSubestacion || '',
        capacidadtransformadorkva: Number(e.capacidadTransformadorKva) || 0,
        marcanumeroserie: e.marcaNumeroSerie || '',
        tipoenfriamiento: e.tipoEnfriamiento || '',
        nivelestadoaceite: e.nivelEstadoAceite || '',
        proteccionfisicacercacandado: e.proteccionFisicaCercaCandado || '',
        electrodotierraconexion: e.electrodoTierraConexion || '',
        resistenciatierramedidaohms: Number(e.resistenciaTierraMedidaOhms) || 0,
        sistemapararrayosbajantes: e.sistemaPararrayosBajantes || '',
        gabinetetiponema: e.gabineteTipoNema || '',
        directoriocircuitosidentificado: e.directorioCircuitosIdentificado || '',
        cubiertafrontalproteccioncontacto: e.cubiertaFrontalProteccionContacto || '',
        espacioreservaespaciosvacios: e.espacioReservaEspaciosVacios || '',
        interruptorprincipalcapacidada: Number(e.interruptorPrincipalCapacidadA) || 0,
        coordinacionprotecciones: e.coordinacionProtecciones || '',
        proteccionfallatierragfci: e.proteccionFallaTierraGfci || '',
        estadointerruptorestermomagneticos: e.estadoInterruptoresTermomagneticos || '',
        tipoconductoraislamiento: e.tipoConductorAislamiento || '',
        codigocoloresnormativo: e.codigoColoresNormativo || '',
        canalizacionestuberiascharolas: e.canalizacionesTuberiasCharolas || '',
        factorllenadocanalizaciones: e.factorLlenadoCanalizaciones || '',
        espaciotrabajotableros: e.espacioTrabajoTableros || '',
        puertasaccesoescape: e.puertasAccesoEscape || '',
        senalesadvertenciariesgoelectrico: e.senalesAdvertenciaRiesgoElectrico || '',
        diagramaunifilaractualizado: e.diagramaUnifilarActualizado || '',
        tapetesdielectricosaislantes: e.tapetesDielectricosAislantes || '',
        iluminacionnormalyemergencia: e.iluminacionNormalYEmergencia || '',
        extintortipoco2pqscercano: e.extintorTipoCo2PqsCercano || '',
        disponibilidadeppdielectrico: e.disponibilidadEppDielectrico || '',
        mediciontensionfasesv: e.medicionTensionFasesV || '',
        pruebaaislamientomegger: e.pruebaAislamientoMegger || '',
        termografiainfrarroja: e.termografiaInfrarroja || '',
        evidencias: e.evidencias || [],
        noconformidadesdetectadas: e.noConformidadesDetectadas || '',
        medidascorrectivasinmediatas: e.medidasCorrectivasInmediatas || '',
        plazosubsanaciondias: Number(e.plazoSubsanacionDias) || 0,
        calificacionseguridad: e.calificacionSeguridad || '',
        peritonombre: e.peritoNombre || '',
        peritoafiliacion: e.peritoAfiliacion || '',
        peritocedula: e.peritoCedula || '',
        peritotelefono: e.peritoTelefono || '',
        peritoemail: e.peritoEmail || '',
        firmadigital: e.firmaDigital || '',
        esmuestra: isMuestra
      };
    }

    case 'mediciones_electricas': {
      const m = data as ElectricalMeasurementsReport;
      const commonRfc = m.rfc || (m as any).titularRfc || '';
      return {
        id: String(m.id),
        folio: String(m.folio || ''),
        claveexpediente: m.claveExpediente || '',
        fechamedicion: m.fechaMedicion || '',
        nombrerazonsocial: m.nombreRazonSocial || '',
        nombrecomercial: m.nombreComercial || '',
        rfc: commonRfc,
        titularrfc: commonRfc,
        domiciliocompleto: m.domicilioCompleto || '',
        municipioestado: m.municipioEstado || '',
        codigopostal: m.codigoPostal || '',
        telefono: m.telefono || '',
        solicitante: m.solicitante || '',
        solicitantetelefono: m.solicitanteTelefono || '',
        giro: m.giro || '',
        instrumentonombre: m.instrumentoNombre || '',
        instrumentomarca: m.instrumentoMarca || '',
        instrumentomodelo: m.instrumentoModelo || '',
        instrumentoserie: m.instrumentoSerie || '',
        instrumentocalibracion: m.instrumentoCalibracion || '',
        tensionf1f2: Number(m.tensionF1F2) || 0,
        tensionf2f3: Number(m.tensionF2F3) || 0,
        tensionf3f1: Number(m.tensionF3F1) || 0,
        tensionpromedioff: Number(m.tensionPromedioFF) || 0,
        tensionf1n: Number(m.tensionF1N) || 0,
        tensionf2n: Number(m.tensionF2N) || 0,
        tensionf3n: Number(m.tensionF3N) || 0,
        tensionpromediofn: Number(m.tensionPromedioFN) || 0,
        tensionnt: Number(m.tensionNT) || 0,
        evaluaciontension: m.evaluacionTension || '',
        corrientef1: Number(m.corrienteF1) || 0,
        corrientef2: Number(m.corrienteF2) || 0,
        corrientef3: Number(m.corrienteF3) || 0,
        corrienteneutro: Number(m.corrienteNeutro) || 0,
        desbalancecorrienteporcentaje: Number(m.desbalanceCorrientePorcentaje) || 0,
        evaluacioncorriente: m.evaluacionCorriente || '',
        potenciaactivakw: Number(m.potenciaActivaKw) || 0,
        potenciareactivakvar: Number(m.potenciaReactivaKvar) || 0,
        potenciaaparentekva: Number(m.potenciaAparenteKva) || 0,
        factorpotenciaf1: Number(m.factorPotenciaF1) || 0,
        factorpotenciaf2: Number(m.factorPotenciaF2) || 0,
        factorpotenciaf3: Number(m.factorPotenciaF3) || 0,
        factorpotenciatotal: Number(m.factorPotenciaTotal) || 0,
        capacidadsubestacionkva: Number(m.capacidadSubestacionKva) || 0,
        porcentajeutilizacioncapacidad: Number(m.porcentajeUtilizacionCapacidad) || 0,
        evaluacionfactorpotencia: m.evaluacionFactorPotencia || '',
        polaridadcontactos: m.polaridadContactos || '',
        pruebagfcidisparo: m.pruebaGfciDisparo || '',
        spatmetodo: m.spatMetodo || '',
        spatpuntomedicion: m.spatPuntoMedicion || '',
        spatresistenciamedidaohms: Number(m.spatResistenciaMedidaOhms) || 0,
        spatvalormaximopermitidoohms: Number(m.spatValorMaximoPermitidoOhms) || 0,
        spatdictamen: m.spatDictamen || '',
        descripciontecnica: m.descripcionTecnica || '',
        evidencias: m.evidencias || [],
        peritonombre: m.peritoNombre || '',
        peritoafiliacion: m.peritoAfiliacion || '',
        peritocedula: m.peritoCedula || '',
        peritotelefono: m.peritoTelefono || '',
        peritoemail: m.peritoEmail || '',
        firmadigital: m.firmaDigital || '',
        esmuestra: isMuestra
      };
    }

    case 'diagramas_unifilares': {
      const d = data as SingleLineDiagram;
      const commonRfc = d.titularRfc || (d as any).rfc || '';
      return {
        id: String(d.id),
        folio: String(d.folio || ''),
        claveexpediente: d.claveExpediente || '',
        titulo: d.titulo || '',
        fecha: d.fecha || '',
        titularnombrecomercial: d.titularNombreComercial || '',
        titularrazonsocial: d.titularRazonSocial || '',
        titularrfc: commonRfc,
        rfc: commonRfc,
        titulardireccion: d.titularDireccion || '',
        peritonombre: d.peritoNombre || '',
        peritoafiliacion: d.peritoAfiliacion || '',
        peritocedula: d.peritoCedula || '',
        imagendataurl: d.imagenDataUrl || '',
        orientacion: d.orientacion || 'horizontal',
        ajustemodo: d.ajusteModo || 'carta_completa',
        rotaciongrados: Number(d.rotacionGrados) || 0,
        notastecnicas: d.notasTecnicas || '',
        subestacionkva: Number(d.subestacionKva) || 0,
        tensionprimaria: d.tensionPrimaria || '',
        tensionsecundaria: d.tensionSecundaria || '',
        esmuestra: isMuestra
      };
    }

    case 'cedula_perito': {
      const c = data as PeritoCedula;
      return {
        id: String(c.id),
        peritonombre: c.peritoNombre || '',
        numerocedula: c.numeroCedula || '',
        profesion: c.profesion || '',
        institucionemisora: c.institucionEmisora || '',
        fechaexpedicion: c.fechaExpedicion || '',
        curp: c.curp || '',
        folioregistro: c.folioRegistro || '',
        imagendataurl: c.imagenDataUrl || '',
        anchocompleto: c.anchoCompleto !== undefined ? Boolean(c.anchoCompleto) : true,
        observaciones: c.observaciones || '',
        esmuestra: isMuestra
      };
    }

    case 'certificado_perito': {
      const cp = data as PeritoCertificado;
      return {
        id: String(cp.id),
        titulocertificado: cp.tituloCertificado || '',
        colegioemisor: cp.colegioEmisor || '',
        peritonombre: cp.peritoNombre || '',
        numeroregistro: cp.numeroRegistro || '',
        numerocedula: cp.numeroCedula || '',
        especialidad: cp.especialidad || '',
        vigencia: cp.vigencia || '',
        fechaemision: cp.fechaEmision || '',
        imagendataurl: cp.imagenDataUrl || '',
        ajustecompleto: cp.ajusteCompleto !== undefined ? Boolean(cp.ajusteCompleto) : true,
        observaciones: cp.observaciones || '',
        esmuestra: isMuestra
      };
    }

    default: {
      const out: any = {};
      for (const [k, v] of Object.entries(data)) {
        out[k.toLowerCase()] = v;
      }
      return out;
    }
  }
}

export function fromSupabaseRow(tableName: string, row: any): any {
  if (!row) return null;
  const isMuestra = Boolean(row.esmuestra ?? row.esMuestra ?? isSampleRecord(row.id, row.esmuestra));

  switch (tableName) {
    case 'revisiones_electricas': {
      return {
        id: row.id,
        folio: row.folio || '',
        claveExpediente: row.claveexpediente || row.claveExpediente || '',
        fecha: row.fecha || '',
        tipoInstalacionPrincipal: row.tipoinstalacionprincipal || row.tipoInstalacionPrincipal || '',
        giroInstalacion: row.giroinstalacion || row.giroInstalacion || '',
        tensionSuministro: row.tensionsuministro || row.tensionSuministro || '',
        clasificacionInstalacion: row.clasificacioninstalacion || row.clasificacionInstalacion || '',
        clasificacionOtroDetalle: row.clasificacionotrodetalle || row.clasificacionOtroDetalle || '',
        tipoServicio: row.tiposervicio || row.tipoServicio || '',
        capacidadSubestacionKva: Number(row.capacidadsubestacionkva ?? row.capacidadSubestacionKva ?? 0),
        cargaInstaladaKw: Number(row.cargainstaladakw ?? row.cargaInstaladaKw ?? 0),
        titularNombreComercial: row.titularnombrecomercial || row.titularNombreComercial || '',
        titularRazonSocial: row.titularrazonsocial || row.titularRazonSocial || '',
        titularRfc: row.titularrfc || row.rfc || row.titularRfc || '',
        titularCalleNumero: row.titularcallenumero || row.titularCalleNumero || '',
        titularColonia: row.titularcolonia || row.titularColonia || '',
        titularMunicipio: row.titularmunicipio || row.titularMunicipio || '',
        titularCiudadEstado: row.titularciudadestado || row.titularCiudadEstado || '',
        titularCodigoPostal: row.titularcodigopostal || row.titularCodigoPostal || '',
        titularTelefono: row.titulartelefono || row.titularTelefono || '',
        solicitanteNombre: row.solicitantenombre || row.solicitanteNombre || '',
        solicitanteTelefono: row.solicitantetelefono || row.solicitanteTelefono || '',
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        peritoAfiliacion: row.peritoafiliacion || row.peritoAfiliacion || '',
        peritoCedula: row.peritocedula || row.peritoCedula || '',
        peritoEmail: row.peritoemail || row.peritoEmail || '',
        peritoTelefono: row.peritotelefono || row.peritoTelefono || '',
        resultadoDictamen: row.resultadodictamen || row.resultadoDictamen || 'Favorable (Aprobado)',
        observaciones: row.observaciones || '',
        vigenciaHasta: row.vigenciahasta || row.vigenciaHasta || '',
        esMuestra: isMuestra,
        firmaDigital: row.firmadigital || row.firmaDigital || ''
      } as RevisionReport;
    }

    case 'agenda_citas': {
      return {
        id: row.id,
        clienteNombre: row.clientenombre || row.clienteNombre || '',
        representante: row.representante || '',
        recomendadoPor: row.recomendadopor || row.recomendadoPor || '',
        direccionEmpresa: row.direccionempresa || row.direccionEmpresa || '',
        telefonos: row.telefonos || '',
        whatsapp: row.whatsapp || '',
        correoElectronico: row.correoelectronico || row.correoElectronico || '',
        fechaCita: row.fechacita || row.fechaCita || '',
        horaCita: row.horacita || row.horaCita || '',
        duracionMinutos: Number(row.duracionminutos ?? row.duracionMinutos ?? 60),
        tipoServicio: row.tiposervicio || row.tipoServicio || 'Dictamen Pericial NOM-001-SEDE-2012',
        motivoNotas: row.motivonotas || row.motivoNotas || '',
        peritoAsignado: row.peritoasignado || row.peritoAsignado || 'Ing. Israel Orozco Arias',
        folioDictamenRelacionado: row.foliodictamenrelacionado || row.folioDictamenRelacionado || '',
        estado: row.estado || 'Programada',
        recordatorioMinutos: Number(row.recordatoriominutos ?? row.recordatorioMinutos ?? 30),
        esMuestra: isMuestra,
        createdAt: row.created_at || row.createdAt || new Date().toISOString(),
        updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
      } as Appointment;
    }

    case 'solicitudes_servicio': {
      return {
        id: row.id,
        folio: row.folio || '',
        fechaVisita: row.fechavisita || row.fechaVisita || '',
        peritoRegistroCfp: row.peritoregistrocfp || row.peritoRegistroCfp || '',
        peritoCedula: row.peritocedula || row.peritoCedula || '',
        peritoTelefono: row.peritotelefono || row.peritoTelefono || '',
        peritoEmail: row.peritoemail || row.peritoEmail || '',
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        nombreComercial: row.nombrecomercial || row.nombreComercial || '',
        nombreRazonSocial: row.nombrerazonsocial || row.nombreRazonSocial || '',
        rfc: row.rfc || row.titularrfc || row.titularRfc || '',
        calleNumero: row.callenumero || row.calleNumero || '',
        coloniaPoblacion: row.coloniapoblacion || row.coloniaPoblacion || '',
        municipioDelegacion: row.municipiodelegacion || row.municipioDelegacion || '',
        ciudadEstado: row.ciudadestado || row.ciudadEstado || '',
        codigoPostal: row.codigopostal || row.codigoPostal || '',
        telefonoInstalacion: row.telefonoinstalacion || row.telefonoInstalacion || '',
        solicitanteNombre: row.solicitantenombre || row.solicitanteNombre || '',
        solicitanteTelefono: row.solicitantetelefono || row.solicitanteTelefono || '',
        fotoReferencia: row.fotoreferencia || row.fotoReferencia || '',
        evidencias: Array.isArray(row.evidencias) ? row.evidencias : [],
        firmaPerito: row.firmaperito || row.firmaPerito || '',
        firmaSolicitante: row.firmasolicitante || row.firmaSolicitante || '',
        esMuestra: isMuestra
      } as ServiceRequest;
    }

    case 'condiciones_operativas': {
      return {
        id: row.id,
        folio: row.folio || '',
        claveExpediente: row.claveexpediente || row.claveExpediente || '',
        fechaInspeccion: row.fechainspeccion || row.fechaInspeccion || '',
        nombreComercial: row.nombrecomercial || row.nombreComercial || '',
        razonSocial: row.razonsocial || row.razonSocial || '',
        rfc: row.rfc || row.titularrfc || '',
        giro: row.giro || '',
        calleNumero: row.callenumero || row.calleNumero || '',
        colonia: row.colonia || '',
        municipio: row.municipio || '',
        ciudadEstado: row.ciudadestado || row.ciudadEstado || '',
        codigoPostal: row.codigopostal || row.codigoPostal || '',
        telefono: row.telefono || '',
        contacto: row.contacto || '',
        tipoInstalacion: row.tipoinstalacion || row.tipoInstalacion || '',
        tensionOperacion: row.tensionoperacion || row.tensionOperacion || '',
        capacidadTransformadorKva: Number(row.capacidadtransformadorkva ?? row.capacidadTransformadorKva ?? 0),
        demandaMedidaKw: Number(row.demandamedidakw ?? row.demandaMedidaKw ?? 0),
        resistenciaTierraOhms: Number(row.resistenciatierraohms ?? row.resistenciaTierraOhms ?? 0),
        estadoSubestacion: row.estadosubestacion || row.estadoSubestacion || 'Satisfactorio',
        estadoTableros: row.estadotableros || row.estadoTableros || 'Satisfactorio',
        estadoConductoresCanalizaciones: row.estadoconductorescanalizaciones || row.estadoConductoresCanalizaciones || 'Satisfactorio',
        estadoSistemaTierras: row.estadosistematierras || row.estadoSistemaTierras || 'Satisfactorio',
        estadoProteccionesSobrecarga: row.estadoproteccionessobrecarga || row.estadoProteccionesSobrecarga || 'Satisfactorio',
        estadoAlumbradoEmergencia: row.estadoalumbradoemergencia || row.estadoAlumbradoEmergencia || 'Satisfactorio',
        programaMantenimientoVigente: Boolean(row.programamantenimientovigente ?? row.programaMantenimientoVigente),
        ultimoMantenimientoFecha: row.ultimomantenimientofecha || row.ultimoMantenimientoFecha || '',
        responsableMantenimiento: row.responsablemantenimiento || row.responsableMantenimiento || '',
        pruebasAislamientoMegger: row.pruebasaislamientomegger || row.pruebasAislamientoMegger || 'Conforme',
        pruebasTermografiaInfrarroja: row.pruebastermografiainfrarroja || row.pruebasTermografiaInfrarroja || 'Sin Puntos Calientes',
        limpiezaOrdenCuartoElectrico: row.limpiezaordencuartoelectrico || row.limpiezaOrdenCuartoElectrico || 'Excelente',
        equipoProteccionPersonalYRotulacion: row.equipoproteccionpersonalyrotulacion || row.equipoProteccionPersonalYRotulacion || 'Completo',
        dictamenCondiciones: row.dictamencondiciones || row.dictamenCondiciones || 'Condición Operativa Satisfactoria (Aprobada)',
        plazoCorreccionDias: Number(row.plazocorrecciondias ?? row.plazoCorreccionDias ?? 0),
        accionesRequeridas: row.accionesrequeridas || row.accionesRequeridas || '',
        notasRecomendaciones: row.notasrecomendaciones || row.notasRecomendaciones || '',
        evidencias: Array.isArray(row.evidencias) ? row.evidencias : [],
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        peritoAfiliacion: row.peritoafiliacion || row.peritoAfiliacion || '',
        peritoCedula: row.peritocedula || row.peritoCedula || '',
        peritoTelefono: row.peritotelefono || row.peritoTelefono || '',
        peritoEmail: row.peritoemail || row.peritoEmail || '',
        firmaDigital: row.firmadigital || row.firmaDigital || '',
        esMuestra: isMuestra
      } as OperatingConditionsReport;
    }

    case 'evaluaciones_seguridad': {
      return {
        id: row.id,
        folio: row.folio || '',
        claveExpediente: row.claveexpediente || row.claveExpediente || '',
        fechaEvaluacion: row.fechaevaluacion || row.fechaEvaluacion || '',
        razonSocial: row.razonsocial || row.razonSocial || '',
        nombreComercial: row.nombrecomercial || row.nombreComercial || '',
        rfc: row.rfc || row.titularrfc || '',
        giro: row.giro || '',
        calleNumero: row.callenumero || row.calleNumero || '',
        colonia: row.colonia || '',
        municipio: row.municipio || '',
        ciudadEstado: row.ciudadestado || row.ciudadEstado || '',
        codigoPostal: row.codigopostal || row.codigoPostal || '',
        telefono: row.telefono || '',
        representanteLegal: row.representantelegal || row.representanteLegal || '',
        companiaSuministradora: row.companiasuministradora || row.companiaSuministradora || '',
        noServicioRpu: row.noserviciorpu || row.noServicioRpu || '',
        tarifaSuministro: row.tarifasuministro || row.tarifaSuministro || '',
        tensionSuministro: row.tensionsuministro || row.tensionSuministro || '',
        frecuenciaHz: Number(row.frecuenciahz ?? row.frecuenciaHz ?? 60),
        fasesHilos: row.faseshilos || row.fasesHilos || '',
        tipoSubestacion: row.tiposubestacion || row.tipoSubestacion || '',
        capacidadTransformadorKva: Number(row.capacidadtransformadorkva ?? row.capacidadTransformadorKva ?? 0),
        marcaNumeroSerie: row.marcanumeroserie || row.marcaNumeroSerie || '',
        tipoEnfriamiento: row.tipoenfriamiento || row.tipoEnfriamiento || '',
        nivelEstadoAceite: row.nivelestadoaceite || row.nivelEstadoAceite || '',
        proteccionFisicaCercaCandado: row.proteccionfisicacercacandado || row.proteccionFisicaCercaCandado || '',
        electrodoTierraConexion: row.electrodotierraconexion || row.electrodoTierraConexion || '',
        resistenciaTierraMedidaOhms: Number(row.resistenciatierramedidaohms ?? row.resistenciaTierraMedidaOhms ?? 0),
        sistemaPararrayosBajantes: row.sistemapararrayosbajantes || row.sistemaPararrayosBajantes || '',
        gabineteTipoNema: row.gabinetetiponema || row.gabineteTipoNema || '',
        directorioCircuitosIdentificado: row.directoriocircuitosidentificado || row.directorioCircuitosIdentificado || '',
        cubiertaFrontalProteccionContacto: row.cubiertafrontalproteccioncontacto || row.cubiertaFrontalProteccionContacto || '',
        espacioReservaEspaciosVacios: row.espacioreservaespaciosvacios || row.espacioReservaEspaciosVacios || '',
        interruptorPrincipalCapacidadA: Number(row.interruptorprincipalcapacidada ?? row.interruptorPrincipalCapacidadA ?? 0),
        coordinacionProtecciones: row.coordinacionprotecciones || row.coordinacionProtecciones || '',
        proteccionFallaTierraGfci: row.proteccionfallatierragfci || row.proteccionFallaTierraGfci || '',
        estadoInterruptoresTermomagneticos: row.estadointerruptorestermomagneticos || row.estadoInterruptoresTermomagneticos || '',
        tipoConductorAislamiento: row.tipoconductoraislamiento || row.tipoConductorAislamiento || '',
        codigoColoresNormativo: row.codigocoloresnormativo || row.codigoColoresNormativo || '',
        canalizacionesTuberiasCharolas: row.canalizacionestuberiascharolas || row.canalizacionesTuberiasCharolas || '',
        factorLlenadoCanalizaciones: row.factorllenadocanalizaciones || row.factorLlenadoCanalizaciones || '',
        espacioTrabajoTableros: row.espaciotrabajotableros || row.espacioTrabajoTableros || '',
        puertasAccesoEscape: row.puertasaccesoescape || row.puertasAccesoEscape || '',
        senalesAdvertenciaRiesgoElectrico: row.senalesadvertenciariesgoelectrico || row.senalesAdvertenciaRiesgoElectrico || '',
        diagramaUnifilarActualizado: row.diagramaunifilaractualizado || row.diagramaUnifilarActualizado || '',
        tapetesDielectricosAislantes: row.tapetesdielectricosaislantes || row.tapetesDielectricosAislantes || '',
        iluminacionNormalYEmergencia: row.iluminacionnormalyemergencia || row.iluminacionNormalYEmergencia || '',
        extintorTipoCo2PqsCercano: row.extintortipoco2pqscercano || row.extintorTipoCo2PqsCercano || '',
        disponibilidadEppDielectrico: row.disponibilidadeppdielectrico || row.disponibilidadEppDielectrico || '',
        medicionTensionFasesV: row.mediciontensionfasesv || row.medicionTensionFasesV || '',
        pruebaAislamientoMegger: row.pruebaaislamientomegger || row.pruebaAislamientoMegger || '',
        termografiaInfrarroja: row.termografiainfrarroja || row.termografiaInfrarroja || '',
        evidencias: Array.isArray(row.evidencias) ? row.evidencias : [],
        noConformidadesDetectadas: row.noconformidadesdetectadas || row.noConformidadesDetectadas || '',
        medidasCorrectivasInmediatas: row.medidascorrectivasinmediatas || row.medidasCorrectivasInmediatas || '',
        plazoSubsanacionDias: Number(row.plazosubsanaciondias ?? row.plazoSubsanacionDias ?? 0),
        calificacionSeguridad: row.calificacionseguridad || row.calificacionSeguridad || 'Instalación Eléctrica Segura (Aprobada)',
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        peritoAfiliacion: row.peritoafiliacion || row.peritoAfiliacion || '',
        peritoCedula: row.peritocedula || row.peritoCedula || '',
        peritoTelefono: row.peritotelefono || row.peritoTelefono || '',
        peritoEmail: row.peritoemail || row.peritoEmail || '',
        firmaDigital: row.firmadigital || row.firmaDigital || '',
        esMuestra: isMuestra
      } as SafetyEvaluationReport;
    }

    case 'mediciones_electricas': {
      return {
        id: row.id,
        folio: row.folio || '',
        claveExpediente: row.claveexpediente || row.claveExpediente || '',
        fechaMedicion: row.fechamedicion || row.fechaMedicion || '',
        nombreRazonSocial: row.nombrerazonsocial || row.nombreRazonSocial || '',
        nombreComercial: row.nombrecomercial || row.nombreComercial || '',
        rfc: row.rfc || row.titularrfc || '',
        domicilioCompleto: row.domiciliocompleto || row.domicilioCompleto || '',
        municipioEstado: row.municipioestado || row.municipioEstado || '',
        codigoPostal: row.codigopostal || row.codigoPostal || '',
        telefono: row.telefono || '',
        solicitante: row.solicitante || '',
        solicitanteTelefono: row.solicitantetelefono || row.solicitanteTelefono || '',
        giro: row.giro || '',
        instrumentoNombre: row.instrumentonombre || row.instrumentoNombre || '',
        instrumentoMarca: row.instrumentomarca || row.instrumentoMarca || '',
        instrumentoModelo: row.instrumentomodelo || row.instrumentoModelo || '',
        instrumentoSerie: row.instrumentoserie || row.instrumentoSerie || '',
        instrumentoCalibracion: row.instrumentocalibracion || row.instrumentoCalibracion || '',
        tensionF1F2: Number(row.tensionf1f2 ?? row.tensionF1F2 ?? 0),
        tensionF2F3: Number(row.tensionf2f3 ?? row.tensionF2F3 ?? 0),
        tensionF3F1: Number(row.tensionf3f1 ?? row.tensionF3F1 ?? 0),
        tensionPromedioFF: Number(row.tensionpromedioff ?? row.tensionPromedioFF ?? 0),
        tensionF1N: Number(row.tensionf1n ?? row.tensionF1N ?? 0),
        tensionF2N: Number(row.tensionf2n ?? row.tensionF2N ?? 0),
        tensionF3N: Number(row.tensionf3n ?? row.tensionF3N ?? 0),
        tensionPromedioFN: Number(row.tensionpromediofn ?? row.tensionPromedioFN ?? 0),
        tensionNT: Number(row.tensionnt ?? row.tensionNT ?? 0),
        evaluacionTension: row.evaluaciontension || row.evaluacionTension || '',
        corrienteF1: Number(row.corrientef1 ?? row.corrienteF1 ?? 0),
        corrienteF2: Number(row.corrientef2 ?? row.corrienteF2 ?? 0),
        corrienteF3: Number(row.corrientef3 ?? row.corrienteF3 ?? 0),
        corrienteNeutro: Number(row.corrienteneutro ?? row.corrienteNeutro ?? 0),
        desbalanceCorrientePorcentaje: Number(row.desbalancecorrienteporcentaje ?? row.desbalanceCorrientePorcentaje ?? 0),
        evaluacionCorriente: row.evaluacioncorriente || row.evaluacionCorriente || '',
        potenciaActivaKw: Number(row.potenciaactivakw ?? row.potenciaActivaKw ?? 0),
        potenciaReactivaKvar: Number(row.potenciareactivakvar ?? row.potenciaReactivaKvar ?? 0),
        potenciaAparenteKva: Number(row.potenciaaparentekva ?? row.potenciaAparenteKva ?? 0),
        factorPotenciaF1: Number(row.factorpotenciaf1 ?? row.factorPotenciaF1 ?? 0),
        factorPotenciaF2: Number(row.factorpotenciaf2 ?? row.factorPotenciaF2 ?? 0),
        factorPotenciaF3: Number(row.factorpotenciaf3 ?? row.factorPotenciaF3 ?? 0),
        factorPotenciaTotal: Number(row.factorpotenciatotal ?? row.factorPotenciaTotal ?? 0),
        capacidadSubestacionKva: Number(row.capacidadsubestacionkva ?? row.capacidadSubestacionKva ?? 0),
        porcentajeUtilizacionCapacidad: Number(row.porcentajeutilizacioncapacidad ?? row.porcentajeUtilizacionCapacidad ?? 0),
        evaluacionFactorPotencia: row.evaluacionfactorpotencia || row.evaluacionFactorPotencia || '',
        polaridadContactos: row.polaridadcontactos || row.polaridadContactos || '',
        pruebaGfciDisparo: row.pruebagfcidisparo || row.pruebaGfciDisparo || '',
        spatMetodo: row.spatmetodo || row.spatMetodo || '',
        spatPuntoMedicion: row.spatpuntomedicion || row.spatPuntoMedicion || '',
        spatResistenciaMedidaOhms: Number(row.spatresistenciamedidaohms ?? row.spatResistenciaMedidaOhms ?? 0),
        spatValorMaximoPermitidoOhms: Number(row.spatvalormaximopermitidoohms ?? row.spatValorMaximoPermitidoOhms ?? 0),
        spatDictamen: row.spatdictamen || row.spatDictamen || '',
        descripcionTecnica: row.descripciontecnica || row.descripcionTecnica || '',
        evidencias: Array.isArray(row.evidencias) ? row.evidencias : [],
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        peritoAfiliacion: row.peritoafiliacion || row.peritoAfiliacion || '',
        peritoCedula: row.peritocedula || row.peritoCedula || '',
        peritoTelefono: row.peritotelefono || row.peritoTelefono || '',
        peritoEmail: row.peritoemail || row.peritoEmail || '',
        firmaDigital: row.firmadigital || row.firmaDigital || '',
        esMuestra: isMuestra
      } as ElectricalMeasurementsReport;
    }

    case 'diagramas_unifilares': {
      return {
        id: row.id,
        folio: row.folio || '',
        claveExpediente: row.claveexpediente || row.claveExpediente || '',
        titulo: row.titulo || '',
        fecha: row.fecha || '',
        titularNombreComercial: row.titularnombrecomercial || row.titularNombreComercial || '',
        titularRazonSocial: row.titularrazonsocial || row.titularRazonSocial || '',
        titularRfc: row.titularrfc || row.rfc || '',
        titularDireccion: row.titulardireccion || row.titularDireccion || '',
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        peritoAfiliacion: row.peritoafiliacion || row.peritoAfiliacion || '',
        peritoCedula: row.peritocedula || row.peritoCedula || '',
        imagenDataUrl: row.imagendataurl || row.imagenDataUrl || '',
        orientacion: row.orientacion || 'horizontal',
        ajusteModo: row.ajustemodo || row.ajusteModo || 'carta_completa',
        rotacionGrados: Number(row.rotaciongrados ?? row.rotacionGrados ?? 0),
        notasTecnicas: row.notastecnicas || row.notasTecnicas || '',
        subestacionKva: Number(row.subestacionkva ?? row.subestacionKva ?? 0),
        tensionPrimaria: row.tensionprimaria || row.tensionPrimaria || '',
        tensionSecundaria: row.tensionsecundaria || row.tensionSecundaria || '',
        esMuestra: isMuestra
      } as SingleLineDiagram;
    }

    case 'cedula_perito': {
      return {
        id: row.id,
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        numeroCedula: row.numerocedula || row.numeroCedula || '',
        profesion: row.profesion || '',
        institucionEmisora: row.institucionemisora || row.institucionEmisora || '',
        fechaExpedicion: row.fechaexpedicion || row.fechaExpedicion || '',
        curp: row.curp || '',
        folioRegistro: row.folioregistro || row.folioRegistro || '',
        imagenDataUrl: row.imagendataurl || row.imagenDataUrl || '',
        anchoCompleto: row.anchocompleto !== undefined ? Boolean(row.anchocompleto) : true,
        observaciones: row.observaciones || '',
        esMuestra: isMuestra
      } as PeritoCedula;
    }

    case 'certificado_perito': {
      return {
        id: row.id,
        tituloCertificado: row.titulocertificado || row.tituloCertificado || '',
        colegioEmisor: row.colegioemisor || row.colegioEmisor || '',
        peritoNombre: row.peritonombre || row.peritoNombre || '',
        numeroRegistro: row.numeroregistro || row.numeroRegistro || '',
        numeroCedula: row.numerocedula || row.numeroCedula || '',
        especialidad: row.especialidad || '',
        vigencia: row.vigencia || '',
        fechaEmision: row.fechaemision || row.fechaEmision || '',
        imagenDataUrl: row.imagendataurl || row.imagenDataUrl || '',
        ajusteCompleto: row.ajustecompleto !== undefined ? Boolean(row.ajustecompleto) : true,
        observaciones: row.observaciones || '',
        esMuestra: isMuestra
      } as PeritoCertificado;
    }

    default:
      return row;
  }
}

// ==========================================
// OPERACIONES CRUD REMOTAS EN SUPABASE
// ==========================================

export async function saveReportToSupabase(
  report: RevisionReport, 
  customSettings?: SupabaseSettings
): Promise<{ success: boolean; message: string }> {
  return syncRecordToSupabaseTable(SUPABASE_TABLES.REVISIONES, report, customSettings);
}

export async function deleteReportsFromSupabase(
  ids: string[], 
  customSettings?: SupabaseSettings
): Promise<{ success: boolean; message: string }> {
  return deleteRecordsFromSupabaseTable(SUPABASE_TABLES.REVISIONES, ids, customSettings);
}

export async function wipeSupabaseRecords(settings: SupabaseSettings): Promise<{ success: boolean; message: string }> {
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'URL o Clave Anónima de Supabase no configurada.' };
  }

  try {
    const cleanUrl = normalizeSupabaseUrl(settings.url);
    const endpoint = `${cleanUrl}/rest/v1/${settings.tableName || 'revisiones_electricas'}?id=neq.none`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'apikey': settings.anonKey,
        'Authorization': `Bearer ${settings.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });

    if (response.ok || response.status === 204 || response.status === 200) {
      return { success: true, message: 'Todos los registros fueron eliminados correctamente en la tabla de Supabase.' };
    } else {
      const errorText = await response.text();
      return { success: false, message: `Supabase respondió con estado ${response.status}: ${errorText || 'Error de permisos o tabla'}` };
    }
  } catch (err: any) {
    return { success: false, message: `Error de red al conectar con Supabase: ${err.message || err}` };
  }
}

export async function syncReportsToSupabase(reports: RevisionReport[], settings: SupabaseSettings): Promise<{ success: boolean; message: string }> {
  return syncRecordToSupabaseTable(SUPABASE_TABLES.REVISIONES, reports, settings);
}

// ==========================================
// SUPABASE: DEFINICIÓN DE TODAS LAS 9 TABLAS
// ==========================================
export const SUPABASE_TABLES = {
  REVISIONES: 'revisiones_electricas',
  SOLICITUDES: 'solicitudes_servicio',
  CONDICIONES: 'condiciones_operativas',
  EVALUACIONES: 'evaluaciones_seguridad',
  MEDICIONES: 'mediciones_electricas',
  DIAGRAMAS: 'diagramas_unifilares',
  CEDULA: 'cedula_perito',
  CERTIFICADO: 'certificado_perito',
  AGENDA: 'agenda_citas',
} as const;

export interface SupabaseTableStatus {
  name: string;
  tableName: string;
  exists: boolean;
  count: number;
  description: string;
}

export async function syncRecordToSupabaseTable(
  tableName: string,
  recordOrRecords: any,
  customSettings?: SupabaseSettings
): Promise<{ success: boolean; message: string }> {
  const settings = customSettings || getSupabaseSettings();
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'Supabase no configurado' };
  }

  try {
    const baseUrl = normalizeSupabaseUrl(settings.url);
    const endpoint = `${baseUrl}/rest/v1/${tableName}`;
    const rawPayload = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords];

    // Mapear cada registro usando toSupabaseRow para garantizar compatibilidad con columnas de PostgreSQL
    const payload = rawPayload.map(item => toSupabaseRow(tableName, item));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': settings.anonKey,
        'Authorization': `Bearer ${settings.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 201 || response.status === 200 || response.status === 204) {
      const updatedSettings = { ...settings, connected: true, lastSync: new Date().toISOString() };
      saveSupabaseSettings(updatedSettings);
      return { success: true, message: `Registro guardado en ${tableName} correctamente en Supabase.` };
    } else {
      const err = await response.text();
      return { success: false, message: `Error Supabase (${tableName}) status ${response.status}: ${err}` };
    }
  } catch (err: any) {
    return { success: false, message: `Error de red al sincronizar con ${tableName}: ${err.message || err}` };
  }
}

export async function deleteRecordsFromSupabaseTable(
  tableName: string,
  ids: string[],
  customSettings?: SupabaseSettings
): Promise<{ success: boolean; message: string }> {
  if (ids.length === 0) return { success: true, message: 'Ningún registro seleccionado' };
  const settings = customSettings || getSupabaseSettings();
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'Supabase no configurado' };
  }

  try {
    const baseUrl = normalizeSupabaseUrl(settings.url);
    const endpoint = ids.length === 1
      ? `${baseUrl}/rest/v1/${tableName}?id=eq.${encodeURIComponent(ids[0])}`
      : `${baseUrl}/rest/v1/${tableName}?id=in.(${ids.map(id => encodeURIComponent(id)).join(',')})`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'apikey': settings.anonKey,
        'Authorization': `Bearer ${settings.anonKey}`,
        'Prefer': 'return=minimal'
      }
    });

    if (response.ok || response.status === 204 || response.status === 200) {
      return { success: true, message: `Se eliminaron ${ids.length} registros en ${tableName} de Supabase.` };
    } else {
      const err = await response.text();
      return { success: false, message: `Supabase status ${response.status}: ${err}` };
    }
  } catch (err: any) {
    return { success: false, message: `Error al eliminar en ${tableName}: ${err.message || err}` };
  }
}

/**
 * Elimina definitivamente los registros de muestra en TODAS las 9 tablas de Supabase
 */
export async function clearSampleDataFromSupabase(
  customSettings?: SupabaseSettings
): Promise<{ success: boolean; message: string; deletedTables: number }> {
  const settings = customSettings || getSupabaseSettings();
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'Supabase no configurado', deletedTables: 0 };
  }

  const baseUrl = normalizeSupabaseUrl(settings.url);
  const tables = Object.values(SUPABASE_TABLES);
  let deletedCount = 0;

  const sampleIdsList = Array.from(KNOWN_SAMPLE_IDS).map(id => encodeURIComponent(id)).join(',');

  for (const table of tables) {
    try {
      // 1. Borrar por esmuestra = true
      await fetch(`${baseUrl}/rest/v1/${table}?esmuestra=eq.true`, {
        method: 'DELETE',
        headers: {
          'apikey': settings.anonKey,
          'Authorization': `Bearer ${settings.anonKey}`,
          'Prefer': 'return=minimal'
        }
      });

      // 2. Borrar por IDs de muestra conocidos
      await fetch(`${baseUrl}/rest/v1/${table}?id=in.(${sampleIdsList})`, {
        method: 'DELETE',
        headers: {
          'apikey': settings.anonKey,
          'Authorization': `Bearer ${settings.anonKey}`,
          'Prefer': 'return=minimal'
        }
      });

      deletedCount++;
    } catch (e) {
      console.warn(`[Supabase Clear Sample] Advertencia al purgar ${table}:`, e);
    }
  }

  return {
    success: true,
    message: 'Registros de muestra purgados en Supabase exitosamente.',
    deletedTables: deletedCount
  };
}

/**
 * Carga todos los registros reales desde Supabase y los sincroniza en la memoria local
 */
export async function loadAllFromSupabase(
  customSettings?: SupabaseSettings
): Promise<{
  success: boolean;
  message: string;
  data: {
    reports: RevisionReport[];
    serviceRequests: ServiceRequest[];
    operatingConditions: OperatingConditionsReport[];
    safetyEvaluations: SafetyEvaluationReport[];
    electricalMeasurements: ElectricalMeasurementsReport[];
    diagrams: SingleLineDiagram[];
    cedula: PeritoCedula | null;
    certificado: PeritoCertificado | null;
    appointments: Appointment[];
  };
}> {
  const settings = customSettings || getSupabaseSettings();
  const fallback = {
    reports: getRevisionReports(),
    serviceRequests: getServiceRequests(),
    operatingConditions: getOperatingConditionsReports(),
    safetyEvaluations: getSafetyEvaluations(),
    electricalMeasurements: getElectricalMeasurements(),
    diagrams: getSingleLineDiagrams(),
    cedula: getPeritoCedula(),
    certificado: getPeritoCertificado(),
    appointments: getAppointments(),
  };

  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'Supabase no configurado', data: fallback };
  }

  const hideDemo = isDemoDataHidden();
  const baseUrl = normalizeSupabaseUrl(settings.url);

  const fetchTable = async (table: string): Promise<any[]> => {
    try {
      const res = await fetch(`${baseUrl}/rest/v1/${table}?select=*`, {
        headers: {
          'apikey': settings.anonKey,
          'Authorization': `Bearer ${settings.anonKey}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        return Array.isArray(rows) ? rows : [];
      }
      return [];
    } catch {
      return [];
    }
  };

  try {
    const [
      rawRev,
      rawSrv,
      rawCond,
      rawEval,
      rawMed,
      rawDiag,
      rawCed,
      rawCert,
      rawAgenda
    ] = await Promise.all([
      fetchTable(SUPABASE_TABLES.REVISIONES),
      fetchTable(SUPABASE_TABLES.SOLICITUDES),
      fetchTable(SUPABASE_TABLES.CONDICIONES),
      fetchTable(SUPABASE_TABLES.EVALUACIONES),
      fetchTable(SUPABASE_TABLES.MEDICIONES),
      fetchTable(SUPABASE_TABLES.DIAGRAMAS),
      fetchTable(SUPABASE_TABLES.CEDULA),
      fetchTable(SUPABASE_TABLES.CERTIFICADO),
      fetchTable(SUPABASE_TABLES.AGENDA),
    ]);

    // Deserializar cada tabla
    const filterSample = (item: any) => {
      if (!hideDemo) return true;
      return !item.esMuestra && !KNOWN_SAMPLE_IDS.has(item.id);
    };

    const parsedReports: RevisionReport[] = rawRev
      .map(r => fromSupabaseRow(SUPABASE_TABLES.REVISIONES, r))
      .filter(filterSample);

    const parsedSrv: ServiceRequest[] = rawSrv
      .map(s => fromSupabaseRow(SUPABASE_TABLES.SOLICITUDES, s))
      .filter(filterSample);

    const parsedCond: OperatingConditionsReport[] = rawCond
      .map(c => fromSupabaseRow(SUPABASE_TABLES.CONDICIONES, c))
      .filter(filterSample);

    const parsedEval: SafetyEvaluationReport[] = rawEval
      .map(e => fromSupabaseRow(SUPABASE_TABLES.EVALUACIONES, e))
      .filter(filterSample);

    const parsedMed: ElectricalMeasurementsReport[] = rawMed
      .map(m => fromSupabaseRow(SUPABASE_TABLES.MEDICIONES, m))
      .filter(filterSample);

    const parsedDiag: SingleLineDiagram[] = rawDiag
      .map(d => fromSupabaseRow(SUPABASE_TABLES.DIAGRAMAS, d))
      .filter(filterSample);

    const parsedCedList: PeritoCedula[] = rawCed
      .map(c => fromSupabaseRow(SUPABASE_TABLES.CEDULA, c))
      .filter(filterSample);

    const parsedCertList: PeritoCertificado[] = rawCert
      .map(cp => fromSupabaseRow(SUPABASE_TABLES.CERTIFICADO, cp))
      .filter(filterSample);

    const parsedAgenda: Appointment[] = rawAgenda
      .map(a => fromSupabaseRow(SUPABASE_TABLES.AGENDA, a))
      .filter(filterSample);

    // Si Supabase contiene registros, los fusionamos en localStorage para acceso offline
    if (parsedReports.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(parsedReports));
    }
    if (parsedSrv.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify(parsedSrv));
    }
    if (parsedCond.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify(parsedCond));
    }
    if (parsedEval.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify(parsedEval));
    }
    if (parsedMed.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify(parsedMed));
    }
    if (parsedDiag.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify(parsedDiag));
    }
    if (parsedCedList.length > 0) {
      localStorage.setItem(STORAGE_KEY_PERITO_CEDULA, JSON.stringify(parsedCedList[0]));
    }
    if (parsedCertList.length > 0) {
      localStorage.setItem(STORAGE_KEY_PERITO_CERTIFICADO, JSON.stringify(parsedCertList[0]));
    }
    if (parsedAgenda.length > 0 || hideDemo) {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(parsedAgenda));
    }

    const updatedSettings = { ...settings, connected: true, lastSync: new Date().toISOString() };
    saveSupabaseSettings(updatedSettings);

    return {
      success: true,
      message: 'Datos cargados y sincronizados desde Supabase.',
      data: {
        reports: parsedReports.length > 0 || hideDemo ? parsedReports : fallback.reports,
        serviceRequests: parsedSrv.length > 0 || hideDemo ? parsedSrv : fallback.serviceRequests,
        operatingConditions: parsedCond.length > 0 || hideDemo ? parsedCond : fallback.operatingConditions,
        safetyEvaluations: parsedEval.length > 0 || hideDemo ? parsedEval : fallback.safetyEvaluations,
        electricalMeasurements: parsedMed.length > 0 || hideDemo ? parsedMed : fallback.electricalMeasurements,
        diagrams: parsedDiag.length > 0 || hideDemo ? parsedDiag : fallback.diagrams,
        cedula: parsedCedList.length > 0 ? parsedCedList[0] : fallback.cedula,
        certificado: parsedCertList.length > 0 ? parsedCertList[0] : fallback.certificado,
        appointments: parsedAgenda.length > 0 || hideDemo ? parsedAgenda : fallback.appointments,
      }
    };
  } catch (err: any) {
    return { success: false, message: `Fallo al leer de Supabase: ${err.message || err}`, data: fallback };
  }
}

export async function checkAllSupabaseTables(customSettings?: SupabaseSettings): Promise<SupabaseTableStatus[]> {
  const settings = customSettings || getSupabaseSettings();
  const tables = [
    { name: '1. Dictámenes Eléctricos', tableName: 'revisiones_electricas', description: 'Revisión y Dictámenes NOM-001' },
    { name: '2. Solicitudes de Servicio', tableName: 'solicitudes_servicio', description: 'Solicitudes y Levantamientos' },
    { name: '3. Condiciones Operativas', tableName: 'condiciones_operativas', description: 'Inspección de Subestación y Tierras' },
    { name: '4. Evaluaciones de Seguridad', tableName: 'evaluaciones_seguridad', description: 'Evaluación Técnica Páginas 5-8' },
    { name: '5. Mediciones Eléctricas', tableName: 'mediciones_electricas', description: 'Variables Eléctricas y SPAT Página 9' },
    { name: '6. Diagramas Unifilares', tableName: 'diagramas_unifilares', description: 'Diagramas Unifilares en Tamaño Carta' },
    { name: '7. Cédula del Perito', tableName: 'cedula_perito', description: 'Cédula Profesional DGP-SEP' },
    { name: '8. Certificado de Perito', tableName: 'certificado_perito', description: 'Acreditación Oficial Pericial CFP' },
    { name: '9. Agenda de Citas', tableName: 'agenda_citas', description: 'Citas y Visitas Técnicas de Inspección' },
  ];

  if (!settings.url || !settings.anonKey) {
    return tables.map(t => ({ ...t, exists: false, count: 0 }));
  }

  const baseUrl = normalizeSupabaseUrl(settings.url);

  const results = await Promise.all(
    tables.map(async (t) => {
      try {
        const endpoint = `${baseUrl}/rest/v1/${t.tableName}?select=count`;
        const res = await fetch(endpoint, {
          method: 'HEAD',
          headers: {
            'apikey': settings.anonKey,
            'Authorization': `Bearer ${settings.anonKey}`,
            'Prefer': 'count=exact'
          }
        });

        if (res.ok) {
          const contentRange = res.headers.get('content-range');
          let count = 0;
          if (contentRange) {
            const parts = contentRange.split('/');
            if (parts[1]) count = parseInt(parts[1], 10) || 0;
          }
          return { ...t, exists: true, count };
        } else {
          return { ...t, exists: false, count: 0 };
        }
      } catch {
        return { ...t, exists: false, count: 0 };
      }
    })
  );

  return results;
}

export async function syncAllModulesToSupabase(customSettings?: SupabaseSettings): Promise<{ success: boolean; message: string; details: string[] }> {
  const settings = customSettings || getSupabaseSettings();
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'Supabase no configurado.', details: [] };
  }

  const details: string[] = [];
  try {
    // 1. Revisiones
    const rev = getRevisionReports();
    await syncReportsToSupabase(rev, settings);
    details.push(`revisiones_electricas: ${rev.length} registros`);

    // 2. Solicitudes
    const sol = getServiceRequests();
    if (sol.length > 0) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.SOLICITUDES, sol, settings);
      details.push(`solicitudes_servicio: ${sol.length} registros`);
    }

    // 3. Condiciones
    const cond = getOperatingConditionsReports();
    if (cond.length > 0) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.CONDICIONES, cond, settings);
      details.push(`condiciones_operativas: ${cond.length} registros`);
    }

    // 4. Evaluaciones
    const evalReport = getSafetyEvaluations();
    if (evalReport.length > 0) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.EVALUACIONES, evalReport, settings);
      details.push(`evaluaciones_seguridad: ${evalReport.length} registros`);
    }

    // 5. Mediciones
    const med = getElectricalMeasurements();
    if (med.length > 0) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.MEDICIONES, med, settings);
      details.push(`mediciones_electricas: ${med.length} registros`);
    }

    // 6. Diagramas
    const diag = getSingleLineDiagrams();
    if (diag.length > 0) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.DIAGRAMAS, diag, settings);
      details.push(`diagramas_unifilares: ${diag.length} registros`);
    }

    // 7. Cédula
    const ced = getPeritoCedula();
    if (ced) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.CEDULA, [ced], settings);
      details.push(`cedula_perito: 1 registro`);
    }

    // 8. Certificado
    const cert = getPeritoCertificado();
    if (cert) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.CERTIFICADO, [cert], settings);
      details.push(`certificado_perito: 1 registro`);
    }

    // 9. Agenda de Citas
    const citas = getAppointments();
    if (citas.length > 0) {
      await syncRecordToSupabaseTable(SUPABASE_TABLES.AGENDA, citas, settings);
      details.push(`agenda_citas: ${citas.length} registros`);
    }

    return { 
      success: true, 
      message: 'Todos los 9 módulos locales fueron sincronizados con Supabase.', 
      details 
    };
  } catch (err: any) {
    return { success: false, message: `Error durante la sincronización: ${err.message || err}`, details };
  }
}

// ==========================================
// MÓDULO 1: SOLICITUDES DE SERVICIOS
// ==========================================

export const SAMPLE_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 'sol-01',
    folio: '01',
    fechaVisita: '02-oct-26',
    
    // Datos del Perito
    peritoRegistroCfp: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoTelefono: '4431748638',
    peritoEmail: 'israel9b@hotmail.com',
    peritoNombre: 'ING.ISRAEL OROZCO ARIAS',
    
    // Datos de la Instalación
    nombreComercial: 'ABARROTES AZTECA SUC. TIJERAS',
    nombreRazonSocial: 'ABARROTES AZTECA TIJERAS S.A DE C.V',
    rfc: 'AAT170629U46',
    calleNumero: 'JUAN DE BAEZA #600',
    coloniaPoblacion: 'DIECIOCHO DE MAYO',
    municipioDelegacion: 'MORELIA',
    ciudadEstado: 'MORELIA, MICHOACÁN',
    codigoPostal: '58258',
    telefonoInstalacion: '4433234075',
    
    // Solicitante del Servicio
    solicitanteNombre: 'VICTOR DANIEL RIOS RAMIREZ',
    solicitanteTelefono: '4438573253',
    
    // REFERENCIA: Foto de la Fachada / Inmueble
    fotoReferencia: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    esMuestra: true,
  }
];

export function getServiceRequests(): ServiceRequest[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_SERVICE_REQUESTS);
  const hideDemo = isDemoDataHidden();

  if (!raw) {
    if (hideDemo) return [];
    localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify(SAMPLE_SERVICE_REQUESTS));
    return SAMPLE_SERVICE_REQUESTS;
  }

  try {
    const list: ServiceRequest[] = JSON.parse(raw);
    if (hideDemo) {
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_SERVICE_REQUESTS;
  }
}

export function saveServiceRequest(request: ServiceRequest): ServiceRequest[] {
  const current = getServiceRequests();
  const existsIndex = current.findIndex(r => r.id === request.id || r.folio === request.folio);
  let updated: ServiceRequest[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...request, esMuestra: false };
  } else {
    updated = [request, ...current];
  }

  localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify(updated));
  return updated;
}

export function deleteServiceRequest(id: string): ServiceRequest[] {
  const current = getServiceRequests();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_SERVICE_REQUESTS, JSON.stringify(updated));
  return updated;
}

// ==========================================
// MÓDULO 2: CONDICIONES OPERATIVAS Y DE MANTENIMIENTO
// ==========================================

export const SAMPLE_OPERATING_CONDITIONS: OperatingConditionsReport[] = [
  {
    id: 'com-088',
    folio: '088',
    claveExpediente: 'CFP0125/COM/IOA/0088/2026',
    fechaInspeccion: '15-oct-26',
    nombreComercial: 'AGROEXPORTADORA DEL VALLE',
    razonSocial: 'AGROEXPORTADORA DEL VALLE S.P.R. DE R.L.',
    rfc: 'AVM190312KP8',
    giro: 'INDUSTRIA PROCESADORA DE AGROALIMENTOS Y EMPACADORA',
    calleNumero: 'CARRETERA MORELIA-PATZCUARO KM 14.5',
    colonia: 'PARQUE INDUSTRIAL MORELIA',
    municipio: 'MORELIA',
    ciudadEstado: 'MORELIA, MICHOACÁN',
    codigoPostal: '58340',
    telefono: '4432198000',
    contacto: 'ING. MARCELO DELGADO CÁRDENAS',
    tipoInstalacion: 'Media y Baja Tensión',
    tensionOperacion: '13,200 V / 220-127 V',
    capacidadTransformadorKva: 225,
    demandaMedidaKw: 148.5,
    resistenciaTierraOhms: 6.4,
    estadoSubestacion: 'Satisfactorio',
    estadoTableros: 'Satisfactorio',
    estadoConductoresCanalizaciones: 'Observaciones Menores',
    estadoSistemaTierras: 'Satisfactorio',
    estadoProteccionesSobrecarga: 'Satisfactorio',
    estadoAlumbradoEmergencia: 'Satisfactorio',
    programaMantenimientoVigente: true,
    ultimoMantenimientoFecha: '10-sep-26',
    responsableMantenimiento: 'Mantenimiento Electromecánico del Centro S.A.',
    pruebasAislamientoMegger: 'Conforme',
    pruebasTermografiaInfrarroja: 'Sin Puntos Calientes',
    limpiezaOrdenCuartoElectrico: 'Excelente',
    equipoProteccionPersonalYRotulacion: 'Completo',
    dictamenCondiciones: 'Condición Operativa Satisfactoria (Aprobada)',
    plazoCorreccionDias: 30,
    accionesRequeridas: 'Sellar adecuadamente una canalización conduit de 2 pulgadas en el muro perimetral del cuarto de tableros.',
    notasRecomendaciones: 'La instalación opera con niveles de seguridad óptimos de acuerdo a la NOM-001-SEDE-2012 y NOM-029-STPS-2011. Valores de resistencia de tierra dentro de norma (6.4 ohms < 25 ohms).',
    evidencias: [],
    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoTelefono: '4431748638',
    peritoEmail: 'israel9b@hotmail.com',
    esMuestra: true,
  }
];

export function getOperatingConditionsReports(): OperatingConditionsReport[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_OPERATING_CONDITIONS);
  const hideDemo = isDemoDataHidden();

  if (!raw) {
    if (hideDemo) return [];
    localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify(SAMPLE_OPERATING_CONDITIONS));
    return SAMPLE_OPERATING_CONDITIONS;
  }

  try {
    const list: OperatingConditionsReport[] = JSON.parse(raw);
    if (hideDemo) {
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_OPERATING_CONDITIONS;
  }
}

export function saveOperatingConditionsReport(report: OperatingConditionsReport): OperatingConditionsReport[] {
  const current = getOperatingConditionsReports();
  const existsIndex = current.findIndex(r => r.id === report.id || r.folio === report.folio);
  let updated: OperatingConditionsReport[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...report, esMuestra: false };
  } else {
    updated = [report, ...current];
  }

  localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify(updated));
  return updated;
}

export function deleteOperatingConditionsReport(id: string): OperatingConditionsReport[] {
  const current = getOperatingConditionsReports();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_OPERATING_CONDITIONS, JSON.stringify(updated));
  return updated;
}

// ==========================================
// MÓDULO: FORMATO PARA EVALUACIÓN DE INSTALACIONES ELÉCTRICAS EN MATERIA DE SEGURIDAD
// Páginas 5, 6, 7 y 8
// ==========================================

export const SAMPLE_SAFETY_EVALUATIONS: SafetyEvaluationReport[] = [
  {
    id: 'eval-055',
    folio: '055',
    claveExpediente: 'CFP0125/FEEMS/IOA/0055/2026',
    fechaEvaluacion: '19-oct-26',

    // Página 5
    razonSocial: 'CORPORATIVO INDUSTRIAL AGROPECUARIO DEL BAJÍO S.A. DE C.V.',
    nombreComercial: 'AGROEXPORTADORA DEL VALLE — PLANTA MORELIA',
    rfc: 'AVM190312KP8',
    giro: 'PROCESO, EMPAQUE Y REFRIGERACIÓN INDUSTRIAL DE ALIMENTOS',
    calleNumero: 'CARRETERA MORELIA-PÁTZCUARO KM 14.5',
    colonia: 'PARQUE INDUSTRIAL MORELIA',
    municipio: 'MORELIA',
    ciudadEstado: 'MORELIA, MICHOACÁN',
    codigoPostal: '58340',
    telefono: '4432198000',
    representanteLegal: 'ING. MARCELO DELGADO CÁRDENAS',

    companiaSuministradora: 'Comisión Federal de Electricidad (CFE Suministrador de Servicios Básicos)',
    noServicioRpu: '892140502194',
    tarifaSuministro: 'GDMTO (Gran Demanda Media Tensión Ordinaria)',
    tensionSuministro: '13,200 V / 220-127 V',
    frecuenciaHz: 60,
    fasesHilos: '3 Fases - 4 Hilos',

    tipoSubestacion: 'Pedestal',
    capacidadTransformadorKva: 225,
    marcaNumeroSerie: 'PROLEC GE / SERIE: 219803-TR',
    tipoEnfriamiento: 'OA (Enfriamiento Natural)',
    nivelEstadoAceite: 'Normal / Aceptable',
    proteccionFisicaCercaCandado: 'Conforme',

    electrodoTierraConexion: 'Conforme',
    resistenciaTierraMedidaOhms: 6.4,
    sistemaPararrayosBajantes: 'Instalado y Conforme',

    // Página 6
    gabineteTipoNema: 'NEMA 1 Interior / NEMA 3R Intemperie',
    directorioCircuitosIdentificado: '100% Identificado y Legible',
    cubiertaFrontalProteccionContacto: 'Completa y Ajustada',
    espacioReservaEspaciosVacios: 'Con tapas ciegas',

    interruptorPrincipalCapacidadA: 400,
    coordinacionProtecciones: 'Adecuada y Selectiva',
    proteccionFallaTierraGfci: 'Instalada en Zonas Húmedas',
    estadoInterruptoresTermomagneticos: 'Buen estado operativo',

    tipoConductorAislamiento: 'THW-LS 600V 75°C / 90°C Antiflama',
    codigoColoresNormativo: 'Conforme NOM-001',
    canalizacionesTuberiasCharolas: 'Tubería Conduit PG/PD Hermética',
    factorLlenadoCanalizaciones: 'Conforme (<40%)',

    // Página 7
    espacioTrabajoTableros: 'Conforme (>90cm despejado)',
    puertasAccesoEscape: 'Libres y con apertura hacia afuera',

    senalesAdvertenciaRiesgoElectrico: 'Completas y Visibles',
    diagramaUnifilarActualizado: 'Disponible y Visible en Tablero',

    tapetesDielectricosAislantes: 'Colocados en tableros principales',
    iluminacionNormalYEmergencia: 'Luminarias normales y de emergencia operativas',

    extintorTipoCo2PqsCercano: 'Extintor CO2 / PQS vigente y despejado',
    disponibilidadEppDielectrico: 'Completo (Guantes, careta arc-flash, calzado)',

    // Página 8
    medicionTensionFasesV: 'F1-F2: 220V, F2-F3: 219V, F3-F1: 221V | F-N: 127V / 126V / 127V',
    pruebaAislamientoMegger: 'Conforme (>100 MΩ)',
    termografiaInfrarroja: 'Sin puntos calientes',

    evidencias: [
      {
        id: 'evi-safe-1',
        dataUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        nombre: 'Subestación Tipo Pedestal',
        descripcion: 'Transformador 225 kVA con candado de seguridad y puesta a tierra perimetral',
        fecha: '19-oct-26'
      },
      {
        id: 'evi-safe-2',
        dataUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        nombre: 'Tablero General de Distribución',
        descripcion: 'Directorio de circuitos legible, tapas frontales completas y tapete dieléctrico',
        fecha: '19-oct-26'
      }
    ],

    noConformidadesDetectadas: 'Se detectó ausencia de una tapa ciega en reserva inferior del submódulo auxiliar de iluminación.',
    medidasCorrectivasInmediatas: 'Colocar tapa ciega metálica tipo NEMA en espacio desocupado del tablero auxiliar antes de 15 días.',
    plazoSubsanacionDias: 15,

    calificacionSeguridad: 'Instalación Eléctrica Segura (Aprobada)',

    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoTelefono: '4431748638',
    peritoEmail: 'israel9b@hotmail.com',
    esMuestra: true,
  }
];

export function getSafetyEvaluations(): SafetyEvaluationReport[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_SAFETY_EVALUATIONS);
  const hideDemo = isDemoDataHidden();

  if (!raw) {
    if (hideDemo) return [];
    localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify(SAMPLE_SAFETY_EVALUATIONS));
    return SAMPLE_SAFETY_EVALUATIONS;
  }

  try {
    const list: SafetyEvaluationReport[] = JSON.parse(raw);
    if (hideDemo) {
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_SAFETY_EVALUATIONS;
  }
}

export function saveSafetyEvaluation(report: SafetyEvaluationReport): SafetyEvaluationReport[] {
  const current = getSafetyEvaluations();
  const existsIndex = current.findIndex(r => r.id === report.id || r.folio === report.folio);
  let updated: SafetyEvaluationReport[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...report, esMuestra: false };
  } else {
    updated = [report, ...current];
  }

  localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify(updated));
  return updated;
}

export function deleteSafetyEvaluation(id: string): SafetyEvaluationReport[] {
  const current = getSafetyEvaluations();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_SAFETY_EVALUATIONS, JSON.stringify(updated));
  return updated;
}

// ==========================================
// MÓDULO 4: MEDICIONES DE VARIABLES ELÉCTRICAS (PÁGINA 9)
// ==========================================

export const SAMPLE_ELECTRICAL_MEASUREMENTS: ElectricalMeasurementsReport[] = [
  {
    id: 'med-359',
    folio: '359',
    claveExpediente: 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026',
    fechaMedicion: '02-oct-26',

    // 1. Datos Generales
    nombreRazonSocial: 'ABARROTES AZTECA TIJERAS S.A DE C.V',
    nombreComercial: 'ABARROTES AZTECA SUC. TIJERAS',
    rfc: 'AAT170629U46',
    domicilioCompleto: 'JUAN DE BAEZA #600 COL. DIECIOCHO DE MAYO',
    municipioEstado: 'MORELIA, MICHOACÁN',
    codigoPostal: '58258',
    telefono: '4433234075',
    solicitante: 'VICTOR DANIEL RIOS RAMIREZ',
    solicitanteTelefono: '4438573253',
    giro: 'COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO',

    // 2. Equipo de Medición
    instrumentoNombre: 'Analizador de Calidad de Energía y Multímetro / Pinza Amperimétrica',
    instrumentoMarca: 'FLUKE',
    instrumentoModelo: '435-II / 376 FC True RMS',
    instrumentoSerie: 'FLK-4352-8921',
    instrumentoCalibracion: 'Vigente al 15-Nov-2027 (Cert. EMA-EL-2024)',

    // 3. Tensión Eléctrica (Volts)
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

    // 4. Corriente Eléctrica (Amperes)
    corrienteF1: 68.5,
    corrienteF2: 71.2,
    corrienteF3: 65.8,
    corrienteNeutro: 14.2,
    desbalanceCorrientePorcentaje: 4.2,
    evaluacionCorriente: 'Carga Balanceada (<10%)',

    // 5. Potencia Eléctrica y Factor de Potencia (FP)
    potenciaActivaKw: 27.26,
    potenciaReactivaKvar: 13.62,
    potenciaAparenteKva: 30.48,
    factorPotenciaF1: 0.89,
    factorPotenciaF2: 0.91,
    factorPotenciaF3: 0.90,
    factorPotenciaTotal: 0.90,
    capacidadSubestacionKva: 75.0,
    porcentajeUtilizacionCapacidad: 49.99,
    evaluacionFactorPotencia: 'Aceptable CFE (>0.90)',

    // 6. Polaridad y Contactos
    polaridadContactos: 'Correcta (Fase en ranura corta, Neutro en ranura larga, Tierra conectada)',
    pruebaGfciDisparo: 'Disparo Correcto (<25ms)',

    // 7. Medición de Resistencia de Puesta a Tierra (SPAT)
    spatMetodo: 'Caída de Potencial (Método Wenner 3 Puntas)',
    spatPuntoMedicion: 'Pozo de Puesta a Tierra No. 1 - Subestación Tipo Pedestal',
    spatResistenciaMedidaOhms: 4.8,
    spatValorMaximoPermitidoOhms: 25.0,
    spatDictamen: 'CUMPLE NORMATIVA (≤ 25 Ω)',

    // 8. Descripción Técnica
    descripcionTecnica: 'Se registraron los parámetros de tensión, corriente, potencia y resistencia de puesta a tierra en el tablero general de distribución en condiciones normales de operación. Las tensiones de fase se mantienen dentro del rango de tolerancia del ±5% normativo. El desbalance de corriente es de 4.2%, clasificándose como carga adecuadamente balanceada. La resistencia de tierra registrada de 4.8 Ω cumple ampliamente con el valor máximo permitido de 25 Ω establecido por la NOM-001-SEDE-2012 y NOM-022-STPS-2015.',

    // 9. Evidencias Fotográficas
    evidencias: [
      {
        id: 'evi-med-1',
        dataUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        nombre: 'Lectura de Tensión y Desbalance en Pantalla',
        descripcion: 'Comprobación de tensiones F-F 220V y F-N 127V en analizador Fluke',
        fecha: '02-oct-26'
      },
      {
        id: 'evi-med-2',
        dataUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
        nombre: 'Medición de Resistencia de Tierra en Pozo',
        descripcion: 'Prueba de resistencia a tierra por método de caída de potencial obteniendo 4.8 Ω',
        fecha: '02-oct-26'
      }
    ],

    // 10. Acreditación Pericial del CFP
    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    peritoTelefono: '4431748638',
    peritoEmail: 'israel9b@hotmail.com',
    esMuestra: true,
  }
];

export function getElectricalMeasurements(): ElectricalMeasurementsReport[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS);
  const hideDemo = isDemoDataHidden();

  if (!raw) {
    if (hideDemo) return [];
    localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify(SAMPLE_ELECTRICAL_MEASUREMENTS));
    return SAMPLE_ELECTRICAL_MEASUREMENTS;
  }

  try {
    const list: ElectricalMeasurementsReport[] = JSON.parse(raw);
    if (hideDemo) {
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_ELECTRICAL_MEASUREMENTS;
  }
}

export function saveElectricalMeasurement(report: ElectricalMeasurementsReport): ElectricalMeasurementsReport[] {
  const current = getElectricalMeasurements();
  const existsIndex = current.findIndex(r => r.id === report.id || r.folio === report.folio);
  let updated: ElectricalMeasurementsReport[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...report, esMuestra: false };
  } else {
    updated = [report, ...current];
  }

  localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify(updated));
  return updated;
}

export function deleteElectricalMeasurement(id: string): ElectricalMeasurementsReport[] {
  const current = getElectricalMeasurements();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY_ELECTRICAL_MEASUREMENTS, JSON.stringify(updated));
  return updated;
}

// ==========================================
// SAMPLE DATA & CRUD: DIAGRAMA UNIFILAR GENERAL
// ==========================================
export const SAMPLE_SINGLE_LINE_DIAGRAMS: SingleLineDiagram[] = [
  {
    id: 'diag-359',
    folio: '359',
    claveExpediente: 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026',
    titulo: 'DIAGRAMA UNIFILAR GENERAL - SUBESTACIÓN 75 kVA Y TABLEROS DE DISTRIBUCIÓN',
    fecha: '02-oct-26',
    titularNombreComercial: 'ABARROTES AZTECA SUC. TIJERAS',
    titularRazonSocial: 'ABARROTES AZTECA TIJERAS S.A DE C.V',
    titularRfc: 'AAT170629U46',
    titularDireccion: 'JUAN DE BAEZA #600, COL. DIECIOCHO DE MAYO, MORELIA, MICHOACÁN',
    peritoNombre: 'Ing. Israel Orozco Arias',
    peritoAfiliacion: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
    peritoCedula: '15240154',
    imagenDataUrl: SAMPLE_DIAGRAM_DATA_URL,
    orientacion: 'horizontal',
    ajusteModo: 'carta_completa',
    rotacionGrados: 0,
    subestacionKva: 75,
    tensionPrimaria: '13,200 V (13.2 kV)',
    tensionSecundaria: '220/127 V - 3F - 4H',
    notasTecnicas: 'Subestación tipo pedestal de 75 kVA con interruptor principal termomagnético 3x200A. Tablero general de distribución con circuitos para alumbrado, refrigeración y climatización. Sistema de puesta a tierra calibrado con resistencia de 4.8 Ω.',
    esMuestra: true,
  }
];

export function getSingleLineDiagrams(): SingleLineDiagram[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS);
  const hideDemo = isDemoDataHidden();

  if (!raw) {
    if (hideDemo) return [];
    localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify(SAMPLE_SINGLE_LINE_DIAGRAMS));
    return SAMPLE_SINGLE_LINE_DIAGRAMS;
  }

  try {
    const list: SingleLineDiagram[] = JSON.parse(raw);
    if (hideDemo) {
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_SINGLE_LINE_DIAGRAMS;
  }
}

export function saveSingleLineDiagram(diagram: SingleLineDiagram): SingleLineDiagram[] {
  const current = getSingleLineDiagrams();
  const existsIndex = current.findIndex(d => d.id === diagram.id || d.folio === diagram.folio);
  let updated: SingleLineDiagram[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...diagram, esMuestra: false };
  } else {
    updated = [diagram, ...current];
  }

  localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify(updated));
  return updated;
}

export function deleteSingleLineDiagram(id: string): SingleLineDiagram[] {
  const current = getSingleLineDiagrams();
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY_SINGLE_LINE_DIAGRAMS, JSON.stringify(updated));
  return updated;
}

// ==========================================
// SAMPLE DATA & CRUD: CÉDULA PROFESIONAL DEL PERITO
// ==========================================
export const SAMPLE_PERITO_CEDULA: PeritoCedula = {
  id: 'cedula-ioa',
  peritoNombre: 'Ing. Israel Orozco Arias',
  numeroCedula: '15240154',
  profesion: 'Ingeniero Mecánico Electricista',
  institucionEmisora: 'Secretaría de Educación Pública - Dirección General de Profesiones',
  fechaExpedicion: '18 de Mayo de 2018',
  curp: 'OOAI820414HMNRSR08',
  folioRegistro: 'DGP-2018-MEX-88419',
  imagenDataUrl: SAMPLE_CEDULA_DATA_URL,
  anchoCompleto: true,
  esMuestra: true,
  observaciones: 'Cédula profesional electrónica federal con efectos de patente legal para dictaminación e inspección pericial en instalaciones eléctricas.'
};

export function getPeritoCedula(): PeritoCedula {
  if (typeof window === 'undefined') return SAMPLE_PERITO_CEDULA;
  const raw = localStorage.getItem(STORAGE_KEY_PERITO_CEDULA);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_PERITO_CEDULA, JSON.stringify(SAMPLE_PERITO_CEDULA));
    return SAMPLE_PERITO_CEDULA;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SAMPLE_PERITO_CEDULA;
  }
}

export function savePeritoCedula(cedula: PeritoCedula): PeritoCedula {
  const toSave = { ...cedula, esMuestra: false };
  localStorage.setItem(STORAGE_KEY_PERITO_CEDULA, JSON.stringify(toSave));
  return toSave;
}

// ==========================================
// SAMPLE DATA & CRUD: CERTIFICADO DE PERITO DICTAMINADOR (CFP)
// ==========================================
export const SAMPLE_PERITO_CERTIFICADO: PeritoCertificado = {
  id: 'cert-ioa-0071',
  tituloCertificado: 'CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELÉCTRICAS EN MEDIA Y BAJA TENSIÓN',
  colegioEmisor: 'Colegio Federal de Peritos A.C.',
  peritoNombre: 'Ing. Israel Orozco Arias',
  numeroRegistro: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
  numeroCedula: '15240154',
  especialidad: 'Instalaciones Eléctricas en Media y Baja Tensión',
  vigencia: '2026 - 2028',
  fechaEmision: '14 de Diciembre de 2020',
  imagenDataUrl: SAMPLE_CERTIFICADO_DATA_URL,
  ajusteCompleto: true,
  esMuestra: true,
  observaciones: 'Acreditación pericial oficial autorizada conforme a la NOM-001-SEDE-2012 y lineamientos del Colegio Federal de Peritos.'
};

export function getPeritoCertificado(): PeritoCertificado {
  if (typeof window === 'undefined') return SAMPLE_PERITO_CERTIFICADO;
  const raw = localStorage.getItem(STORAGE_KEY_PERITO_CERTIFICADO);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_PERITO_CERTIFICADO, JSON.stringify(SAMPLE_PERITO_CERTIFICADO));
    return SAMPLE_PERITO_CERTIFICADO;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return SAMPLE_PERITO_CERTIFICADO;
  }
}

export function savePeritoCertificado(cert: PeritoCertificado): PeritoCertificado {
  const toSave = { ...cert, esMuestra: false };
  localStorage.setItem(STORAGE_KEY_PERITO_CERTIFICADO, JSON.stringify(toSave));
  return toSave;
}

// ==========================================
// SAMPLE DATA & CRUD: AGENDA DE CITAS DEL PERITO / ADMIN
// ==========================================
export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getOffsetDateString(daysOffset: number): string {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'cita-001',
    clienteNombre: 'ABARROTES AZTECA TIJERAS S.A DE C.V',
    representante: 'Lic. Víctor Daniel Ríos Ramírez',
    recomendadoPor: 'Ing. Héctor Sánchez Morales (CFE Distribución)',
    direccionEmpresa: 'Juan de Baeza #600, Col. Dieciocho de Mayo, Morelia, Michoacán, C.P. 58258',
    telefonos: '4433234075 / 4438573253',
    whatsapp: '4438573253',
    correoElectronico: 'victor.rios@abarrotesazteca.mx',
    fechaCita: getTodayDateString(),
    horaCita: '10:00',
    duracionMinutos: 90,
    tipoServicio: 'Dictamen Pericial NOM-001-SEDE-2012',
    motivoNotas: 'Inspección de subestación tipo pedestal de 75 kVA, revisión de tableros de distribución y medición de resistencia de tierra.',
    peritoAsignado: 'Ing. Israel Orozco Arias',
    folioDictamenRelacionado: '359',
    estado: 'Confirmada',
    recordatorioMinutos: 30,
    createdAt: new Date().toISOString(),
    esMuestra: true,
  },
  {
    id: 'cita-002',
    clienteNombre: 'PLAZA COMERCIAL LAS AMÉRICAS MORELIA',
    representante: 'Arq. Marcela Vega Sandoval',
    recomendadoPor: 'Colegio Federal de Peritos A.C.',
    direccionEmpresa: 'Av. Enrique Ramírez Miguel #1000, Col. Las Américas, Morelia, Michoacán',
    telefonos: '4433145600 / 4432190876',
    whatsapp: '4432190876',
    correoElectronico: 'mvega@plazalamericas.com.mx',
    fechaCita: getOffsetDateString(1),
    horaCita: '16:00',
    duracionMinutos: 120,
    tipoServicio: 'Medición de Resistencia de Puesta a Tierra (SPAT)',
    motivoNotas: 'Pruebas con telurómetro de 3 puntas en pozos de tierra perimetrales y verificación de continuidad de masas metálicas.',
    peritoAsignado: 'Ing. Israel Orozco Arias',
    folioDictamenRelacionado: '',
    estado: 'Programada',
    recordatorioMinutos: 60,
    createdAt: new Date().toISOString(),
    esMuestra: true,
  },
  {
    id: 'cita-003',
    clienteNombre: 'INDUSTRIA LÁCTEA DEL BAJÍO S.P.R. DE R.L.',
    representante: 'Ing. Fernando Mendoza Cárdenas',
    recomendadoPor: 'Cámara Nacional de la Industria de Transformación (CANACINTRA)',
    direccionEmpresa: 'Carretera Morelia-Salamanca Km 12.5, Parque Industrial Morelia',
    telefonos: '4432984100 / 4431876543',
    whatsapp: '4431876543',
    correoElectronico: 'fmendoza@lacteosdelbajio.com',
    fechaCita: getOffsetDateString(3),
    horaCita: '09:30',
    duracionMinutos: 180,
    tipoServicio: 'Levantamiento de Diagrama Unifilar y Cargas',
    motivoNotas: 'Levantamiento técnico de subestación de 150 kVA y circuitos derivados para actualización de expediente técnico ante Protección Civil.',
    peritoAsignado: 'Ing. Israel Orozco Arias',
    folioDictamenRelacionado: 'EVAL-055',
    estado: 'Programada',
    recordatorioMinutos: 60,
    createdAt: new Date().toISOString(),
    esMuestra: true,
  },
  {
    id: 'cita-004',
    clienteNombre: 'GASOLINERA Y SERVICIOS EXPRESS MICHOACÁN',
    representante: 'C.P. Roberto Guzmán Ortiz',
    recomendadoPor: 'Ing. Roberto Calderón V.',
    direccionEmpresa: 'Periférico Paseo de la República #4500, Morelia, Mich.',
    telefonos: '4433159988',
    whatsapp: '4433159988',
    correoElectronico: 'gerencia@gasolineraexpress.mx',
    fechaCita: getOffsetDateString(-2),
    horaCita: '11:00',
    duracionMinutos: 120,
    tipoServicio: 'Evaluación de Seguridad Eléctrica en Áreas Peligrosas',
    motivoNotas: 'Verificación de sellos a prueba de explosión, clasificación de áreas Clase I División 1 y tableros herméticos.',
    peritoAsignado: 'Ing. Israel Orozco Arias',
    folioDictamenRelacionado: 'COM-088',
    estado: 'Realizada',
    recordatorioMinutos: 30,
    createdAt: new Date().toISOString(),
    esMuestra: true,
  }
];

export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return SAMPLE_APPOINTMENTS;
  const hideDemo = isDemoDataHidden();
  const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);

  if (!raw) {
    if (hideDemo) return [];
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(SAMPLE_APPOINTMENTS));
    return SAMPLE_APPOINTMENTS;
  }

  try {
    const list: Appointment[] = JSON.parse(raw);
    if (hideDemo) {
      return list.filter(item => !item.esMuestra);
    }
    return list;
  } catch {
    return hideDemo ? [] : SAMPLE_APPOINTMENTS;
  }
}

export function saveAppointment(appointment: Appointment): Appointment[] {
  const current = getAppointments();
  const existsIndex = current.findIndex(a => a.id === appointment.id);
  let updated: Appointment[];

  const toSave: Appointment = {
    ...appointment,
    updatedAt: new Date().toISOString(),
    esMuestra: false
  };

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = toSave;
  } else {
    updated = [toSave, ...current];
  }

  // Sort by date and time
  updated.sort((a, b) => {
    const dtA = `${a.fechaCita}T${a.horaCita}`;
    const dtB = `${b.fechaCita}T${b.horaCita}`;
    return dtA.localeCompare(dtB);
  });

  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  return updated;
}

export function deleteAppointment(id: string): Appointment[] {
  const current = getAppointments();
  const updated = current.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  return updated;
}

export function wipeAllAppointments(): void {
  localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
}

// ==========================================
// HELPERS DE SINCRONIZACIÓN CON CALENDARIOS & WHATSAPP
// ==========================================

export function buildGoogleCalendarUrl(appointment: Appointment): string {
  const [y, m, d] = (appointment.fechaCita || getTodayDateString()).split('-').map(Number);
  const [hh, mm] = (appointment.horaCita || '10:00').split(':').map(Number);
  
  const start = new Date(y, (m || 1) - 1, d || 1, hh || 10, mm || 0);
  const duration = Number(appointment.duracionMinutos) || 60;
  const end = new Date(start.getTime() + duration * 60000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatGDate = (dt: Date) => 
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;

  const title = `Visita Pericial CFP: ${appointment.clienteNombre} (${appointment.tipoServicio})`;
  const details = [
    `⚡ COLEGIO FEDERAL DE PERITOS - CITA DE INSPECCIÓN TÉCNICA`,
    `Cliente: ${appointment.clienteNombre}`,
    `Representante: ${appointment.representante}`,
    `Recomendado por: ${appointment.recomendadoPor || 'Directo'}`,
    `Teléfonos: ${appointment.telefonos}`,
    `WhatsApp: ${appointment.whatsapp}`,
    `Correo: ${appointment.correoElectronico}`,
    `Servicio: ${appointment.tipoServicio}`,
    appointment.folioDictamenRelacionado ? `Folio Dictamen: #${appointment.folioDictamenRelacionado}` : '',
    appointment.peritoAsignado ? `Perito Asignado: ${appointment.peritoAsignado}` : '',
    appointment.motivoNotas ? `Notas / Alcance: ${appointment.motivoNotas}` : '',
  ].filter(Boolean).join('\n');

  const location = appointment.direccionEmpresa || 'Michoacán, México';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGDate(start)}/${formatGDate(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}

export function generateIcsCalendar(appointment: Appointment): string {
  const [y, m, d] = (appointment.fechaCita || getTodayDateString()).split('-').map(Number);
  const [hh, mm] = (appointment.horaCita || '10:00').split(':').map(Number);

  const start = new Date(y, (m || 1) - 1, d || 1, hh || 10, mm || 0);
  const duration = Number(appointment.duracionMinutos) || 60;
  const end = new Date(start.getTime() + duration * 60000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatIcsDate = (dt: Date) => 
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;

  const now = formatIcsDate(new Date());

  const escapeIcs = (str: string) => (str || '').replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');

  const summary = `Visita Pericial CFP: ${appointment.clienteNombre} - ${appointment.tipoServicio}`;
  const description = [
    `Cliente: ${appointment.clienteNombre}`,
    `Representante: ${appointment.representante}`,
    `Recomendado por: ${appointment.recomendadoPor || 'Contacto directo'}`,
    `Teléfonos: ${appointment.telefonos}`,
    `WhatsApp: ${appointment.whatsapp}`,
    `Correo: ${appointment.correoElectronico}`,
    `Servicio: ${appointment.tipoServicio}`,
    appointment.folioDictamenRelacionado ? `Folio Dictamen: #${appointment.folioDictamenRelacionado}` : '',
    appointment.peritoAsignado ? `Perito: ${appointment.peritoAsignado}` : '',
    appointment.motivoNotas ? `Notas: ${appointment.motivoNotas}` : '',
  ].filter(Boolean).join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Colegio Federal de Peritos//CFP Agenda Electrica//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cfp-cita-${appointment.id || Date.now()}@peritos.org`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${escapeIcs(appointment.direccionEmpresa || 'México')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    `TRIGGER:-PT${appointment.recordatorioMinutos || 30}M`,
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio de Cita Pericial CFP: ${escapeIcs(appointment.clienteNombre)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function buildWhatsAppReminderUrl(appointment: Appointment): string {
  const cleanPhone = (appointment.whatsapp || appointment.telefonos || '').replace(/[^0-9]/g, '');
  const phone = cleanPhone.length === 10 ? `52${cleanPhone}` : cleanPhone;
  const message = `Hola Estimado/a *${appointment.representante || appointment.clienteNombre}*, le saludamos de *Ingeniería Eléctrica CFP*.\n\nLe confirmamos su cita técnica pericial programada:\n\n📅 *Fecha:* ${appointment.fechaCita}\n⏰ *Hora:* ${appointment.horaCita} hrs (Duración estimada: ${appointment.duracionMinutos} min)\n📍 *Lugar:* ${appointment.direccionEmpresa}\n⚡ *Servicio:* ${appointment.tipoServicio}\n👨‍💼 *Perito Asignado:* ${appointment.peritoAsignado || 'Ing. Israel Orozco Arias'}\n\nQuedamos a sus órdenes para cualquier duda o cambio de horario. ¡Excelente día!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ==========================================
// CRUD: CÓDIGOS QR GENERADOS PARA DICTÁMENES
// ==========================================
export function getGeneratedQrCodes(): GeneratedQrCode[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_GENERATED_QRS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveGeneratedQrCode(qr: GeneratedQrCode): GeneratedQrCode[] {
  const current = getGeneratedQrCodes();
  const existsIndex = current.findIndex(q => q.id === qr.id);
  let updated: GeneratedQrCode[];

  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = qr;
  } else {
    updated = [qr, ...current];
  }

  localStorage.setItem(STORAGE_KEY_GENERATED_QRS, JSON.stringify(updated));
  return updated;
}

export function deleteGeneratedQrCode(id: string): GeneratedQrCode[] {
  const current = getGeneratedQrCodes();
  const updated = current.filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY_GENERATED_QRS, JSON.stringify(updated));
  return updated;
}


