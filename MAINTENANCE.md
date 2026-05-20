# Zuo Group Website Maintenance Guide

Online website:

```text
https://greengyc.github.io/zuo-group/
```

GitHub repository:

```text
https://github.com/greengyc/zuo-group
```

## The Simple Rule

Routine editing should be done through the website admin page:

```text
/admin/
```

Do not edit `.html`, `.css`, `.js`, or `.json` files by hand unless changing the website system itself.

## What Can Be Edited In The Admin Page

- Global site brand, top menu, footer, and theme color
- Homepage large image area, buttons, research-focus section, guide cards, recruiting band
- Top title section on Research, Publications, People, News, Photos, Resources, Facilities, Join Us, and Contact
- Research direction cards
- Publication entries, DOI links, journal links, and TOC images
- People groups, members, photos, and alumni information
- News items, optional images, and optional buttons
- Photo tiles
- Resource cards
- Facility cards
- Join Us text and extra blocks
- Contact rows and profile links

## Recommended Editing Workflow

1. Open `/admin/`.
2. Log in with the invited editor account.
3. Choose the page or section you want to edit.
4. Make a small change first.
5. Click `Publish` and then `Publish now`.
6. Wait 1-3 minutes.
7. Refresh the public website and check the result.

## Safe Editing Tips

- Use the `Show this...` switch to hide content without deleting it.
- For internal links, use filenames like `research.html` or `contact.html`.
- For external links, use full URLs beginning with `https://`.
- For uploaded images, use clear filenames in English.
- If a design looks wrong after a change, revert the last edited field in `/admin/` and publish again.

## CMS Coverage Audit

The project includes an audit script:

```text
scripts/audit-cms-coverage.js
```

Before structural releases, run this audit. It checks that:

- every `content/*.json` file is registered in the admin configuration
- every content field name has a matching admin field
- every rendered visible text item is covered by admin-managed content
- visible images, buttons, and links are covered by admin-managed content

If the audit reports a missing item, move that item into `content/*.json`, expose it in `admin/config.yml`, and run the audit again.

## Content Still Useful To Add Later

- Confirmed English spellings for all group members
- Member roles and alumni destinations
- Real TOC images for publications
- Group photos and activity photos
- ResearchGate profile URL
