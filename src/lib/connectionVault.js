// Secrets keychain — tokens live ONLY in this browser (localStorage), never in the database.
const KEY = "forge_conn_vault";

const readVault = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};

export function getConnSecrets(id) {
  return readVault()[id] || { token: "", cfId: "", cfSecret: "" };
}

export function saveConnSecrets(id, secrets) {
  const vault = readVault();
  vault[id] = secrets;
  localStorage.setItem(KEY, JSON.stringify(vault));
}

export function deleteConnSecrets(id) {
  const vault = readVault();
  delete vault[id];
  localStorage.setItem(KEY, JSON.stringify(vault));
}

export function hasConnSecrets(id) {
  const s = readVault()[id];
  return !!(s && (s.token || s.cfSecret));
}