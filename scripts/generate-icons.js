import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to write CRC32 checksum for PNG chunks
function crc32(buf) {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const typeAndData = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crcBuf]);
}

function generatePng(size) {
  const width = size;
  const height = size;
  
  // Create scanlines: each row starts with 0 (no filter)
  const rawData = Buffer.alloc(height * (1 + width * 4));
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = size * 0.45;
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter type 0
    
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist <= radius) {
        // Vibrant Indigo to Cyan gradient background
        const t = (x + y) / (width + height);
        const r = Math.round(79 * (1 - t) + 14 * t);
        const g = Math.round(70 * (1 - t) + 165 * t);
        const b = Math.round(229 * (1 - t) + 233 * t);
        
        // Inner icon: Draw a stylized proxy shield / globe indicator (white symbol)
        const innerRatio = dist / radius;
        let isSymbol = false;
        
        // Horizontal bar / Shield accent
        if (Math.abs(dy) < radius * 0.18 && Math.abs(dx) < radius * 0.6) {
          isSymbol = true;
        }
        // Vertical axis
        if (Math.abs(dx) < radius * 0.18 && Math.abs(dy) < radius * 0.6) {
          isSymbol = true;
        }
        // Outer ring detail
        if (innerRatio > 0.65 && innerRatio < 0.82) {
          isSymbol = true;
        }

        if (isSymbol) {
          rawData[pxOffset] = 255;   // Red
          rawData[pxOffset + 1] = 255; // Green
          rawData[pxOffset + 2] = 255; // Blue
          rawData[pxOffset + 3] = 240; // Alpha
        } else {
          rawData[pxOffset] = r;
          rawData[pxOffset + 1] = g;
          rawData[pxOffset + 2] = b;
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparent outside circle
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
      }
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // Bit depth
  ihdrData[9] = 6;  // Color type RGBA
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const iconBuffer = generatePng(size);
  const filePath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, iconBuffer);
  console.log(`Generated ${filePath} (${size}x${size})`);
});
