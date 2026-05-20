# Zuo Group website

This is the first formal English website framework for the Zuo Group / Zhijun Zuo Research Group at Northwest University.

## Open locally

This website now uses JSON content files. For the most accurate local preview, open the folder through a local web server instead of double-clicking `index.html`.

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
- `content/*.json` - Content edited through the admin page
- `admin/config.yml` - Admin form configuration
- `js/content-renderer.js` - Turns JSON content into page content

## Routine editing

For routine updates, use the `/admin/` page. The admin page provides form fields for global site settings, homepage content, page hero areas, publications, people, news, photos, resources, facilities, joining information, and contact information.

## CMS coverage audit

The repo includes `scripts/audit-cms-coverage.js`. It is used before releases to check that rendered visible text, images, buttons, links, and content fields are covered by the admin-managed content files.

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
