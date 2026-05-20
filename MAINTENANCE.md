# Zuo Group website 维护说明

线上网站：

https://greengyc.github.io/zuo-group/

本地文件夹：

E:\左师兄主页

## 1. 修改新闻

打开 `news.html`，找到这一段：

```html
<div class="timeline">
  ...
</div>
```

复制一个 `<article>...</article>`，改里面的日期、标题和正文即可。

推荐格式：

```html
<article>
  <time>2026</time>
  <h2>News title</h2>
  <p>One or two sentences describing the update.</p>
</article>
```

## 2. 修改论文

打开 `publications.html`。

每篇论文在一个 `<article class="publication-item">...</article>` 里。

如果要新增论文，复制一整段论文卡片，然后修改：

- 年份
- 题目
- 作者
- 期刊、年份、卷号、页码
- DOI 链接
- Journal 链接

当前格式要求：

```html
<p class="citation"><em>Journal Abbrev.</em> <strong>2026</strong>, volume, page.</p>
```

注意：期刊名只斜体，只有年份加粗。

## 3. 修改人员名单

打开 `people.html`。

目前学生名单位置使用 `To be updated` 占位。拿到正式英文名单后，替换为：

```html
<div class="person-placeholder">
  <strong>Student Name</strong>
  <span>PhD Student</span>
</div>
```

可用身份写法：

- Postdoctoral Fellow
- PhD Student
- Master Student
- Undergraduate Researcher
- Alumni

Alumni 建议格式：

```text
Name + Degree + Graduation Year + Current Position
```

## 4. 添加照片

把真实照片放到：

```text
assets/photos/
```

建议文件名使用英文和短横线，例如：

```text
group-photo-2026.jpg
conference-2026.jpg
graduation-2026.jpg
```

然后打开 `photos.html`，把占位卡片替换为：

```html
<figure class="photo-real">
  <img src="assets/photos/group-photo-2026.jpg" alt="Zuo Group photo, 2026" />
  <figcaption>Group photo, 2026</figcaption>
</figure>
```

## 5. 上传更新到 GitHub

每次本地修改完成后，在这个文件夹里运行：

```powershell
git add .
git commit -m "Update website content"
git push
```

一般 1-3 分钟后，线上网站会自动更新。

## 6. 目前仍需人工确认的信息

- 真实学生英文姓名和身份
- Alumni 的毕业年份、学位和去向
- 真实组会、合照、会议照片
- 第一篇 2026 Angew 论文的 DOI
- ResearchGate 主页链接
