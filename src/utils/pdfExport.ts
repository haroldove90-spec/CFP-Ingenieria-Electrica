import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportDocumentToPdf(
  elementId: string, 
  filename: string,
  isGreenSecurityPaper = true
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Exact background color: authentic light security paper green or white
    const targetBgColor = isGreenSecurityPaper ? '#d8f3dc' : '#ffffff';

    // Temporary force element styling for crisp capture
    const originalTransform = element.style.transform;
    element.style.transform = 'none';

    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp 300 DPI print quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: targetBgColor,
      imageTimeout: 10000,
      ignoreElements: (el) => el.classList.contains('no-print'),
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.margin = '0 auto';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';
          if (isGreenSecurityPaper) {
            clonedElement.style.backgroundColor = '#d8f3dc';
          } else {
            clonedElement.style.backgroundColor = '#ffffff';
          }
        }
      },
    });

    element.style.transform = originalTransform;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Letter size: 215.9 mm x 279.4 mm (Carta)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = 215.9;
    const pdfHeight = 279.4;

    // Small clean margins (5 mm on all sides)
    const margin = 5;
    const availableWidth = pdfWidth - margin * 2; // 205.9 mm
    const availableHeight = pdfHeight - margin * 2; // 269.4 mm

    // Fit entirely on 1 Carta page
    const canvasAspect = canvas.height / canvas.width;
    let finalWidth = availableWidth;
    let finalHeight = finalWidth * canvasAspect;

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = finalHeight / canvasAspect;
    }

    const posX = margin + (availableWidth - finalWidth) / 2;
    const posY = margin + (availableHeight - finalHeight) / 2;

    // Draw background color on the entire letter page if green security paper
    if (isGreenSecurityPaper) {
      pdf.setFillColor(216, 243, 220); // #d8f3dc
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
    }

    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'SLOW');

    // Safe sanitized filename
    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Trigger direct browser file download
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 4000);

    return true;
  } catch (error) {
    console.error('Error generating and downloading PDF:', error);
    alert('Ocurrió un error al generar el archivo PDF. Verifique los permisos del navegador para descargas.');
    return false;
  }
}
