
const fs = require('fs');
const { createCanvas } = require('canvas');

// Simple SVG to PNG converter function
function svgToPng(svgPath, outputPath, width, height) {
    try {
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Set white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // For now, create a simple colored circle with play button as fallback
        // Purple gradient background
        const gradient = ctx.createRadialGradient(width/2, height*0.3, 0, width/2, height/2, width*0.7);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        const radius = Math.min(width, height) * 0.44;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(width/2, height/2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = '#5a67d8';
        ctx.lineWidth = Math.max(1, width/40);
        ctx.stroke();
        
        // Add play triangle
        const playSize = radius * 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = Math.max(1, width/60);
        ctx.beginPath();
        ctx.moveTo(width/2 - playSize/2, height/2 - playSize/2);
        ctx.lineTo(width/2 - playSize/2, height/2 + playSize/2);
        ctx.lineTo(width/2 + playSize/2, height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add speed lines for larger icons
        if (width >= 48) {
            const lineX = width * 0.7;
            const lineY = height * 0.35;
            ctx.strokeStyle = '#ff6b35';
            ctx.lineWidth = Math.max(2, width/30);
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(lineX, lineY);
            ctx.lineTo(lineX + width/10, lineY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(lineX + width/40, lineY + height/20);
            ctx.lineTo(lineX + width/8, lineY + height/20);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(lineX, lineY + height/10);
            ctx.lineTo(lineX + width/10, lineY + height/10);
            ctx.stroke();
        }
        
        // Save PNG
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        console.log(`Generated: ${outputPath} (${width}x${height})`);
        return true;
    } catch (error) {
        console.error(`Error converting ${svgPath} to ${outputPath}:`, error.message);
        return false;
    }
}

// Check if canvas module is available
try {
    require.resolve('canvas');
    console.log('Canvas module found, generating icons...');
    
    const sizes = [16, 32, 48, 128];
    const svgPath = 'assets/icons/icon-simple.svg';
    let success = 0;
    
    sizes.forEach(size => {
        const outputPath = `assets/icons/icon${size}.png`;
        if (svgToPng(svgPath, outputPath, size, size)) {
            success++;
        }
    });
    
    console.log(`Successfully generated ${success}/${sizes.length} icons`);
} catch (error) {
    console.log('Canvas module not available, attempting to install...');
    process.exit(1);
}
