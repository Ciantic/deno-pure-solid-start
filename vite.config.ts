// import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import { defineConfig } from '@solidjs/start/config';
import { createDb } from "./src/db.ts";
await createDb(true);

// https://vite.dev/config/
export default defineConfig({
  // server: {

  // }
  vite: () => ({
    plugins: [deno()],
  })
})
