/**
 * Examer Built-in Cloud Sync Engine
 * Single-user zero-config cloud synchronization via Upstash Redis REST API.
 * Automatically synchronizes completion status between phone, laptop, and desktop.
 */

const BUILTIN_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL || 'https://precious-catfish-207117.upstash.io';
const BUILTIN_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN || '';
const SYNC_KEY = import.meta.env.VITE_CLOUD_SYNC_KEY || 'examer_dev_progress';

export function getCloudConfig() {
  const isConfigured = Boolean(BUILTIN_URL && BUILTIN_TOKEN);

  return {
    enabled: isConfigured,
    endpoint: BUILTIN_URL,
    token: BUILTIN_TOKEN
  };
}

export function saveCloudConfig(config) {
  // Maintained for backward compatibility if custom endpoint is ever set
  try {
    localStorage.setItem('examer_cloud_config_v1', JSON.stringify(config));
  } catch (e) {}
}

/**
 * Fetch latest completed playlist map from cloud
 */
export async function pullFromCloud() {
  const config = getCloudConfig();
  if (!config.enabled || !config.endpoint) {
    return null;
  }

  try {
    const url = config.endpoint.endsWith('/')
      ? `${config.endpoint}get/${SYNC_KEY}`
      : `${config.endpoint}/get/${SYNC_KEY}`;

    const headers = {};
    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Cloud fetch failed: ${res.statusText}`);
    }

    const data = await res.json();
    const payload = data.result
      ? typeof data.result === 'string'
        ? JSON.parse(data.result)
        : data.result
      : data;

    return payload;
  } catch (err) {
    console.warn('Cloud pull error (using local cache):', err);
    return null;
  }
}

/**
 * Push completed playlist map to cloud
 */
export async function pushToCloud(completedMap) {
  const config = getCloudConfig();
  if (!config.enabled || !config.endpoint) {
    return false;
  }

  try {
    const url = config.endpoint.endsWith('/')
      ? `${config.endpoint}set/${SYNC_KEY}`
      : `${config.endpoint}/set/${SYNC_KEY}`;

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
