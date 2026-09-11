const AURA_NAMES = [
  "진짜 함대", "깊은 뿌리", "내가 이 구역의 쪼신", "품질 향상", "누구보다 빠르고 정확하게",
  "주는 대로 가는 사람", "압도 그잡채", "주사 맞으면 다 나아", "부식", "마법 회랑",
  "광신도", "구조 붕괴", "누가 네 친구야?", "마스코트 등장", "포커가 잘떠야..",
  "현상금 사냥꾼", "정밀 분석 완료", "모두 힘내봐요!", "고립", "과일이 그렇게 좋아?",
  "암시장", "계시록", "엄마가 하룻밤 자고 나면 올게", "응급 지원", "낡아빠진 공장",
  "입영 통지서", "지방방패", "수호진영", "풍부한 미네랄", "동화 작용",
  "부자의 삶이란", "리롤!리롤!리롤!", "무한 동력", "개복치", "아니 왜 나만 안떠!",
  "무료 식권", "황금 기물", "붉은 왕관", "치타는 웃고 있다", "미래 예지",
  "네 일은 네가 알아서 해", "혹한기", "따뜻한 부화기", "키리의 강화기", "정기 구독",
  "맘마 메가", "한 수 위", "특이점", "눈부신 기교", "혹시 로또 당첨됐어?",
  "소규모 팀", "우정의 힘", "적응형 타격", "사교육", "엄마가 모아놨다가 돌려줄게",
  "건물주", "고양's", "쳤냐?", "우리도 일합니다", "우리들의 우상",
  "나만 빼고 레벨업", "공리주의", "애기 예비군", "보물사냥꾼", "전력의 힘",
  "내일 봐", "심장을 지켜요", "방지턱이 많네 ㅋ", "따뜻한 느낌", "희망의 감마 빔",
  "앗뜨거!", "색안경", "영원한 짝꿍", "비밀 친구", "산 제물",
  "느긋하게 갑시다", "신나는 여름밤", "고혹적인 루비", "공격 또 공격", "방사 원소 잔류",
  "모든걸 담아서", "진동 전기톱", "일어나라", "고급 쪼꼬미", "우주의 격노",
  "공이 그렇게 좋아?", "쌍둥이 자매", "상호 파괴 보장", "드디어 올것이 왔군", "어바웃 타임"
];

const LEVELS = ["미보유", "브론즈", "실버", "골드", "프리즘", "초월"];
const TIERS = new Map([[0, "미클리어"], [2, "노말 클리어"], [3, "하드 클리어"], [4, "챌린지 클리어"], [5, "인페르넘 클리어"], [7, "EOU 클리어"]]);
const MOD_AURA = 9991;
const MOD_FINAL = 5551;
const VERSION = 51;
const SEED = 91;
const MAX_INT = 2147483647;

const app = document.querySelector("#app");

let bank = null;
let originalText = "";
let originalSnapshot = "";
let fileName = "ACKOPPPPL32Q.SC2Bank";
let checksumResidue = null;
let dirty = false;
let filter = "all";
let query = "";

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="brand-copy">
        <p>STARCRAFT II · LOCAL BANK TOOL</p>
        <h1>팀 포커 디펜스 <em>Bank Editor</em></h1>
      </div>
      <div class="privacy-chip"><i></i> 파일은 이 기기에서만 처리</div>
    </header>

    <main>
      <section id="dropPanel" class="drop-panel" aria-labelledby="dropTitle">
        <input id="fileInput" type="file" accept=".SC2Bank,.sc2bank,text/xml,application/xml" hidden />
        <div class="drop-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>
        </div>
        <div>
          <p class="eyebrow">OPEN BANK</p>
          <h2 id="dropTitle">뱅크 파일을 여기에 놓으세요</h2>
          <p><code>ACKOPPPPL32Q.SC2Bank</code> 파일을 드래그하거나 직접 선택하세요.</p>
        </div>
        <button id="chooseButton" class="button primary" type="button">파일 선택</button>
      </section>

      <div id="errorBox" class="notice error" role="alert" hidden></div>

      <div id="workspace" class="workspace" hidden>
        <section class="file-strip panel">
          <div class="file-badge">
            <span class="file-type">FILE</span>
            <strong id="loadedFileName"></strong>
          </div>
          <div class="file-meta"><span>SCHEMA</span><strong id="schemaValue"></strong></div>
          <div class="file-meta"><span>CHECKSUM</span><strong id="checksumValue"></strong></div>
          <div class="file-state"><i></i><span id="fileStateText">원본 구조 확인</span></div>
          <button id="changeFileButton" class="button ghost" type="button">다른 파일</button>
        </section>

        <section class="summary-panel panel" aria-labelledby="summaryTitle">
          <div class="section-heading">
            <div><p class="eyebrow">PROGRESSION MATRIX</p><h2 id="summaryTitle">진행도 요약</h2></div>
            <span class="auto-note"><i></i> 청록색 값은 자동 계산</span>
          </div>
          <div class="summary-grid">
            <label class="edit-field">
              <span>최고 난이도</span>
              <select id="tierInput" aria-label="최고 난이도"></select>
            </label>
            <label class="edit-field accent-field">
              <span>보유 포인트</span>
              <div class="number-wrap"><input id="pointsInput" type="number" min="0" step="1" inputmode="numeric" /><b>P</b></div>
              <small id="pointLimit"></small>
            </label>
            <div class="metric"><span>보유 오라</span><strong id="ownedMetric"></strong></div>
            <div class="metric"><span>누적 뽑기</span><strong id="drawMetric"></strong></div>
            <div class="metric"><span>사용 포인트</span><strong id="spentMetric"></strong></div>
            <div class="metric featured"><span>누적 포인트</span><strong id="totalMetric"></strong></div>
          </div>
        </section>

        <section class="loadout-panel panel" aria-labelledby="loadoutTitle">
          <div class="section-heading compact">
            <div><p class="eyebrow">AURA LOADOUT</p><h2 id="loadoutTitle">장착 오라</h2></div>
            <span>게임 시작 시 적용되는 세 슬롯</span>
          </div>
          <div class="loadout-grid">
            <label><span>슬롯 1</span><select id="ora1"></select></label>
            <label><span>슬롯 2</span><select id="ora2"></select></label>
            <label><span>슬롯 3</span><select id="ora3"></select></label>
          </div>
        </section>

        <section class="aura-panel panel" aria-labelledby="auraTitle">
          <div class="section-heading aura-heading">
            <div><p class="eyebrow">AURA MATRIX</p><h2 id="auraTitle">오라 등급</h2></div>
            <strong id="auraCount">90 / 90</strong>
          </div>
          <div class="aura-toolbar">
            <label class="search-box">
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>
              <input id="searchInput" type="search" placeholder="번호 또는 오라 이름 검색" aria-label="오라 검색" />
            </label>
            <div class="segmented" role="group" aria-label="보유 상태 필터">
              <button type="button" data-filter="all" class="active">전체</button>
              <button type="button" data-filter="owned">보유</button>
              <button type="button" data-filter="unowned">미보유</button>
            </div>
            <label class="bulk-select"><span>일괄 설정</span><select id="bulkInput"><option value="">선택</option>${LEVELS.map((name, value) => `<option value="${value}">${name}</option>`).join("")}</select></label>
          </div>
          <div id="auraGrid" class="aura-grid"></div>
          <div id="emptyAuras" class="empty-state" hidden>조건에 맞는 오라가 없습니다.</div>
        </section>

        <section class="save-panel panel">
          <div>
            <p class="eyebrow">SAVE BANK</p>
            <h2>체크섬까지 자동으로 맞춰 저장</h2>
            <p id="saveHelp">기존 HU에서 계정 기여값을 보존합니다. 필요하면 계정 번호를 직접 입력할 수 있습니다.</p>
          </div>
          <label class="account-field">
            <span>계정 번호 <small>선택</small></span>
            <input id="accountInput" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="예: 3026465" />
          </label>
          <div class="save-actions">
            <button id="resetButton" class="button ghost" type="button" disabled>원본으로 되돌리기</button>
            <button id="downloadButton" class="button primary download" type="button">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"/></svg>
              수정본 다운로드
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
  <div id="dropOverlay" class="drop-overlay" aria-hidden="true"><div><strong>여기에 놓으면 바로 열립니다</strong><span>SC2Bank 파일만 지원합니다</span></div></div>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
`;

const $ = (selector) => document.querySelector(selector);
const ui = {
  fileInput: $("#fileInput"), choose: $("#chooseButton"), changeFile: $("#changeFileButton"),
  dropPanel: $("#dropPanel"), workspace: $("#workspace"), error: $("#errorBox"),
  loadedFileName: $("#loadedFileName"), schema: $("#schemaValue"), checksum: $("#checksumValue"),
  fileStateText: $("#fileStateText"), tier: $("#tierInput"), points: $("#pointsInput"), pointLimit: $("#pointLimit"),
  owned: $("#ownedMetric"), draw: $("#drawMetric"), spent: $("#spentMetric"), total: $("#totalMetric"),
  ora: [$("#ora1"), $("#ora2"), $("#ora3")], search: $("#searchInput"), bulk: $("#bulkInput"),
  auraGrid: $("#auraGrid"), emptyAuras: $("#emptyAuras"), auraCount: $("#auraCount"),
  account: $("#accountInput"), reset: $("#resetButton"), download: $("#downloadButton"),
  overlay: $("#dropOverlay"), toast: $("#toast")
};

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function modInverse(value, modulus) {
  let [oldR, r] = [value, modulus];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return mod(oldS, modulus);
}

function section(documentNode, name) {
  return [...documentNode.getElementsByTagName("Section")].find((node) => node.getAttribute("name") === name);
}

function valueNode(documentNode, sectionName, keyName) {
  const parent = section(documentNode, sectionName);
  if (!parent) throw new Error(`필수 섹션이 없습니다: ${sectionName}`);
  const key = [...parent.children].find((node) => node.tagName === "Key" && node.getAttribute("name") === keyName);
  if (!key) throw new Error(`필수 값이 없습니다: ${sectionName}/${keyName}`);
  const value = [...key.children].find((node) => node.tagName === "Value");
  if (!value || !value.hasAttribute("int")) throw new Error(`정수 값이 아닙니다: ${sectionName}/${keyName}`);
  return value;
}

function readInt(documentNode, sectionName, keyName) {
  const raw = valueNode(documentNode, sectionName, keyName).getAttribute("int");
  if (!/^-?\d+$/.test(raw ?? "")) throw new Error(`값 형식이 올바르지 않습니다: ${sectionName}/${keyName}`);
  const value = Number(raw);
  if (!Number.isSafeInteger(value)) throw new Error(`안전한 정수가 아닙니다: ${sectionName}/${keyName}`);
  return value;
}

function writeInt(sectionName, keyName, value) {
  valueNode(bank.document, sectionName, keyName).setAttribute("int", String(value));
}

function parseBank(text) {
  const documentNode = new DOMParser().parseFromString(text, "application/xml");
  if (documentNode.querySelector("parsererror")) throw new Error("XML 형식을 읽을 수 없습니다.");
  if (documentNode.documentElement?.tagName !== "Bank") throw new Error("StarCraft II Bank 파일이 아닙니다.");
  if (documentNode.getElementsByTagName("Signature").length > 0) throw new Error("Blizzard 서명이 있는 Bank 파일은 지원하지 않습니다.");

  const version = readInt(documentNode, "Upi", "V");
  if (version !== VERSION) throw new Error(`지원하지 않는 Bank 버전입니다. Upi/V ${version} (지원: ${VERSION})`);

  const auraLevels = Array.from({ length: 90 }, (_, index) => readInt(documentNode, `OOra${index + 1}`, "number"));
  if (auraLevels.some((level) => level < 0 || level > 5)) throw new Error("오라 등급은 0부터 5까지만 사용할 수 있습니다.");

  return {
    document: documentNode,
    version,
    tier: readInt(documentNode, "tier", "number"),
    currentPoints: readInt(documentNode, "Point", "current"),
    storedTotal: readInt(documentNode, "Point", "total"),
    icon: readInt(documentNode, "icon", "number"),
    event: readInt(documentNode, "HU", "event"),
    storedDraws: readInt(documentNode, "po", "po"),
    storedHU: readInt(documentNode, "HU", "number"),
    equipped: [1, 2, 3].map((slot) => readInt(documentNode, `Ora${slot}`, "number")),
    auraLevels
  };
}

function derived(state = bank) {
  const drawCount = state.auraLevels.reduce((sum, value) => sum + value, 0);
  const spentPoints = drawCount * 100;
  return {
    drawCount,
    spentPoints,
    totalPoints: state.currentPoints + spentPoints,
    ownedCount: state.auraLevels.filter((value) => value > 0).length
  };
}

function baseBeforeAuras(state = bank) {
  const info = derived(state);
  return state.tier * 51
    + info.totalPoints * 131
    + state.currentPoints * 513
    + state.icon * 19
    + info.drawCount * 33
    + state.event * 57
    + state.equipped[0] * 311
    + state.equipped[1] * 41553
    + state.equipped[2] * 7;
}

function foldAuras(state = bank) {
  let hash = baseBeforeAuras(state);
  for (const level of state.auraLevels) hash = mod(hash * 7 + level, MOD_AURA);
  return hash;
}

function getAccountResidue(state = bank) {
  const withoutAccount = mod(foldAuras(state) + SEED * SEED, MOD_FINAL);
  return mod((state.storedHU - withoutAccount) * modInverse(159, MOD_FINAL), MOD_FINAL);
}

function selectedAccountResidue() {
  const raw = ui.account.value.trim();
  if (!raw) return checksumResidue;
  if (!/^\d+$/.test(raw)) throw new Error("계정 번호는 숫자만 입력하세요.");
  const value = Number(raw);
  if (!Number.isSafeInteger(value)) throw new Error("계정 번호가 너무 큽니다.");
  return mod(value, MOD_FINAL);
}

function calculateHU(state = bank) {
  const account = selectedAccountResidue();
  if (account === null) throw new Error("체크섬 계정값을 확인할 수 없습니다.");
  return mod(foldAuras(state) + account * 159 + SEED * SEED, MOD_FINAL);
}

function maxCurrentPoints(state = bank) {
  const info = derived(state);
  const auraFirst = state.auraLevels[0];
  const ceiling = Math.floor((MAX_INT - auraFirst) / 7);
  const withoutCurrent = state.tier * 51
    + info.drawCount * 100 * 131
    + state.icon * 19
    + info.drawCount * 33
    + state.event * 57
    + state.equipped[0] * 311
    + state.equipped[1] * 41553
    + state.equipped[2] * 7;
  return Math.max(0, Math.floor((ceiling - withoutCurrent) / 644));
}

function number(value) {
  return value.toLocaleString("ko-KR");
}

function tierOptions(current) {
  const entries = [...TIERS.entries()];
  if (!TIERS.has(current)) entries.push([current, `특수 티어 ${current}`]);
  return entries.sort((a, b) => a[0] - b[0]).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
}

function auraOptions(selected) {
  return `<option value="0">미장착</option>${AURA_NAMES.map((name, index) => `<option value="${index + 1}"${selected === index + 1 ? " selected" : ""}>${String(index + 1).padStart(2, "0")} · ${name}</option>`).join("")}`;
}

function updateSummary() {
  if (!bank) return;
  const info = derived();
  const cap = maxCurrentPoints();
  ui.owned.textContent = `${info.ownedCount} / 90`;
  ui.draw.textContent = `${number(info.drawCount)}회`;
  ui.spent.textContent = `${number(info.spentPoints)}P`;
  ui.total.textContent = `${number(info.totalPoints)}P`;
  ui.pointLimit.textContent = `현재 구성 안전 상한 ${number(cap)}P`;
  ui.points.max = String(cap);
  ui.checksum.textContent = String(calculateHU()).padStart(4, "0");
  ui.fileStateText.textContent = dirty ? "수정 중 · 아직 저장하지 않음" : "원본 구조 확인";
  ui.reset.disabled = !dirty;
}

function markDirty() {
  dirty = true;
  updateSummary();
}

function renderAuras() {
  const normalizedQuery = query.trim().toLocaleLowerCase("ko");
  const matches = AURA_NAMES.map((name, index) => ({ id: index + 1, name, level: bank.auraLevels[index] }))
    .filter((aura) => filter === "all" || (filter === "owned" ? aura.level > 0 : aura.level === 0))
    .filter((aura) => !normalizedQuery || aura.name.toLocaleLowerCase("ko").includes(normalizedQuery) || String(aura.id).padStart(2, "0").includes(normalizedQuery));

  ui.auraCount.textContent = `${matches.length} / 90`;
  ui.emptyAuras.hidden = matches.length !== 0;
  ui.auraGrid.innerHTML = matches.map((aura) => `
    <article class="aura-card ${aura.level > 0 ? `level-${aura.level}` : ""}" data-aura-id="${aura.id}">
      <div class="aura-id">${String(aura.id).padStart(2, "0")}</div>
      <div class="aura-name"><strong>${aura.name}</strong><span>${LEVELS[aura.level]}</span></div>
      <div class="level-control" aria-label="${aura.name} 등급">
        <button type="button" data-step="-1" aria-label="${aura.name} 등급 낮추기" ${aura.level === 0 ? "disabled" : ""}>−</button>
        <output>${aura.level}</output>
        <button type="button" data-step="1" aria-label="${aura.name} 등급 높이기" ${aura.level === 5 ? "disabled" : ""}>＋</button>
      </div>
    </article>
  `).join("");
}

function loadStateIntoUI() {
  ui.loadedFileName.textContent = fileName;
  ui.schema.textContent = `Upi/V ${bank.version}`;
  ui.tier.innerHTML = tierOptions(bank.tier);
  ui.tier.value = String(bank.tier);
  ui.points.value = String(bank.currentPoints);
  ui.ora.forEach((select, index) => { select.innerHTML = auraOptions(bank.equipped[index]); });
  ui.account.value = "";
  ui.account.placeholder = `자동 키 ${checksumResidue}`;
  renderAuras();
  updateSummary();
}

async function openFile(file) {
  ui.error.hidden = true;
  if (!file) return;
  if (!/\.sc2bank$/i.test(file.name)) {
    showError(".SC2Bank 파일을 선택하세요.");
    return;
  }
  try {
    const text = await file.text();
    loadBankText(text, file.name);
    showToast("Bank 파일을 불러왔습니다.");
  } catch (error) {
    showError(error instanceof Error ? error.message : "파일을 열지 못했습니다.");
  } finally {
    ui.fileInput.value = "";
  }
}

function loadBankText(text, name = "ACKOPPPPL32Q.SC2Bank") {
  const parsed = parseBank(text);
  originalText = text;
  originalSnapshot = JSON.stringify({
    tier: parsed.tier, currentPoints: parsed.currentPoints, equipped: parsed.equipped,
    auraLevels: parsed.auraLevels, storedHU: parsed.storedHU
  });
  bank = parsed;
  fileName = name;
  checksumResidue = getAccountResidue(parsed);
  dirty = false;
  query = "";
  filter = "all";
  ui.search.value = "";
  document.querySelectorAll("[data-filter]").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
  ui.dropPanel.hidden = true;
  ui.workspace.hidden = false;
  loadStateIntoUI();
  return window.TeamPokerBankEditor?.getState?.() ?? null;
}

function showError(message) {
  ui.error.textContent = message;
  ui.error.hidden = false;
  ui.error.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.add("visible");
  toastTimer = setTimeout(() => ui.toast.classList.remove("visible"), 2600);
}

function saveBank() {
  try {
    const cap = maxCurrentPoints();
    if (!Number.isInteger(bank.currentPoints) || bank.currentPoints < 0 || bank.currentPoints > cap) {
      throw new Error(`보유 포인트는 0부터 ${number(cap)} 사이여야 합니다.`);
    }
    const info = derived();
    const hu = calculateHU();

    writeInt("tier", "number", bank.tier);
    writeInt("Point", "current", bank.currentPoints);
    writeInt("Point", "total", info.totalPoints);
    writeInt("po", "po", info.drawCount);
    writeInt("Ora1", "number", bank.equipped[0]);
    writeInt("Ora2", "number", bank.equipped[1]);
    writeInt("Ora3", "number", bank.equipped[2]);
    bank.auraLevels.forEach((level, index) => writeInt(`OOra${index + 1}`, "number", level));
    writeInt("HU", "number", hu);

    const serialized = new XMLSerializer().serializeToString(bank.document);
    const content = `<?xml version="1.0" encoding="utf-8"?>\r\n${serialized}`;
    const blob = new Blob([content], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(/\.sc2bank$/i, "_수정.SC2Bank");
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    dirty = false;
    updateSummary();
    showToast(`HU ${hu} · 수정본을 저장했습니다.`);
  } catch (error) {
    showError(error instanceof Error ? error.message : "수정본을 저장하지 못했습니다.");
  }
}

async function resetBank() {
  if (!bank || !dirty) return;
  const parsed = parseBank(originalText);
  bank = parsed;
  checksumResidue = getAccountResidue(parsed);
  dirty = false;
  loadStateIntoUI();
  showToast("원본 상태로 되돌렸습니다.");
}

ui.choose.addEventListener("click", () => ui.fileInput.click());
ui.changeFile.addEventListener("click", () => ui.fileInput.click());
ui.fileInput.addEventListener("change", () => openFile(ui.fileInput.files?.[0]));
ui.download.addEventListener("click", saveBank);
ui.reset.addEventListener("click", resetBank);

ui.tier.addEventListener("change", () => {
  bank.tier = Number(ui.tier.value);
  markDirty();
});

ui.points.addEventListener("input", () => {
  if (!/^\d+$/.test(ui.points.value)) return;
  const value = Number(ui.points.value);
  if (Number.isSafeInteger(value)) {
    bank.currentPoints = value;
    markDirty();
  }
});

ui.points.addEventListener("blur", () => {
  const cap = maxCurrentPoints();
  bank.currentPoints = Math.max(0, Math.min(bank.currentPoints, cap));
  ui.points.value = String(bank.currentPoints);
  updateSummary();
});

ui.ora.forEach((select, index) => select.addEventListener("change", () => {
  bank.equipped[index] = Number(select.value);
  markDirty();
}));

ui.account.addEventListener("input", () => {
  ui.account.value = ui.account.value.replace(/\D/g, "");
  updateSummary();
  if (ui.account.value) markDirty();
});

ui.search.addEventListener("input", () => {
  query = ui.search.value;
  renderAuras();
});

document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderAuras();
}));

ui.bulk.addEventListener("change", () => {
  if (ui.bulk.value === "") return;
  const level = Number(ui.bulk.value);
  bank.auraLevels = bank.auraLevels.map(() => level);
  ui.bulk.value = "";
  renderAuras();
  markDirty();
});

ui.auraGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-step]");
  if (!button) return;
  const card = button.closest("[data-aura-id]");
  const index = Number(card.dataset.auraId) - 1;
  const next = bank.auraLevels[index] + Number(button.dataset.step);
  bank.auraLevels[index] = Math.max(0, Math.min(5, next));
  renderAuras();
  markDirty();
});

let dragDepth = 0;
for (const type of ["dragenter", "dragover", "dragleave", "drop"]) {
  document.addEventListener(type, (event) => event.preventDefault());
}
document.addEventListener("dragenter", () => {
  dragDepth += 1;
  ui.overlay.classList.add("visible");
});
document.addEventListener("dragleave", () => {
  dragDepth -= 1;
  if (dragDepth <= 0) { dragDepth = 0; ui.overlay.classList.remove("visible"); }
});
document.addEventListener("drop", (event) => {
  dragDepth = 0;
  ui.overlay.classList.remove("visible");
  openFile(event.dataTransfer?.files?.[0]);
});

window.addEventListener("beforeunload", (event) => {
  if (!dirty) return;
  event.preventDefault();
});

// The checksum is deliberately kept client-side; uploaded files never leave this tab.
window.TeamPokerBankEditor = Object.freeze({
  getState: () => bank ? { ...derived(), tier: bank.tier, equipped: [...bank.equipped], auraLevels: [...bank.auraLevels], hu: calculateHU() } : null,
  loadText: (text, name) => loadBankText(text, name)
});

function registerWebMcpTools() {
  const context = document.modelContext;
  if (!context?.registerTool) return;

  const register = (tool) => {
    try {
      Promise.resolve(context.registerTool(tool)).catch(() => {});
    } catch {
      // WebMCP is optional; the visible editor remains fully functional.
    }
  };

  const readTool = {
    name: "read_bank_editor_state",
    title: "현재 Bank 상태 읽기",
    description: "현재 브라우저에 열린 팀 포커 디펜스 Bank의 포인트, 장착 오라, 90개 오라 등급과 계산된 HU를 읽습니다.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute() {
      if (!bank) throw new Error("먼저 SC2Bank 파일을 여세요.");
      return window.TeamPokerBankEditor.getState();
    }
  };

  const stageTool = {
    name: "stage_bank_changes",
    title: "Bank 수정값 적용",
    description: "열린 Bank의 보유 포인트, 장착 오라 또는 여러 오라 등급을 한 번에 수정하고 화면과 체크섬 계산을 갱신합니다. 다운로드는 사용자가 화면에서 완료합니다.",
    inputSchema: {
      type: "object",
      properties: {
        currentPoints: { type: "integer", minimum: 0 },
        equipped: {
          type: "array", minItems: 3, maxItems: 3,
          items: { type: "integer", minimum: 0, maximum: 90 }
        },
        auraLevels: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", minimum: 1, maximum: 90 },
              level: { type: "integer", minimum: 0, maximum: 5 }
            },
            required: ["id", "level"],
            additionalProperties: false
          }
        }
      },
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!bank) throw new Error("먼저 SC2Bank 파일을 여세요.");
      if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("수정값 객체가 필요합니다.");

      const next = {
        currentPoints: input.currentPoints ?? bank.currentPoints,
        equipped: input.equipped ? [...input.equipped] : [...bank.equipped],
        auraLevels: [...bank.auraLevels]
      };
      if (!Number.isInteger(next.currentPoints) || next.currentPoints < 0) throw new Error("currentPoints는 0 이상의 정수여야 합니다.");
      if (next.equipped.length !== 3 || next.equipped.some((value) => !Number.isInteger(value) || value < 0 || value > 90)) {
        throw new Error("equipped는 0~90 정수 3개여야 합니다.");
      }
      if (input.auraLevels !== undefined) {
        if (!Array.isArray(input.auraLevels)) throw new Error("auraLevels는 배열이어야 합니다.");
        const seen = new Set();
        for (const item of input.auraLevels) {
          if (!item || !Number.isInteger(item.id) || item.id < 1 || item.id > 90 || !Number.isInteger(item.level) || item.level < 0 || item.level > 5) {
            throw new Error("각 오라 수정값에는 1~90 id와 0~5 level이 필요합니다.");
          }
          if (seen.has(item.id)) throw new Error(`오라 ${item.id}가 중복되었습니다.`);
          seen.add(item.id);
          next.auraLevels[item.id - 1] = item.level;
        }
      }

      const candidate = { ...bank, ...next };
      const cap = maxCurrentPoints(candidate);
      if (next.currentPoints > cap) throw new Error(`현재 구성의 안전 포인트 상한은 ${cap}입니다.`);

      bank.currentPoints = next.currentPoints;
      bank.equipped = next.equipped;
      bank.auraLevels = next.auraLevels;
      ui.points.value = String(bank.currentPoints);
      ui.ora.forEach((select, index) => { select.innerHTML = auraOptions(bank.equipped[index]); });
      renderAuras();
      markDirty();
      return { ...derived(), equipped: [...bank.equipped], hu: calculateHU(), pendingDownload: true };
    }
  };

  window.TeamPokerBankEditorWebMCP = Object.freeze({ readTool, stageTool });
  register(readTool);
  register(stageTool);
}

registerWebMcpTools();
