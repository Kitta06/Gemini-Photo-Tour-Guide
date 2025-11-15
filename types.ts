
export type AppState = 'idle' | 'loading' | 'analyzing' | 'searching' | 'narrating' | 'success' | 'error';

export interface Source {
  web?: {
    uri: string;
    title: string;
  };
}
