# 三角洲行动黑榜名单

这是一个纯前端网站，用于展示三角洲行动游戏的黑榜名单。数据来源于 [GitHub仓库](https://github.com/whx61/dfbad) 中的 XML 文件。

## 功能特点

- 纯前端实现，无需后端服务器
- 从 GitHub 仓库直接读取 XML 数据
- 响应式设计，适配不同设备屏幕
- 通过 GitHub Actions 自动部署到 GitHub Pages

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub Actions (CI/CD)

## 部署方式

1. 将本仓库 Fork 到你的 GitHub 账户下
2. 在你的仓库中，进入 Settings > Pages
3. 在 "Build and deployment" 部分，选择 "GitHub Actions" 作为部署源
4. 推送代码到 main 分支，GitHub Actions 会自动部署网站

## 本地运行

直接在浏览器中打开 `index.html` 文件即可查看网站。

## 数据来源

数据来自：https://raw.githubusercontent.com/whx61/dfbad/main/三角洲行动黑榜名单.xml

## 许可证

MIT License