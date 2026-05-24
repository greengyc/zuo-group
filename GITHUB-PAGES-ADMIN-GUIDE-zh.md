# GitHub Pages 后台维护说明

这份说明用于新的 GitHub Pages 后台。Netlify 后台已经保留在 `admin-netlify/`，但日常维护建议使用 GitHub Pages 后台。

## 维护入口

公开网站：

```text
https://zuozhijun1502.github.io/zuo-group/
```

GitHub Pages 后台：

```text
https://zuozhijun1502.github.io/zuo-group/admin/
```

Netlify 旧后台备份文件：

```text
admin-netlify/
```

这个文件夹只是保留旧 Netlify 模式。如果以后重新启用 Netlify，可以把这套后台随网站一起部署到 Netlify 后继续使用。日常维护不要打开它。

## 第一次登录

维护者需要有 GitHub 账号，并且已经被加入 `zuozhijun1502/zuo-group` 仓库的协作者。

这个后台使用 GitHub access token 登录。进入 `/admin/` 后请选择：

```text
Sign In Using Access Token
```

不要使用 GitHub OAuth 登录按钮。OAuth 登录需要额外的授权服务；本站为了避免继续依赖 Netlify，日常维护统一使用 access token。

请在 GitHub 里创建一个只用于本网站维护的 token。权限建议只给这个仓库，并开启内容读写权限。保存 token 后，进入 `/admin/` 登录。

## 日常修改流程

```text
打开 /admin/
选择 Website Content
选择要修改的页面
修改文字、图片或选项
Publish
Publish now
等待 GitHub Pages 自动更新
```

通常等待 1-3 分钟后刷新公开网站即可看到变化。

## 图片大小在哪里调

不要在 Images 图片库弹窗里调大小。图片库只负责上传和选择图片。

真正的图片显示效果在对应内容条目里调整。例如：

```text
Publications -> 某篇论文 -> TOC image 下方
```

或者：

```text
News -> 某条新闻 -> Image 下方
Photos -> 某张照片 -> Image 下方
Facilities -> 某个仪器 -> Image 下方
```

常见选项含义：

```text
Image display mode
Fill area, crop edges if needed = 填满区域，可能裁切边缘
Show full image, no cropping = 完整显示，不裁切

Image position
Center / Top / Bottom / Left / Right = 控制图片对齐位置

Image size / height
Short / Standard / Tall = 控制图片显示高度
```

论文 TOC 图通常建议：

```text
TOC image width in publication row: Wide 或 Standard
TOC image height: Standard 或 Tall
TOC image display mode: Show full image, no cropping
TOC image position: Center
TOC image background: White
```

## 注意事项

不要直接删除 GitHub 仓库文件。  
不要在 GitHub 里随意改代码文件。  
不要把 GitHub token 发给别人。  
修改前如果不确定，可以先只改一条 News 测试。
