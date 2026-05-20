# Zuo Group website

This is the first formal English website framework for the Zuo Group / Zhijun Zuo Research Group at Northwest University.

## Open locally

Double-click `index.html` to open the website in a browser.

## Current structure

- `index.html` - Home
- `research.html` - Research directions
- `publications.html` - Publication page layout
- `people.html` - People page layout
- `news.html` - News page layout
- `photos.html` - Photo archive structure for future group images
- `resources.html` - Group resources
- `facilities.html` - HPLC and GC-MS facilities
- `join.html` - International recruiting page
- `contact.html` - Contact and academic profile links
- `data/publications.js` - Routine publication updates
- `data/people.js` - Routine people updates
- `data/news.js` - Routine news updates
- `js/content-renderer.js` - Turns data files into page content

## Routine editing

For routine updates, edit the files in `data/` instead of editing the HTML pages directly:

- Add or edit publications in `data/publications.js`
- Add or edit group members in `data/people.js`
- Add or edit announcements in `data/news.js`

The pages will automatically render the edited data in the existing design.

## Editing the top hero text

The home page uses its own large hero layout. For all other pages, the top hero area is locked to a fixed visual grid:

- first line: red page label inside `<p class="eyebrow">...</p>`
- second line: white title inside `<h1>...</h1>`
- third line: white subtitle inside the following `<p>...</p>`

When updating a page later, edit only the text inside those three tags. Keep the tag order unchanged so the top area stays visually aligned across pages.

## Content sources used

The X-MOL group page and the Northwest University faculty page were used as data sources for public facts. The website itself is not a direct translation of X-MOL; it is written as a new international English research-group website.

## Next materials to add

- Confirmed English spellings for all group members
- Member roles and alumni destinations
- Real TOC images for publications
- Group photos and activity photos
- ResearchGate profile URL, if available
- Detailed models/photos for HPLC and GC-MS

For step-by-step instructions, see `MAINTENANCE.md`.
