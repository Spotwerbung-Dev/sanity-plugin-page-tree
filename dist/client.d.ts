import { SanityClient } from 'sanity';

export declare const createPageTreeClient: ({ config, client }: PageTreeClientOptions) => PageTreeClient;

/**
 * @public
 */
export declare type PageMetadata = {
  _id: string;
  _updatedAt: string;
  path: string;
  type: string;
};

declare class PageTreeClient {
  private readonly config;
  private readonly client;
  constructor(config: PageTreeConfig, client: SanityClient);
  getAllPageMetadata(): Promise<PageMetadata[]>;
}

export declare type PageTreeClientOptions = {
  config: PageTreeConfig;
  client: SanityClient;
};

/**
 * @public
 */
declare type PageTreeConfig = {
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

export {};
