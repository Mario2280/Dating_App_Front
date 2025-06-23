/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_NODE_ENV: string
  //readonly NODE_ENV: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
