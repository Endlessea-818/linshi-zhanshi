# tokens.md

设计变量。当前项目沿用「临床研究智能化管理平台」的颜色、字体和控件变量。

## 品牌色

| 名称 | 色值 |
| --- | --- |
| `品牌色/5品牌色` | `#027AFF` |
| `品牌色/9` | `#001833` |
| `品牌色/8.5` | `#01254D` |
| `品牌色/8` | `#013166` |
| `品牌色/7` | `#014999` |
| `品牌色/6` | `#0262CC` |
| `品牌色/4` | `#3595FF` |
| `品牌色/3` | `#67AFFF` |
| `品牌色/2` | `#9ACAFF` |
| `品牌色/1.5` | `#B3D7FF` |
| `品牌色/1` | `#CCE4FF` |

## 字体色

| 名称 | 色值 |
| --- | --- |
| `字体/T1` | `#111647` |
| `字体/T2` | `#242F57` |
| `字体/T3` | `#424D71` |
| `字体/T4` | `#666F8E` |
| `字体/T5` | `#878EB3` |
| `字体/T6` | `#9CA2BF` |
| `字体/禁选` | `#C9CDD4` |

## 辅助色

| 名称 | 色值 |
| --- | --- |
| `辅助色/金额` | `#FF8711` |
| `辅助色/警示` | `#F44545` |
| `辅助色/成功` | `#15C369` |
| `辅助色/提醒` | `#FFBD21` |
| `辅助色/边框` | `#E8EAF2` |
| `辅助色/标题背景` | `#F7F8FA` |
| `辅助色/信息背景` | `#F4F7FC` |
| `辅助色/底色禁用` | `#F0F2F5` |

## CSS 变量

- `--color-brand-5`：品牌主色。
- `--color-text-t1`：一级文字。
- `--color-text-t2`：正文文字。
- `--color-text-t4`：次要文字。
- `--color-amount`：金额或重点数值。
- `--color-warning`：警示。
- `--color-success`：成功。
- `--color-reminder`：提醒。
- `--color-border`：边框。
- `--color-title-bg`：标题背景。
- `--color-info-bg`：页面信息背景。
- `--color-disabled-bg`：禁用底色。
- `--form-control-height`：表单控件默认高度。
- `--form-control-radius`：表单控件默认圆角。
- `--dropdown-shadow`：通用下拉和浮层阴影。
- `--font-number`：数字专用字体，默认使用 `Rubik`。

## 字体

Rubik 用于数字强调场景，例如任职等级、评审人数、完成率、周期天数、关键指标等。

Alibaba PuHuiTi Bold 用于平台名称、职群名称、页面标题和能力标题等主要中文标题。

Alimama ShuHeiTi Bold 用于职级卡片等展示性中文标题。网页优先加载项目内的 Web 子集文件，原始字体文件保留在 `src/assets/fonts/`。

| 字体文件 | 字重 | 字体样式 |
| --- | --- | --- |
| `assets/fonts/Rubik-Medium.ttf` | `500` | normal |
| `assets/fonts/Rubik-MediumItalic.ttf` | `500` | italic |
| `assets/fonts/Rubik-Bold.ttf` | `700` | normal |
| `assets/fonts/Rubik-BoldItalic.ttf` | `700` | italic |
