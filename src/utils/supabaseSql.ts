/**
 * Script SQL para Supabase (PostgreSQL)
 * Proyecto: are.com's Project
 * Project ID: ggxliydxwcylilanitzk
 * 
 * Contiene:
 * 1. Definición de tabla 'revisiones_electricas' con todos sus campos
 * 2. Políticas de Seguridad (RLS) para lectura/escritura con clave Anon
 * 3. Datos de muestra oficiales iniciales (Folio 359, 360, 361)
 * 4. Instrucciones y queries de mantenimiento (borrado selectivo y total)
 */

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================
-- COLEGIO FEDERAL DE PERITOS (CFP) • SISTEMA DE DICTÁMENES ELÉCTRICOS
-- PROYECTO SUPABASE: are.com's Project (ID: ggxliydxwcylilanitzk)
-- ARCHIVO DE MIGRACIÓN & DATOS DE MUESTRA NOM-001-SEDE-2012
-- ==============================================================

-- 1. Habilitar extensión UUID (opcional pero recomendada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla principal 'revisiones_electricas'
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

-- 3. Índices para acelerar búsquedas de folios y titulares
CREATE INDEX IF NOT EXISTS idx_rev_folio ON public.revisiones_electricas(folio);
CREATE INDEX IF NOT EXISTS idx_rev_titular ON public.revisiones_electricas(titularNombreComercial);
CREATE INDEX IF NOT EXISTS idx_rev_es_muestra ON public.revisiones_electricas(esMuestra);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.revisiones_electricas ENABLE ROW LEVEL SECURITY;

-- 5. Crear Políticas de Acceso para clave Anon (Lectura, Inserción, Actualización y Borrado)
DROP POLICY IF EXISTS "Acceso total lectura revisiones" ON public.revisiones_electricas;
DROP POLICY IF EXISTS "Acceso total insercion revisiones" ON public.revisiones_electricas;
DROP POLICY IF EXISTS "Acceso total actualizacion revisiones" ON public.revisiones_electricas;
DROP POLICY IF EXISTS "Acceso total eliminacion revisiones" ON public.revisiones_electricas;
DROP POLICY IF EXISTS "Acceso público completo revisiones" ON public.revisiones_electricas;

CREATE POLICY "Acceso público completo revisiones"
  ON public.revisiones_electricas
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Conceder permisos DML al esquema público
GRANT ALL ON TABLE public.revisiones_electricas TO anon;
GRANT ALL ON TABLE public.revisiones_electricas TO authenticated;
GRANT ALL ON TABLE public.revisiones_electricas TO service_role;

-- 7. Trigger para actualizar columna updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.revisiones_electricas;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.revisiones_electricas
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================
-- 8. INSERCIÓN DE DATOS DE MUESTRA OFICIALES (FOLIO 359, 360, 361)
-- ==============================================================

INSERT INTO public.revisiones_electricas (
  id,
  folio,
  claveExpediente,
  fecha,
  tipoInstalacionPrincipal,
  giroInstalacion,
  tensionSuministro,
  clasificacionInstalacion,
  tipoServicio,
  capacidadSubestacionKva,
  cargaInstaladaKw,
  titularNombreComercial,
  titularRazonSocial,
  titularRfc,
  titularCalleNumero,
  titularColonia,
  titularMunicipio,
  titularCiudadEstado,
  titularCodigoPostal,
  titularTelefono,
  solicitanteNombre,
  solicitanteTelefono,
  peritoNombre,
  peritoAfiliacion,
  peritoCedula,
  peritoEmail,
  peritoTelefono,
  resultadoDictamen,
  observaciones,
  vigenciaHasta,
  esMuestra
) VALUES 
(
  'rep-sample-359',
  '359',
  'CFP0125/PCIEMBT/IOA/0071/14XII20 - 359/2026',
  '02-oct-26',
  'Media y Baja Tensión',
  'COMERCIO AL POR MENOR DE ABARROTES, ALIMENTOS, BEBIDAS, HIELO Y TABACO',
  '1000 V o más',
  'Lugar de concentración pública',
  'Revisión periódica',
  75.0,
  27.25,
  'ABARROTES AZTECA SUC. TIJERAS',
  'ABARROTES AZTECA TIJERAS S.A DE C.V',
  'AAT170629U46',
  'JUAN DE BAEZA #600',
  'DIECIOCHO DE MAYO',
  'MORELIA',
  'MORELIA, MICHOACÁN',
  '58258',
  '4433234075',
  'VICTOR DANIEL RIOS RAMIREZ',
  '4438573253',
  'Ing. Israel Orozco Arias',
  'CFP0125/PCIEMBT/IOA/0071/14XII20',
  '15240154',
  'israel9b@hotmail.com',
  '4431748638',
  'Favorable (Aprobado)',
  'Cumple cabalmente con las especificaciones y normativas de la NOM-001-SEDE-2012 en materia de seguridad eléctrica para media y baja tensión.',
  '02-oct-28',
  true
),
(
  'rep-sample-360',
  '360',
  'CFP0125/PCIEMBT/IOA/0071/14XII20 - 360/2026',
  '15-oct-26',
  'Baja Tensión',
  'FARMACIAS CON MINISUPER Y CONSULTORIO MÉDICO ANEXO',
  'Menos de 1000 V',
  'Lugar de concentración pública',
  'Servicio Nuevo',
  45.0,
  18.50,
  'FARMACIAS SAN FRANCISCO SUC. CENTRO',
  'FARMACIAS SAN FRANCISCO DE MICHOACÁN S.A. DE C.V.',
  'FSF190312KP8',
  'AV. MADERO PONIENTE #1420',
  'CENTRO HISTÓRICO',
  'MORELIA',
  'MORELIA, MICHOACÁN',
  '58000',
  '4433128900',
  'LIC. CARLOS EDUARDO VEGA SOLÍS',
  '4431892044',
  'Ing. Israel Orozco Arias',
  'CFP0125/PCIEMBT/IOA/0071/14XII20',
  '15240154',
  'israel9b@hotmail.com',
  '4431748638',
  'Favorable (Aprobado)',
  'Subestación tipo poste y sistema de tierras verificado conforme a NOM-001-SEDE-2012 Art. 250.',
  '15-oct-28',
  true
),
(
  'rep-sample-361',
  '361',
  'CFP0125/PCIEMBT/IOA/0071/14XII20 - 361/2026',
  '09-nov-26',
  'Media y Baja Tensión',
  'UNIDAD MÉDICA Y LABORATORIO DE ANÁLISIS CLÍNICOS',
  '1000 V o más',
  'Lugar de concentración pública',
  'Modificación de instalación',
  112.5,
  42.80,
  'CENTRO MÉDICO Y LABORATORIOS MORELIA',
  'SERVICIOS INTEGRALES DE SALUD MORELIA S.C.',
  'SIS150821M99',
  'CALLE MANUEL MUÑIZ #450',
  'VENTURA PUENTE',
  'MORELIA',
  'MORELIA, MICHOACÁN',
  '58020',
  '4433405510',
  'DRA. PATRICIA ALONSO CÁRDENAS',
  '4432109845',
  'Ing. Israel Orozco Arias',
  'CFP0125/PCIEMBT/IOA/0071/14XII20',
  '15240154',
  'israel9b@hotmail.com',
  '4431748638',
  'Condicionado',
  'Requiere sustitución de 2 interruptores termomagnéticos por tipo GFCI en área húmeda de laboratorio antes de la emisión final definitiva.',
  '09-nov-26',
  true
)
ON CONFLICT (id) DO UPDATE SET
  folio = EXCLUDED.folio,
  claveExpediente = EXCLUDED.claveExpediente,
  fecha = EXCLUDED.fecha,
  tipoInstalacionPrincipal = EXCLUDED.tipoInstalacionPrincipal,
  giroInstalacion = EXCLUDED.giroInstalacion,
  tensionSuministro = EXCLUDED.tensionSuministro,
  clasificacionInstalacion = EXCLUDED.clasificacionInstalacion,
  tipoServicio = EXCLUDED.tipoServicio,
  capacidadSubestacionKva = EXCLUDED.capacidadSubestacionKva,
  cargaInstaladaKw = EXCLUDED.cargaInstaladaKw,
  titularNombreComercial = EXCLUDED.titularNombreComercial,
  titularRazonSocial = EXCLUDED.titularRazonSocial,
  titularRfc = EXCLUDED.titularRfc,
  resultadoDictamen = EXCLUDED.resultadoDictamen,
  observaciones = EXCLUDED.observaciones,
  updated_at = timezone('utc'::text, now());

-- ==============================================================
-- COMANDOS ÚTILES PARA EL USUARIO / ADMINISTRADOR
-- ==============================================================
-- Borrar SOLO los datos de muestra en Supabase:
-- DELETE FROM public.revisiones_electricas WHERE esMuestra = true;
--
-- Borrar TODOS los registros (muestra y nuevos):
-- TRUNCATE TABLE public.revisiones_electricas;
--
-- Consultar todos los dictámenes ordenados por folio:
-- SELECT folio, titularNombreComercial, resultadoDictamen, fecha, esMuestra FROM public.revisiones_electricas ORDER BY folio ASC;
`;
