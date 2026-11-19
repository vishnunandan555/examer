/**
 * Examer Cloud Sync Engine
 * Supports seamless multi-device synchronization via REST API (Upstash Redis, Vercel KV, or custom JSON endpoint)
 * with robust offline-first fallback to localStorage.
 */

const STORAGE_KEY = 'examer_completed_v1';
const CONFIG_KEY = 'examer_cloud_config_v1';

export function getCloudConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : {
      enabled: false,
      endpoint: '',
      token: ''
    };
  } catch (e) {
    return { enabled: false, endpoint: '', token: '' };
  }
}

export function saveCloudConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save cloud config', e);
  }
}

/**
 * Fetch latest completed videos map from cloud (if configured)
 */
export async function pullFromCloud() {
  const config = getCloudConfig();
  if (!config.enabled || !config.endpoint) {
    return null;
  }

  try {
    const url = config.endpoint.endsWith('/') ? `${config.endpoint}get/examer_progress` : `${config.endpoint}/get/examer_progress`;
    const headers = {};
    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Cloud fetch failed: ${res.statusText}`);
    }

    const data = await res.json();
    // Upstash returns { result: "..." }
    const payload = data.result ? (typeof data.result === 'string' ? JSON.parse(data.result) : data.result) : data;
    return payload;
  } catch (err) {
    console.warn('Cloud pull error (using local cache):', err);
    return null;
  }
}

/**
 * Push completed videos map to cloud (if configured)
 */
export async function pushToCloud(completedMap) {
  const config = getCloudConfig();
  if (!config.enabled || !config.endpoint) {
    return false;
  }

  try {
    const url = config.endpoint.endsWith('/') ? `${config.endpoint}set/examer_progress` : `${config.endpoint}/set/examer_progress`;
    const headers = { 'Content-Type': 'application/json' };
    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(JSON.stringify(completedMap))
    });

    return res.ok;
  } catch (err) {
    console.warn('Cloud push error:', err);
    return false;
  }
}
