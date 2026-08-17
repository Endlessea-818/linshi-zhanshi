const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const requiredFiles = [
  "package.json",
  "babel.config.js",
  "vue.config.js",
  "public/index.html",
  "src/main.js",
  "src/App.vue",
  "src/styles.css",
  "docs/setup.md",
  "docs/tokens.md",
  "docs/components.md",
  "docs/styles.md",
  "docs/Guidelines.md",
  "assets/manifest.json",
  "src/assets/logo/logo-mark.svg",
  "src/assets/fonts/Rubik-Medium.ttf",
  "src/assets/action-icons/search.svg",
  "src/assets/table-checkboxes/checked.svg"
];

const requiredText = [
  {
    file: "package.json",
    values: ["\"vue\": \"^2.7.16\"", "\"@vue/cli-service\": \"~5.0.8\""]
  },
  {
    file: "src/styles.css",
    values: [
      "--color-brand-5: #027aff",
      "--form-control-height: 36px",
      "--dropdown-shadow",
      "--font-number"
    ]
  },
  {
    file: "src/App.vue",
    values: ["name: \"App\"", "id=\"app-root\""]
  }
];

const missing = [];

function resolveProjectPath(relativePath) {
  return path.join(rootDir, relativePath);
}

requiredFiles.forEach((file) => {
  if (!fs.existsSync(resolveProjectPath(file))) {
    missing.push(`${file}: 文件不存在`);
  }
});

requiredText.forEach(({ file, values }) => {
  const fullPath = resolveProjectPath(file);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");

  values.forEach((value) => {
    if (!content.includes(value)) {
      missing.push(`${file}: 缺少 ${value}`);
    }
  });
});

if (missing.length > 0) {
  console.error("环境校验失败：");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log("环境校验通过：Vue 2 构建配置、设计变量和基础素材已就绪。");
