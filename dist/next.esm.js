import { getAllRawPageMetadataQuery, getAllPageMetadata } from './_chunks/index-DHD1e6p-.js';
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const createNextPageTreeClient = _ref => {
  let {
    config,
    client,
    fetchOptions
  } = _ref;
  return new NextPageTreeClient(config, client, fetchOptions);
};
class NextPageTreeClient {
  constructor(config, client, defaultSanityFetchOptions) {
    __publicField(this, "config");
    __publicField(this, "client");
    __publicField(this, "defaultSanityFetchOptions");
    this.config = config;
    this.client = client;
    this.defaultSanityFetchOptions = defaultSanityFetchOptions;
  }
  async getAllPageMetadata() {
    var _a;
    const rawPageMetadata = await this.client.fetch(getAllRawPageMetadataQuery(this.config), void 0, (_a = this.defaultSanityFetchOptions) != null ? _a : {});
    return getAllPageMetadata(this.config, rawPageMetadata);
  }
  async getPageMetadataById(id) {
    const pageMetadatas = await this.getAllPageMetadata();
    return pageMetadatas.find(page => page._id === id);
  }
  async getPageMetadataByPath(path) {
    const pageMetadatas = await this.getAllPageMetadata();
    return pageMetadatas.find(page => page.path === path);
  }
}
export { createNextPageTreeClient };
//# sourceMappingURL=next.esm.js.map
