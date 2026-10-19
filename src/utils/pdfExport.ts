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
  isGreenSecurityPaper = true,
  orientation: 'portrait' | 'landscape' = 'portrait',
  customMargin = 5
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
    const isLandscape = orientation === 'landscape';
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = isLandscape ? 279.4 : 215.9;
    const pdfHeight = isLandscape ? 215.9 : 279.4;

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
    const margin = customMargin;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

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

/**
 * Exports multiple DOM elements into a multi-page PDF (Letter format)
 * Useful for multi-page inspection reports like Página 3 and Página 4
 */
export async function exportMultiPageDocumentToPdf(
  elementIds: string[],
  filename: string,
  isGreenSecurityPaper = false
): Promise<boolean> {
  const elements = elementIds.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
  if (elements.length === 0) {
    console.error('No elements found for multi-page PDF export');
    return false;
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = 215.9;
    const pdfHeight = 279.4;
    const margin = 5;
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    let securityBgDataUrl: string | null = null;
    if (isGreenSecurityPaper) {
      securityBgDataUrl = await loadSecurityBackground();
    }

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (i > 0) {
        pdf.addPage('letter', 'portrait');
      }

      // Draw background
      if (isGreenSecurityPaper && securityBgDataUrl) {
        pdf.addImage(securityBgDataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      } else {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      }

      // Backup styles
      const prevBg = el.style.backgroundColor;
      const prevBgImg = el.style.backgroundImage;
      const prevShadow = el.style.boxShadow;
      const prevBorder = el.style.border;

      el.style.setProperty('transition', 'none', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('background-color', 'transparent', 'important');
      el.style.setProperty('box-shadow', 'none', 'important');
      el.style.setProperty('border', 'none', 'important');

      const contentPng = await toPng(el, {
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
          if (node instanceof HTMLElement && node.classList.contains('no-print')) {
            return false;
          }
          return true;
        },
      });

      // Restore styles
      el.style.backgroundColor = prevBg;
      el.style.backgroundImage = prevBgImg;
      el.style.boxShadow = prevShadow;
      el.style.border = prevBorder;

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

      pdf.addImage(contentPng, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
    }

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
    console.error('Error in exportMultiPageDocumentToPdf:', error);
    alert('Ocurrió un inconveniente al exportar el PDF. Por favor reintente.');
    return false;
  }
}

/**
 * Exports an image directly to a Letter-sized PDF.
 * Perfect for single-line diagrams, diplomas, and official credential cards
 * allowing full width, full bleed, or margins in Portrait or Landscape.
 */
export async function exportDirectImageToPdf(options: {
  imageDataUrl: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  fullBleed?: boolean;
  marginMm?: number;
}): Promise<boolean> {
  const {
    imageDataUrl,
    filename,
    orientation = 'portrait',
    fullBleed = false,
    marginMm = 0,
  } = options;

  try {
    const isLandscape = orientation === 'landscape';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'letter',
      compress: true,
    });

    const pdfWidth = isLandscape ? 279.4 : 215.9;
    const pdfHeight = isLandscape ? 215.9 : 279.4;

    // Clean white background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    const effectiveMargin = fullBleed ? 0 : marginMm;
    const availableWidth = pdfWidth - effectiveMargin * 2;
    const availableHeight = pdfHeight - effectiveMargin * 2;

    const img = new Image();
    img.src = imageDataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Failed to load image for PDF export'));
    });

    const imgAspect = img.height / img.width;
    let finalWidth = availableWidth;
    let finalHeight = finalWidth * imgAspect;

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = finalHeight / imgAspect;
    }

    const posX = effectiveMargin + (availableWidth - finalWidth) / 2;
    const posY = effectiveMargin + (availableHeight - finalHeight) / 2;

    pdf.addImage(imageDataUrl, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');

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
  } catch (err) {
    console.error('Error in exportDirectImageToPdf:', err);
    alert('Ocurrió un error al generar el PDF del documento. Intente nuevamente.');
    return false;
  }
}
