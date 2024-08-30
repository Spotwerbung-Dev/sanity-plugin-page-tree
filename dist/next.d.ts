import { FilteredResponseQueryOptions } from 'next-sanity';
import { SanityClient } from 'next-sanity';

export declare const createNextPageTreeClient: ({
  config,
  client,
  fetchOptions,
}: NextPageTreeClientOptions) => NextPageTreeClient;

declare class NextPageTreeClient {
  private readonly config;
  private readonly client;
  private readonly defaultSanityFetchOptions?;
  constructor(config: PageTreeConfig, client: SanityClient, defaultSanityFetchOptions?: FilteredResponseQueryOptions);
  getAllPageMetadata(): Promise<PageMetadata[]>;
  getPageMetadataById(id: string): Promise<PageMetadata | undefined>;
  getPageMetadataByPath(path: string): Promise<PageMetadata | undefined>;
}

export declare type NextPageTreeClientOptions = {
  config: PageTreeConfig;
  client: SanityClient;
  fetchOptions?: FilteredResponseQueryOptions;
};

/**
 * @public
 */
export declare type PageMetadata = {
  _id: string;
  _updatedAt: string;
  path: string;
  type: string;
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
