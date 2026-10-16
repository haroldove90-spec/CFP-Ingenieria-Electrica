export type UserRole = 
  | 'Perito Dictaminador'
  | 'Inspector Técnico'
  | 'Coordinador de Proyectos'
  | 'Administrador General';

export interface RevisionReport {
  id: string;
  folio: string; // e.g. "359"
  claveExpediente: string; // e.g. "CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026"
  fecha: string; // e.g. "02-oct-26"
  
  // Tipo de instalación
  tipoInstalacionPrincipal: 'Baja Tensión' | 'Media y Baja Tensión';
  
  // Giro
  giroInstalacion: string; // e.g. "COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO"
  
  // Tensión de suministro
  tensionSuministro: 'Menos de 1000 V' | '1000 V o más';
  
  // Clasificación de instalación
  clasificacionInstalacion: 'Lugar de concentración pública' | 'Area peligrosa' | 'Industria' | 'Otro';
  clasificacionOtroDetalle?: string;
  
  // Tipo de servicio
  tipoServicio: 'Servicio Nuevo' | 'Modificación de instalación' | 'Revisión periódica' | 'Cambio de Razón social';
  
  // Capacidades
  capacidadSubestacionKva: number; // e.g. 75
  cargaInstaladaKw: number; // e.g. 27.25
  
  // Datos del Titular
  titularNombreComercial: string; // e.g. "ABARROTES AZTECA SUC. TIJERAS"
  titularRazonSocial: string; // e.g. "ABARROTES AZTECA TIJERAS S.A DE C.V"
  titularRfc: string; // e.g. "AAT170629U46"
  titularCalleNumero: string; // e.g. "JUAN DE BAEZA #600"
  titularColonia: string; // e.g. "DIECIOCHO DE MAYO"
  titularMunicipio: string; // e.g. "MORELIA"
  titularCiudadEstado: string; // e.g. "MORELIA, MICHOACÁN"
  titularCodigoPostal: string; // e.g. "58258"
  titularTelefono: string; // e.g. "4433234075"
  
  // Solicitante del servicio
  solicitanteNombre: string; // e.g. "VICTOR DANIEL RIOS RAMIREZ"
  solicitanteTelefono: string; // e.g. "4438573253"
  
  // Perito Responsable
  peritoNombre: string; // e.g. "Ing. Israel Orozco Arias"
  peritoAfiliacion: string; // e.g. "CFP0125/PCIEMBT/IOA/0071/14XII20"
  peritoCedula: string; // e.g. "15240154"
  peritoEmail: string; // e.g. "israel9b@hotmail.com"
  peritoTelefono: string; // e.g. "4431748638"
  
  // Estatus del dictamen
  resultadoDictamen: 'Favorable (Aprobado)' | 'Condicionado' | 'No Favorable (Riesgo Crítico)';
  observaciones?: string;
  vigenciaHasta?: string;
  esMuestra?: boolean;
  firmaDigital?: string; // Data URL of electronic signature
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  tableName: string;
  connected: boolean;
  lastSync?: string;
}
