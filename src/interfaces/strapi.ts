export interface IMetadata {
  pageSize: number;
  pageCount: number;
  page: number;
  total: number;
}

export interface IMetadataDefault {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface IStrapiImage {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    large?: IStrapiImageFormat;
    small?: IStrapiImageFormat;
    medium?: IStrapiImageFormat;
    thumbnail?: IStrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  documentId: string;
  locale: string | null;
  publishedAt: string;
}

export interface IStrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface IServiceSection {
  id: number;
  title: string;
  description: string;
  visual: IStrapiImage | null;
}

export interface IService {
  id: number;
  documentId: string;
  name: string;
  description: string;
  visual_description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  slug: string | null;
  visual: IStrapiImage | null;
  sections: IServiceSection[];
  first_gallery: IStrapiImage[] | null;
  second_gallery: IStrapiImage[] | null;
  localizations: any[];
}

export interface IServicesResponse {
  data: IService[];
  meta: {
    pagination: IMetadata;
  };
}

export type StrapiResponse<T> = {
  results: T[];
  metadata: IMetadata;
};

export type StrapiResponseData<T> = {
  data: T[];
  metadata: IMetadata;
};

export type StrapiResponseDataSingle<T> = {
  data: T;
  metadata: IMetadata;
};

// Files
export interface IFile {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface IFileFormats {
  large?: IFile;
  medium?: IFile;
  small?: IFile;
  thumbnail?: IFile;
}

export interface IFileObject {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width?: number;
  height?: number;
  formats: IFileFormats | null;
  hash: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: unknown;
  provider: string;
  provider_metadata: unknown;
  folderPath: string;
  createdAt: string;
  updatedAt: string;
  ext: string;
}
