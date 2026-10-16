import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportDocumentToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Clone element or configure html2canvas options to avoid SVG tainted errors
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: element.style.backgroundColor || '#ffffff',
      ignoreElements: (el) => el.classList.contains('no-print'),
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.width = '800px';
          clonedElement.style.maxWidth = '800px';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Letter size: 215.9 mm x 279.4 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const margin = 5;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;

    if (imgHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    const posX = margin + (availableWidth - finalWidth) / 2;
    const posY = margin;

    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.warn('html2canvas direct export failed, triggering printable PDF window:', error);
    // Fallback: Open clean print dialog formatted specifically for 1-page PDF
    window.print();
    return true;
  }
}
