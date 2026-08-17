# components.md

组件清单与使用说明。当前项目优先复用「临床研究智能化管理平台」沉淀的后台组件结构和素材。

## 基础组件

- Button 按钮：主按钮使用品牌色背景；次按钮使用白底边框；危险操作使用警示色。
- Input 输入框：默认高度 `36px`，边框 `#D8DCE5`，聚焦和悬停边框为品牌色。
- Select 选择器：默认高度 `32px` 或 `36px`，右侧箭头使用本地 SVG，展开态保持品牌蓝边框。
- Checkbox 复选框：状态图标统一使用 `assets/table-checkboxes/`。
- Tag 标签：用于状态、等级、角色、流程节点和表格中的短文本标识。
- Table 表格：表头高度 `46px`，常规文本 `13px / 22px`，单元格左右内边距 `12px`。
- Pagination 分页：沿用参照项目的分页尺寸、页码按钮、上一页和下一页图标规范。
- Empty 空状态：使用 `assets/illustrations/no-data.svg` 或 `assets/illustrations/no-search-data.svg`。

## HR 任职资格业务组件方向

- 任职等级标签：用于 P3、P4、P5 等等级展示。
- 认证状态标签：用于未开始、进行中、待评审、已通过、未通过。
- 能力维度条：用于展示专业能力、项目经验、协同能力、管理能力等得分。
- 评审任务表格：用于承载候选人、申报等级、当前环节、评审人、截止日期、状态。
- 标准库卡片：用于承载职类、职级、能力项和评审规则入口。

## 图标素材

- 操作图标目录：`assets/action-icons/`。
- 左侧导航图标目录：`assets/nav-icons/`。
- 顶部状态栏图标目录：`assets/topbar/`。
- 表格复选框目录：`assets/table-checkboxes/`。
- 空状态插图目录：`assets/illustrations/`。

## 调用原则

- 表达明确命令时优先使用本地图标素材。
- 不直接引用下载目录或 Figma 临时链接。
- 新增组件状态时，同时补充本文件和 `src/styles.css`。
