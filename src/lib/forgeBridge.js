const KEY = "forge_bridge_config";

export const getBridgeConfig = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { url: "", token: "", cfId: "", cfSecret: "" };
  } catch {
    return { url: "", token: "", cfId: "", cfSecret: "" };
  }
};

export const saveBridgeConfig = (cfg) => localStorage.setItem(KEY, JSON.stringify(cfg));

export const isBridgeConfigured = () => Boolean(getBridgeConfig().url);

const authHeaders = () => {
  const { token, cfId, cfSecret } = getBridgeConfig();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(cfId ? { "CF-Access-Client-Id": cfId } : {}),
    ...(cfSecret ? { "CF-Access-Client-Secret": cfSecret } : {}),
  };
};

export const bridgeFetch = async (path, options = {}) => {
  const { url } = getBridgeConfig();
  if (!url) throw new Error("Bridge not configured — set your Forge URL in settings.");
  const res = await fetch(url.replace(/\/$/, "") + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Bridge ${res.status}: ${await res.text()}`);
  return res.json();
};

// SSE over fetch — EventSource can't carry the Cloudflare Access headers, a fetch stream can.
// Returns an abort function.
export const openFeed = (onEvent, onStatus) => {
  const { url } = getBridgeConfig();
  if (!url) {
    onStatus("unconfigured");
    return () => {};
  }
  const controller = new AbortController();
  (async () => {
    try {
      const res = await fetch(url.replace(/\/$/, "") + "/feed", {
        headers: authHeaders(),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        onStatus("disconnected");
        return;
      }
      onStatus("live");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop();
        for (const chunk of chunks) {
          const line = chunk.split("\n").find((l) => l.startsWith("data: "));
          if (line) onEvent(line.slice(6));
        }
      }
      onStatus("disconnected");
    } catch (e) {
      if (e.name !== "AbortError") onStatus("disconnected");
    }
  })();
  return () => controller.abort();
};