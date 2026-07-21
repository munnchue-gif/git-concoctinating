const KEY = "forge_bridge_config";

export const getBridgeConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { url: "", token: "" };
  } catch {
    return { url: "", token: "" };
  }
};

export const saveBridgeConfig = (cfg) => localStorage.setItem(KEY, JSON.stringify(cfg));

export const isBridgeConfigured = () => Boolean(getBridgeConfig().url);

export const bridgeFetch = async (path, options = {}) => {
  const { url, token } = getBridgeConfig();
  if (!url) throw new Error("Bridge not configured — set your Forge URL in settings.");
  const res = await fetch(url.replace(/\/$/, "") + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Bridge ${res.status}: ${await res.text()}`);
  return res.json();
};

// EventSource can't set headers — token rides as a query param per bridge convention.
export const feedUrl = () => {
  const { url, token } = getBridgeConfig();
  if (!url) return null;
  return url.replace(/\/$/, "") + "/feed" + (token ? `?token=${encodeURIComponent(token)}` : "");
};