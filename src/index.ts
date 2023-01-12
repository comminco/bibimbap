/**
 * Original Code
 * https://github.com/vitejs/vite/blob/main/packages/create-vite/src/index.ts
 * Copyright Vite
 * Author: Evan You
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import prompts from "prompts";
import {
  blue,
  cyan,
  green,
  lightGreen,
  lightRed,
  magenta,
  red,
  reset,
  yellow,
} from "kolorist";

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  t?: string;
  template?: string;
}>(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

type ColorFunc = (str: string | number) => string;
type Framework = {
  name: string;
  display: string;
  color: ColorFunc;
  variants: FrameworkVariant[];
};
type FrameworkVariant = {
  name: string;
  display: string;
  color: ColorFunc;
  customCommand?: string;
};

// const FRAMEWORKS: Framework[] = [
//   {
//     name: "vanilla",
//     display: "Vanilla",
//     color: yellow,
//     variants: [
//       {
//         name: "vanilla",
//         display: "JavaScript",
//         color: yellow,
//       },
//       {
//         name: "vanilla-ts",
//         display: "TypeScript",
//         color: blue,
//       },
//     ],
//   },
//   {
//     name: "vue",
//     display: "Vue",
//     color: green,
//     variants: [
//       {
//         name: "vue",
//         display: "JavaScript",
//         color: yellow,
//       },
//       {
//         name: "vue-ts",
//         display: "TypeScript",
//         color: blue,
//       },
//       {
//         name: "custom-create-vue",
//         display: "Customize with create-vue ↗",
//         color: green,
//         customCommand: "npm create vue@latest TARGET_DIR",
//       },
//       {
//         name: "custom-nuxt",
//         display: "Nuxt ↗",
//         color: lightGreen,
//         customCommand: "npm exec nuxi init TARGET_DIR",
//       },
//     ],
//   },
//   {
//     name: "react",
//     display: "React",
//     color: cyan,
//     variants: [
//       {
//         name: "react",
//         display: "JavaScript",
//         color: yellow,
//       },
//       {
//         name: "react-ts",
//         display: "TypeScript",
//         color: blue,
//       },
//       {
//         name: "react-swc",
//         display: "JavaScript + SWC",
//         color: yellow,
//       },
//       {
//         name: "react-swc-ts",
//         display: "TypeScript + SWC",
//         color: blue,
//       },
//     ],
//   },
//   {
//     name: "preact",
//     display: "Preact",
//     color: magenta,
//     variants: [
//       {
//         name: "preact",
//         display: "JavaScript",
//         color: yellow,
//       },
//       {
//         name: "preact-ts",
//         display: "TypeScript",
//         color: blue,
//       },
//     ],
//   },
//   {
//     name: "lit",
//     display: "Lit",
//     color: lightRed,
//     variants: [
//       {
//         name: "lit",
//         display: "JavaScript",
//         color: yellow,
//       },
//       {
//         name: "lit-ts",
//         display: "TypeScript",
//         color: blue,
//       },
//     ],
//   },
//   {
//     name: "svelte",
//     display: "Svelte",
//     color: red,
//     variants: [
//       {
//         name: "svelte",
//         display: "JavaScript",
//         color: yellow,
//       },
//       {
//         name: "svelte-ts",
//         display: "TypeScript",
//         color: blue,
//       },
//       {
//         name: "custom-svelte-kit",
//         display: "SvelteKit ↗",
//         color: red,
//         customCommand: "npm create svelte@latest TARGET_DIR",
//       },
//     ],
//   },
//   {
//     name: "others",
//     display: "Others",
//     color: reset,
//     variants: [
//       {
//         name: "create-vite-extra",
//         display: "create-vite-extra ↗",
//         color: reset,
//         customCommand: "npm create vite-extra@latest TARGET_DIR",
//       },
//     ],
//   },
// ];

// const TEMPLATES = FRAMEWORKS.map(
//   (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name]
// ).reduce((a, b) => a.concat(b), []);

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

const defaultTargetDir = "bibimbap-project";

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;

  let targetDir = argTargetDir || defaultTargetDir;
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir;

  let result: prompts.Answers<"projectName" | "overwrite" | "packageName">;

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled");
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  // user choice associated with prompts
  const { overwrite, packageName } = result;

  const root = path.join(cwd, targetDir);

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  // determine template

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template`
  );

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }

  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
  );

  pkg.name = packageName || getProjectName();

  write("package.json", JSON.stringify(pkg, null, 2));

  console.log(`\nDone. Now run:\n`);

  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`);
  }

  switch (pkgManager) {
    case "yarn":
      console.log("  yarn");
      console.log("  yarn dev");
      break;
    default:
      console.log(`  ${pkgManager} install`);
      console.log(`  ${pkgManager} run dev`);
      break;
  }
  console.log();
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

function setupReactSwc(root: string, isTs: boolean) {
  editFile(path.resolve(root, "package.json"), (content) => {
    return content.replace(
      /"@vitejs\/plugin-react": ".+?"/,
      `"@vitejs/plugin-react-swc": "^3.0.0"`
    );
  });
  editFile(
    path.resolve(root, `vite.config.${isTs ? "ts" : "js"}`),
    (content) => {
      return content.replace(
        "@vitejs/plugin-react",
        "@vitejs/plugin-react-swc"
      );
    }
  );
}

function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, "utf-8");
  fs.writeFileSync(file, callback(content), "utf-8");
}

init().catch((e) => {
  console.error(e);
});
