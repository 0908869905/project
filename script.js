// Sign language image generator using Canvas API
// This creates visual representations of sign language for each character

function generateSignLanguage() {
    const input = document.getElementById('textInput').value.trim();
    const output = document.getElementById('signLanguageOutput');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (!input) {
        alert('請輸入文字！');
        return;
    }
    
    // Clear previous output
    output.innerHTML = '';
    
    // Process each character
    const characters = input.split('');
    
    characters.forEach((char, index) => {
        // Skip whitespace but keep it for spacing
        if (char === ' ' || char === '\n') {
            const spacer = document.createElement('div');
            spacer.style.width = '20px';
            output.appendChild(spacer);
            return;
        }
        
        // Create a card for each character
        const card = document.createElement('div');
        card.className = 'sign-card';
        
        // Create canvas for sign language representation
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        
        // Draw the sign language representation
        drawSignLanguage(canvas, char);
        
        // Add character label
        const label = document.createElement('div');
        label.className = 'character';
        label.textContent = char;
        
        card.appendChild(canvas);
        card.appendChild(label);
        output.appendChild(card);
    });
    
    // Show download button
    downloadBtn.style.display = 'inline-block';
}

function drawSignLanguage(canvas, char) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set a background
    ctx.fillStyle = '#f0f0ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate a unique visual pattern based on the character
    const charCode = char.charCodeAt(0);
    
    // Draw hand outline (base shape)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffd700';
    
    // Draw a stylized hand shape
    ctx.beginPath();
    ctx.arc(centerX, centerY + 10, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw fingers based on character code
    const fingerCount = (charCode % 5) + 1;
    const fingerAngle = Math.PI / 6;
    
    for (let i = 0; i < fingerCount; i++) {
        const angle = -Math.PI / 2 + (i - fingerCount / 2) * fingerAngle;
        const fingerLength = 20 + (charCode % 10);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * fingerLength,
            centerY + Math.sin(angle) * fingerLength
        );
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Draw fingertip
        ctx.beginPath();
        ctx.arc(
            centerX + Math.cos(angle) * fingerLength,
            centerY + Math.sin(angle) * fingerLength,
            3,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = '#ff6b6b';
        ctx.fill();
    }
    
    // Add decorative elements based on character
    const decorationCount = (charCode % 3) + 1;
    for (let i = 0; i < decorationCount; i++) {
        const angle = (charCode * i * 137.5) * (Math.PI / 180); // Golden angle
        const radius = 35;
        
        ctx.beginPath();
        ctx.arc(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius,
            3,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = '#667eea';
        ctx.fill();
    }
    
    // Add character-specific pattern
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#764ba2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, centerX, centerY + 35);
}

function downloadImage() {
    const output = document.getElementById('signLanguageOutput');
    const cards = output.querySelectorAll('.sign-card');
    
    if (cards.length === 0) {
        alert('請先生成手語圖片！');
        return;
    }
    
    // Create a larger canvas to combine all sign cards
    const padding = 20;
    const cardWidth = 120;
    const cardHeight = 150;
    const cardsPerRow = Math.min(cards.length, 8);
    const rows = Math.ceil(cards.length / cardsPerRow);
    
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = (cardWidth + padding) * cardsPerRow + padding;
    finalCanvas.height = (cardHeight + padding) * rows + padding;
    
    const ctx = finalCanvas.getContext('2d');
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    
    // Draw each card
    cards.forEach((card, index) => {
        const canvas = card.querySelector('canvas');
        const character = card.querySelector('.character').textContent;
        
        const col = index % cardsPerRow;
        const row = Math.floor(index / cardsPerRow);
        const x = col * (cardWidth + padding) + padding;
        const y = row * (cardHeight + padding) + padding;
        
        // Draw border
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cardWidth, cardHeight);
        
        // Draw canvas content
        ctx.drawImage(canvas, x + 10, y + 10, 100, 100);
        
        // Draw character label
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(character, x + cardWidth / 2, y + cardHeight - 20);
    });
    
    // Download the image
    finalCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sign-language-' + Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Add Enter key support in textarea (Ctrl+Enter to generate)
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textInput');
    textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateSignLanguage();
        }
    });
});
