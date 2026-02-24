# 🎵 网易云音乐 Web 播放器 (NeteaseCloud Music WebApp)

<p align="center">
  <img src="./demoimg/demo1.png" alt="首页预览" width="600">
  <br>
  <em>首页预览</em>
</p>
<br>
<p align="center">
  <img src="./demoimg/demo2.png" alt="播放界面预览" width="600">
  <br>
  <em>播放界面预览</em>
</p>
<br>
<p align="center">
  <img src="./demoimg/demo3.png" alt="歌单详情预览" width="600">
  <br>
  <em>歌单详情预览</em>
</p>

> 一个基于 Vue 3 全家桶开发的网易云音乐网页版播放器。界面风格致敬经典，提供了基础的歌单浏览、音乐播放、搜索等功能。本项目仅用于学习和交流前端技术。

## 🛠️ 技术栈 (Tech Stack)

- **前端框架:** Vue 3 (Composition API, `<script setup>`)
- **状态管理:** Pinia
- **路由管理:** Vue Router 4
- **HTTP 请求:** Axios
- **构建工具:** Vite

## 🎵 功能特性 (Features)

- **推荐页:** 查看热门推荐歌单,推荐音乐,热门100名歌手。
- **登录:** 支持网易云音乐app扫码登录,可退出登录。
- **音乐播放:** 支持播放、暂停。
- **搜索功能:** 支持搜索歌曲。
- **歌单详情:** 查看歌单内的所有歌曲并点击播放。
- **歌手详情:** 查看歌手前200首歌曲并点击播放。
- **播放进度:** 显示当前播放时间、总时长，支持点击跳转进度条(目前不支持拖拽)。
- **歌词显示:** 播放时同步滚动显示歌词。

## 🙏 后端说明 (Backend Acknowledgement)

**本项目本身不包含任何后端代码。**

所有音乐数据接口均来源于开源的 **[NeteaseCloudMusicApiEnhanced/api-enhanced](https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced)**。

这是一个基于 Node.js 的网易云音乐 API 接口服务。在此向该项目的作者表示衷心的感谢！


## 🚀 快速开始 (Getting Started)
运行本项目前,请先下载 **[node.js](https://nodejs.cn/download/)**

1.  进入项目根目录终端安装所有依赖:
    ```bash
    npm run install:all
    ```
2.  运行:
    ```bash
    npm run dev
    ```

## 📁 项目结构 (Project Structure)

```text
frontpage/src/
├── api/          # API 请求接口 (Axios 封装)
├── assets/       # 静态资源 (图片、样式等)
├── router/       # Vue Router 路由配置
├── stores/       # Pinia 状态管理
├── views/        # 页面视图组件
└── App.vue       # 根组件
```

## 📄 开源协议 (License)

[MIT](LICENSE)

## 📧 联系我 (Contact)

- 作者：Danica66
- 邮箱：danica6@qq.com
- GitHub：[Danica66](https://github.com/Danica66)

如果这个项目对你有帮助，欢迎给个 ⭐️！