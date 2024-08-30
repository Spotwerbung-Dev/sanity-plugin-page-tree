'use strict';

var lodash = require('lodash');
const DRAFTS_PREFIX$1 = "drafts.";
const getSanityDocumentId = val => val.replace(DRAFTS_PREFIX$1, "");
const getLanguageFieldName = config => {
  var _a, _b;
  return (_b = (_a = config.documentInternationalization) == null ? void 0 : _a.languageFieldName) != null ? _b : "language";
};
const getRootPageSlug = (page, config) => {
  if (!config.documentInternationalization) return;
  const language = page[getLanguageFieldName(config)];
  if (typeof language != "string") {
    throw new Error("Language field is not a string: ".concat(language));
  }
  return language;
};
const DRAFTS_PREFIX = "drafts.";
const getAllPageMetadata = (config, pages) => {
  const pageTree = mapRawPageMetadatasToPageTree(config, pages);
  const flatPageTree = flatMapPageTree(pageTree);
  return flatPageTree.map(page => ({
    _id: page._id,
    _updatedAt: page._updatedAt,
    path: page.path,
    type: page._type
  }));
};
const findPageTreeItemById = (pages, id) => {
  for (const page of pages) {
    if (page._id === id) return page;
    if (page.children) {
      const childPage = findPageTreeItemById(page.children, id);
      if (childPage) return childPage;
    }
  }
};
const mapRawPageMetadatasToPageTree = (config, pages) => {
  const pagesWithPublishedState = getPublishedAndDraftRawPageMetadata(config, pages);
  const orderedPages = lodash.orderBy(mapPageTreeItems(config, pagesWithPublishedState), "path");
  const {
    documentInternationalization
  } = config;
  if (documentInternationalization) {
    const languageField = getLanguageFieldName(config);
    return lodash.sortBy(orderedPages, p => {
      var _a;
      let index = documentInternationalization.supportedLanguages.indexOf((_a = p[languageField]) == null ? void 0 : _a.toLowerCase());
      if (index === -1) {
        index = documentInternationalization.supportedLanguages.length;
      }
      return index;
    });
  }
  return orderedPages;
};
const flatMapPageTree = pages => pages.flatMap(page => page.children ? [lodash.omit(page, "children"), ...flatMapPageTree(page.children)] : page);
const mapPageTreeItems = function (config, pagesWithPublishedState, parentId) {
  let parentPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  const getChildPages = parentId2 => pagesWithPublishedState.filter(page => {
    var _a;
    return ((_a = page.parent) == null ? void 0 : _a._ref) === parentId2;
  });
  return getChildPages(parentId).map(page => {
    var _a, _b;
    const pagePath = parentPath ? "".concat(parentPath === "/" ? "" : parentPath, "/").concat((_a = page.slug) == null ? void 0 : _a.current) : "/".concat((_b = getRootPageSlug(page, config)) != null ? _b : "");
    const children = lodash.orderBy(mapPageTreeItems(config, pagesWithPublishedState, page._id, pagePath), "path");
    return {
      ...page,
      children,
      path: pagePath
    };
  });
};
const getPublishedAndDraftRawPageMetadata = (config, pages) => {
  const publishedPages = lodash.groupBy(pages.filter(p => !p._id.startsWith(DRAFTS_PREFIX)), p => p._id);
  const draftPages = lodash.groupBy(pages.filter(p => p._id.startsWith(DRAFTS_PREFIX)), p => getSanityDocumentId(p._id));
  return pages.filter(page => isValidPage(config, page)).filter(p => !draftPages[p._id]).map(p => {
    const isDraft = p._id.startsWith(DRAFTS_PREFIX);
    const _idWithoutDraft = getSanityDocumentId(p._id);
    const newPage = {
      ...p,
      _id: isDraft ? _idWithoutDraft : p._id,
      isDraft,
      isPublished: !!publishedPages[_idWithoutDraft]
    };
    return newPage;
  });
};
const isValidPage = (config, page) => {
  if (!page.parent || !page.slug) {
    if (page._type !== config.rootSchemaType) {
      return false;
    }
  }
  return true;
};
const getAllRawPageMetadataQuery = config => "*[_type in [".concat(Object.values(config.pageSchemaTypes).map(key => '"'.concat(key, '"')).join(", "), "]]{\n    ").concat(rawPageMetadataFragment(config), "\n  }");
const getRawPageMetadataQuery = (documentId, config) => '*[_id == "'.concat(documentId, '"]{\n  ').concat(rawPageMetadataFragment(config), "\n}");
const rawPageMetadataFragment = config => {
  var _a;
  return "\n    _id,\n    _type,\n    _updatedAt,\n    parent,\n    slug,\n    title,\n    ".concat((_a = getLanguageFieldName(config)) != null ? _a : "");
};
exports.DRAFTS_PREFIX = DRAFTS_PREFIX;
exports.findPageTreeItemById = findPageTreeItemById;
exports.flatMapPageTree = flatMapPageTree;
exports.getAllPageMetadata = getAllPageMetadata;
exports.getAllRawPageMetadataQuery = getAllRawPageMetadataQuery;
exports.getLanguageFieldName = getLanguageFieldName;
exports.getRawPageMetadataQuery = getRawPageMetadataQuery;
exports.getRootPageSlug = getRootPageSlug;
exports.getSanityDocumentId = getSanityDocumentId;
exports.mapRawPageMetadatasToPageTree = mapRawPageMetadatasToPageTree;
//# sourceMappingURL=index-Bz7d-yUR.js.map
