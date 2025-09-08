import type { BuildConfig } from "bun";
import { resolve } from "node:path";

const sharedConfig: BuildConfig = {
  entrypoints: [resolve(__dirname, "../src/index.ts")],
  env: "disable",
  sourcemap: "linked",
  minify: true,
  packages: "external",
};

async function clean() {
  const proc = Bun.spawn(["rm", "-rf", resolve(__dirname, "../dist")]);
  await proc.exited;
}

async function buildEsm() {
  await Bun.build({
    ...sharedConfig,
    target: "node",
    format: "esm",
    outdir: resolve(__dirname, "../dist/esm"),
  });
}

async function buildCjs() {
  await Bun.build({
    ...sharedConfig,
    target: "node",
    format: "cjs",
    outdir: resolve(__dirname, "../dist/cjs"),
  });
}

async function buildTypes() {
  const proc = Bun.spawn(
    ["tsc", "-p", resolve(__dirname, "../tsconfig.json")],
    {
      stdout: "inherit",
      stderr: "inherit",
    }
  );
  await proc.exited;
  return;
}

async function main() {
  await clean();
  await buildEsm();
  await buildCjs();
  await buildTypes();
}

main();
