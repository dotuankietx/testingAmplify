export {};

declare global {
  interface Window {
    BACKEND_TOKEN: string;
    ROLE: string;
  }
}