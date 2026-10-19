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

export interface EvidenceItem {
  id: string;
  dataUrl: string; // Base64 data URL
  nombre: string;
  descripcion?: string;
  fecha: string;
}

export interface ServiceRequest {
  id: string;
  folio?: string; // e.g. "0101"
  fechaVisita: string; // e.g. "02-oct-26"
  
  // Datos del Perito
  peritoRegistroCfp: string; // e.g. "CFP0125/PCIEMBT/IOA/0071/14XII20"
  peritoCedula: string; // e.g. "15240154"
  peritoTelefono: string; // e.g. "4431748638"
  peritoEmail: string; // e.g. "israel9b@hotmail.com"
  peritoNombre: string; // e.g. "ING.ISRAEL OROZCO ARIAS"
  
  // Datos de la Instalación
  nombreComercial: string; // e.g. "ABARROTES AZTECA SUC. TIJERAS"
  nombreRazonSocial: string; // e.g. "ABARROTES AZTECA TIJERAS S.A DE C.V"
  rfc: string; // e.g. "AAT170629U46"
  calleNumero: string; // e.g. "JUAN DE BAEZA #600"
  coloniaPoblacion: string; // e.g. "DIECIOCHO DE MAYO"
  municipioDelegacion: string; // e.g. "MORELIA"
  ciudadEstado: string; // e.g. "MORELIA, MICHOACÁN"
  codigoPostal: string; // e.g. "58258"
  telefonoInstalacion: string; // e.g. "4433234075"
  
  // Solicitante del Servicio
  solicitanteNombre: string; // e.g. "VICTOR DANIEL RIOS RAMIREZ"
  solicitanteTelefono: string; // e.g. "4438573253"
  
  // REFERENCIA: Foto de Evidencia / Fachada del Inmueble
  fotoReferencia?: string;
  evidencias?: EvidenceItem[];
  
  // Firmas
  firmaPerito?: string;
  firmaSolicitante?: string;
  
  esMuestra?: boolean;
}

export interface OperatingConditionsReport {
  id: string;
  folio: string; // e.g. "COM-088"
  claveExpediente: string; // e.g. "CFP0125/COM/IOA/0088/2026"
  fechaInspeccion: string; // e.g. "19-oct-26"
  
  // Datos del Inmueble / Instalación
  nombreComercial: string;
  razonSocial: string;
  rfc: string;
  giro: string;
  calleNumero: string;
  colonia: string;
  municipio: string;
  ciudadEstado: string;
  codigoPostal: string;
  telefono: string;
  contacto: string;
  
  // Parámetros Eléctricos Operativos
  tipoInstalacion: 'Baja Tensión' | 'Media y Baja Tensión';
  tensionOperacion: string; // e.g. "220/127 V" o "13,200 V / 220 V"
  capacidadTransformadorKva: number;
  demandaMedidaKw: number;
  resistenciaTierraOhms: number; // e.g. 6.8 ohms
  
  // CONDICIONES OPERATIVAS DE SEGURIDAD (Evaluación NOM-001)
  estadoSubestacion: 'Satisfactorio' | 'Observaciones Menores' | 'Crítico' | 'No Aplica';
  estadoTableros: 'Satisfactorio' | 'Observaciones Menores' | 'Crítico';
  estadoConductoresCanalizaciones: 'Satisfactorio' | 'Observaciones Menores' | 'Crítico';
  estadoSistemaTierras: 'Satisfactorio' | 'Observaciones Menores' | 'Crítico';
  estadoProteccionesSobrecarga: 'Satisfactorio' | 'Observaciones Menores' | 'Crítico';
  estadoAlumbradoEmergencia: 'Satisfactorio' | 'Observaciones Menores' | 'Crítico';
  
  // CONDICIONES DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO
  programaMantenimientoVigente: boolean;
  ultimoMantenimientoFecha: string; // e.g. "15-ago-26"
  responsableMantenimiento: string;
  pruebasAislamientoMegger: 'Conforme' | 'No Conforme' | 'No Realizada';
  pruebasTermografiaInfrarroja: 'Sin Puntos Calientes' | 'Puntos Calientes Detectados' | 'No Realizada';
  limpiezaOrdenCuartoElectrico: 'Excelente' | 'Aceptable' | 'Deficiente';
  equipoProteccionPersonalYRotulacion: 'Completo' | 'Incompleto' | 'Ausente';
  
  // DIAGNÓSTICO FINAL Y EVALUACIÓN
  dictamenCondiciones: 'Condición Operativa Satisfactoria (Aprobada)' | 'Condición Condicionada a Mantenimiento' | 'Condición de Alto Riesgo Eléctrico';
  plazoCorreccionDias: number; // e.g. 15
  accionesRequeridas: string;
  notasRecomendaciones: string;
  
  // Evidencias fotográficas del levantamiento
  evidencias: EvidenceItem[];
  
  // Perito Responsable y Firmas
  peritoNombre: string;
  peritoAfiliacion: string;
  peritoCedula: string;
  peritoTelefono: string;
  peritoEmail: string;
  firmaDigital?: string;
  esMuestra?: boolean;
}

export interface SafetyEvaluationReport {
  id: string;
  folio: string; // e.g. "EVAL-055"
  claveExpediente: string; // e.g. "CFP0125/FEEMS/IOA/0055/2026"
  fechaEvaluacion: string; // e.g. "19-oct-26"

  // ==========================================
  // PÁGINA 5: DATOS GENERALES, SUMINISTRO Y SUBESTACIÓN
  // ==========================================
  // Centro de Trabajo / Instalación
  razonSocial: string;
  nombreComercial: string;
  rfc: string;
  giro: string;
  calleNumero: string;
  colonia: string;
  municipio: string;
  ciudadEstado: string;
  codigoPostal: string;
  telefono: string;
  representanteLegal: string;

  // Suministro de Energía Eléctrica
  companiaSuministradora: string; // e.g. "Comisión Federal de Electricidad (CFE SSB)"
  noServicioRpu: string; // e.g. "892140502194"
  tarifaSuministro: string; // e.g. "GDMTO (Gran Demanda Media Tensión Ordinaria)"
  tensionSuministro: string; // e.g. "13,200 V / 220-127 V"
  frecuenciaHz: number; // 60
  fasesHilos: string; // e.g. "3 Fases - 4 Hilos"

  // Subestación Eléctrica y Transformador de Potencia
  tipoSubestacion: 'Pedestal' | 'Poste / Aérea' | 'Subterránea' | 'Compacta / Encapsulada' | 'No Aplica (Solo BT)';
  capacidadTransformadorKva: number; // e.g. 150
  marcaNumeroSerie: string; // e.g. "PROLEC GE / SERIE: 219803"
  tipoEnfriamiento: 'OA (Enfriamiento Natural)' | 'ONAN' | 'Tipo Seco';
  nivelEstadoAceite: 'Normal / Aceptable' | 'Bajo nivel' | 'Deteriorado' | 'No Aplica (Seco)';
  proteccionFisicaCercaCandado: 'Conforme' | 'No Conforme' | 'Requiere Mantenimiento';

  // Sistema de Puesta a Tierra y Pararrayos
  electrodoTierraConexion: 'Conforme' | 'Observaciones Menores' | 'Crítico';
  resistenciaTierraMedidaOhms: number; // e.g. 7.2
  sistemaPararrayosBajantes: 'Instalado y Conforme' | 'No Instalado / No Requerido' | 'Requiere Mantenimiento';

  // ==========================================
  // PÁGINA 6: TABLEROS, CIRCUITOS DERIVADOS, PROTECCIONES Y CANALIZACIONES
  // ==========================================
  // Tableros Principales y de Distribución
  gabineteTipoNema: string; // e.g. "NEMA 1 Interior" o "NEMA 3R Intemperie"
  directorioCircuitosIdentificado: '100% Identificado y Legible' | 'Parcialmente Identificado' | 'Sin Identificación';
  cubiertaFrontalProteccionContacto: 'Completa y Ajustada' | 'Tapas Sueltas / Faltantes' | 'Inexistente';
  espacioReservaEspaciosVacios: 'Con tapas ciegas' | 'Aperturas expuestas sin tapa' | 'Sin espacio';

  // Dispositivos de Sobrecorriente e Interruptores
  interruptorPrincipalCapacidadA: number; // e.g. 400
  coordinacionProtecciones: 'Adecuada y Selectiva' | 'Sobrecalibrada' | 'Riesgo de Disparo en Cascada';
  proteccionFallaTierraGfci: 'Instalada en Zonas Húmedas' | 'Parcial' | 'No Instalada / Requerida';
  estadoInterruptoresTermomagneticos: 'Buen estado operativo' | 'Signos de calentamiento' | 'Dañados';

  // Conductores y Canalizaciones
  tipoConductorAislamiento: string; // e.g. "THW-LS 600V 75°C / 90°C Antiflama"
  codigoColoresNormativo: 'Conforme NOM-001' | 'Parcialmente Identificado' | 'No Cumple Código';
  canalizacionesTuberiasCharolas: 'Tubería Conduit PG/PD Hermética' | 'Charola Tipo Escalera' | 'Conductores Expuestos';
  factorLlenadoCanalizaciones: 'Conforme (<40%)' | 'Saturado (>40%)' | 'Crítico';

  // ==========================================
  // PÁGINA 7: CONDICIONES DE SEGURIDAD LABORAL (NOM-029-STPS / NOM-026-STPS)
  // ==========================================
  // Espacios de Trabajo y Accesibilidad (Art. 110-26)
  espacioTrabajoTableros: 'Conforme (>90cm despejado)' | 'Parcialmente Obstruido' | 'Obstrucción Crítica';
  puertasAccesoEscape: 'Libres y con apertura hacia afuera' | 'Bloqueadas' | 'Aceptable';

  // Señalización de Seguridad (NOM-026-STPS)
  senalesAdvertenciaRiesgoElectrico: 'Completas y Visibles' | 'Deterioradas / Faltantes' | 'Inexistentes';
  diagramaUnifilarActualizado: 'Disponible y Visible en Tablero' | 'En Archivo' | 'No Disponible';

  // Medidas Preventivas y Tapetes Dieléctricos
  tapetesDielectricosAislantes: 'Colocados en tableros principales' | 'Deteriorados' | 'No Colocados';
  iluminacionNormalYEmergencia: 'Luminarias normales y de emergencia operativas' | 'Sin luz de emergencia' | 'Deficiente';

  // Prevención de Incendios y EPP
  extintorTipoCo2PqsCercano: 'Extintor CO2 / PQS vigente y despejado' | 'Vencido o sin presión' | 'No Disponible en el área';
  disponibilidadEppDielectrico: 'Completo (Guantes, careta arc-flash, calzado)' | 'Parcial' | 'Inexistente';

  // ==========================================
  // PÁGINA 8: PRUEBAS, EVIDENCIAS, PLAN DE ACCIÓN Y CALIFICACIÓN GLOBAL
  // ==========================================
  // Pruebas y Mediciones Eléctricas
  medicionTensionFasesV: string; // e.g. "F1-F2: 220V, F2-F3: 221V, F3-F1: 219V, F-N: 127V"
  pruebaAislamientoMegger: 'Conforme (>100 MΩ)' | 'Aceptable (>50 MΩ)' | 'Falla de Aislamiento';
  termografiaInfrarroja: 'Sin puntos calientes' | 'Puntos calientes leves detectados' | 'Punto caliente crítico';

  // Evidencias Fotográficas
  evidencias: EvidenceItem[];

  // No Conformidades y Plan de Corrección
  noConformidadesDetectadas: string;
  medidasCorrectivasInmediatas: string;
  plazoSubsanacionDias: number; // e.g. 15

  // Veredicto Global
  calificacionSeguridad: 'Instalación Eléctrica Segura (Aprobada)' | 'Instalación Condicionada a Correcciones' | 'Instalación de Alto Riesgo Inminente';

  // Acreditación Pericial del CFP
  peritoNombre: string;
  peritoAfiliacion: string;
  peritoCedula: string;
  peritoTelefono: string;
  peritoEmail: string;
  firmaDigital?: string;
  esMuestra?: boolean;
}

