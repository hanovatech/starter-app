import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const pkgPath = fileURLToPath(new URL('package.json', import.meta.url));
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  // No commits yet
}

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __APP_COMMIT_HASH__: JSON.stringify(commitHash)
  }
});
