// 將 SVG 圖示轉成 PNG - 先執行: npm install sharp
// 然後執行: node convert-icons.js
const fs = require('fs');
const path = require('path');

async function convertIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('❌ sharp 未安裝，請先執行: npm install sharp');
    process.exit(1);
  }

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const iconsDir = path.join(__dirname, 'public', 'icons');

  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  找不到 SVG: ${svgPath}，請先執行 node generate-icons.js`);
      continue;
    }

    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(pngPath);
    console.log(`✅ Converted: icon-${size}x${size}.png`);
  }

  console.log('\n🎉 所有圖示已轉換為 PNG！');
}

convertIcons().catch(console.error);
