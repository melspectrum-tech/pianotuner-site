import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mpaDev } from './scripts/vite-plugin-mpa-dev.mjs';

// root = app/ ; static source = app/public/ (dev and prod share the same URL semantics).
// base '/' is load-bearing: /en/*.html must resolve /assets/… absolutely.
// appType 'mpa' makes `vite preview` behave like nginx `try_files … =404` (no SPA fallback).
// Build goes to an untrusted stage; scripts/publish-build.mjs promotes only the GENERATED
// allowlist into the repo root after verification. Never point outDir at the repo root.
// 本地联调网站助手：设了 PT_API_PROXY（如 http://127.0.0.1:5055）才把 /api 转给本地 Flask，默认不代理。
const apiProxy = process.env.PT_API_PROXY;
const proxy = apiProxy ? { '/api': { target: apiProxy } } : undefined;

export default defineConfig({
  root: 'app',
  base: '/',
  appType: 'mpa',
  plugins: [react(), mpaDev()],
  server: { proxy },
  preview: { proxy },
  build: {
    outDir: '../build-stage',
    emptyOutDir: true,
    assetsDir: 'assets',
    target: 'es2020',
    manifest: false,
  },
});
