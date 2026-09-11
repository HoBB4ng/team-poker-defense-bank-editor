const DB_NAME = "team-poker-bank-editor";
const DB_VERSION = 1;
const STORE_NAME = "bank-slots";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("저장 슬롯을 열지 못했습니다."));
  });
}

function runRequest(mode, operation) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    let result;
    try {
      result = operation(store);
    } catch (error) {
      database.close();
      reject(error);
      return;
    }
    transaction.oncomplete = () => {
      database.close();
      resolve(result?.result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("저장 슬롯 작업에 실패했습니다."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("저장 슬롯 작업이 중단되었습니다."));
    };
  }));
}

export async function listBankSlots() {
  const slots = await runRequest("readonly", (store) => store.getAll());
  return (slots ?? []).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function getBankSlot(id) {
  return runRequest("readonly", (store) => store.get(id));
}

export function putBankSlot(slot) {
  return runRequest("readwrite", (store) => store.put(slot));
}

export function deleteBankSlot(id) {
  return runRequest("readwrite", (store) => store.delete(id));
}

export function createSlotId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `slot-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
