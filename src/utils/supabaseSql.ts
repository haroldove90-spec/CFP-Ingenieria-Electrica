/**
 * Script SQL Completo para Supabase (PostgreSQL)
 * Proyecto: are.com's Project (ID: ggxliydxwcylilanitzk)
 * 
 * Contiene la definición y migraciones idempotentes de las 9 tablas oficiales del sistema CFP:
 * 1. revisiones_electricas (Dictámenes / Revisiones Principales NOM-001)
 * 2. solicitudes_servicio (Solicitudes de Servicios Eléctricos)
 * 3. condiciones_operativas (Condiciones Operativas de Seguridad NOM-001)
 * 4. evaluaciones_seguridad (Evaluación Integral de Seguridad Páginas 5 a 8)
 * 5. mediciones_electricas (Formato Técnico de Mediciones Eléctricas Página 9)
 * 6. diagramas_unifilares (Diagrama Unifilar General en Tamaño Carta - Soporta titularRfc y rfc)
 * 7. cedula_perito (Cédula Profesional del Perito Dictaminador)
 * 8. certificado_perito (Certificado de Acreditación como Perito Dictaminador CFP)
 * 9. agenda_citas (Agenda de Citas Técnicas, Sincronización y Notificaciones)
 */

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================
-- COLEGIO FEDERAL DE PERITOS (CFP) • SISTEMA DE INGENIERÍA ELÉCTRICA
-- PROYECTO SUPABASE: are.com's Project (ID: ggxliydxwcylilanitzk)
-- SCRIPT INTEGRAL DE 9 TABLAS: MIGRACIÓN & DATOS DE MUESTRA NOM-001-SEDE-2012
-- Compatible con migraciones previas (Corrige error: column "rfc" does not exist)
-- ==============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================
-- TABLA 1: REVISIONES Y DICTÁMENES ELÉCTRICOS PRINCIPALES
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.revisiones_electricas (
  id TEXT PRIMARY KEY,
  folio TEXT NOT NULL,
  claveExpediente TEXT,
  fecha TEXT,
  tipoInstalacionPrincipal TEXT,
  giroInstalacion TEXT,
  tensionSuministro TEXT,
  clasificacionInstalacion TEXT,
  clasificacionOtroDetalle TEXT,
  tipoServicio TEXT,
  capacidadSubestacionKva NUMERIC,
  cargaInstaladaKw NUMERIC,
  titularNombreComercial TEXT,
  titularRazonSocial TEXT,
  titularRfc TEXT,
  rfc TEXT,
  titularCalleNumero TEXT,
  titularColonia TEXT,
  titularMunicipio TEXT,
  titularCiudadEstado TEXT,
  titularCodigoPostal TEXT,
  titularTelefono TEXT,
  solicitanteNombre TEXT,
  solicitanteTelefono TEXT,
  peritoNombre TEXT,
  peritoAfiliacion TEXT,
  peritoCedula TEXT,
  peritoEmail TEXT,
  peritoTelefono TEXT,
  resultadoDictamen TEXT,
  observaciones TEXT,
  vigenciaHasta TEXT,
  esMuestra BOOLEAN DEFAULT false,
  firmaDigital TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 1
ALTER TABLE public.revisiones_electricas ADD COLUMN IF NOT EXISTS rfc TEXT;
ALTER TABLE public.revisiones_electricas ADD COLUMN IF NOT EXISTS titularRfc TEXT;
ALTER TABLE public.revisiones_electricas ADD COLUMN IF NOT EXISTS vigenciaHasta TEXT;
ALTER TABLE public.revisiones_electricas ADD COLUMN IF NOT EXISTS firmaDigital TEXT;

ALTER TABLE public.revisiones_electricas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo revisiones" ON public.revisiones_electricas;
CREATE POLICY "Acceso público completo revisiones" ON public.revisiones_electricas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.revisiones_electricas TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 2: SOLICITUDES DE SERVICIOS
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.solicitudes_servicio (
  id TEXT PRIMARY KEY,
  folio TEXT,
  fechaVisita TEXT,
  peritoRegistroCfp TEXT,
  peritoCedula TEXT,
  peritoTelefono TEXT,
  peritoEmail TEXT,
  peritoNombre TEXT,
  nombreComercial TEXT,
  nombreRazonSocial TEXT,
  rfc TEXT,
  titularRfc TEXT,
  calleNumero TEXT,
  coloniaPoblacion TEXT,
  municipioDelegacion TEXT,
  ciudadEstado TEXT,
  codigoPostal TEXT,
  telefonoInstalacion TEXT,
  solicitanteNombre TEXT,
  solicitanteTelefono TEXT,
  fotoReferencia TEXT,
  evidencias JSONB DEFAULT '[]'::jsonb,
  firmaPerito TEXT,
  firmaSolicitante TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 2
ALTER TABLE public.solicitudes_servicio ADD COLUMN IF NOT EXISTS titularRfc TEXT;
ALTER TABLE public.solicitudes_servicio ADD COLUMN IF NOT EXISTS rfc TEXT;
ALTER TABLE public.solicitudes_servicio ADD COLUMN IF NOT EXISTS evidencias JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.solicitudes_servicio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo solicitudes" ON public.solicitudes_servicio;
CREATE POLICY "Acceso público completo solicitudes" ON public.solicitudes_servicio FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.solicitudes_servicio TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 3: CONDICIONES OPERATIVAS Y DE MANTENIMIENTO NOM-001
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.condiciones_operativas (
  id TEXT PRIMARY KEY,
  folio TEXT,
  claveExpediente TEXT,
  fechaInspeccion TEXT,
  nombreComercial TEXT,
  razonSocial TEXT,
  rfc TEXT,
  titularRfc TEXT,
  giro TEXT,
  calleNumero TEXT,
  colonia TEXT,
  municipio TEXT,
  ciudadEstado TEXT,
  codigoPostal TEXT,
  telefono TEXT,
  contacto TEXT,
  tipoInstalacion TEXT,
  tensionOperacion TEXT,
  capacidadTransformadorKva NUMERIC,
  demandaMedidaKw NUMERIC,
  resistenciaTierraOhms NUMERIC,
  estadoSubestacion TEXT,
  estadoTableros TEXT,
  estadoConductoresCanalizaciones TEXT,
  estadoSistemaTierras TEXT,
  estadoProteccionesSobrecarga TEXT,
  estadoAlumbradoEmergencia TEXT,
  programaMantenimientoVigente BOOLEAN DEFAULT false,
  ultimoMantenimientoFecha TEXT,
  responsableMantenimiento TEXT,
  pruebasAislamientoMegger TEXT,
  pruebasTermografiaInfrarroja TEXT,
  limpiezaOrdenCuartoElectrico TEXT,
  equipoProteccionPersonalYRotulacion TEXT,
  dictamenCondiciones TEXT,
  plazoCorreccionDias NUMERIC,
  accionesRequeridas TEXT,
  notasRecomendaciones TEXT,
  evidencias JSONB DEFAULT '[]'::jsonb,
  peritoNombre TEXT,
  peritoAfiliacion TEXT,
  peritoCedula TEXT,
  peritoTelefono TEXT,
  peritoEmail TEXT,
  firmaDigital TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 3
ALTER TABLE public.condiciones_operativas ADD COLUMN IF NOT EXISTS titularRfc TEXT;
ALTER TABLE public.condiciones_operativas ADD COLUMN IF NOT EXISTS rfc TEXT;
ALTER TABLE public.condiciones_operativas ADD COLUMN IF NOT EXISTS evidencias JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.condiciones_operativas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo condiciones" ON public.condiciones_operativas;
CREATE POLICY "Acceso público completo condiciones" ON public.condiciones_operativas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.condiciones_operativas TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 4: EVALUACIONES DE SEGURIDAD ELÉCTRICA (PÁGINAS 5 A 8)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.evaluaciones_seguridad (
  id TEXT PRIMARY KEY,
  folio TEXT,
  claveExpediente TEXT,
  fechaEvaluacion TEXT,
  razonSocial TEXT,
  nombreComercial TEXT,
  rfc TEXT,
  titularRfc TEXT,
  giro TEXT,
  calleNumero TEXT,
  colonia TEXT,
  municipio TEXT,
  ciudadEstado TEXT,
  codigoPostal TEXT,
  telefono TEXT,
  representanteLegal TEXT,
  companiaSuministradora TEXT,
  noServicioRpu TEXT,
  tarifaSuministro TEXT,
  tensionSuministro TEXT,
  frecuenciaHz NUMERIC,
  fasesHilos TEXT,
  tipoSubestacion TEXT,
  capacidadTransformadorKva NUMERIC,
  marcaNumeroSerie TEXT,
  tipoEnfriamiento TEXT,
  nivelEstadoAceite TEXT,
  proteccionFisicaCercaCandado TEXT,
  electrodoTierraConexion TEXT,
  resistenciaTierraMedidaOhms NUMERIC,
  sistemaPararrayosBajantes TEXT,
  gabineteTipoNema TEXT,
  directorioCircuitosIdentificado TEXT,
  cubiertaFrontalProteccionContacto TEXT,
  espacioReservaEspaciosVacios TEXT,
  interruptorPrincipalCapacidadA NUMERIC,
  coordinacionProtecciones TEXT,
  proteccionFallaTierraGfci TEXT,
  estadoInterruptoresTermomagneticos TEXT,
  tipoConductorAislamiento TEXT,
  codigoColoresNormativo TEXT,
  canalizacionesTuberiasCharolas TEXT,
  factorLlenadoCanalizaciones TEXT,
  espacioTrabajoTableros TEXT,
  puertasAccesoEscape TEXT,
  senalesAdvertenciaRiesgoElectrico TEXT,
  diagramaUnifilarActualizado TEXT,
  tapetesDielectricosAislantes TEXT,
  iluminacionNormalYEmergencia TEXT,
  extintorTipoCo2PqsCercano TEXT,
  disponibilidadEppDielectrico TEXT,
  medicionTensionFasesV TEXT,
  pruebaAislamientoMegger TEXT,
  termografiaInfrarroja TEXT,
  evidencias JSONB DEFAULT '[]'::jsonb,
  noConformidadesDetectadas TEXT,
  medidasCorrectivasInmediatas TEXT,
  plazoSubsanacionDias NUMERIC,
  calificacionSeguridad TEXT,
  peritoNombre TEXT,
  peritoAfiliacion TEXT,
  peritoCedula TEXT,
  peritoTelefono TEXT,
  peritoEmail TEXT,
  firmaDigital TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 4
ALTER TABLE public.evaluaciones_seguridad ADD COLUMN IF NOT EXISTS titularRfc TEXT;
ALTER TABLE public.evaluaciones_seguridad ADD COLUMN IF NOT EXISTS rfc TEXT;
ALTER TABLE public.evaluaciones_seguridad ADD COLUMN IF NOT EXISTS evidencias JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.evaluaciones_seguridad ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo evaluaciones" ON public.evaluaciones_seguridad;
CREATE POLICY "Acceso público completo evaluaciones" ON public.evaluaciones_seguridad FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.evaluaciones_seguridad TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 5: MEDICIONES DE VARIABLES ELÉCTRICAS (PÁGINA 9)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.mediciones_electricas (
  id TEXT PRIMARY KEY,
  folio TEXT,
  claveExpediente TEXT,
  fechaMedicion TEXT,
  nombreRazonSocial TEXT,
  nombreComercial TEXT,
  rfc TEXT,
  titularRfc TEXT,
  domicilioCompleto TEXT,
  municipioEstado TEXT,
  codigoPostal TEXT,
  telefono TEXT,
  solicitante TEXT,
  solicitanteTelefono TEXT,
  giro TEXT,
  instrumentoNombre TEXT,
  instrumentoMarca TEXT,
  instrumentoModelo TEXT,
  instrumentoSerie TEXT,
  instrumentoCalibracion TEXT,
  tensionF1F2 NUMERIC,
  tensionF2F3 NUMERIC,
  tensionF3F1 NUMERIC,
  tensionPromedioFF NUMERIC,
  tensionF1N NUMERIC,
  tensionF2N NUMERIC,
  tensionF3N NUMERIC,
  tensionPromedioFN NUMERIC,
  tensionNT NUMERIC,
  evaluacionTension TEXT,
  corrienteF1 NUMERIC,
  corrienteF2 NUMERIC,
  corrienteF3 NUMERIC,
  corrienteNeutro NUMERIC,
  desbalanceCorrientePorcentaje NUMERIC,
  evaluacionCorriente TEXT,
  potenciaActivaKw NUMERIC,
  potenciaReactivaKvar NUMERIC,
  potenciaAparenteKva NUMERIC,
  factorPotenciaF1 NUMERIC,
  factorPotenciaF2 NUMERIC,
  factorPotenciaF3 NUMERIC,
  factorPotenciaTotal NUMERIC,
  capacidadSubestacionKva NUMERIC,
  porcentajeUtilizacionCapacidad NUMERIC,
  evaluacionFactorPotencia TEXT,
  polaridadContactos TEXT,
  pruebaGfciDisparo TEXT,
  spatMetodo TEXT,
  spatPuntoMedicion TEXT,
  spatResistenciaMedidaOhms NUMERIC,
  spatValorMaximoPermitidoOhms NUMERIC,
  spatDictamen TEXT,
  descripcionTecnica TEXT,
  evidencias JSONB DEFAULT '[]'::jsonb,
  peritoNombre TEXT,
  peritoAfiliacion TEXT,
  peritoCedula TEXT,
  peritoTelefono TEXT,
  peritoEmail TEXT,
  firmaDigital TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 5
ALTER TABLE public.mediciones_electricas ADD COLUMN IF NOT EXISTS titularRfc TEXT;
ALTER TABLE public.mediciones_electricas ADD COLUMN IF NOT EXISTS rfc TEXT;
ALTER TABLE public.mediciones_electricas ADD COLUMN IF NOT EXISTS evidencias JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.mediciones_electricas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo mediciones" ON public.mediciones_electricas;
CREATE POLICY "Acceso público completo mediciones" ON public.mediciones_electricas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.mediciones_electricas TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 6: DIAGRAMAS UNIFILARES GENERALES
-- (Soporta explícitamente tanto 'titularRfc' como 'rfc' para evitar error 42703)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.diagramas_unifilares (
  id TEXT PRIMARY KEY,
  folio TEXT,
  claveExpediente TEXT,
  titulo TEXT,
  fecha TEXT,
  titularNombreComercial TEXT,
  titularRazonSocial TEXT,
  titularRfc TEXT,
  rfc TEXT,
  titularDireccion TEXT,
  peritoNombre TEXT,
  peritoAfiliacion TEXT,
  peritoCedula TEXT,
  imagenDataUrl TEXT,
  orientacion TEXT DEFAULT 'horizontal',
  ajusteModo TEXT DEFAULT 'carta_completa',
  rotacionGrados NUMERIC DEFAULT 0,
  notasTecnicas TEXT,
  subestacionKva NUMERIC,
  tensionPrimaria TEXT,
  tensionSecundaria TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 6: Agregan 'rfc' y 'titularRfc' si la tabla ya existía
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS rfc TEXT;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS titularRfc TEXT;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS titularDireccion TEXT;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS orientacion TEXT DEFAULT 'horizontal';
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS ajusteModo TEXT DEFAULT 'carta_completa';
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS rotacionGrados NUMERIC DEFAULT 0;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS notasTecnicas TEXT;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS subestacionKva NUMERIC;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS tensionPrimaria TEXT;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS tensionSecundaria TEXT;
ALTER TABLE public.diagramas_unifilares ADD COLUMN IF NOT EXISTS esMuestra BOOLEAN DEFAULT false;

ALTER TABLE public.diagramas_unifilares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo diagramas" ON public.diagramas_unifilares;
CREATE POLICY "Acceso público completo diagramas" ON public.diagramas_unifilares FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.diagramas_unifilares TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 7: CÉDULA PROFESIONAL DEL PERITO
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.cedula_perito (
  id TEXT PRIMARY KEY,
  peritoNombre TEXT,
  numeroCedula TEXT,
  profesion TEXT,
  institucionEmisora TEXT,
  fechaExpedicion TEXT,
  curp TEXT,
  folioRegistro TEXT,
  imagenDataUrl TEXT,
  anchoCompleto BOOLEAN DEFAULT true,
  observaciones TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 7
ALTER TABLE public.cedula_perito ADD COLUMN IF NOT EXISTS anchoCompleto BOOLEAN DEFAULT true;
ALTER TABLE public.cedula_perito ADD COLUMN IF NOT EXISTS observaciones TEXT;
ALTER TABLE public.cedula_perito ADD COLUMN IF NOT EXISTS curp TEXT;
ALTER TABLE public.cedula_perito ADD COLUMN IF NOT EXISTS folioRegistro TEXT;

ALTER TABLE public.cedula_perito ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo cedula" ON public.cedula_perito;
CREATE POLICY "Acceso público completo cedula" ON public.cedula_perito FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.cedula_perito TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 8: CERTIFICADO OFICIAL CFP (PERITO DICTAMINADOR)
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.certificado_perito (
  id TEXT PRIMARY KEY,
  tituloCertificado TEXT,
  colegioEmisor TEXT,
  peritoNombre TEXT,
  numeroRegistro TEXT,
  numeroCedula TEXT,
  especialidad TEXT,
  vigencia TEXT,
  fechaEmision TEXT,
  imagenDataUrl TEXT,
  ajusteCompleto BOOLEAN DEFAULT true,
  observaciones TEXT,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 8
ALTER TABLE public.certificado_perito ADD COLUMN IF NOT EXISTS ajusteCompleto BOOLEAN DEFAULT true;
ALTER TABLE public.certificado_perito ADD COLUMN IF NOT EXISTS observaciones TEXT;

ALTER TABLE public.certificado_perito ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo certificado" ON public.certificado_perito;
CREATE POLICY "Acceso público completo certificado" ON public.certificado_perito FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.certificado_perito TO anon, authenticated, service_role;

-- ==============================================================
-- TABLA 9: AGENDA DE CITAS Y VISITAS TÉCNICAS PERICIALES
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.agenda_citas (
  id TEXT PRIMARY KEY,
  clienteNombre TEXT NOT NULL,
  representante TEXT,
  recomendadoPor TEXT,
  direccionEmpresa TEXT,
  telefonos TEXT,
  whatsapp TEXT,
  correoElectronico TEXT,
  fechaCita TEXT NOT NULL,
  horaCita TEXT NOT NULL,
  duracionMinutos NUMERIC DEFAULT 60,
  tipoServicio TEXT,
  motivoNotas TEXT,
  peritoAsignado TEXT,
  folioDictamenRelacionado TEXT,
  estado TEXT DEFAULT 'Programada',
  recordatorioMinutos NUMERIC DEFAULT 30,
  esMuestra BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Migraciones automáticas Tabla 9
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS representante TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS recomendadoPor TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS direccionEmpresa TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS telefonos TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS correoElectronico TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS duracionMinutos NUMERIC DEFAULT 60;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS folioDictamenRelacionado TEXT;
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'Programada';
ALTER TABLE public.agenda_citas ADD COLUMN IF NOT EXISTS recordatorioMinutos NUMERIC DEFAULT 30;

CREATE INDEX IF NOT EXISTS idx_agenda_citas_fecha ON public.agenda_citas(fechaCita);
CREATE INDEX IF NOT EXISTS idx_agenda_citas_estado ON public.agenda_citas(estado);

ALTER TABLE public.agenda_citas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso público completo agenda" ON public.agenda_citas;
CREATE POLICY "Acceso público completo agenda" ON public.agenda_citas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE public.agenda_citas TO anon, authenticated, service_role;

-- ==============================================================
-- LIMPIEZA / PURGA DE DATOS DE MUESTRA EN LAS 9 TABLAS
-- (Elimina registros demo para que tu base de datos opere 100% limpia)
-- ==============================================================
DELETE FROM public.revisiones_electricas WHERE esMuestra = true OR id IN ('rep-359', 'rep-360', 'rep-361', 'rep-sample-359', 'rep-sample-360', 'rep-sample-361');
DELETE FROM public.solicitudes_servicio WHERE esMuestra = true OR id IN ('sol-01', 'req-sample-088');
DELETE FROM public.condiciones_operativas WHERE esMuestra = true OR id IN ('com-088', 'cond-sample-088');
DELETE FROM public.evaluaciones_seguridad WHERE esMuestra = true OR id IN ('eval-055');
DELETE FROM public.mediciones_electricas WHERE esMuestra = true OR id IN ('med-359', 'med-sample-359');
DELETE FROM public.diagramas_unifilares WHERE esMuestra = true OR id IN ('diag-sample-01');
DELETE FROM public.cedula_perito WHERE esMuestra = true OR id IN ('cedula-perito-01');
DELETE FROM public.certificado_perito WHERE esMuestra = true OR id IN ('cert-perito-01');
DELETE FROM public.agenda_citas WHERE esMuestra = true OR id IN ('cita-001', 'cita-002', 'cita-003', 'cita-004');

-- Permisos completos de esquema para los roles de Supabase
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
`;
