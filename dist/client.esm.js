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
const createPageTreeClient = _ref => {
  let {
    config,
    client
  } = _ref;
  return new PageTreeClient(config, client);
};
class PageTreeClient {
  constructor(config, client) {
    __publicField(this, "config");
    __publicField(this, "client");
    this.config = config;
    this.client = client;
  }
  async getAllPageMetadata() {
    const rawPageMetadata = await this.client.fetch(getAllRawPageMetadataQuery(this.config));
    return getAllPageMetadata(this.config, rawPageMetadata);
  }
}
export { createPageTreeClient };
//# sourceMappingURL=client.esm.js.map
