# Zuo Group Website Editing Guide

This website is designed for form-based editing through the `/admin/` page.

Editors should not edit code for routine maintenance. Use the admin page instead:

```text
/admin/
```

## Basic Workflow

1. Open the admin page.
2. Log in with an invited editor account.
3. Choose a content section.
4. Edit the form fields.
5. Click `Publish`.
6. Click `Publish now`.
7. Wait 1-3 minutes for the public website to update.

## Editable Sections

- `Site Settings`: top-left brand, navigation menu, footer, main red theme color
- `Home`: homepage hero image/text/buttons, research-focus area, guide cards, recruiting band
- `Research`: top hero area and research direction cards
- `Publications`: page title, section headings, papers, DOI links, journal links, TOC images
- `People`: page title, people groups, member names, roles, photos, alumni details
- `News`: page title, extra blocks, news items, images, buttons
- `Photos`: page title and photo tiles
- `Resources`: page title and resource cards
- `Facilities`: page title and facility cards
- `Join Us`: page title, recruiting text, extra editable blocks
- `Contact`: page title, contact heading, email, office, lab address, academic profile links

## Practical Rule

If a field has a `Show this...` switch, turning it off hides that part without deleting it. This is useful when an item may be needed again later.

For links inside the same website, use filenames such as:

```text
research.html
join.html
contact.html
```

For outside links, use the full URL:

```text
https://www.x-mol.com/groups/zuozj
```

For images, use the image picker in the admin page. The image will be uploaded into `assets/uploads/`.
