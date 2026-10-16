import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportDocumentToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Render the element to high-res canvas (scale 2 for retina / print quality)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Letter size: 215.9 mm x 279.4 mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Maintain aspect ratio with a small margin (5mm)
    const margin = 6;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let finalHeight = imgHeight;
    let finalWidth = imgWidth;

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
    console.error('Error generating PDF:', error);
    return false;
  }
}
