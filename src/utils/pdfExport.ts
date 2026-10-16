import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * Loads the official security paper image (https://appdesignproyectos.com/seguridad.png)
 * and returns it as a base64 data URL for embedding directly in the PDF canvas.
 */
async function loadSecurityBackground(): Promise<string | null> {
  const urls = ['/seguridad.png', 'https://appdesignproyectos.com/seguridad.png'];
  for (const url of urls) {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 1600;
            canvas.height = img.naturalHeight || 2071;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas context not available'));
              return;
            }
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error(`Failed to load ${url}`));
        img.src = url;
      });
      if (dataUrl) return dataUrl;
    } catch {
      // Continue to next URL
    }
  }
  return null;
}

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

  // Backup styles
  const prevBgImage = element.style.backgroundImage;
  const prevBgColor = element.style.backgroundColor;
  const prevBoxShadow = element.style.boxShadow;
  const prevBorder = element.style.border;

  try {
    // 1. Preload official security paper background image if requested
    let securityBgDataUrl: string | null = null;
    if (isGreenSecurityPaper) {
      securityBgDataUrl = await loadSecurityBackground();
    }

    // 2. Set element background to transparent for the capture so all text, tables,
    // borders, and signatures form a crisp transparent overlay over the background image
    element.style.setProperty('transition', 'none', 'important');
    element.style.setProperty('background-image', 'none', 'important');
    element.style.setProperty('background-color', 'transparent', 'important');
    element.style.setProperty('box-shadow', 'none', 'important');
    element.style.setProperty('border', 'none', 'important');

    // 3. Capture high-resolution transparent PNG with 300 DPI quality
    const contentPng = await toPng(element, {
      pixelRatio: 2.2,
      backgroundColor: 'transparent',
      style: {
        transform: 'none',
        margin: '0',
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        boxShadow: 'none',
        border: 'none',
      },
      filter: (node) => {
        // Exclude UI controls marked as no-print
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    // Restore original styles to the DOM view
    element.style.backgroundImage = prevBgImage;
    element.style.backgroundColor = prevBgColor;
    element.style.boxShadow = prevBoxShadow;
    element.style.border = prevBorder;
    element.style.transition = '';

    // 4. Create Letter size PDF (215.9 mm x 279.4 mm - Tamaño Carta)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = 215.9;
    const pdfHeight = 279.4;

    // 5. Draw Full-Bleed Security Paper Background (Carta size)
    if (isGreenSecurityPaper) {
      if (securityBgDataUrl) {
        // Official security paper image fills the entire Carta sheet seamlessly
        pdf.addImage(securityBgDataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
    } else {
      // Clean white paper
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
    }

    // 6. Calculate dimensions and margins for document content
    const margin = 5; // 5 mm margins
    const availableWidth = pdfWidth - margin * 2; // 205.9 mm
    const availableHeight = pdfHeight - margin * 2; // 269.4 mm

    const img = new Image();
    img.src = contentPng;
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

    // 7. Overlay document content with transparent boxes
    pdf.addImage(contentPng, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');

    // 8. Direct browser file download
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
    // Restore styles on error
    if (element) {
      element.style.backgroundImage = prevBgImage;
      element.style.backgroundColor = prevBgColor;
      element.style.boxShadow = prevBoxShadow;
      element.style.border = prevBorder;
    }
    alert('Ocurrió un inconveniente al exportar el PDF. Por favor reintente.');
    return false;
  }
}
