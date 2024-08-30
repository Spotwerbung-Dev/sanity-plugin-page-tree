import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { MenuItem, Tooltip, Flex, MenuButton, Button, Menu, Box, Text, useTheme, Card, Stack, TextInput, Spinner, Dialog } from '@sanity/ui';
import { useMemo, createContext, useContext, useState, useEffect, useCallback, forwardRef } from 'react';
import { useListeningQuery } from 'sanity-plugin-utils';
import { getAllRawPageMetadataQuery, mapRawPageMetadatasToPageTree, getLanguageFieldName, flatMapPageTree, getRootPageSlug, findPageTreeItemById, getSanityDocumentId, getAllPageMetadata, getRawPageMetadataQuery, DRAFTS_PREFIX } from './_chunks/index-DHD1e6p-.js';
import { AddIcon, PublishIcon, EditIcon, ChevronUpIcon, ChevronDownIcon, SearchIcon } from '@sanity/icons';
import { without, compact } from 'lodash';
import { useSchema, useClient, useFormValue, set, FormField, useEditState, defineType, defineField } from 'sanity';
import { useRouter } from 'sanity/router';
import styled from 'styled-components';
import { uuid } from '@sanity/uuid';
import { usePaneRouter } from 'sanity/structure';
const usePageTree = config => {
  const {
    data,
    loading
  } = useListeningQuery(getAllRawPageMetadataQuery(config), {
    options: {
      apiVersion: config.apiVersion
    }
  });
  const pageTree = useMemo(() => data ? mapRawPageMetadatasToPageTree(config, data) : void 0, [config, data]);
  return {
    isLoading: loading,
    pageTree
  };
};
const PageTreeConfigContext = createContext({});
const PageTreeConfigProvider = _ref => {
  let {
    children,
    config
  } = _ref;
  return /* @__PURE__ */jsx(PageTreeConfigContext.Provider, {
    value: {
      config
    },
    children
  });
};
const usePageTreeConfig = () => {
  const {
    config
  } = useContext(PageTreeConfigContext);
  if (!config) {
    throw new Error("Failed to get page tree config. Make sure to use the component in a PageTreeConfigProvider.");
  }
  return config;
};
const generateDraftId = () => "drafts.".concat(uuid());
const PageTreeViewItemActions = _ref2 => {
  let {
    page,
    onActionOpen,
    onActionClose
  } = _ref2;
  const schema = useSchema();
  const config = usePageTreeConfig();
  const client = useClient({
    apiVersion: config.apiVersion
  });
  const {
    navigateUrl,
    resolveIntentLink
  } = useRouter();
  const [newPage, setNewPage] = useState();
  const onAdd = async type => {
    const language = getLanguageFieldName(config);
    const doc = await client.create({
      _id: generateDraftId(),
      _type: type,
      parent: config.rootSchemaType === type ? void 0 : {
        _type: "reference",
        _ref: page._id,
        _weak: true,
        _strengthenOnPublish: {
          type: page._type
        }
      },
      ...(language ? {
        [language]: page[language]
      } : {})
    });
    setNewPage(doc);
  };
  useEffect(() => {
    if (newPage) {
      const path = resolveIntentLink("edit", {
        id: newPage._id,
        type: newPage._type
      });
      navigateUrl({
        path
      });
    }
  }, [newPage, navigateUrl, resolveIntentLink]);
  const menuButtons = config.pageSchemaTypes.filter(type => {
    var _a, _b, _c;
    return type !== config.rootSchemaType && (((_a = config.allowedParents) == null ? void 0 : _a[type]) === void 0 || ((_c = (_b = config.allowedParents) == null ? void 0 : _b[type]) == null ? void 0 : _c.includes(page._type)));
  }).map(type => {
    var _a, _b;
    return /* @__PURE__ */jsx(MenuItem, {
      onClick: () => onAdd(type),
      text: (_b = (_a = schema.get(type)) == null ? void 0 : _a.title) != null ? _b : type,
      value: type
    }, type);
  });
  const isAddPageButtonDisabled = menuButtons.length === 0;
  const tooltipContent = isAddPageButtonDisabled ? /* @__PURE__ */jsx(Box, {
    padding: 1,
    children: /* @__PURE__ */jsx(Text, {
      muted: true,
      size: 1,
      children: "This page cannot have any child pages."
    })
  }) : void 0;
  return /* @__PURE__ */jsx(Tooltip, {
    content: tooltipContent,
    fallbackPlacements: ["right", "left"],
    placement: "top",
    portal: true,
    children: /* @__PURE__ */jsx(Flex, {
      gap: 1,
      style: {
        flexShrink: 0
      },
      onClick: e => e.stopPropagation(),
      children: /* @__PURE__ */jsx(MenuButton, {
        id: "add-page-button",
        button: /* @__PURE__ */jsx(Button, {
          mode: "ghost",
          paddingX: 2,
          paddingY: 2,
          fontSize: 1,
          icon: AddIcon,
          disabled: isAddPageButtonDisabled
        }),
        menu: /* @__PURE__ */jsx(Menu, {
          children: menuButtons
        }),
        popover: {
          placement: "bottom"
        },
        onOpen: onActionOpen,
        onClose: onActionClose
      })
    })
  });
};
var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", {
  value: __freeze$3(raw || cooked.slice())
}));
var _a$3;
const TOOLTIP_PROPS = {
  fallbackPlacements: ["right", "left"],
  placement: "top",
  portal: true
};
const PageTreeViewItemStatus = _ref3 => {
  let {
    isPublished,
    isDraft
  } = _ref3;
  const theme = useTheme();
  return /* @__PURE__ */jsxs(Flex, {
    gap: 2,
    style: {
      flexShrink: 0
    },
    children: [/* @__PURE__ */jsx(Tooltip, {
      content: /* @__PURE__ */jsx(Box, {
        padding: 2,
        children: /* @__PURE__ */jsx(Text, {
          muted: true,
          size: 1,
          children: isPublished ? "Published" : "Not published"
        })
      }),
      ...TOOLTIP_PROPS,
      children: /* @__PURE__ */jsx(OpacityBox, {
        opacity: isPublished ? 1 : 0.3,
        children: /* @__PURE__ */jsx(PublishIcon, {
          fontSize: 21,
          color: isPublished ? theme.sanity.color.muted.positive.enabled.fg : void 0
        })
      })
    }), /* @__PURE__ */jsx(Tooltip, {
      content: /* @__PURE__ */jsx(Box, {
        padding: 2,
        children: /* @__PURE__ */jsx(Text, {
          muted: true,
          size: 1,
          children: isDraft ? "Edited" : "No unpublished edits"
        })
      }),
      ...TOOLTIP_PROPS,
      children: /* @__PURE__ */jsx(OpacityBox, {
        opacity: isDraft ? 1 : 0.3,
        children: /* @__PURE__ */jsx(EditIcon, {
          fontSize: 21,
          color: isDraft ? theme.sanity.color.muted.caution.enabled.fg : void 0
        })
      })
    })]
  });
};
const OpacityBox = styled(Box)(_a$3 || (_a$3 = __template$3(["\n  opacity: ", ";\n"])), props => props.opacity);
var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", {
  value: __freeze$2(raw || cooked.slice())
}));
var _a$2, _b, _c, _d, _e, _f;
const PageTreeViewItem = _ref4 => {
  let {
    page,
    parentPath,
    onToggle,
    onClick,
    openItemIds,
    disabledItemIds,
    allowedPageTypes,
    forceOpen,
    isRoot
  } = _ref4;
  var _a2, _b2, _c2, _d2, _e2, _f2, _g;
  const config = usePageTreeConfig();
  const {
    navigateIntent,
    routerPanesState,
    groupIndex
  } = usePaneRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hasActionOpen, setHasActionOpen] = useState(false);
  const toggle = e => {
    e.stopPropagation();
    onToggle(page);
  };
  const onItemClick = () => {
    if (isDisabled) return;
    onClick ? onClick(page) : openPage();
  };
  const openPage = () => {
    navigateIntent("edit", {
      id: page._id,
      type: page._type
    });
  };
  const path = parentPath ? "".concat(parentPath, "/").concat((_a2 = page.slug) == null ? void 0 : _a2.current) : (_b2 = getLanguageFieldName(config)) != null ? _b2 : "/";
  const hasChildren = page.children.length > 0;
  const currentPageNumber = (_d2 = (_c2 = routerPanesState[groupIndex + 1]) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.id;
  const isSelected = currentPageNumber === page._id;
  const isDisabled = (_e2 = allowedPageTypes && !allowedPageTypes.includes(page._type) || disabledItemIds && disabledItemIds.some(id => id === page._id)) != null ? _e2 : false;
  const isOpen = useMemo(() => {
    if (forceOpen) {
      return true;
    }
    const flatPages = page.children ? flatMapPageTree(page.children) : [];
    const flatPageIds = [page._id, ...flatPages.map(p => p._id)];
    return openItemIds.some(id => flatPageIds.includes(id));
  }, [page._id, page.children, forceOpen, openItemIds]);
  return /* @__PURE__ */jsx(Card, {
    children: /* @__PURE__ */jsxs(Stack, {
      flex: 1,
      children: [/* @__PURE__ */jsxs(ItemContainer, {
        align: "center",
        gap: 1,
        children: [!isRoot && /* @__PURE__ */jsx(HorizontalLine, {}), /* @__PURE__ */jsx(Flex, {
          paddingLeft: 3,
          children: hasChildren && /* @__PURE__ */jsx(Button, {
            mode: "ghost",
            padding: 2,
            fontSize: 1,
            icon: isOpen ? ChevronUpIcon : ChevronDownIcon,
            onClick: toggle,
            disabled: forceOpen
          })
        }), /* @__PURE__ */jsxs(Item, {
          flex: 1,
          paddingLeft: 1,
          align: "center",
          gap: 3,
          justify: "space-between",
          hasMarginLeft: hasChildren,
          isDisabled,
          isSelected: isHovered || isSelected,
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
          onClick: onItemClick,
          children: [/* @__PURE__ */jsxs(Flex, {
            align: "center",
            gap: 3,
            children: [/* @__PURE__ */jsx(UrlText, {
              isDisabled,
              textOverflow: "ellipsis",
              children: parentPath ? (_f2 = page.slug) == null ? void 0 : _f2.current : (_g = getRootPageSlug(page, config)) != null ? _g : "/"
            }), !isDisabled && (isHovered || hasActionOpen) && /* @__PURE__ */jsx(PageTreeViewItemActions, {
              page,
              onActionOpen: () => setHasActionOpen(true),
              onActionClose: () => setHasActionOpen(false)
            })]
          }), /* @__PURE__ */jsx(PageTreeViewItemStatus, {
            isPublished: page.isPublished,
            isDraft: page.isDraft
          })]
        })]
      }), isOpen && /* @__PURE__ */jsxs(ChildContainer, {
        children: [/* @__PURE__ */jsx(VerticalLine, {}), hasChildren && /* @__PURE__ */jsx(Stack, {
          paddingY: 1,
          space: 2,
          children: page.children.map(childPage => /* @__PURE__ */jsx(PageTreeViewItem, {
            page: childPage,
            parentPath: path,
            onToggle,
            openItemIds,
            disabledItemIds,
            allowedPageTypes,
            forceOpen,
            onClick
          }, childPage._id))
        })]
      })]
    })
  });
};
const HorizontalLine = styled("div")(_a$2 || (_a$2 = __template$2(["\n  background-color: ", ";\n  position: absolute;\n  height: 1px;\n  width: 2rem;\n  left: 0;\n  top: 50%;\n  transform: translateY(-50%);\n"])), _ref5 => {
  let {
    theme
  } = _ref5;
  return theme.sanity.color.card.enabled.border;
});
const VerticalLine = styled("div")(_b || (_b = __template$2(["\n  background-color: ", ";\n  position: absolute;\n  margin-top: -2px;\n  height: calc(100% - 16px);\n  width: 1px;\n  left: 0;\n  top: 0;\n"])), _ref6 => {
  let {
    theme
  } = _ref6;
  return theme.sanity.color.card.enabled.border;
});
const ItemContainer = styled(Flex)(_c || (_c = __template$2(["\n  position: relative;\n"])));
const Item = styled(Flex)(_d || (_d = __template$2(["\n  height: 1.75rem;\n  margin-left: ", ";\n  border-radius: 0.1875rem;\n  background-color: ", ";\n\n  &:hover {\n    cursor: ", ";\n  }\n"])), _ref7 => {
  let {
    hasMarginLeft
  } = _ref7;
  return hasMarginLeft ? "0rem" : "1.5rem";
}, _ref8 => {
  let {
    theme,
    isDisabled,
    isSelected
  } = _ref8;
  return !isDisabled && isSelected ? theme.sanity.color.card.hovered.bg : void 0;
}, _ref9 => {
  let {
    isDisabled
  } = _ref9;
  return !isDisabled ? "pointer" : void 0;
});
const UrlText = styled(Text)(_e || (_e = __template$2(["\n  min-width: 0;\n  opacity: ", ";\n"])), _ref10 => {
  let {
    isDisabled
  } = _ref10;
  return isDisabled ? 0.5 : 1;
});
const ChildContainer = styled(Card)(_f || (_f = __template$2(["\n  margin-left: 1.5rem;\n  position: relative;\n"])));
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", {
  value: __freeze$1(raw || cooked.slice())
}));
var _a$1;
const PAGE_TREE_STATE_KEY = "sanity:page-tree-state";
const PageTreeEditor = _ref11 => {
  let {
    pageTree,
    onItemClick,
    disabledItemIds,
    initialOpenItemIds,
    allowedPageTypes
  } = _ref11;
  const config = usePageTreeConfig();
  const client = useClient({
    apiVersion: config.apiVersion
  });
  const {
    navigateUrl,
    resolveIntentLink
  } = useRouter();
  const [pageTreeState, setPageTreeState] = useState(() => {
    const sessionState = JSON.parse(sessionStorage.getItem(PAGE_TREE_STATE_KEY) || "{}");
    return {
      query: sessionState.query || "",
      openItemIds: [...(sessionState.openItemIds || pageTree.map(page => page._id)), ...(initialOpenItemIds || [])]
    };
  });
  useEffect(() => {
    sessionStorage.setItem(PAGE_TREE_STATE_KEY, JSON.stringify(pageTreeState));
  }, [pageTreeState]);
  const filteredPageTree = useMemo(() => {
    if (!pageTree) return;
    const query = pageTreeState.query.toLowerCase();
    const filter = pages => pages.reduce((filteredPages, page) => {
      var _a2, _b;
      let shouldInclude = true;
      if (page.children) {
        const children = filter(page.children);
        if (children.length) {
          filteredPages.push({
            ...page,
            children
          });
          shouldInclude = false;
        }
      }
      if (shouldInclude) {
        const slugSourceFieldValue = config.titleFieldName ? page[config.titleFieldName] : void 0;
        const matchesSlug = (_b = (_a2 = page.slug) == null ? void 0 : _a2.current) == null ? void 0 : _b.toLowerCase().includes(query);
        const matchesTitle = typeof slugSourceFieldValue === "string" ? slugSourceFieldValue.toLowerCase().includes(query) : false;
        if (matchesSlug || matchesTitle) {
          filteredPages.push(page);
        }
      }
      return filteredPages;
    }, []);
    return filter(pageTree);
  }, [pageTree, pageTreeState.query, config.titleFieldName]);
  const togglePage = useCallback(page => {
    if (!pageTree) return;
    const index = pageTreeState.openItemIds.indexOf(page._id);
    if (index === -1) {
      setPageTreeState({
        ...pageTreeState,
        openItemIds: [...pageTreeState.openItemIds, page._id]
      });
    } else {
      const item = findPageTreeItemById(pageTree, page._id);
      if (!item) return;
      const childItems = flatMapPageTree([item]);
      const itemIdsToClose = [item, ...childItems];
      const newOpenItemIds = without(pageTreeState.openItemIds, ...itemIdsToClose.map(item2 => item2._id));
      setPageTreeState({
        ...pageTreeState,
        openItemIds: newOpenItemIds
      });
    }
  }, [pageTreeState, setPageTreeState, pageTree]);
  const addRootPage = useCallback(async () => {
    const doc = await client.create({
      _id: generateDraftId(),
      _type: config.rootSchemaType
    });
    const path = resolveIntentLink("edit", {
      id: doc._id,
      type: doc._type
    });
    navigateUrl({
      path
    });
  }, [client, config.rootSchemaType, resolveIntentLink, navigateUrl]);
  return /* @__PURE__ */jsxs(Flex, {
    gap: 3,
    direction: "column",
    children: [/* @__PURE__ */jsx(Box, {
      children: /* @__PURE__ */jsx(TextInput, {
        icon: SearchIcon,
        onChange: event => setPageTreeState({
          ...pageTreeState,
          query: event.currentTarget.value
        }),
        placeholder: "Search",
        value: pageTreeState.query
      })
    }), (filteredPageTree == null ? void 0 : filteredPageTree.length) ? /* @__PURE__ */jsx(Flex, {
      direction: "column",
      children: filteredPageTree.map(page => /* @__PURE__ */jsx(PageTreeViewItem, {
        page,
        onToggle: togglePage,
        openItemIds: pageTreeState.openItemIds,
        disabledItemIds,
        allowedPageTypes,
        forceOpen: !!pageTreeState.query,
        isRoot: true,
        onClick: onItemClick
      }, page._id))
    }) : /* @__PURE__ */jsxs(Fragment, {
      children: [/* @__PURE__ */jsx(Box, {
        paddingX: 3,
        paddingY: 3,
        children: /* @__PURE__ */jsx(Text, {
          children: "No pages found"
        })
      }), /* @__PURE__ */jsx(AddButton, {
        mode: "ghost",
        icon: AddIcon,
        text: "Add root page",
        onClick: addRootPage
      })]
    })]
  });
};
const AddButton = styled(Button)(_a$1 || (_a$1 = __template$1(["\n  align-self: flex-start;\n"])));
const PageTreeView = forwardRef((_ref12, ref) => {
  let {
    config
  } = _ref12;
  const {
    pageTree
  } = usePageTree(config);
  return /* @__PURE__ */jsx(PageTreeConfigProvider, {
    config,
    children: /* @__PURE__ */jsx(Stack, {
      ref,
      space: 3,
      children: /* @__PURE__ */jsx(Card, {
        padding: 3,
        children: !pageTree ? /* @__PURE__ */jsx(Flex, {
          paddingY: 4,
          justify: "center",
          align: "center",
          children: /* @__PURE__ */jsx(Spinner, {})
        }) : /* @__PURE__ */jsx(PageTreeEditor, {
          pageTree
        })
      })
    })
  });
});
PageTreeView.displayName = "PageTreeView";
const createPageTreeView = config => /* @__PURE__ */jsx(PageTreeView, {
  config
});
const useOptimisticState = state => {
  const [optimisticState, setOptimisticState] = useState(null);
  useEffect(() => {
    if (optimisticState === state) {
      setOptimisticState(null);
    }
  }, [state, optimisticState]);
  return [optimisticState != null ? optimisticState : state, setOptimisticState];
};
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", {
  value: __freeze(raw || cooked.slice())
}));
var _a;
const PageTreeInput = props => {
  var _a2, _b, _c;
  const mode = (_a2 = props.mode) != null ? _a2 : "select-page";
  const form = useFormValue([]);
  const {
    pageTree
  } = usePageTree(props.config);
  const allowedPageTypes = (_b = props.schemaType.to) == null ? void 0 : _b.map(t => t.name);
  const [isPageTreeDialogOpen, setIsPageTreeDialogOpen] = useState(false);
  const parentId = (_c = props.value) == null ? void 0 : _c._ref;
  const pageId = getSanityDocumentId(form._id);
  const fieldPage = useMemo(() => pageTree ? findPageTreeItemById(pageTree, pageId) : void 0, [pageTree, pageId]);
  const parentPage = useMemo(() => pageTree && parentId ? findPageTreeItemById(pageTree, parentId) : void 0, [pageTree, parentId]);
  const flatFieldPages = useMemo(() => fieldPage ? flatMapPageTree([fieldPage]) : [], [fieldPage]);
  const [parentPath, setOptimisticParentPath] = useOptimisticState(parentPage == null ? void 0 : parentPage.path);
  const disabledParentIds = mode !== "select-parent" ? [] : [...(parentId ? [parentId] : []), ...flatFieldPages.map(page => page._id)];
  const openItemIds = (fieldPage == null ? void 0 : fieldPage._id) ? [fieldPage == null ? void 0 : fieldPage._id] : void 0;
  const openDialog = () => {
    setIsPageTreeDialogOpen(true);
  };
  const closeDialog = () => {
    setIsPageTreeDialogOpen(false);
  };
  const selectParentPage = page => {
    const lastPath = props.path[props.path.length - 1];
    const _key = typeof lastPath === "object" && "_key" in lastPath ? lastPath._key : void 0;
    props.onChange(set({
      ...(_key ? {
        _key
      } : {}),
      _ref: page._id,
      _type: "reference",
      _weak: page.isDraft,
      ...(page.isDraft ? {
        _strengthenOnPublish: {
          type: page._type
        }
      } : {})
    }));
    setOptimisticParentPath(page.path);
    closeDialog();
  };
  return /* @__PURE__ */jsxs(PageTreeConfigProvider, {
    config: props.config,
    children: [/* @__PURE__ */jsx(Stack, {
      space: 3,
      children: !pageTree ? /* @__PURE__ */jsx(Flex, {
        paddingY: 4,
        justify: "center",
        align: "center",
        children: /* @__PURE__ */jsx(Spinner, {})
      }) : /* @__PURE__ */jsx(Card, {
        padding: 1,
        shadow: 1,
        radius: 2,
        children: /* @__PURE__ */jsx(SelectedItemCard, {
          padding: 3,
          radius: 2,
          onClick: openDialog,
          children: /* @__PURE__ */jsx(Text, {
            size: 2,
            children: parentId ? parentPath != null ? parentPath : "Select page" : "Select page"
          })
        })
      })
    }), pageTree && isPageTreeDialogOpen && /* @__PURE__ */jsx(Dialog, {
      header: "Select page",
      id: "parent-page-tree",
      zOffset: 1e3,
      width: 1,
      onClose: closeDialog,
      onClickOutside: closeDialog,
      children: /* @__PURE__ */jsx(Box, {
        padding: 4,
        children: /* @__PURE__ */jsx(PageTreeEditor, {
          allowedPageTypes,
          pageTree,
          onItemClick: selectParentPage,
          disabledItemIds: disabledParentIds,
          initialOpenItemIds: openItemIds
        })
      })
    })]
  });
};
const SelectedItemCard = styled(Card)(_a || (_a = __template(["\n  cursor: pointer;\n\n  &:hover {\n    background-color: ", ";\n  }\n"])), _ref13 => {
  let {
    theme
  } = _ref13;
  return theme.sanity.color.card.hovered.bg;
});
const PageTreeField = props => {
  const inputProps = {
    config: props.config,
    mode: props.mode,
    ...props.inputProps
  };
  return /* @__PURE__ */jsx(FormField, {
    title: props.title,
    inputId: props.inputId,
    validation: props.validation,
    children: /* @__PURE__ */jsx(PageTreeInput, {
      ...inputProps
    })
  });
};
const usePageTreeItem = (documentId, config, perspective) => {
  const {
    data,
    loading
  } = useListeningQuery(getAllRawPageMetadataQuery(config), {
    options: {
      apiVersion: config.apiVersion,
      perspective
    }
  });
  const pageTree = useMemo(() => data ? getAllPageMetadata(config, data) : void 0, [config, data]);
  return {
    isLoading: loading,
    page: pageTree == null ? void 0 : pageTree.find(page => page._id === documentId)
  };
};
const SlugField = props => {
  const id = useFormValue(["_id"]);
  const type = useFormValue(["_type"]);
  const parentRef = useFormValue(["parent"]);
  const {
    config,
    value,
    renderDefault
  } = props;
  return /* @__PURE__ */jsxs(Stack, {
    space: 3,
    children: [renderDefault(props), typeof id == "string" && typeof type == "string" && !!(parentRef == null ? void 0 : parentRef._ref) && /* @__PURE__ */jsx(UrlExplanation, {
      id,
      type,
      parentId: parentRef == null ? void 0 : parentRef._ref,
      config,
      value
    })]
  });
};
const UrlExplanation = _ref14 => {
  let {
    id,
    type,
    parentId,
    value,
    config
  } = _ref14;
  useEditState(getSanityDocumentId(id), type != null ? type : "");
  const {
    page,
    isLoading
  } = usePageTreeItem(parentId, config, "published");
  if (isLoading) return null;
  const path = (page == null ? void 0 : page.path) == "/" ? "".concat(page == null ? void 0 : page.path).concat(value == null ? void 0 : value.current) : "".concat(page == null ? void 0 : page.path, "/").concat(value == null ? void 0 : value.current);
  if (!config.baseUrl) {
    return /* @__PURE__ */jsxs(Text, {
      muted: true,
      size: 1,
      children: ["Page url: ", path]
    });
  }
  const url = "".concat(config.baseUrl).concat(path);
  return /* @__PURE__ */jsxs(Text, {
    muted: true,
    size: 1,
    children: ["Link to page:", /* @__PURE__ */jsx("a", {
      href: url,
      target: "blank",
      children: url
    })]
  });
};
const parentValidator = (config, ownType) => async (selectedParentRef, context) => {
  const client = context.getClient({
    apiVersion: config.apiVersion
  });
  if (!selectedParentRef) {
    return true;
  }
  const parentId = selectedParentRef._ref;
  const selectedParent = (await client.fetch(getRawPageMetadataQuery(parentId, config)))[0];
  const allowedParentValidation = allowedParentValidator(selectedParent, config, ownType);
  if (allowedParentValidation !== true) {
    return allowedParentValidation;
  }
  return parentLanguageValidator(selectedParent, config, context);
};
const allowedParentValidator = (selectedParent, config, ownType) => {
  var _a;
  const allowedParents = (_a = config.allowedParents) == null ? void 0 : _a[ownType];
  if (allowedParents === void 0) {
    return true;
  }
  if (!allowedParents.includes(selectedParent._type)) {
    return 'The parent of type "'.concat(selectedParent._type, '" is not allowed for this type of document.');
  }
  return true;
};
const parentLanguageValidator = (selectedParent, config, context) => {
  var _a, _b;
  if ((_a = config.documentInternationalization) == null ? void 0 : _a.documentLanguageShouldMatchParent) {
    const languageFieldName = getLanguageFieldName(config);
    const language = (_b = context.document) == null ? void 0 : _b[languageFieldName];
    const parentLanguage = selectedParent == null ? void 0 : selectedParent[languageFieldName];
    if (language !== parentLanguage) {
      return "The language of the parent must match the language of the document.";
    }
  }
  return true;
};
const slugValidator = config => async (slug, context) => {
  var _a, _b;
  const client = context.getClient({
    apiVersion: config.apiVersion
  });
  const parentRef = (_a = context.document) == null ? void 0 : _a.parent;
  if (!parentRef) {
    return true;
  }
  const allPages = await client.fetch(getAllRawPageMetadataQuery(config));
  const siblingPages = allPages.filter(page => {
    var _a2;
    return ((_a2 = page.parent) == null ? void 0 : _a2._ref) === parentRef._ref;
  });
  const siblingPagesWithSameSlug = siblingPages.filter(page => {
    var _a2;
    return getSanityDocumentId(page._id) !== (((_a2 = context.document) == null ? void 0 : _a2._id) && getSanityDocumentId(context.document._id));
  }).filter(page => {
    var _a2, _b2, _c;
    return ((_b2 = (_a2 = page.slug) == null ? void 0 : _a2.current) == null ? void 0 : _b2.toLowerCase()) === ((_c = slug == null ? void 0 : slug.current) == null ? void 0 : _c.toLowerCase());
  });
  if (siblingPagesWithSameSlug.length) {
    const siblingDraftPageWithSameSlug = siblingPages.find(page => {
      var _a2, _b2, _c;
      return page._id.startsWith(DRAFTS_PREFIX) && page._id.includes(siblingPagesWithSameSlug[0]._id) && ((_b2 = (_a2 = page.slug) == null ? void 0 : _a2.current) == null ? void 0 : _b2.toLowerCase()) !== ((_c = slug == null ? void 0 : slug.current) == null ? void 0 : _c.toLowerCase());
    });
    return siblingDraftPageWithSameSlug ? 'Slug must be unique. Another page with the same slug is already published, but has a draft version with a  different slug: "'.concat((_b = siblingDraftPageWithSameSlug.slug) == null ? void 0 : _b.current, '". Publish that page first or change the slug to something else.') : "Slug must be unique.";
  }
  return true;
};
function getPossibleParentsFromConfig(config, ownType) {
  if (config.allowedParents !== void 0 && ownType.name in config.allowedParents) {
    return config.allowedParents[ownType.name];
  }
  return config.pageSchemaTypes;
}
const definePageType = function (type, config) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    isRoot: false
  };
  const slugSourceFieldName = getSlugSourceField(config, options);
  let slugSourceField;
  let typeFields = type.fields;
  if (slugSourceFieldName) {
    slugSourceField = type.fields.find(field => field.name === slugSourceFieldName);
    typeFields = type.fields.filter(field => field.name !== slugSourceFieldName);
  }
  return defineType({
    ...type,
    title: type.title,
    fields: compact([slugSourceField, ...basePageFields(config, options, type), ...typeFields])
  });
};
const basePageFields = (config, options, ownType) => [...(!options.isRoot ? [defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  options: {
    source: getSlugSourceField(config, options),
    isUnique: () => true
  },
  components: {
    input: props => SlugField({
      ...props,
      config
    })
  },
  validation: Rule => Rule.required().custom(slugValidator(config)),
  group: options.fieldsGroupName
})] : []), ...(!options.isRoot ? [defineField({
  name: "parent",
  title: "Parent page",
  type: "reference",
  to: getPossibleParentsFromConfig(config, ownType).map(type => ({
    type
  })),
  validation: Rule => Rule.required().custom(parentValidator(config, ownType.name)),
  group: options.fieldsGroupName,
  components: {
    field: props => PageTreeField({
      ...props,
      config,
      mode: "select-parent"
    })
  }
})] : [])];
const getSlugSourceField = (config, options) => {
  var _a;
  return (_a = config.titleFieldName) != null ? _a : options.slugSource;
};
const createPageTreeDocumentList = (S, _ref15) => {
  let {
    config,
    extendDocumentList
  } = _ref15;
  const documentList = extendDocumentList ? extendDocumentList(S.documentList()) : S.documentList();
  return Object.assign(documentList.filter("_type in [".concat(config.pageSchemaTypes.map(type => '"'.concat(type, '"')).join(","), "]")).serialize(), {
    // Prevents the component from re-rendering when switching documents
    __preserveInstance: true,
    key: "pageTree",
    type: "component",
    component: createPageTreeView(config)
  });
};
export { PageTreeField, PageTreeInput, createPageTreeDocumentList, definePageType };
//# sourceMappingURL=index.esm.js.map
