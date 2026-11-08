# 一人公司模拟器 · SOLO INC.

本地运行的创业经营游戏：角色选择、客户沟通、项目交付、产品研发、内容营销、日程、财务与五阶段创业成就。客户沟通与内容评估可接入 DeepSeek。

## 运行

需要 Node.js 20 或以上版本，无需安装第三方依赖。

```sh
npm start
```

- 游戏：http://127.0.0.1:4173/
- 模型配置：http://127.0.0.1:4173/admin.html
- 设计学习后台：http://127.0.0.1:4173/learn.html
- 开发历程：http://127.0.0.1:4173/devlog.html

在模型后台填写自己的 DeepSeek API Key。配置仅保存在 `.local/`，不提交到仓库。模型调用按提供商账户计费。

游戏存档位于浏览器本地存储。多角色不是远程账号系统；文件版和 HTTP 服务版存档不自动共享。服务仅监听本机地址。

## 验证与构建

```sh
npm test
node scripts/build-local.mjs
```

构建脚本将单文件游戏输出到项目上一级目录；AI 功能仍需要本地服务。

## 目录

- `dist/`：游戏界面、规则引擎、学习后台及图像素材
- `server.mjs`：本地 HTTP 服务
- `llm.mjs`、`*-llm.mjs`、`choices.mjs`：模型调用与输出校验
- `customer-rules.mjs`：客户关系与成交规则
- `tests/`：回归测试
- `scripts/`：单文件构建、开发历程生成等工具

开发历程生成脚本可能引用原工作区的截图资料；现成的 `dist/devlog.html` 和素材可直接访问。
