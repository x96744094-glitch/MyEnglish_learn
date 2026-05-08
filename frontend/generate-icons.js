// 生成 PWA 圖示腳本 - 執行: node generate-icons.js
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 產生每個尺寸的 SVG 圖示並存成 .svg（之後可用工具轉PNG，或直接用SVG）
sizes.forEach(size => {
  const fontSize = Math.round(size * 0.35);
  const circleR = Math.round(size * 0.42);
  const cx = size / 2;
  const cy = size / 2;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#4F46E5"/>
  <!-- Book shape -->
  <g transform="translate(${size*0.15}, ${size*0.18})">
    <!-- Book body -->
    <rect x="0" y="0" width="${size*0.33}" height="${size*0.6}" rx="${size*0.04}" fill="#ffffff" opacity="0.9"/>
    <rect x="${size*0.37}" y="0" width="${size*0.33}" height="${size*0.6}" rx="${size*0.04}" fill="#ffffff" opacity="0.9"/>
    <!-- Book spine -->
    <rect x="${size*0.315}" y="0" width="${size*0.07}" height="${size*0.6}" fill="#C7D2FE"/>
    <!-- Lines on left page -->
    <line x1="${size*0.06}" y1="${size*0.15}" x2="${size*0.27}" y2="${size*0.15}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <line x1="${size*0.06}" y1="${size*0.25}" x2="${size*0.27}" y2="${size*0.25}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <line x1="${size*0.06}" y1="${size*0.35}" x2="${size*0.27}" y2="${size*0.35}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <line x1="${size*0.06}" y1="${size*0.45}" x2="${size*0.2}" y2="${size*0.45}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <!-- Lines on right page -->
    <line x1="${size*0.43}" y1="${size*0.15}" x2="${size*0.64}" y2="${size*0.15}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <line x1="${size*0.43}" y1="${size*0.25}" x2="${size*0.64}" y2="${size*0.25}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <line x1="${size*0.43}" y1="${size*0.35}" x2="${size*0.64}" y2="${size*0.35}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
    <line x1="${size*0.43}" y1="${size*0.45}" x2="${size*0.57}" y2="${size*0.45}" stroke="#818CF8" stroke-width="${size*0.025}" stroke-linecap="round"/>
  </g>
  <!-- "E" letter overlay -->
  <text x="${size*0.5}" y="${size*0.88}" font-family="Arial, sans-serif" font-size="${size*0.16}" font-weight="bold" fill="#E0E7FF" text-anchor="middle">ENGLISH</text>
</svg>`;

  // 寫成 SVG 文件
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Created: icon-${size}x${size}.svg`);
});

console.log('\n⚠️  SVG 圖示已產生！');
console.log('💡 PWA 在現代瀏覽器支援 SVG 圖示，但為了最佳相容性建議轉換成 PNG。');
console.log('💡 使用方法: 執行 npm install sharp 然後執行 node convert-icons.js');
console.log('💡 或者直接使用 https://realfavicongenerator.net/ 上傳 icon-512x512.svg 來產生所有尺寸的 PNG。');
