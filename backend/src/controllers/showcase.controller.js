import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store showcase data file in backend/data/showcase.json
const dataDir = path.resolve(__dirname, '../../data');
const dataFilePath = path.join(dataDir, 'showcase.json');

// Paths to save uploaded images (in frontend public and dist)
const publicUploadDir = path.resolve(__dirname, '../../../frontend/public/assets/images/b2b-showcase');
const distUploadDir = path.resolve(__dirname, '../../../frontend/dist/assets/images/b2b-showcase');

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(publicUploadDir)) {
  fs.mkdirSync(publicUploadDir, { recursive: true });
}

// Helper to read data file
function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading showcase.json:', err);
  }
  return {};
}

// Helper to write data file
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing showcase.json:', err);
    return false;
  }
}

/**
 * GET /api/showcase
 * Returns all custom showcase items or specific language items
 */
export const getShowcase = async (req, res) => {
  try {
    const { lang } = req.query;
    const allData = readData();

    if (lang) {
      return res.json({
        success: true,
        data: allData[lang] || null
      });
    }

    return res.json({
      success: true,
      data: allData
    });
  } catch (error) {
    console.error('Error in getShowcase:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve showcase items',
      error: error.message
    });
  }
};

/**
 * POST /api/showcase
 * Saves showcase items for a specific language or all languages
 */
export const saveShowcase = async (req, res) => {
  try {
    const { lang, items, allLanguages } = req.body;

    const allData = readData();

    if (allLanguages && typeof allLanguages === 'object') {
      // Save all languages at once
      Object.assign(allData, allLanguages);
    } else if (lang && Array.isArray(items)) {
      allData[lang] = items;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. Provide { lang, items } or { allLanguages }.'
      });
    }

    const success = writeData(allData);
    if (!success) {
      throw new Error('Failed to write data file');
    }

    return res.json({
      success: true,
      message: 'Showcase content saved successfully',
      data: allData
    });
  } catch (error) {
    console.error('Error in saveShowcase:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save showcase content',
      error: error.message
    });
  }
};

/**
 * POST /api/showcase/upload
 * Handles base64 image upload and saves to public/assets/images/b2b-showcase/
 */
export const uploadImage = async (req, res) => {
  try {
    const { filename, base64Data } = req.body;

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided'
      });
    }

    // Sanitize filename or generate unique name
    const extMatch = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    let ext = 'jpg';
    if (extMatch && extMatch[1]) {
      ext = extMatch[1].replace('jpeg', 'jpg');
    }

    const cleanName = (filename || `upload-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');

    const finalFileName = cleanName.endsWith(`.${ext}`) ? cleanName : `${cleanName}.${ext}`;
    const base64Pure = base64Data.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    const buffer = Buffer.from(base64Pure, 'base64');

    // Save to public directory
    const publicPath = path.join(publicUploadDir, finalFileName);
    fs.writeFileSync(publicPath, buffer);

    // Save duplicate to dist directory if dist exists
    if (fs.existsSync(distUploadDir)) {
      const distPath = path.join(distUploadDir, finalFileName);
      fs.writeFileSync(distPath, buffer);
    }

    const publicUrl = `/assets/images/b2b-showcase/${finalFileName}`;

    return res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: publicUrl,
      filename: finalFileName
    });
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
};

/**
 * POST /api/showcase/reset
 * Resets custom showcase data (reverts to original source files)
 */
export const resetShowcase = async (req, res) => {
  try {
    const { lang } = req.body;
    const allData = readData();

    if (lang && allData[lang]) {
      delete allData[lang];
    } else {
      // Clear all custom data
      for (const k of Object.keys(allData)) {
        delete allData[k];
      }
    }

    writeData(allData);

    return res.json({
      success: true,
      message: 'Showcase content reset to factory defaults'
    });
  } catch (error) {
    console.error('Error in resetShowcase:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset showcase content',
      error: error.message
    });
  }
};
