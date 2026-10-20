/**
 * KETA Global Holdings - Showcase Content Management Service
 * Handles loading, saving, uploading, and synchronizing B2B showcase product data.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const STORAGE_PREFIX = 'keta_custom_showcase_';

/**
 * Get showcase items for a specific language
 * Priority: LocalStorage cache -> Backend API -> Default Locale Items
 */
export function getLocalShowcaseItems(lang, defaultItems = []) {
  try {
    const local = localStorage.getItem(`${STORAGE_PREFIX}${lang}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading local showcase items:', err);
  }
  return defaultItems;
}

/**
 * Fetch showcase items from backend API with fallback to default
 */
export async function fetchRemoteShowcaseItems(lang, defaultItems = []) {
  try {
    const res = await fetch(`${API_BASE}/showcase?lang=${lang}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Cache in localStorage
        localStorage.setItem(`${STORAGE_PREFIX}${lang}`, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend showcase fetch failed, falling back to local/default:', err);
  }
  return getLocalShowcaseItems(lang, defaultItems);
}

/**
 * Fetch all showcase languages at once from backend API
 */
export async function fetchAllLanguagesShowcase() {
  try {
    const res = await fetch(`${API_BASE}/showcase`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        Object.keys(json.data).forEach(l => {
          if (Array.isArray(json.data[l])) {
            localStorage.setItem(`${STORAGE_PREFIX}${l}`, JSON.stringify(json.data[l]));
          }
        });
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend fetchAllLanguagesShowcase failed:', err);
  }
  return null;
}

/**
 * Save showcase items for a specific language
 * Writes to both LocalStorage and Backend API, and broadcasts update event
 */
export async function saveShowcaseItems(lang, items) {
  if (!lang || !Array.isArray(items)) {
    throw new Error('Invalid arguments for saveShowcaseItems');
  }

  // 1. Save to LocalStorage immediately
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${lang}`, JSON.stringify(items));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }

  // 2. Broadcast update event to all active components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('keta:showcase-updated', { detail: { lang, items } }));
  }

  // 3. Sync to backend API asynchronously
  try {
    const res = await fetch(`${API_BASE}/showcase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lang, items })
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.warn('Backend sync warning (data still saved locally):', err);
    return { success: true, localOnly: true };
  }
}

/**
 * Save all languages simultaneously to LocalStorage and Backend API
 */
export async function saveAllLanguagesShowcase(allLanguages) {
  if (!allLanguages || typeof allLanguages !== 'object') {
    throw new Error('Invalid arguments for saveAllLanguagesShowcase');
  }

  // 1. Save all to LocalStorage
  try {
    Object.keys(allLanguages).forEach(lang => {
      if (Array.isArray(allLanguages[lang])) {
        localStorage.setItem(`${STORAGE_PREFIX}${lang}`, JSON.stringify(allLanguages[lang]));
      }
    });
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }

  // 2. Broadcast update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('keta:showcase-updated', { detail: { allLanguages } }));
  }

  // 3. Sync to backend API
  try {
    const res = await fetch(`${API_BASE}/showcase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ allLanguages })
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.warn('Backend sync warning (data still saved locally):', err);
    return { success: true, localOnly: true };
  }
}

/**
 * Upload an image file to backend
 * Returns public URL (e.g. /assets/images/b2b-showcase/filename.jpg)
 */
export async function uploadShowcaseImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      const filename = file.name.replace(/\.[^/.]+$/, '');

      try {
        const res = await fetch(`${API_BASE}/showcase/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filename,
            base64Data
          })
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.url) {
            return resolve(json.url);
          }
        }
        // If backend fails or not available, fallback to base64 Data URL
        console.warn('Server upload not available, using inline data URL fallback');
        resolve(base64Data);
      } catch (err) {
        console.warn('Upload error, using inline base64 fallback:', err);
        resolve(base64Data);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Reset showcase items to factory defaults for a language or all
 */
export async function resetShowcaseItems(lang) {
  try {
    if (lang) {
      localStorage.removeItem(`${STORAGE_PREFIX}${lang}`);
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}vi`);
      localStorage.removeItem(`${STORAGE_PREFIX}en`);
      localStorage.removeItem(`${STORAGE_PREFIX}zh`);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('keta:showcase-updated', { detail: { lang, reset: true } }));
    }

    await fetch(`${API_BASE}/showcase/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lang })
    }).catch(() => {});

    return true;
  } catch (err) {
    console.error('Reset error:', err);
    return false;
  }
}
