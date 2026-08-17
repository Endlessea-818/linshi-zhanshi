# setup.md

项目配置与接入指南。用于记录本地预览、目录结构、素材接入和后续维护规则。

## 项目定位

- 项目名称：人力资源任职资格平台。
- 项目类型：基于 Web 环境的后台管理界面。
- 目标用户：HR、任职资格管理员、业务评审专家、部门负责人。
- 技术栈：Vue 2.7 + Vue CLI 5，与「临床研究智能化管理平台」保持一致。
- 最小响应宽度：`1100px`。

## 本地预览

```bash
npm install
npm run serve
```

构建前可执行：

```bash
npm run verify:env
```

## 主要目录

```text
人力资源任职资格平台项目/
├── package.json
├── babel.config.js
├── vue.config.js
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── styles.css
│   └── assets/
├── scripts/
│   └── verify-environment.js
├── assets/
└── docs/
```

## 资源接入

- `assets/`：保留参照项目的原始素材结构，便于静态引用和设计核对。
- `src/assets/`：供 Vue 模板和 CSS 打包解析。
- `public/assets/`：供运行时浏览器路径访问。
- `assets/manifest.json` 与 `assets/assets.js` 保持可用，后续需要统一读取素材路径时可继续使用。

## 维护规则

- 新增组件或业务页面前，先确认是否可复用现有表格、筛选栏、按钮、标签、分页、空状态等样式。
- 新增颜色或语义变量时，先补充 `docs/tokens.md`，再同步到 `src/styles.css`。
- 新增页面布局、滚动区域、弹框尺寸等规则时，补充 `docs/styles.md`。
- 新增业务交互规则时，补充 `docs/Guidelines.md`。
