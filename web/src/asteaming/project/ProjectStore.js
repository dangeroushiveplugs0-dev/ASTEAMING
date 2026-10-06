const DB_NAME = "asteaming_projects";
const DB_VERSION = 1;

export class ProjectStore {
  constructor(projectId = "default") {
    this.projectId = projectId;
    this.dbPromise = this.open();
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "id" });
        if (!db.objectStoreNames.contains("sounds")) {
          const store = db.createObjectStore("sounds", { keyPath: "id" });
          store.createIndex("projectId", "projectId");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async putProject(data) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      tx.objectStore("projects").put({ ...data, id: this.projectId, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(data);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getProject() {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const req = db.transaction("projects").objectStore("projects").get(this.projectId);
      req.onsuccess = () => resolve(req.result ?? { id: this.projectId, name: "Untitled Project", timeline: null });
      req.onerror = () => reject(req.error);
    });
  }

  async putSound(file, name = file.name) {
    const db = await this.dbPromise;
    const id = crypto.randomUUID();
    const record = { id, projectId: this.projectId, name, type: file.type, blob: file, createdAt: Date.now() };
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sounds", "readwrite");
      tx.objectStore("sounds").put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  }

  async listSounds() {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const req = db.transaction("sounds").objectStore("sounds").index("projectId").getAll(this.projectId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
}
