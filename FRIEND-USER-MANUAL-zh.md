# Zuo Group 网站后台维护使用手册

这份手册写给没有编程基础、不了解 GitHub 的维护者。日常维护时，你只需要打开网站后台，像填写表格一样修改内容，然后点击发布。

## 一句话原则

你不需要打开 GitHub，不需要写代码，不需要安装软件。

日常只做三件事：

```text
打开后台 -> 修改表单 -> Publish now
```

## 你需要保存的两个地址

公开网站地址：

```text
https://greengyc.github.io/zuo-group/
```

后台管理地址：

```text
https://你的-Netlify-网站地址/admin/
```

如果目前 Netlify 地址还没有改名，可能类似：

```text
https://monumental-sable-696eed.netlify.app/admin/
```

以后如果绑定了正式域名，后台地址通常会变成：

```text
https://正式域名/admin/
```

实际使用时，以你收到的后台链接为准。

## 第一次登录后台

你会收到一封 Netlify 或网站后台发来的邀请邮件。

操作步骤：

```text
打开邀请邮件
点击 Accept invite / 接受邀请
设置密码
进入后台
```

以后登录时直接打开：

```text
https://你的-Netlify-网站地址/admin/
```

如果看到登录页面，输入邮箱和密码即可。

## 后台页面长什么样

进入后台后，左侧会看到一个栏目：

```text
Website Content
```

点进去后，会看到这些内容区：

```text
Site Settings
Home
Research
Publications
People
News
Photos
Resources
Facilities
Join Us
Contact
```

每个内容区都对应网站上的一个页面或全站设置。

## 修改后如何发布

任何地方修改完成后，都要发布才会出现在公开网站。

标准流程：

```text
修改内容
点击 Publish
点击 Publish now
等待 1-3 分钟
打开公开网站刷新查看
```

如果公开网站没有马上变化，先等 1-3 分钟，再按：

```text
Ctrl + F5
```

这是强制刷新浏览器缓存。

## 最重要的安全规则

后台里如果看到这些按钮，不要点：

```text
Disable Git Gateway
Delete Identity instance
Danger zone
Unpublish site
Delete site
```

这些按钮属于网站系统设置，可能会导致后台或网站不能用。

你日常只需要在 `/admin/` 后台里面改内容，不需要进 GitHub 或 Netlify 设置页面。

## Site Settings：全站设置

这个栏目控制整个网站都会出现的东西。

可以修改：

```text
顶部左上角 Zuo Group
顶部小字 Northwest University, China
导航菜单 Home / Research / Publications 等
页脚 Zuo Group 和学院信息
网站主红色
```

建议：

```text
不要随便改 Page key
不要随便删除导航菜单
如果只是暂时不显示某个菜单，把 Show this menu item 关掉即可
```

常见用途：

```text
想把 Join Us 改成 Open Positions
想隐藏 Resources 页面入口
想修改页脚学院英文名称
想调整网站主色
```

## Home：首页

这个栏目控制网站首页。

可以修改：

```text
首页大图
首页大标题
首页副标题
首页按钮
Research Focus 区域
Start here 卡片
Recruiting 招聘横幅
Google 搜索用的标题和简介
```

常见修改：

```text
换首页背景图
改首页标语
修改 Research / Join Us 按钮文字
修改 Research Focus 说明文字
隐藏 Recruiting 横幅
```

注意：

```text
如果只是暂时不用某一块，关闭 Show this section
不要把所有首页按钮都删掉，至少保留一个常用入口比较好
```

## Research：研究方向

这个栏目控制 Research 页面。

可以修改：

```text
页面顶部大标题
页面顶部背景图
页面顶部按钮
研究方向卡片
卡片编号 01 / 02 / 03
卡片标题
卡片说明文字
```

如果要增加一个研究方向：

```text
进入 Research
找到 Research direction cards
点击 Add
填写 Number / Title line 1 / Title line 2 / Description
Publish now
```

如果要删除某个方向：

```text
建议先关闭 Show this card
确认不需要后再删除
```

## Publications：论文列表

这个栏目控制 Publications 页面。

可以修改：

```text
页面顶部标题
Independent Work at NWU 分区标题
Prior to NWU 分区标题
论文题目
作者
期刊缩写
年份
卷号页码
DOI 链接
期刊链接
TOC 图片
TOC pending 文字
DOI / Journal 按钮文字
```

新增一篇论文时，建议准备这些信息：

```text
Year
Title
Authors
Journal abbreviation
Volume / page / DOI details
DOI URL
Journal URL
TOC image
```

如果 DOI 还没有：

```text
DOI URL 留空
DOI label if no DOI URL 填 DOI to be added
```

如果没有 TOC 图片：

```text
TOC image 留空
TOC placeholder text 填 TOC pending
TOC placeholder color 选择 blue / teal / red / gold
```

期刊格式说明：

```text
Journal abbreviation 里只填标准缩写
网页会自动把期刊名变成斜体
网页会自动把年份加粗
```

示例：

```text
Journal abbreviation: Angew. Chem., Int. Ed.
Year: 2026
Volume / page / DOI details: 65, e7485683.
```

## People：成员页面

这个栏目控制 People 页面。

可以修改：

```text
页面顶部标题
成员分组
PI
Postdocs
Graduate Students
Undergraduate Students
Alumni
每个人的姓名
身份
照片
标签
校友学位、毕业年份、去向
```

新增学生：

```text
进入 People
找到对应分组，例如 Graduate Students
点击 Members 里的 Add
填写 Name
填写 Role
Publish now
```

如果暂时没有照片：

```text
Photo 留空
```

如果要让某个人显示成 PI 大卡片：

```text
打开 Featured PI card
```

通常只有 PI 需要打开这个选项。

校友建议填写：

```text
Name
Degree
Graduation year
Destination
```

## News：新闻页面

这个栏目控制 News 页面。

可以修改：

```text
页面顶部标题
顶部背景图
顶部按钮
额外文字块
额外图片块
额外按钮块
新闻条目
新闻图片
新闻按钮
```

新增新闻：

```text
进入 News
找到 News items
点击 Add news items
填写 Date
填写 Title
填写 Text
Publish now
```

新闻日期可以写：

```text
2026
May 2026
Ongoing
```

如果新闻不想显示但以后可能还用：

```text
关闭 Show this item
```

## Photos：照片页面

这个栏目控制 Photos 页面。

可以修改：

```text
页面顶部标题
照片卡片标题
照片说明
照片图片
是否大图
```

上传照片：

```text
进入 Photos
找到 Photo tiles
选择某个照片卡片
点击 Image
上传图片
Publish now
```

建议图片命名：

```text
group-photo-2026.jpg
conference-2026.jpg
graduation-2026.jpg
```

不要使用中文文件名，避免浏览器或服务器识别问题。

## Resources：资源页面

这个栏目控制 Resources 页面。

可以修改：

```text
页面顶部标题
资源卡片
卡片图标
卡片标题
卡片说明
按钮文字
按钮链接
```

可以放：

```text
安全文件
组会模板
论文模板
常用数据库
常用软件
内部说明
```

如果某个资源还没准备好：

```text
关闭 Show this card
```

## Facilities：仪器设备页面

这个栏目控制 Facilities 页面。

可以修改：

```text
页面顶部标题
仪器卡片
仪器名称
仪器说明
仪器图片
按钮链接
```

新增仪器：

```text
进入 Facilities
找到 Facility items
点击 Add
填写 Name
填写 Description
需要的话上传 Image
Publish now
```

如果不想公开某台仪器：

```text
关闭 Show this card
```

## Join Us：招生招聘页面

这个栏目控制 Join Us 页面。

可以修改：

```text
页面顶部标题
招聘说明
联系按钮
额外文字块
额外图片块
额外按钮块
```

如果要改联系邮箱：

```text
进入 Join Us
找到 Main recruiting text section
修改 Button link
```

邮箱链接格式：

```text
mailto:zuozj@nwu.edu.cn
```

## Contact：联系页面

这个栏目控制 Contact 页面。

可以修改：

```text
页面顶部标题
Contact Information 标题
邮箱
办公室
实验室地址
学校主页链接
X-MOL 链接
Google Scholar
ORCID
ResearchGate
```

新增一个链接：

```text
进入 Contact
找到 Academic profiles
点击 Add
填写 Label
填写 Detail
填写 URL
填写 Icon name
Publish now
```

如果暂时没有链接：

```text
URL 留空
```

网页会显示成不可点击的信息卡片。

## 图片上传注意事项

建议图片格式：

```text
jpg
png
webp
```

建议图片大小：

```text
单张最好小于 2 MB
```

建议文件名：

```text
group-photo-2026.jpg
lab-meeting-2026.jpg
toc-paper-2026-01.png
```

不建议：

```text
中文文件名
空格很多的文件名
特别大的原图
```

## 链接填写规则

网站内部链接写文件名：

```text
research.html
publications.html
people.html
contact.html
```

外部链接写完整网址：

```text
https://www.x-mol.com/groups/zuozj
```

邮箱链接写：

```text
mailto:zuozj@nwu.edu.cn
```

## 图标怎么填

后台有些地方会看到：

```text
Icon name
```

这是网页图标的名字。常用的可以填：

```text
mail
user-plus
arrow-right
flask-conical
building-2
external-link
graduation-cap
fingerprint
id-card
shield-check
clipboard-list
database
activity
chart-no-axes-combined
book-open
```

如果不确定，就留空或沿用原来的。

## Show this... 开关怎么用

后台很多地方有：

```text
Show this section
Show this card
Show this item
Show this person
Show this button
```

打开：

```text
网站显示
```

关闭：

```text
网站隐藏，但内容还保留在后台
```

建议优先使用关闭，而不是删除。

## 删除内容前的建议

如果只是暂时不用：

```text
关闭 Show this...
```

如果确认以后完全不用：

```text
再点击删除
```

这样更安全。

## 修改出错怎么办

如果页面显示不对，先不要慌。

按这个顺序处理：

```text
回到后台
找到刚才修改的栏目
把刚才改过的内容改回去
Publish now
等待 1-3 分钟
刷新公开网站
```

如果不知道哪里改错了：

```text
截图发给网站搭建者
说明你刚才改了哪个栏目
```

## 发布后网站没变化怎么办

先检查：

```text
是否点了 Publish now
是否等待了 1-3 分钟
是否按了 Ctrl + F5 强制刷新
```

如果还是没变化：

```text
等 5 分钟
再刷新
```

如果仍然没有变化，截图后台页面和公开网页。

## 后台打不开怎么办

常见原因：

```text
网址输错
没有使用 /admin/
登录邮箱不对
邀请链接过期
浏览器缓存问题
```

可以尝试：

```text
重新打开后台地址
按 Ctrl + F5
换 Chrome 浏览器
确认邮箱是否已经被邀请
```

## 不要做的事情

不要进入 GitHub 修改代码。

不要进入 Netlify 的危险设置。

不要点击：

```text
Delete
Disable Git Gateway
Delete Identity instance
Unpublish site
Delete site
Danger zone
```

不要随便修改：

```text
Page key
admin/config.yml
content/*.json
js/*.js
css/*.css
```

这些由网站维护人员处理。

## 推荐的日常维护流程

每次只改一个小地方。

例如：

```text
今天只加一条 News
发布
检查公开网站
确认没问题
再改下一处
```

不要一次性大改很多栏目。这样如果出问题，很容易知道是哪一步导致的。

## 最常用的三个操作

加新闻：

```text
News -> News items -> Add -> 填写 Date / Title / Text -> Publish now
```

加学生：

```text
People -> 找到对应分组 -> Members -> Add -> 填写 Name / Role -> Publish now
```

加论文：

```text
Publications -> Independent work at NWU -> Add -> 填写论文信息 -> Publish now
```

## 最后提醒

你维护的是正式英文课题组网站。修改前先确认英文拼写，尤其是：

```text
人名
论文题目
期刊缩写
DOI
邮箱
链接
```

不确定时，先保存草稿或截图确认，不要急着发布。
