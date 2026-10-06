const DB_NAME = "asteaming_projects";
const DB_VERSION = 1;

export class ProjectStore {
  constructor(projectId = null) {
    this.projectId = projectId || localStorage.getItem("asteaming_active_project") || null;
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

  async listProjects() {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const req = db.transaction("projects").objectStore("projects").getAll();
      req.onsuccess = () => resolve((req.result || []).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
      req.onerror = () => reject(req.error);
    });
  }

  async createProject(name = "Untitled Project") {
    const id = crypto.randomUUID();
    const project = {
      id,
      name: String(name).trim() || "Untitled Project",
      timeline: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const db = await this.dbPromise;
    await new Promise((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      tx.objectStore("projects").put(project);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    return project;
  }

  async putProject(data) {
    const db = await this.dbPromise;
    const id = data.id || this.projectId || crypto.randomUUID();
    const project = { ...data, id, updatedAt: Date.now() };
    await new Promise((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      tx.objectStore("projects").put(project);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    this.projectId = id;
    localStorage.setItem("asteaming_active_project", id);
    return project;
  }

  async openProject(projectId) {
    const db = await this.dbPromise;
    const project = await new Promise((resolve, reject) => {
      const req = db.transaction("projects").objectStore("projects").get(projectId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (!project) throw new Error("Project not found");
    this.projectId = project.id;
    localStorage.setItem("asteaming_active_project", project.id);
    return project;
  }

  async getProject() {
    const projects = await this.listProjects();
    if (!this.projectId) return null;
    return projects.find(p => p.id === this.projectId) || null;
  }

  async putSound(file, name = file.name, folder = "SFX") {
    if (!this.projectId) throw new Error("Open or create a project first");
    const db = await this.dbPromise;
    const id = crypto.randomUUID();
    const record = {
      id,
      projectId: this.projectId,
      folder,
      name,
      type: file.type,
      blob: file,
      createdAt: Date.now()
    };
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sounds", "readwrite");
      tx.objectStore("sounds").put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  }

  async listSounds(folder = null) {
    if (!this.projectId) return [];
    const db = await this.dbPromise;
    const sounds = await new Promise((resolve, reject) => {
      const req = db.transaction("sounds").objectStore("sounds").index("projectId").getAll(this.projectId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    return folder ? sounds.filter(sound => sound.folder === folder) : sounds;
  }
}
