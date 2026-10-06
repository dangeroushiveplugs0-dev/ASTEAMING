export class SoundAsset {
  constructor({ id, name, source, duration = 0, mime = "audio/mpeg" }) {
    this.id = id;
    this.name = name;
    this.source = source;
    this.duration = duration;
    this.mime = mime;
  }
}

export class SoundLibrary {
  constructor(storage) {
    this.storage = storage;
    this.assets = [];
  }

  async load() {
    this.assets = (await this.storage?.list?.("sounds")) ?? [];
    return this.assets;
  }

  async add(file) {
    const id = crypto.randomUUID();
    const asset = await this.storage.put("sounds", id, file);
    const sound = new SoundAsset({ id, name: file.name, source: asset.url, mime: file.type });
    this.assets.push(sound);
    return sound;
  }

  async remove(id) {
    await this.storage?.remove?.("sounds", id);
    this.assets = this.assets.filter(a => a.id !== id);
  }
}
