import { RevisionReport, SupabaseSettings, ServiceRequest, OperatingConditionsReport } from '../types';

const STORAGE_KEY_REPORTS = 'cfp_revision_reports';
const STORAGE_KEY_SERVICE_REQUESTS = 'cfp_service_requests';
const STORAGE_KEY_OPERATING_CONDITIONS = 'cfp_operating_conditions';
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

export function clearSampleData(): { removedCount: number; remainingCount: number } {
  setDemoDataHidden(true);
  const current = getRevisionReports();
  const nonDemo = current.filter(r => !r.esMuestra);
  const removedCount = current.length - nonDemo.length;
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(nonDemo));
  return { removedCount, remainingCount: nonDemo.length };
}

export function wipeAllReports(): void {
  setDemoDataHidden(true);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify([]));
}

export function restoreSampleData(): RevisionReport[] {
  setDemoDataHidden(false);
  localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(SAMPLE_REPORTS));
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
export function getSupabaseSettings(): SupabaseSettings {
  if (typeof window === 'undefined') {
    return { url: '', anonKey: '', tableName: 'revisiones_electricas', connected: false };
  }
  const raw = localStorage.getItem(STORAGE_KEY_SUPABASE);
  if (!raw) {
    return { url: '', anonKey: '', tableName: 'revisiones_electricas', connected: false };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { url: '', anonKey: '', tableName: 'revisiones_electricas', connected: false };
  }
}

export function saveSupabaseSettings(settings: SupabaseSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(settings));
}

export async function wipeSupabaseRecords(settings: SupabaseSettings): Promise<{ success: boolean; message: string }> {
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'URL o Clave Anónima de Supabase no configurada.' };
  }

  try {
    const cleanUrl = settings.url.replace(/\/+$/, '');
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

    if (response.ok || response.status === 204) {
      return { success: true, message: 'Registros eliminados correctamente en la tabla de Supabase.' };
    } else {
      const errorText = await response.text();
      return { success: false, message: `Supabase respondió con estado ${response.status}: ${errorText || 'Error de permisos o tabla'}` };
    }
  } catch (err: any) {
    return { success: false, message: `Error de red al conectar con Supabase: ${err.message || err}` };
  }
}

export async function syncReportsToSupabase(reports: RevisionReport[], settings: SupabaseSettings): Promise<{ success: boolean; message: string }> {
  if (!settings.url || !settings.anonKey) {
    return { success: false, message: 'Configure la URL y Clave Anónima de Supabase primero.' };
  }

  try {
    const cleanUrl = settings.url.replace(/\/+$/, '');
    const endpoint = `${cleanUrl}/rest/v1/${settings.tableName || 'revisiones_electricas'}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': settings.anonKey,
        'Authorization': `Bearer ${settings.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(reports)
    });

    if (response.ok || response.status === 201) {
      const updatedSettings = { ...settings, connected: true, lastSync: new Date().toISOString() };
      saveSupabaseSettings(updatedSettings);
      return { success: true, message: `Se sincronizaron con éxito ${reports.length} informes en Supabase.` };
    } else {
      const errorText = await response.text();
      return { success: false, message: `Error al subir a Supabase (${response.status}): ${errorText}` };
    }
  } catch (err: any) {
    return { success: false, message: `Fallo de conexión a Supabase: ${err.message || err}` };
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

