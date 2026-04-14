# AIDC Collector — 桌面端管理后台

> admin 管理界面，深色风格，功能完整的 IDC 机房数据管理系统。

## 技术栈
- 纯原生 HTML + CSS + JavaScript
- localStorage 数据持久化
- 共享数据层：`admin/lib/`（来源：aidc-collector-shared）

## 目录结构
```
aidc-collector-admin/
├── index.html              # 桌面端入口
├── api.js                  # 根级 API（旧版，兼容）
├── shared.css              # 全局样式（深色）
├── admin/
│   ├── lib/               # ⬅️ 共享数据层（来自 aidc-collector-shared）
│   │   ├── constants.js
│   │   ├── seed.js
│   │   └── api.js
│   └── pages/
│       ├── index.html          # 首页
│       ├── dashboard-v2.html   # 仪表盘 v2
│       ├── datacenter-list.html # 机房列表
│       ├── datacenter-form.html # 添加/编辑
│       ├── datacenter-detail-v2.html # 详情
│       ├── datacenter-view.html  # 查看
│       ├── datacenter-import.html # Excel 导入
│       ├── customers.html       # 客户管理
│       ├── users.html          # 用户管理
│       ├── visits.html         # 考察记录
│       ├── statistics.html      # 统计分析
│       ├── gantt.html           # 甘特图
│       ├── login.html           # 登录
│       └── settings.html        # 设置
```

## 数据同步说明
与手机端共用 **同一套 localStorage 键名**：
- `aidc_user` / `aidc_datacenters` / `aidc_changelogs`
同一浏览器下两端的修改会相互可见。

## 更新共享数据层
```bash
git subtree pull --prefix=admin/lib \
  https://github.com/weiweiinmn/aidc-collector-shared.git main --squash
```

## 测试账号
| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | Admin@2026 | admin |
| zhangsan | Abc@12345 | collector |
