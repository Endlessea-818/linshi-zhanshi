# Figma 素材库

这里存放从 Figma 设计稿导出的本地素材，后续页面开发优先引用这里的稳定路径，不再直接引用 Figma 临时链接。

## 目录说明

- `logo/`：平台标识素材；当前新项目顶部使用 `logo-mark.svg` 与项目文字组合展示
- `topbar/`：顶部栏图标、待办状态入口、消息入口与头像背景
- `common/`：通用箭头等公共图标，其中 `common/arrows/` 存放左侧导航展开/收起方向箭头
- `table-checkboxes/`：表格复选框的未选、悬停、选中、半选、禁用等状态图标
- `radio-buttons/`：单选框的选中、未选、禁用状态图标
- `switches/`：开关的开启、关闭、禁用状态图标
- `input-number/`：数字输入框早期状态整图，仅作为历史设计对照；正式实现统一使用结构化按钮与 `common/arrows/up.svg`、`common/arrows/down.svg`
- `pagination/`：分页组件的上一页、页码、下一页在默认、选中、禁用状态下的图标
- `time-picker/`：下拉时间选择器头部年月切换按钮的默认态与悬停态图标
- `month-report/`：月度报告月份选择器使用的“完成 / 缺少”状态图标
- `action-icons/`：搜索、关闭、导入、导出、刷新、删除等通用操作图标
- `other-icons/`：提示、删除、标签悬停删除等业务辅助图标；部分素材名称沿用参照项目命名
- `scoring-icons/`：评分、类别、维度、星级等图标；后续可复用于任职资格评审场景
- `tooltips/`：提示气泡尖角等提示层素材
- `nav-icons/`：左侧导航图标的默认态与选中态完整 SVG 素材
- `illustrations/`：页面插图、装饰图和弹框头图
- `manifest.json`：素材索引，方便后续按用途查找
- `assets.js`：浏览器脚本可直接使用的素材路径对象

## 调用示例

```html
<img src="./assets/logo/logo-mark.svg" alt="人力资源任职资格平台" />
<img src="./assets/illustrations/sidebar-object.png" alt="" />
```

```js
const logo = window.PlatformFigmaAssets.logo.header;
const homeDefaultIconSrc = window.PlatformFigmaAssets.navIcons.home.default;
const homeActiveIconSrc = window.PlatformFigmaAssets.navIcons.home.active;
const inactiveArrowSrc = window.PlatformFigmaAssets.common.arrows.down;
const activeArrowSrc = window.PlatformFigmaAssets.common.arrows.up;
const tableCheckedIconSrc = window.PlatformFigmaAssets.tableCheckboxes.checked;
const radioCheckedIconSrc = window.PlatformFigmaAssets.radioButtons.checked;
const switchOnIconSrc = window.PlatformFigmaAssets.switches.on;
const inputNumberIncreaseIconSrc = window.PlatformFigmaAssets.common.arrows.up;
const inputNumberDecreaseIconSrc = window.PlatformFigmaAssets.common.arrows.down;
const paginationPageSelectedIconSrc = window.PlatformFigmaAssets.pagination.page.selected;
const timePickerYearPreviousIconSrc = window.PlatformFigmaAssets.timePicker.yearPrevious.default;
const searchIconSrc = window.PlatformFigmaAssets.actionIcons.search;
const addIconSrc = window.PlatformFigmaAssets.actionIcons.add;
const coResearcherIconSrc = window.PlatformFigmaAssets.otherIcons.coResearcher;
const researchCenterIconSrc = window.PlatformFigmaAssets.otherIcons.researchCenter;
const amountIconSrc = window.PlatformFigmaAssets.otherIcons.amount;
const tagHoverDeleteIconSrc = window.PlatformFigmaAssets.otherIcons.tagHoverDelete;
const emptyAddIllustrationSrc = window.PlatformFigmaAssets.illustrations.emptyAdd;
const noDataIllustrationSrc = window.PlatformFigmaAssets.illustrations.noData;
const noSearchDataIllustrationSrc = window.PlatformFigmaAssets.illustrations.noSearchData;
const pendingEvaluationHeaderSrc = window.PlatformFigmaAssets.illustrations.pendingEvaluationHeader;
const tooltipTipSrc = window.PlatformFigmaAssets.tooltips.tipBottom;
const scoreQuestionnaireIconSrc = window.PlatformFigmaAssets.topbar.statusQuestionnaire;
const scoreDimensionQualityIconSrc = window.PlatformFigmaAssets.scoringIcons.dimensionQuality;
```
