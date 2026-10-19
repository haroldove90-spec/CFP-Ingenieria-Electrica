import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  FileText, 
  Edit3, 
  Trash2, 
  PenTool, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Camera, 
  Upload,
  Calendar,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { ServiceRequest, UserRole } from '../types';
import { exportDocumentToPdf } from '../utils/pdfExport';
import { SignatureModal } from './SignatureModal';
import { CfpLogo } from './CfpLogo';

interface ServiceRequestModuleProps {
  requests: ServiceRequest[];
  activeRole: UserRole;
  onSaveRequest: (request: ServiceRequest) => void;
  onDeleteRequest: (id: string) => void;
  initialMode?: 'document' | 'form' | 'list';
  autoCreate?: boolean;
}

export const ServiceRequestModule: React.FC<ServiceRequestModuleProps> = ({
  requests,
  activeRole,
  onSaveRequest,
  onDeleteRequest,
  initialMode = 'list',
  autoCreate = false,
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    requests.length > 0 ? requests[0].id : ''
  );
  const [viewMode, setViewMode] = useState<'document' | 'form' | 'list'>(initialMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<string | null>(null);

  // Signature modal state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureTarget, setSignatureTarget] = useState<'perito' | 'solicitante'>('perito');

  // Form State
  const [formData, setFormData] = useState<Partial<ServiceRequest>>({});
  const [isEditing, setIsEditing] = useState(false);

  // File & Camera input refs for Reference Photo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0] || null;

  useEffect(() => {
    if (autoCreate || initialMode === 'form') {
      handleStartCreate();
    }
  }, [autoCreate, initialMode]);

  const filteredRequests = requests.filter(r => {
    const term = searchTerm.toLowerCase();
    return (
      (r.nombreComercial && r.nombreComercial.toLowerCase().includes(term)) ||
      (r.nombreRazonSocial && r.nombreRazonSocial.toLowerCase().includes(term)) ||
      (r.solicitanteNombre && r.solicitanteNombre.toLowerCase().includes(term)) ||
      (r.rfc && r.rfc.toLowerCase().includes(term)) ||
      (r.fechaVisita && r.fechaVisita.toLowerCase().includes(term))
    );
  });

  const handleStartCreate = () => {
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).replace('.', '');

    const newReq: Partial<ServiceRequest> = {
      id: `sol-${Date.now()}`,
      folio: `${String(requests.length + 1).padStart(2, '0')}`,
      fechaVisita: dateFormatted,
      peritoRegistroCfp: 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: '15240154',
      peritoTelefono: '4431748638',
      peritoEmail: 'israel9b@hotmail.com',
      peritoNombre: 'ING.ISRAEL OROZCO ARIAS',
      nombreComercial: '',
      nombreRazonSocial: '',
      rfc: '',
      calleNumero: '',
      coloniaPoblacion: '',
      municipioDelegacion: 'MORELIA',
      ciudadEstado: 'MORELIA, MICHOACÁN',
      codigoPostal: '58000',
      telefonoInstalacion: '',
      solicitanteNombre: '',
      solicitanteTelefono: '',
      fotoReferencia: '',
      esMuestra: false,
    };

    setFormData(newReq);
    setIsEditing(false);
    setViewMode('form');
  };

  const handleStartEdit = (req: ServiceRequest) => {
    setFormData({ ...req });
    setIsEditing(true);
    setViewMode('form');
  };

  // Process reference image file with compression
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1400;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressed);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUploaded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(file);
      setFormData(prev => ({ ...prev, fotoReferencia: dataUrl }));
    } catch (err) {
      console.error('Error al procesar la foto de evidencia:', err);
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreComercial?.trim()) {
      alert('Por favor ingrese el Nombre Comercial.');
      return;
    }

    const requestToSave: ServiceRequest = {
      id: formData.id || `sol-${Date.now()}`,
      folio: formData.folio || '01',
      fechaVisita: formData.fechaVisita || '02-oct-26',
      peritoRegistroCfp: formData.peritoRegistroCfp || 'CFP0125/PCIEMBT/IOA/0071/14XII20',
      peritoCedula: formData.peritoCedula || '15240154',
      peritoTelefono: formData.peritoTelefono || '4431748638',
      peritoEmail: formData.peritoEmail || 'israel9b@hotmail.com',
      peritoNombre: formData.peritoNombre || 'ING.ISRAEL OROZCO ARIAS',
      nombreComercial: (formData.nombreComercial || '').toUpperCase(),
      nombreRazonSocial: (formData.nombreRazonSocial || '').toUpperCase(),
      rfc: (formData.rfc || '').toUpperCase(),
      calleNumero: (formData.calleNumero || '').toUpperCase(),
      coloniaPoblacion: (formData.coloniaPoblacion || '').toUpperCase(),
      municipioDelegacion: (formData.municipioDelegacion || 'MORELIA').toUpperCase(),
      ciudadEstado: (formData.ciudadEstado || 'MORELIA, MICHOACÁN').toUpperCase(),
      codigoPostal: formData.codigoPostal || '',
      telefonoInstalacion: formData.telefonoInstalacion || '',
      solicitanteNombre: (formData.solicitanteNombre || '').toUpperCase(),
      solicitanteTelefono: formData.solicitanteTelefono || '',
      fotoReferencia: formData.fotoReferencia || '',
      firmaPerito: formData.firmaPerito,
      firmaSolicitante: formData.firmaSolicitante,
      esMuestra: false,
    };

    onSaveRequest(requestToSave);
    setSelectedRequestId(requestToSave.id);
    setViewMode('document');
  };

  const handleApplySignature = (signatureDataUrl: string) => {
    if (!selectedRequest) return;
    const updated: ServiceRequest = {
      ...selectedRequest,
      ...(signatureTarget === 'perito' 
        ? { firmaPerito: signatureDataUrl } 
        : { firmaSolicitante: signatureDataUrl }),
    };
    onSaveRequest(updated);
    setPdfNotification(`Firma del ${signatureTarget === 'perito' ? 'Perito' : 'Solicitante'} guardada exitosamente.`);
    setTimeout(() => setPdfNotification(null), 4000);
  };

  const handleExportPdf = async (reqToExport?: ServiceRequest) => {
    const target = reqToExport || selectedRequest;
    if (!target) return;

    if (viewMode !== 'document') {
      setSelectedRequestId(target.id);
      setViewMode('document');
    }

    setIsExportingPdf(true);
    setPdfNotification('Generando Solicitud de Servicios en PDF oficial (Página 2)...');

    setTimeout(async () => {
      try {
        const cleanName = (target.nombreComercial || 'Inmueble').replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Solicitud_de_Servicios_Pagina_2_${cleanName}.pdf`;
        await exportDocumentToPdf('official-solicitud-document', filename, false);
        setPdfNotification('¡Solicitud de Servicios descargada en PDF exitosamente!');
        setTimeout(() => setPdfNotification(null), 4000);
      } catch (err) {
        console.error('Error al exportar Solicitud a PDF:', err);
        setPdfNotification('Error al crear el archivo PDF. Intente de nuevo.');
        setTimeout(() => setPdfNotification(null), 5000);
      } finally {
        setIsExportingPdf(false);
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {pdfNotification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 border border-amber-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{pdfNotification}</span>
        </div>
      )}

      {/* Main Module Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Solicitud de Servicios
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Página 2
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {requests.length} Registradas
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Formato oficial de solicitud de servicios periciales, datos de la instalación y evidencia fotográfica
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lista ({requests.length})
            </button>
            <button
              onClick={() => {
                if (selectedRequest) setViewMode('document');
                else if (requests.length > 0) {
                  setSelectedRequestId(requests[0].id);
                  setViewMode('document');
                }
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'document'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Formato Oficial (Pág. 2)
            </button>
          </div>

          <button
            onClick={handleStartCreate}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva Solicitud</span>
          </button>

          {viewMode === 'document' && selectedRequest && (
            <button
              onClick={() => handleExportPdf()}
              disabled={isExportingPdf}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
              title="Descargar Solicitud en PDF oficial (Página 2)"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Exportar PDF</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>

      {/* ======================================================== */}
      {/* 1. LIST VIEW */}
      {/* ======================================================== */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nombre Comercial, Razón Social, Solicitante..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No hay solicitudes de servicio registradas</p>
              <p className="text-xs text-slate-500">Crea una nueva solicitud con el formato oficial.</p>
              <button
                onClick={handleStartCreate}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Primera Solicitud</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Inmueble / Nombre Comercial</th>
                    <th className="px-4 py-3">Razón Social / RFC</th>
                    <th className="px-4 py-3">Ubicación</th>
                    <th className="px-4 py-3">Solicitante</th>
                    <th className="px-4 py-3">Evidencia / Foto</th>
                    <th className="px-4 py-3">Fecha Visita</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredRequests.map((req) => {
                    const isSelected = req.id === selectedRequestId;
                    return (
                      <tr 
                        key={req.id}
                        className={`hover:bg-slate-50 transition cursor-pointer ${isSelected ? 'bg-amber-50/40' : ''}`}
                        onClick={() => {
                          setSelectedRequestId(req.id);
                          setViewMode('document');
                        }}
                      >
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                          {req.nombreComercial}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="font-medium text-slate-800">{req.nombreRazonSocial || '—'}</div>
                          <div className="text-[10px] font-mono text-slate-500">{req.rfc || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {req.calleNumero}, {req.coloniaPoblacion}, {req.municipioDelegacion}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{req.solicitanteNombre}</div>
                          <div className="text-[10px] font-mono text-slate-500">{req.solicitanteTelefono}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {req.fotoReferencia ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Camera className="w-3 h-3" />
                              Foto adjunta
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Sin foto</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                          {req.fechaVisita}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedRequestId(req.id);
                                setViewMode('document');
                              }}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Ver Formato Oficial (Página 2)"
                            >
                              <FileText className="w-4 h-4 text-amber-600" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(req)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Editar solicitud"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleExportPdf(req)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                              title="Exportar a PDF oficial"
                            >
                              <Download className="w-4 h-4 text-emerald-600" />
                            </button>
                            {activeRole === 'Perito Dictaminador' && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar la solicitud de ${req.nombreComercial}?`)) {
                                    onDeleteRequest(req.id);
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FORM VIEW: RECABAR DATOS EXACTOS DE LA MUESTRA        */}
      {/* ======================================================== */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isEditing ? `Editar Solicitud: ${formData.nombreComercial}` : 'Nueva Solicitud de Servicios (Página 2)'}
              </h3>
              <p className="text-xs text-slate-500">
                Formulario exacto para la emisión oficial de la Solicitud de Servicios del Colegio Federal de Peritos
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          {/* Section: Datos del Perito y Fecha de Visita */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Datos del Perito y Fecha de Visita</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">No. Registro de perito CFP</label>
                <input
                  type="text"
                  value={formData.peritoRegistroCfp || 'CFP0125/PCIEMBT/IOA/0071/14XII20'}
                  onChange={(e) => setFormData({ ...formData, peritoRegistroCfp: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Cédula Profesional</label>
                <input
                  type="text"
                  value={formData.peritoCedula || '15240154'}
                  onChange={(e) => setFormData({ ...formData, peritoCedula: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono del Perito</label>
                <input
                  type="text"
                  value={formData.peritoTelefono || '4431748638'}
                  onChange={(e) => setFormData({ ...formData, peritoTelefono: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.peritoEmail || 'israel9b@hotmail.com'}
                  onChange={(e) => setFormData({ ...formData, peritoEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-blue-700 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fecha de Visita</label>
                <input
                  type="text"
                  value={formData.fechaVisita || '02-oct-26'}
                  onChange={(e) => setFormData({ ...formData, fechaVisita: e.target.value })}
                  placeholder="02-oct-26"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section: Datos de la Instalación */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Datos de la Instalación</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  value={formData.nombreComercial || ''}
                  onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                  placeholder="Ej. ABARROTES AZTECA SUC. TIJERAS"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre o razón social</label>
                <input
                  type="text"
                  value={formData.nombreRazonSocial || ''}
                  onChange={(e) => setFormData({ ...formData, nombreRazonSocial: e.target.value })}
                  placeholder="Ej. ABARROTES AZTECA TIJERAS S.A DE C.V"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">RFC</label>
                <input
                  type="text"
                  value={formData.rfc || ''}
                  onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
                  placeholder="Ej. AAT170629U46"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Calle y No</label>
                <input
                  type="text"
                  value={formData.calleNumero || ''}
                  onChange={(e) => setFormData({ ...formData, calleNumero: e.target.value })}
                  placeholder="Ej. JUAN DE BAEZA #600"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Colonia o Población</label>
                <input
                  type="text"
                  value={formData.coloniaPoblacion || ''}
                  onChange={(e) => setFormData({ ...formData, coloniaPoblacion: e.target.value })}
                  placeholder="Ej. DIECIOCHO DE MAYO"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Municipio o Delegación</label>
                <input
                  type="text"
                  value={formData.municipioDelegacion || 'MORELIA'}
                  onChange={(e) => setFormData({ ...formData, municipioDelegacion: e.target.value })}
                  placeholder="Ej. MORELIA"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Ciudad y Estado</label>
                <input
                  type="text"
                  value={formData.ciudadEstado || 'MORELIA, MICHOACÁN'}
                  onChange={(e) => setFormData({ ...formData, ciudadEstado: e.target.value })}
                  placeholder="Ej. MORELIA, MICHOACÁN"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={formData.codigoPostal || ''}
                    onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                    placeholder="Ej. 58258"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefonoInstalacion || ''}
                    onChange={(e) => setFormData({ ...formData, telefonoInstalacion: e.target.value })}
                    placeholder="Ej. 4433234075"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Solicitante del Servicio */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Solicitante del Servicio</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.solicitanteNombre || ''}
                  onChange={(e) => setFormData({ ...formData, solicitanteNombre: e.target.value })}
                  placeholder="Ej. VICTOR DANIEL RIOS RAMIREZ"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.solicitanteTelefono || ''}
                  onChange={(e) => setFormData({ ...formData, solicitanteTelefono: e.target.value })}
                  placeholder="Ej. 4438573253"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: REFERENCIA - Fotografía de Evidencia */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>REFERENCIA (Fotografía de la Fachada / Inmueble)</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">Requerida para el formato oficial</span>
            </div>

            {/* Hidden Inputs for Direct Camera & Gallery */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUploaded}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUploaded}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isProcessingImage}
                onClick={() => cameraInputRef.current?.click()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>Tomar Foto con Cámara</span>
              </button>

              <button
                type="button"
                disabled={isProcessingImage}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Subir Imagen desde Galería</span>
              </button>

              {formData.fotoReferencia && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, fotoReferencia: '' }))}
                  className="px-3 py-2 text-rose-600 hover:text-rose-800 text-xs font-bold rounded-xl hover:bg-rose-50 transition cursor-pointer"
                >
                  Quitar Foto
                </button>
              )}
            </div>

            {isProcessingImage && (
              <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold p-2">
                <span className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Procesando imagen...</span>
              </div>
            )}

            {/* Photo Preview */}
            {formData.fotoReferencia ? (
              <div className="mt-2 border border-slate-300 rounded-xl overflow-hidden bg-slate-100 max-w-xl">
                <img
                  src={formData.fotoReferencia}
                  alt="Referencia de la Instalación"
                  className="w-full max-h-72 object-cover"
                />
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-1.5 bg-white">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">Aún no se ha cargado la fotografía del inmueble</p>
                <p className="text-[11px] text-slate-400">Pulsa &quot;Tomar Foto&quot; o &quot;Subir Imagen&quot; para adjuntar la evidencia.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              Guardar y Ver Formato Oficial
            </button>
          </div>

        </form>
      )}

      {/* ======================================================== */}
      {/* 3. DOCUMENT VIEW: EXACTO AL FORMATO DE LA MUESTRA        */}
      {/* ======================================================== */}
      {viewMode === 'document' && selectedRequest && (
        <div className="space-y-4">
          
          {/* Document Top Controls Bar */}
          <div className="no-print bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lista</span>
              </button>

              <button
                onClick={() => handleStartEdit(selectedRequest)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <button
                onClick={() => {
                  setSignatureTarget('perito');
                  setIsSignatureModalOpen(true);
                }}
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-700" />
                <span>Firmar Perito</span>
              </button>

              <button
                onClick={() => {
                  setSignatureTarget('solicitante');
                  setIsSignatureModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-slate-600" />
                <span>Firmar Solicitante</span>
              </button>
            </div>

            {/* Export PDF Button */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Formato Oficial • Página 2</span>
              </div>

              <button
                onClick={() => handleExportPdf()}
                disabled={isExportingPdf}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Descargando PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>Exportar PDF</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* ==================================================================== */}
          {/* THE OFFICIAL DOCUMENT CANVAS: EXACT REPLICA OF THE SAMPLE IMAGE      */}
          {/* ==================================================================== */}
          <div className="flex justify-center p-2 sm:p-4 overflow-x-auto bg-slate-200/50 rounded-2xl">
            <div
              id="official-solicitud-document"
              className="w-full max-w-3xl p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 relative print:shadow-none print:border-none print:m-0 print:p-0 bg-white"
              style={{
                fontFamily: '"Times New Roman", Times, serif',
                backgroundColor: '#ffffff',
                backgroundImage: 'none',
              }}
            >
              
              <div className="space-y-4 text-slate-900">
                
                {/* 1. Header: Centered Title + CFP Shield on the top right */}
                <div className="relative flex items-center justify-between pb-1 min-h-[55px]">
                  <div className="w-16"></div>
                  
                  <div className="text-center flex-1">
                    <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-slate-900 uppercase">
                      SOLICITUD DE SERVICIOS
                    </h1>
                  </div>

                  {/* Logo Colegio Federal */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-11 h-11">
                      <CfpLogo size={44} />
                    </div>
                    <div className="flex flex-col text-[8.5px] font-bold leading-tight uppercase font-sans text-slate-800">
                      <span>COLEGIO</span>
                      <span>FEDERAL</span>
                    </div>
                  </div>
                </div>

                {/* 2. Recuadro 1: Datos del Perito y Fecha */}
                <div className="border border-black p-2.5 text-xs font-sans space-y-1.5 leading-tight">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap">No. Registro de perito CFP:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 truncate">
                        {selectedRequest.peritoRegistroCfp || 'CFP0125/PCIEMBT/IOA/0071/14XII20'}
                      </span>
                    </div>
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap">Cédula Profesional:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900">
                        {selectedRequest.peritoCedula || '15240154'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5 flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap">Teléfono:</span>
                      <span className="border-b border-black flex-1 text-slate-900">
                        {selectedRequest.peritoTelefono || '4431748638'}
                      </span>
                    </div>
                    <div className="col-span-7 flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 whitespace-nowrap">Correo electrónico:</span>
                      <span className="border-b border-black flex-1 text-blue-700 truncate underline">
                        {selectedRequest.peritoEmail || 'israel9b@hotmail.com'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-slate-900 whitespace-nowrap">Fecha de Visita:</span>
                    <span className="font-bold border-b border-black w-40 text-slate-900 text-center font-mono">
                      {selectedRequest.fechaVisita || '02-oct-26'}
                    </span>
                  </div>
                </div>

                {/* 3. Recuadro 2: Datos de la Instalación */}
                <div className="border border-black p-2.5 text-xs font-sans space-y-2 leading-tight">
                  <div className="font-bold text-slate-900 text-[12.5px]">
                    Datos de la Instalación:
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">Nombre Comercial:</span>
                      <span className="font-black border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.nombreComercial}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">Nombre o razón social:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.nombreRazonSocial || ''}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">RFC :</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase font-mono">
                        {selectedRequest.rfc || ''}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">Calle y No:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.calleNumero || ''}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">Colonia o Población:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.coloniaPoblacion || ''}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">Municipio o Delegación:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.municipioDelegacion || 'MORELIA'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-36 sm:w-44 whitespace-nowrap">Ciudad y Estado:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.ciudadEstado || 'MORELIA, MICHOACÁN'}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-3 pt-0.5">
                      <div className="col-span-4 flex items-baseline gap-1">
                        <span className="font-semibold text-slate-900 whitespace-nowrap">Código Postal:</span>
                        <span className="font-bold border-b border-black flex-1 text-slate-900 font-mono text-center">
                          {selectedRequest.codigoPostal || ''}
                        </span>
                      </div>
                      <div className="col-span-8 flex items-baseline gap-1">
                        <span className="font-semibold text-slate-900 whitespace-nowrap">Teléfono:</span>
                        <span className="font-bold border-b border-black flex-1 text-slate-900 font-mono">
                          {selectedRequest.telefonoInstalacion || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Recuadro 3: Solicitante del Servicio */}
                <div className="border border-black p-2.5 text-xs font-sans space-y-2 leading-tight">
                  <div className="font-bold text-slate-900 text-[12.5px]">
                    Solicitante del Servicio:
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-24 sm:w-28 whitespace-nowrap">Nombre:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 uppercase">
                        {selectedRequest.solicitanteNombre || ''}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900 w-24 sm:w-28 whitespace-nowrap">Teléfono:</span>
                      <span className="font-bold border-b border-black flex-1 text-slate-900 font-mono">
                        {selectedRequest.solicitanteTelefono || ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Recuadro 4: REFERENCIA (Foto Fachada + Firmas) */}
                <div className="border border-black overflow-hidden font-sans">
                  
                  {/* Gray Title Bar: REFERENCIA */}
                  <div className="bg-slate-200 py-1 text-center font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-black">
                    REFERENCIA
                  </div>

                  {/* Foto de Fachada / Inmueble */}
                  <div className="p-3 bg-white flex justify-center">
                    {selectedRequest.fotoReferencia ? (
                      <div className="w-full max-h-80 overflow-hidden flex items-center justify-center border border-slate-200">
                        <img
                          src={selectedRequest.fotoReferencia}
                          alt="Fachada del Inmueble"
                          className="w-full h-auto max-h-80 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-56 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-center space-y-2 bg-slate-50">
                        <ImageIcon className="w-8 h-8 text-slate-400 stroke-1" />
                        <p className="text-xs font-bold text-slate-600">Espacio asignado para la fotografía de la fachada / inmueble</p>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(selectedRequest)}
                          className="no-print px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                        >
                          Adjuntar Fotografía
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Firmas: Perito y Solicitante */}
                  <div className="grid grid-cols-2 gap-4 px-6 pt-1 pb-3 text-center text-xs">
                    
                    {/* Firma Perito */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="h-14 flex items-center justify-center w-full">
                        {selectedRequest.firmaPerito ? (
                          <img
                            src={selectedRequest.firmaPerito}
                            alt="Firma del Perito"
                            className="max-h-12 object-contain"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSignatureTarget('perito');
                              setIsSignatureModalOpen(true);
                            }}
                            className="no-print text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
                          >
                            [Estampar Firma Perito]
                          </button>
                        )}
                      </div>
                      <div className="w-full border-b border-black mb-1"></div>
                      <div className="font-bold text-slate-900 text-[11.5px] uppercase">
                        {selectedRequest.peritoNombre || 'ING.ISRAEL OROZCO ARIAS'}
                      </div>
                      <div className="text-[10px] text-slate-800">
                        Cédula Profesional: {selectedRequest.peritoCedula || '15240154'}
                      </div>
                    </div>

                    {/* Firma Solicitante */}
                    <div className="flex flex-col items-center justify-end">
                      <div className="h-14 flex items-center justify-center w-full">
                        {selectedRequest.firmaSolicitante ? (
                          <img
                            src={selectedRequest.firmaSolicitante}
                            alt="Firma del Solicitante"
                            className="max-h-12 object-contain"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSignatureTarget('solicitante');
                              setIsSignatureModalOpen(true);
                            }}
                            className="no-print text-[11px] text-slate-600 font-bold hover:underline cursor-pointer"
                          >
                            [Estampar Firma Solicitante]
                          </button>
                        )}
                      </div>
                      <div className="w-full border-b border-black mb-1"></div>
                      <div className="text-[11px] font-normal text-slate-900">
                        Solicitante
                      </div>
                      <div className="font-bold text-slate-900 text-[11px] uppercase">
                        {selectedRequest.solicitanteNombre || 'SOLICITANTE'}
                      </div>
                    </div>

                  </div>

                </div>

                {/* 6. Recuadro 5: Aviso de Privacidad Legal (Tratamiento de Datos) */}
                <div className="border border-black p-2.5 text-[9.5px] sm:text-[10px] leading-relaxed text-justify font-sans text-slate-800">
                  El perito tratará los datos personales del solicitante exclusivamante para llevar a cabo las actividades de dictaminación de la instalación eléctrica del inmueble referenciado en el campo datos de la instalación. Asimismo el perito tratará los datos personales o comerciales para otras finalidades como enviar notificación de ofertas, avisos y/o mensajes promocionales; comunicaciones con fines de mercadotecnia, publicidad o telemarketing sobre productos y servicios nuevos o existentes ya sean propios o de socios comerciales. Puede oponerse al tratamiento de sus datos para las finalidades secundarias a través de los medios puestos a su disposición para el ejercicio de sus derechos. En caso de no oponerse en un plazo de cinco días hábiles posteriores a que sus datos fueron recabados, se entenderá que ha otorgado su consentimiento.
                </div>

                {/* 7. Page Footer: Página 2 */}
                <div className="pt-2 text-right text-xs font-serif text-slate-900">
                  Página 2
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={handleApplySignature}
        signerName={
          signatureTarget === 'perito'
            ? selectedRequest?.peritoNombre || 'ING.ISRAEL OROZCO ARIAS'
            : selectedRequest?.solicitanteNombre || 'Solicitante'
        }
        peritoNombre={selectedRequest?.peritoNombre || 'ING.ISRAEL OROZCO ARIAS'}
        cedula={signatureTarget === 'perito' ? selectedRequest?.peritoCedula || '15240154' : undefined}
        title={
          signatureTarget === 'perito'
            ? 'Firma Electrónica del Perito Dictaminador'
            : 'Firma Electrónica del Solicitante'
        }
      />

    </div>
  );
};
