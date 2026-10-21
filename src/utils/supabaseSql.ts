/**
 * Script SQL Completo para Supabase (PostgreSQL)
 * Proyecto: are.com's Project (ID: ggxliydxwcylilanitzk)
 * 
 * Contiene la definición y migraciones idempotentes de las 8 tablas oficiales del sistema CFP:
 * 1. revisiones_electricas (Dictámenes / Revisiones Principales NOM-001)
 * 2. solicitudes_servicio (Solicitudes de Servicios Eléctricos)
 * 3. condiciones_operativas (Condiciones Operativas de Seguridad NOM-001)
 * 4. evaluaciones_seguridad (Evaluación Integral de Seguridad Páginas 5 a 8)
 * 5. mediciones_electricas (Formato Técnico de Mediciones Eléctricas Página 9)
 * 6. diagramas_unifilares (Diagrama Unifilar General en Tamaño Carta - Soporta titularRfc y rfc)
 * 7. cedula_perito (Cédula Profesional del Perito Dictaminador)
 * 8. certificado_perito (Certificado de Acreditación como Perito Dictaminador CFP)
 */

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================
-- COLEGIO FEDERAL DE PERITOS (CFP) • SISTEMA DE INGENIERÍA ELÉCTRICA
-- PROYECTO SUPABASE: are.com's Project (ID: ggxliydxwcylilanitzk)
-- SCRIPT INTEGRAL DE 8 TABLAS: MIGRACIÓN & DATOS DE MUESTRA NOM-001-SEDE-2012
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
-- DATOS INICIALES DE MUESTRA (NOM-001-SEDE-2012 Y EJEMPLOS REALES)
-- ==============================================================

-- 1. Revisión Eléctrica Principal
INSERT INTO public.revisiones_electricas (
  id, folio, claveExpediente, fecha, tipoInstalacionPrincipal, giroInstalacion,
  tensionSuministro, clasificacionInstalacion, clasificacionOtroDetalle, tipoServicio,
  capacidadSubestacionKva, cargaInstaladaKw, titularNombreComercial, titularRazonSocial,
  titularRfc, rfc, titularCalleNumero, titularColonia, titularMunicipio, titularCiudadEstado,
  titularCodigoPostal, titularTelefono, solicitanteNombre, solicitanteTelefono,
  peritoNombre, peritoAfiliacion, peritoCedula, peritoEmail, peritoTelefono,
  resultadoDictamen, observaciones, vigenciaHasta, esMuestra
) VALUES (
  'rep-sample-359', '359', 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026', '02-oct-26',
  'Media y Baja Tensión', 'COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO',
  '1000 V o más', 'Lugar de concentración pública', '', 'Revisión periódica',
  75.0, 25.0, 'ABARROTES AZTECA SUC. TIJERAS', 'ABARROTES AZTECA TIJERAS S.A DE C.V',
  'AAT170629U46', 'AAT170629U46', 'JUAN DE BAEZA #600', 'DIECIOCHO DE MAYO', 'MORELIA',
  'MORELIA, MICHOACÁN', '58258', '4433234075', 'VICTOR DANIEL RIOS RAMIREZ', '4438573253',
  'Ing. Israel Orozco Arias', 'CFP0125/PCIEMBT/IOA/0071/14XII20', '15240154',
  'israel9b@hotmail.com', '4431748638', 'Favorable (Aprobado)',
  'Evaluación técnica de cumplimiento de la NOM-001-SEDE-2012. Instalación en óptimas condiciones de seguridad.',
  '02-oct-28', true
) ON CONFLICT (id) DO UPDATE SET
  titularNombreComercial = EXCLUDED.titularNombreComercial,
  fecha = EXCLUDED.fecha;

-- 2. Solicitud de Servicio
INSERT INTO public.solicitudes_servicio (
  id, folio, fechaVisita, peritoRegistroCfp, peritoCedula, peritoTelefono, peritoEmail,
  peritoNombre, nombreComercial, nombreRazonSocial, rfc, titularRfc, calleNumero,
  coloniaPoblacion, municipioDelegacion, ciudadEstado, codigoPostal, telefonoInstalacion,
  solicitanteNombre, solicitanteTelefono, esMuestra
) VALUES (
  'req-sample-088', '088', '19-oct-26', 'CFP0125/PCIEMBT/IOA/0071/14XII20', '15240154',
  '4431748638', 'israel9b@hotmail.com', 'Ing. Israel Orozco Arias',
  'ABARROTES AZTECA SUC. TIJERAS', 'ABARROTES AZTECA TIJERAS S.A DE C.V',
  'AAT170629U46', 'AAT170629U46', 'JUAN DE BAEZA #600', 'DIECIOCHO DE MAYO', 'MORELIA',
  'MORELIA, MICHOACÁN', '58258', '4433234075', 'VICTOR DANIEL RIOS RAMIREZ', '4438573253', true
) ON CONFLICT (id) DO UPDATE SET
  nombreComercial = EXCLUDED.nombreComercial;

-- 3. Condiciones Operativas NOM-001
INSERT INTO public.condiciones_operativas (
  id, folio, claveExpediente, fechaInspeccion, nombreComercial, razonSocial, rfc, titularRfc,
  giro, calleNumero, colonia, municipio, ciudadEstado, codigoPostal, telefono, contacto,
  tipoInstalacion, tensionOperacion, capacidadTransformadorKva, demandaMedidaKw,
  resistenciaTierraOhms, estadoSubestacion, estadoTableros, estadoConductoresCanalizaciones,
  estadoSistemaTierras, estadoProteccionesSobrecarga, estadoAlumbradoEmergencia,
  programaMantenimientoVigente, ultimoMantenimientoFecha, responsableMantenimiento,
  pruebasAislamientoMegger, pruebasTermografiaInfrarroja, limpiezaOrdenCuartoElectrico,
  equipoProteccionPersonalYRotulacion, dictamenCondiciones, plazoCorreccionDias,
  accionesRequeridas, notasRecomendaciones, peritoNombre, peritoAfiliacion, peritoCedula,
  peritoTelefono, peritoEmail, esMuestra
) VALUES (
  'cond-sample-088', 'COM-088', 'CFP0125/COM/IOA/0088/2026', '19-oct-26',
  'ABARROTES AZTECA SUC. TIJERAS', 'ABARROTES AZTECA TIJERAS S.A DE C.V', 'AAT170629U46', 'AAT170629U46',
  'COMERCIO AL POR MENOR DE ABARROTES', 'JUAN DE BAEZA #600', 'DIECIOCHO DE MAYO', 'MORELIA',
  'MORELIA, MICHOACÁN', '58258', '4433234075', 'VICTOR DANIEL RIOS RAMIREZ',
  'Media y Baja Tensión', '13,200 V / 220-127 V', 75, 24.8, 4.8,
  'Satisfactorio', 'Satisfactorio', 'Satisfactorio', 'Satisfactorio', 'Satisfactorio', 'Satisfactorio',
  true, '15-ago-26', 'Ing. Israel Orozco Arias', 'Conforme', 'Sin Puntos Calientes',
  'Excelente', 'Completo', 'Favorable (Aprobado)', 0,
  'Continuar con el programa preventivo semestral.',
  'La instalación cumple satisfactoriamente con los requerimientos operativos de la NOM-001-SEDE-2012.',
  'Ing. Israel Orozco Arias', 'CFP0125/PCIEMBT/IOA/0071/14XII20', '15240154', '4431748638',
  'israel9b@hotmail.com', true
) ON CONFLICT (id) DO UPDATE SET
  nombreComercial = EXCLUDED.nombreComercial;

-- 4. Mediciones eléctricas (Página 9)
INSERT INTO public.mediciones_electricas (
  id, folio, claveExpediente, fechaMedicion, nombreRazonSocial, nombreComercial, rfc, titularRfc,
  domicilioCompleto, municipioEstado, codigoPostal, telefono, solicitante, solicitanteTelefono,
  giro, instrumentoNombre, instrumentoMarca, instrumentoModelo, instrumentoSerie,
  instrumentoCalibracion, tensionF1F2, tensionF2F3, tensionF3F1, tensionPromedioFF,
  tensionF1N, tensionF2N, tensionF3N, tensionPromedioFN, tensionNT, evaluacionTension,
  corrienteF1, corrienteF2, corrienteF3, corrienteNeutro, desbalanceCorrientePorcentaje,
  evaluacionCorriente, potenciaActivaKw, potenciaReactivaKvar, potenciaAparenteKva,
  factorPotenciaF1, factorPotenciaF2, factorPotenciaF3, factorPotenciaTotal,
  capacidadSubestacionKva, porcentajeUtilizacionCapacidad, evaluacionFactorPotencia,
  polaridadContactos, pruebaGfciDisparo, spatMetodo, spatPuntoMedicion,
  spatResistenciaMedidaOhms, spatValorMaximoPermitidoOhms, spatDictamen, descripcionTecnica,
  peritoNombre, peritoAfiliacion, peritoCedula, peritoTelefono, peritoEmail, esMuestra
) VALUES (
  'med-sample-359', '359', 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026', '02-oct-26',
  'ABARROTES AZTECA TIJERAS S.A DE C.V', 'ABARROTES AZTECA SUC. TIJERAS', 'AAT170629U46', 'AAT170629U46',
  'JUAN DE BAEZA #600 COL. DIECIOCHO DE MAYO', 'MORELIA, MICHOACÁN', '58258', '4433234075',
  'VICTOR DANIEL RIOS RAMIREZ', '4438573253', 'COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO',
  'Analizador de Calidad de Energía y Multímetro TRMS', 'FLUKE', '435-II / 376 FC', 'FLK-9823412',
  'Vigente al 15-Nov-2027', 220, 221, 219, 220.0, 127.5, 126.8, 127.2, 127.2, 1.2,
  'Conforme NOM-001-SEDE', 68.5, 71.2, 65.8, 14.2, 4.2, 'Carga Balanceada (<10%)',
  27.26, 13.62, 30.48, 0.89, 0.91, 0.90, 0.90, 75, 49.99, 'Aceptable CFE (>0.90)',
  'Correcta (Fase en ranura corta, Neutro en ranura larga, Tierra conectada)',
  'Disparo Correcto (<25ms)', 'Caída de Potencial (Método Wenner 3 Puntas)',
  'Pozo de Tierra No. 1 - Subestación Principal', 4.8, 25, 'CUMPLE NORMATIVA (≤ 25 Ω)',
  'Mediciones realizadas en bornes del secundario del transformador pedestal de 75 kVA y tablero general.',
  'Ing. Israel Orozco Arias', 'CFP0125/PCIEMBT/IOA/0071/14XII20', '15240154', '4431748638',
  'israel9b@hotmail.com', true
) ON CONFLICT (id) DO UPDATE SET
  nombreComercial = EXCLUDED.nombreComercial;

-- 5. Diagrama unifilar inicial (Suministra tanto titularRfc como rfc)
INSERT INTO public.diagramas_unifilares (
  id, folio, claveExpediente, titulo, fecha, titularNombreComercial, titularRazonSocial, titularRfc, rfc,
  peritoNombre, peritoAfiliacion, peritoCedula, orientacion, ajusteModo, subestacionKva,
  tensionPrimaria, tensionSecundaria, esMuestra
) VALUES (
  'diag-sample-01', '359', 'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026',
  'DIAGRAMA UNIFILAR GENERAL - SUBESTACIÓN 75 kVA Y CENTRO DE CARGA',
  '02-oct-26', 'ABARROTES AZTECA SUC. TIJERAS', 'ABARROTES AZTECA TIJERAS S.A DE C.V',
  'AAT170629U46', 'AAT170629U46', 'Ing. Israel Orozco Arias', 'CFP0125/PCIEMBT/IOA/0071/14XII20',
  '15240154', 'horizontal', 'carta_completa', 75, '13.2 kV 3F-3H', '220/127 V 3F-4H', true
) ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  fecha = EXCLUDED.fecha,
  titularNombreComercial = EXCLUDED.titularNombreComercial;

-- 6. Cédula profesional del perito
INSERT INTO public.cedula_perito (
  id, peritoNombre, numeroCedula, profesion, institucionEmisora, fechaExpedicion, curp,
  anchoCompleto, esMuestra, observaciones
) VALUES (
  'cedula-perito-01', 'ING. ISRAEL OROZCO ARIAS', '15240154',
  'INGENIERO ELECTRICISTA / ELECTROMECÁNICO', 'DIRECCIÓN GENERAL DE PROFESIONES - SEP',
  '14-Dic-2020', 'OOAI850914HMNRR01', true, true,
  'Cédula profesional con efectos de patente legal para ejercer la profesión y dictaminación pericial.'
) ON CONFLICT (id) DO UPDATE SET
  peritoNombre = EXCLUDED.peritoNombre;

-- 7. Certificado oficial CFP
INSERT INTO public.certificado_perito (
  id, tituloCertificado, colegioEmisor, peritoNombre, numeroRegistro, numeroCedula,
  especialidad, vigencia, fechaEmision, ajusteCompleto, esMuestra, observaciones
) VALUES (
  'cert-perito-01',
  'CERTIFICADO COMO PERITO DICTAMINADOR DE INSTALACIONES ELÉCTRICAS EN MEDIA Y BAJA TENSIÓN',
  'Colegio Federal de Peritos • Acreditación y Registro Nacional Pericial',
  'ING. ISRAEL OROZCO ARIAS', 'CFP0125/PCIEMBT/IOA/0071/14XII20', '15240154',
  'DICTAMINADOR EN INSTALACIONES ELÉCTRICAS DE MEDIA Y BAJA TENSIÓN (NOM-001-SEDE-2012)',
  '2026 - 2028', '14 de Diciembre de 2020', true, true,
  'Certificación vigente para la firma, evaluación y emisión de dictámenes técnicos periciales.'
) ON CONFLICT (id) DO UPDATE SET
  tituloCertificado = EXCLUDED.tituloCertificado;
`;
