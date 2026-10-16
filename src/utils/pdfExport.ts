import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';

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
    const targetBgColor = isGreenSecurityPaper ? '#cbf3d2' : '#ffffff';

    // Use html-to-image which natively supports Tailwind v4 "oklch" colors and modern CSS
    const imgData = await toJpeg(element, {
      quality: 0.98,
      pixelRatio: 2.2, // Crisp 300 DPI print quality
      backgroundColor: targetBgColor,
      style: {
        transform: 'none',
        margin: '0',
      },
      filter: (node) => {
        // Exclude elements marked as no-print
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    // Create Letter size PDF (215.9 mm x 279.4 mm - Tamaño Carta)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = 215.9;
    const pdfHeight = 279.4;

    const margin = 5; // 5 mm margins
    const availableWidth = pdfWidth - margin * 2; // 205.9 mm
    const availableHeight = pdfHeight - margin * 2; // 269.4 mm

    // Load image to determine exact dimensions
    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const imgAspect = img.height / img.width;
    let finalWidth = availableWidth;
    let finalHeight = finalWidth * imgAspect;

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = finalHeight / imgAspect;
    }

    const posX = margin + (availableWidth - finalWidth) / 2;
    const posY = margin + (availableHeight - finalHeight) / 2;

    // Paint the entire Letter page in authentic security green if green paper is selected
    if (isGreenSecurityPaper) {
      pdf.setFillColor(203, 243, 210); // #cbf3d2
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
    }

    // Add high-resolution document image
    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'SLOW');

    // Trigger direct browser download
    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
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
    console.error('Error in exportDocumentToPdf:', error);
    alert('Ocurrió un inconveniente al exportar el PDF. Por favor reintente.');
    return false;
  }
}
