// If the iframe fails to load the PDF, show the fallback
const iframe = document.getElementById('pdfIframe');
const fallback = document.getElementById('pdfFallback');
iframe.addEventListener('error', () => {
  iframe.style.display = 'none';
  fallback.style.display = 'flex';
});
