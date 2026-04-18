#  LED显示屏报价计算器

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/platform-Web-orange.svg" alt="Platform">
</p>

<p align="center">
  <b>专业的LED显示屏项目报价与配置工具</b><br>
  实时计算尺寸、报价、发货清单与布线排布方案
</p>

***

## 📋 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [在线演示](#-在线演示)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [使用指南](#-使用指南)
- [项目结构](#-项目结构)
- [核心功能](#-核心功能)
- [导出功能](#-导出功能)
- [价格数据库](#-价格数据库)
- [浏览器兼容性](#-浏览器兼容性)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

***

## 🎯 项目简介

** LED显示屏报价计算器** 是一款面向LED显示屏行业的专业报价工具。它不仅仅是一个计算表，更是一套完整的产品配置工作台。

输入项目约束（尺寸、型号、配件等）后，系统能够实时生成：

- 📐 精确的模组排布方案
- 💰 详细的商业报价明细
- 📦 完整的发货备料清单
- 🔌 科学的电源布线拓扑
- 📄 支持中英文的合同文档

***

## ✨ 功能特性

### 🎨 产品品类支持

| 类别         | 型号范围         | 特点            |
| ---------- | ------------ | ------------- |
| **室内常规模组** | P1.25 - P4.0 | 高清显示，适合会议室、展厅 |
| **室内软模组**  | P1.25 - P4.0 | 柔性设计，支持异形拼接   |
| **室内租赁屏**  | P2.6 - P3.91 | 高刷新率，适合舞台演出   |
| **户外常规模组** | P2.5 - P10   | 高亮度，防水防尘      |
| **户外软模组**  | P2.5 - P4.0  | 柔性户外方案        |
| **户外租赁屏**  | P2.6 - P3.91 | 快速拆装，适合活动     |
| **晶膜屏**    | P4 - P20     | 透明贴膜式安装       |
| **全息屏**    | P3.9 - P6.25 | 高透光率，透视效果     |

### 🔧 核心计算功能

- ✅ **智能排布算法**：自动计算最优模组拼接方案
- ✅ **向上取整原则**：确保显示面积覆盖预期
- ✅ **电源配置优化**：根据模组类型自动计算电源数量
- ✅ **接收卡匹配**：智能匹配接收卡型号与数量
- ✅ **视频处理器选型**：根据像素点自动推荐处理器
- ✅ **线缆算量**：精确计算电源线、排线、网线长度与数量

### 📊 导出功能

- 📄 **Word报价单**：标准商业报价文档
- 📊 **Excel报表**：结构化数据表格
- 📝 **销售合同**：基于模板自动生成
- 📦 **发货清单**：理论量/备品量/发货量三列分离
- 🔄 **项目文件**：JSON格式项目备份与分享

### 🛡️ 其他特性

- 🔒 **密码保护**：系统级访问控制
- 💾 **项目管理**：支持保存、导入、导出项目
- 🌐 **多语言支持**：中英文报价与合同
- 📱 **响应式设计**：适配桌面与移动端
- 🎨 **现代化UI**：贝壳卡片式界面设计

***

## 🚀 在线演示

直接打开 `index.html` 即可使用，无需服务器环境。

**默认访问密码**: `filivision2024`

> ⚠️ **提示**：密码可在 `index.html` 中修改 `SYSTEM_PASSWORD` 变量进行自定义。

***

## 🛠️ 技术栈

| 技术                 | 版本     | 用途       |
| ------------------ | ------ | -------- |
| **HTML5**          | -      | 页面结构     |
| **CSS3**           | -      | 样式与布局    |
| **JavaScript**     | ES6+   | 核心逻辑     |
| **Chart.js**       | Latest | 数据可视化    |
| **SheetJS (XLSX)** | 0.18.5 | Excel导出  |
| **docx.js**        | 7.8.2  | Word文档生成 |
| **JSZip**          | 3.10.1 | 文件压缩     |
| **FileSaver.js**   | 2.0.5  | 文件下载     |

***

## ⚡ 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/led-quote-calculator.git
cd led-quote-calculator
```

### 2. 启动使用

由于本项目是纯前端应用，您可以直接：

**方式一：直接打开**
双击 `index.html` 文件在浏览器中打开

**方式二：使用本地服务器（推荐）**

```bash
# 使用 Python 3
python -m http.server 8000

# 或使用 Node.js
npx serve .

# 或使用 VS Code Live Server 插件
```

然后访问 `http://localhost:8000`

### 3. 输入密码

输入默认密码 `filivision2024` 进入系统

***

## 📖 使用指南

### 基础配置流程

1. **填写项目信息**
   - 客户名称
   - 项目名称
   - 项目地点
   - 目标尺寸（宽×高）
2. **选择产品**
   - 产品大类（室内/户外/特种）
   - 具体型号（P1.25 - P10 等）
3. **配置配件**
   - 结构类型（E结构/甄结构/户外钢结构等）
   - 箱体类型（可选）
   - 其他配件（音响、网络设备等）
4. **选择品牌**
   - 接收卡品牌（中航/诺瓦/卡莱特等）
   - 电源品牌（康盛/创联/聚能伟业等）
5. **生成方案**
   - 点击"生成方案与报价"按钮
   - 查看项目总览、算量推演、报价明细
6. **导出文档**
   - 导出Word报价单
   - 导出Excel表格
   - 导出销售合同

***

## 📁 项目结构

```
led-quote-calculator/
├── 📄 index.html                    # 主入口文件
├── 📁 assets/
│   └── 📁 templates/
│       └── 📄 led-sales-contract-template.docx  # 合同模板
├── 📁 scripts/
│   ├── 📁 core/                     # 核心模块
│   │   ├── 📄 project-manager.js    # 项目管理
│   │   ├── 📄 project-state.js      # 状态管理
│   │   ├── 📄 translations.js       # 多语言支持
│   │   ├── 📄 export-translator.js  # 导出翻译
│   │   └── 📄 export-dialog.js      # 导出对话框
│   ├── 📁 data/                     # 数据层
│   │   ├── 📄 catalogs.js           # 价格数据库
│   │   └── 📄 contract-template-base64.js  # 合同模板Base64
│   ├── 📁 features/                 # 功能模块
│   │   ├── 📄 calculator.js         # 核心计算器
│   │   ├── 📄 cable-algorithms.js   # 线缆算法
│   │   ├── 📄 exporters.js          # 导出功能
│   │   └── 📄 contract-exporter.js  # 合同导出
│   └── 📁 ui/                       # UI层
│       ├── 📄 workbench-ui.js       # 工作台UI
│       ├── 📄 shell-card-adapter.js # 卡片适配器
│       └── 📄 status-controller.js  # 状态控制
├── 📁 styles/                       # 样式文件
│   ├── 📄 base.css                  # 基础样式
│   ├── 📄 theme.css                 # 主题样式
│   ├── 📄 layout.css                # 布局样式
│   ├── 📄 responsive.css            # 响应式样式
│   └── 📄 shell-card-ui.css         # 卡片UI样式
└── 📄 README.md                     # 项目说明
```

***

## 🔬 核心功能

### 1. 智能排布算法

系统根据目标尺寸和模组规格，采用\*\*向上取整（CEILING）\*\*原则计算：

```
列数 = CEILING(目标宽度 / 模组宽度)
行数 = CEILING(目标高度 / 模组高度)
总模组数 = 列数 × 行数
```

### 2. 电源配置法则

| 模组类型       | 每电源带载   | 说明        |
| ---------- | ------- | --------- |
| P1.25-P2.5 | 6块      | 小间距模组     |
| P3.0-P10   | 8块      | 常规模组      |
| 户外箱体       | 18块/5电源 | 960×960箱体 |

电源备品率：**5%（向上取整）**

### 3. 接收卡匹配规则

根据模组像素间距智能匹配：

- **P1.25**: 320口专机，1列/卡，最大8行
- **P1.538**: 12口卡，最大12行
- **P1.86-P2.5**: 1列/卡
- **P3-P4**: 3列/卡

### 4. 视频处理器选型

根据总像素点自动推荐：

| 像素点范围 | 推荐型号 | 网口数 |
| ----- | ---- | --- |
| ≤130万 | 双网口  | 2   |
| ≤260万 | 四网口  | 4   |
| ≤390万 | 六网口  | 6   |
| ≤520万 | 八网口  | 8   |
| ≤650万 | 十网口  | 10  |
| >650万 | 多机组合 | 按需  |

***

## 📤 导出功能

### 支持格式

| 功能   | Word | Excel | PDF    |
| ---- | ---- | ----- | ------ |
| 报价单  | ✅    | ✅     | ⏳      |
| 发货清单 | ✅    | ✅     | ⏳      |
| 销售合同 | ✅    | ❌     | ⏳      |
| 项目文件 | ❌    | ❌     | JSON ✅ |

### 合同模板

支持基于Word模板自动生成销售合同：

- 自动填充项目信息
- 自动计算价格与税费
- 支持中英文双语
- 智能匹配付款条款

***

## 💰 价格数据库

价格数据集中管理在 `scripts/data/catalogs.js` 中：

```javascript
const priceDB = {
    modules: { /* 模组价格 */ },
    receivingCards: { /* 接收卡价格 */ },
    processors: { /* 处理器价格 */ },
    power: { /* 电源价格 */ },
    accessories: { /* 配件价格 */ }
};
```

### 价格更新

编辑 `catalogs.js` 文件，修改对应产品的价格数值即可。

***

## 🌐 浏览器兼容性

| 浏览器     | 版本要求 | 支持状态   |
| ------- | ---- | ------ |
| Chrome  | 80+  | ✅ 完全支持 |
| Firefox | 75+  | ✅ 完全支持 |
| Edge    | 80+  | ✅ 完全支持 |
| Safari  | 13+  | ✅ 完全支持 |

> ⚠️ **注意**：IE浏览器不支持

***

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 ES6+ 语法
- 变量命名采用 camelCase
- 函数添加必要注释
- 保持代码简洁清晰

***

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证开源。

```
MIT License

Copyright (c) 2026 阿东

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

***

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📧 邮箱：[2271495904@qq.com](mailto:support@filivision.com)
- 💬 微信：PKA1966

***

