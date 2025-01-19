document.getElementById('generate-pdf').addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const genre = document.getElementById('genre').value.trim();
  const description = document.getElementById('description').value.trim();
  const aesthetic = document.getElementById('aesthetic').value.trim();
  const coreConcept = document.getElementById('core-concept').value.trim();
  const features = document.getElementById('features').value.trim();
  const gameplayLoop = document.getElementById('gameplay-loop').value.trim();
  const uploadedImages = document.getElementById('upload-images').files;

  const debugMessage = document.getElementById('debug-message');

  // Clear previous debug message
  debugMessage.textContent = '';
  debugMessage.className = '';

  // Validation
  if (!title || !genre || !description) {
    debugMessage.textContent = 'Error: Title, Genre, and Description are required fields.';
    debugMessage.className = 'error';
    return;
  }

  const doc = new jsPDF();

  // Add text content
  doc.setFontSize(18);
  doc.text(title, 10, 10);

  doc.setFontSize(12);
  doc.text(`Genre: ${genre}`, 10, 20);
  doc.text(`Description:`, 10, 30);
  doc.text(description, 10, 40, { maxWidth: 190 });

  doc.text(`Aesthetic:`, 10, 60);
  doc.text(aesthetic, 10, 70, { maxWidth: 190 });

  doc.text(`Core Concept:`, 10, 90);
  doc.text(coreConcept, 10, 100, { maxWidth: 190 });

  doc.text(`Features:`, 10, 120);
  doc.text(features, 10, 130, { maxWidth: 190 });

  doc.text(`Gameplay Loop:`, 10, 150);
  doc.text(gameplayLoop, 10, 160, { maxWidth: 190 });

  // Add uploaded images
  if (uploadedImages.length > 0) {
    for (let index = 0; index < uploadedImages.length; index++) {
      const file = uploadedImages[index];

      try {
        const imgData = await readFileAsBase64(file);
        const imageType = getImageTypeFromBase64(imgData); // Determine type dynamically

        doc.addPage();
        doc.addImage(imgData, imageType, 10, 20, 190, 100);
      } catch (error) {
        console.warn(`Failed to add uploaded image ${index + 1}. Error: ${error.message}`);
        doc.addPage();
        doc.text(`Failed to load uploaded image ${index + 1}`, 10, 10);
      }
    }
  }

  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_Game_Document.pdf`);
  debugMessage.textContent = 'Success: PDF generated and downloaded!';
  debugMessage.className = 'success';
});

// Helper function to read file as Base64
async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to determine image type from Base64 string
function getImageTypeFromBase64(base64) {
  const mime = base64.split(';')[0].split(':')[1]; // Extract MIME type
  switch (mime) {
    case 'image/png': return 'PNG';
    case 'image/jpeg': return 'JPEG';
    case 'image/webp': return 'WEBP';
    case 'image/bmp': return 'BMP';
    default: return 'PNG'; // Default to PNG if type is unknown
  }
}
