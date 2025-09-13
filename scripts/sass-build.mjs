/* eslint-env node */
// Build CSS from Sass using the modern Dart Sass JS API (compile/compileString)
import sass from 'sass';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Inputs/outputs
const entry = path.join(rootDir, 'src/styles/styles.scss');
const outFile = path.join(rootDir, 'public/styles.css');

// CLI flags (optional):
// --compressed     -> style=compressed
// --expanded       -> style=expanded (default)
// --style=expanded -> explicit style
// --style=compressed
const args = process.argv.slice(2);
const argStyle = args.find(a => a.startsWith('--style='));
let style = 'expanded';
if (args.includes('--compressed')) style = 'compressed';
if (args.includes('--expanded')) style = 'expanded';
if (argStyle) {
  const v = argStyle.split('=')[1];
  if (v === 'expanded' || v === 'compressed') style = v;
}

// Load paths to simplify @use/@forward like @use 'global';
const loadPaths = [path.join(rootDir, 'src/styles')];

async function buildFile() {
  try {
    const result = sass.compile(entry, {
      style,
      loadPaths,
      // quietDeps: true, // uncomment to silence dependency warnings
    });

    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, result.css, 'utf8');

    console.log(`[sass] Compiled ${path.relative(rootDir, entry)} -> ${path.relative(rootDir, outFile)} (${style})`);
    if (result.loadedUrls?.length) {
      // Print the first few loaded URLs for visibility
      const urls = result.loadedUrls.slice(0, 5).map(u => (u.pathname || u.toString()));
      console.log(`[sass] Loaded URLs (${result.loadedUrls.length}):`, urls);
    }
  } catch (err) {
    console.error('[sass] Build failed:', err);
    process.exitCode = 1;
  }
}

/**
 * Example showing compileString for dynamic content (optional).
 * Uncomment this block to try it locally.
 */
/*
function buildStringExample() {
  const scss = `
    @use "global";
    .debug-badge {
      background: var(--color-highlight);
      color: var(--color-text);
      padding-inline: var(--space-2);
      border-radius: var(--radius-sm);
    }
  `;
  const res = sass.compileString(scss, { style, loadPaths });
  // You could write res.css to a different file if needed
  // console.log(res.css);
  return res.css;
}
*/

await buildFile();
// Uncomment to generate a dynamic string CSS artifact if needed:
// const dynamicCss = buildStringExample();