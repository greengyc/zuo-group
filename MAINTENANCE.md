# Zuo Group website maintenance guide

Online website:

https://greengyc.github.io/zuo-group/

GitHub repository:

https://github.com/greengyc/zuo-group

## The simple rule

For routine updates, edit only these files:

- `data/publications.js`
- `data/people.js`
- `data/news.js`

Do not edit `publications.html`, `people.html`, or `news.html` unless changing the page design.

## Update publications

Open:

`data/publications.js`

Each publication looks like this:

```js
{
  year: "2026",
  title: "Paper title",
  authors: "Author A, Author B, Zhijun Zuo*",
  journal: "Angew. Chem., Int. Ed.",
  details: "65, e7485683.",
  tocColor: "blue",
  doiUrl: "https://doi.org/...",
  journalUrl: "https://journal-page-url"
}
```

To add a new publication, copy one complete block, paste it in the correct year position, and edit the text.

Formatting rules:

- Journal names are automatically italic.
- Only the year is automatically bold.
- Keep the comma after the year in the rendered citation.
- If DOI is not ready, use:

```js
doiLabel: "DOI to be added",
```

instead of `doiUrl`.

## Update people

Open:

`data/people.js`

A simple member entry looks like this:

```js
{ name: "Student Name", role: "Graduate Student" }
```

For alumni, use:

```js
{
  name: "Alumni Name",
  degree: "PhD",
  year: "2026",
  destination: "Current position"
}
```

Keep quotation marks and commas.

## Update news

Open:

`data/news.js`

A news item looks like this:

```js
{
  date: "2026",
  title: "News title",
  text: "One or two sentences describing the update."
}
```

Newest items should be placed first.

## Upload updates to GitHub

If editing locally, run:

```powershell
git add .
git commit -m "Update website content"
git push
```

If editing directly on GitHub, click `Commit changes`.

The live website usually updates in 1-3 minutes.

## Still useful to confirm later

- Real English names and roles for all group members
- Alumni graduation years and destinations
- Real TOC images for publications
- Group photos
- ResearchGate profile URL
