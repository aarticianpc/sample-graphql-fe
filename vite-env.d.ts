/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // Replace with any other variables you need
  // Add more environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
