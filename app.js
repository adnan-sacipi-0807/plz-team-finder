const $ = (id) => document.getElementById(id);

// Fixe, verbindliche Team-Farben (wie in der Genspark-Version)
// Diese Zuordnung ist die Quelle der Wahrheit – unabhängig von Excel/JSON.
const TEAM_COLORS = {
  "2A": "#FF69B4", // Pink
  "2B": "#90EE90", // Grün
  "2C": "#FF1493", // Fuchsia
  "3A": "#D3D3D3", // Grau
  "3B": "#FFA500", // Orange
  "3C": "#4169E1", // Blau
  "4A": "#F5DEB3", // Chamois
  "4B": "#9370DB", // Violett
};


const plzInput = $("plzInput");
const hint = $("hint");
const resultCard = $("resultCard");
const resultLabel = $("resultLabel");
const teamText = $("teamText");
const ravPill = $("ravPill");
const ortText = $("ortText");
const countStatus = $("countStatus");
const offlineStatus = $("offlineStatus");
const installBtn = $("installBtn");

let dataIndex = new Map(); // plz -> entry

function normalizePlz(v){
  return (v || "").toString().replace(/\D/g, "").slice(0,4);
}

function setHint(msg, isError=false){
  hint.textContent = msg || "";
  hint.style.color = isError ? "rgba(255,120,120,0.92)" : "rgba(240,248,255,0.60)";
}

function showResult(entry, plz){
  resultCard.hidden = false;
  resultLabel.textContent = `TEAM FÜR PLZ ${plz}`;
  teamText.textContent = entry.team;
  const color = TEAM_COLORS[entry.team] || entry.teamColor || "#00e5ff";
  teamText.style.color = color;
  teamText.style.textShadow = `0 0 24px ${color}, 0 18px 60px rgba(0,0,0,0.45)`;
  ravPill.textContent = entry.rav;

  const orts = Array.isArray(entry.orte) ? entry.orte : [];
  ortText.textContent = orts.length === 0 ? "" : (orts.length === 1 ? orts[0] : orts.join(" / "));
}

function hideResult(){
  resultCard.hidden = true;
}

async function loadData(){
  const res = await fetch("./data/plz-map.json", { cache: "no-cache" });
  if(!res.ok) throw new Error("Konnte PLZ-Daten nicht laden.");
  const json = await res.json();

  (json.items || []).forEach(item => {
    if(item && item.plz) dataIndex.set(String(item.plz), item);
  });

  const count = dataIndex.size;
  countStatus.textContent = `${count}+ PLZ verfügbar`;
}

function onInput(){
  const plz = normalizePlz(plzInput.value);
  if(plzInput.value !== plz) plzInput.value = plz;

  if(plz.length === 0){
    setHint("");
    hideResult();
    return;
  }
  if(plz.length < 4){
    setHint("Bitte 4-stellige PLZ eingeben.");
    hideResult();
    return;
  }

  const entry = dataIndex.get(plz);
  if(!entry){
    setHint("PLZ nicht gefunden.", true);
    hideResult();
    return;
  }

  setHint("");
  showResult(entry, plz);
  plzInput.value = "";
  plzInput.focus();
}

function registerSW(){
  if(!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try{
      await navigator.serviceWorker.register("./sw.js");
    }catch(e){
      // SW ist optional; UI bleibt trotzdem nutzbar
    }
  });
}

function setupInstall(){
  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

function updateOfflineLabel(){
  const update = () => {
    offlineStatus.textContent = navigator.onLine ? "Offline verfügbar" : "Offline (kein Internet)";
  };
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

(async function init(){
  try{
    await loadData();
    setHint("");
  }catch(e){
    setHint("Daten konnten nicht geladen werden.", true);
  }
  plzInput.addEventListener("input", onInput);
  plzInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") onInput();
  });

  registerSW();
  setupInstall();
  updateOfflineLabel();
})();
