import { DocumentDefinition } from 'sanity';
import { DocumentList } from 'sanity/structure';
import { DocumentListBuilder } from 'sanity/structure';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ObjectFieldProps } from 'sanity';
import { ObjectInputProps } from 'sanity';
import { PreviewConfig } from 'sanity';
import { ReferenceValue } from 'sanity';
import { SlugOptions } from 'sanity';
import { StructureBuilder } from 'sanity/structure';

/**
 * Creates a custom document list for the page tree.
 * @param S - Structure builder
 * @param config - Page tree config
 * @param extendDocumentList - Optional function to extend the document list builder to add custom title, filter etc.
 * @public
 */
export declare const createPageTreeDocumentList: (
  S: StructureBuilder,
  { config, extendDocumentList }: PageTreeDocumentListOptions,
) => DocumentList;

export declare const definePageType: (
  type: DocumentDefinition,
  config: PageTreeConfig,
  options?: Options,
) => {
  type: 'document';
  name: string;
} & Omit<DocumentDefinition, 'preview'> & {
    preview?: PreviewConfig<Record<string, string>, Record<string, any>> | undefined;
  };

declare type Options = {
  isRoot?: boolean;
  fieldsGroupName?: string;
  slugSource?: SlugOptions['source'];
};

/**
 * @public
 */
export declare type PageTreeConfig = {
  apiVersion: string;
  rootSchemaType: string;
  pageSchemaTypes: string[];
  titleFieldName?: string;
  allowedParents?: Record<string, string[]>;
  baseUrl?: string;
  documentInternationalization?: {
    supportedLanguages: string[];
    languageFieldName?: string;
    documentLanguageShouldMatchParent?: boolean;
  };
};

/**
 * @public
 */
export declare type PageTreeDocumentListOptions = {
  config: PageTreeConfig;
  extendDocumentList?: (builder: DocumentListBuilder) => DocumentListBuilder;
};

export declare const PageTreeField: (
  props: ObjectFieldProps<ReferenceValue> & {
    config: PageTreeConfig;
    mode?: 'select-parent' | 'select-page';
    inputProps: {
      schemaType: {
        to?: {
          name: string;
        }[];
      };
    };
  },
) => JSX_2.Element;

export declare const PageTreeInput: (
  props: ObjectInputProps<ReferenceValue> & {
    config: PageTreeConfig;
    mode?: 'select-parent' | 'select-page';
    schemaType: {
      to?: {
        name: string;
      }[];
    };
  },
) => JSX_2.Element;

export {};
