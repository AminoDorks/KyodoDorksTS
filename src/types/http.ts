export type Headers = Record<string, string>;

export type HandleBuilder = {
  status: number;
  path: string;
  json: unknown;
};

export type CallBuilder = {
  method: 'GET' | 'POST';
  path: string;
  headers: Headers;
  body?: string | ArrayBuffer;
};

export type PostBuilder = {
  path: string;
  body: string | ArrayBuffer;
  contentType?: string;
};
