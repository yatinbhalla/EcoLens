// @ts-ignore
import html2pdf from "html2pdf.js";

export async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Clone the element to avoid mutating the live DOM
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Force all accordions in the clone to be fully expanded for the PDF
  const hiddenElements = clone.querySelectorAll('.max-h-0, .opacity-0, .overflow-hidden');
  hiddenElements.forEach(el => {
     el.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden');
     el.classList.add('max-h-[5000px]', 'opacity-100');
  });

  // Remove scrollable constraints to print full content
  const scrollableElements = clone.querySelectorAll('.max-h-\\[400px\\], .overflow-y-auto');
  scrollableElements.forEach(el => {
      el.classList.remove('max-h-[400px]', 'overflow-y-auto');
  });

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
    filename: `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in' as const, format: 'letter', orientation: 'portrait' as const }
  };

  await html2pdf().set(opt).from(clone).save();
}
