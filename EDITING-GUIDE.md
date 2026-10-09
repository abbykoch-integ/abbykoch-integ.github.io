# Editing your portfolio

Everything people read on the site lives in **one file: `content.yml`**. The other files
(`index.html`, `app.js`, `style.css`) handle the design. You won't need to touch them.

## Edit online (once it's on GitHub)

1. Go to your repository on github.com and click **content.yml**.
2. Click the **pencil icon** (top right of the file).
3. Make your changes.
4. Click **Commit changes…**, then **Commit changes** again.
5. Wait about a minute and refresh your site. Done.

If the page shows a box saying **"Something in content.yml needs a fix"**, it tells you the line
number. Open the file, fix that line, and commit again. Nothing else breaks while you fix it.

## The rules of the file

- Only change text **after the colon** (`title: Your text here`) or **after a dash** (`- Your text`).
- **Keep the spaces at the start of each line exactly as they are.** Indentation tells the site
  what belongs to what. Use spaces, never Tab.
- If your text has a **colon followed by a space**, wrap it in double quotes:
  `title: "Capstone: my project"`
- Numbers on their own (like a year) also need quotes: `when: "2027"`
- **Bold** words with double stars: `**like this**`
- Lines starting with `#` are notes to you. The site ignores them.

## Common changes

**Change what you're looking for:** edit the `looking_for:` line near the top.

**Add a new job:** copy an existing block under `experience:`, paste it at the top of the list,
and change the words. Each job starts with `  - when:` (two spaces, a dash, a space).

**Add a case study:** copy a whole block under `case_studies:` (from `  - title:` down to just
before the next `  - title:`), paste it where you want it to appear, and edit it. Leave out
`images:` if you don't have photos yet.

**Add a photo:** upload the image into the `images` folder (on GitHub: open the folder,
**Add file → Upload files**), then refer to it by its exact file name:

```yaml
    images:
      - file: my-new-photo.jpg
        alt: A short description of the photo for people using screen readers.
```

One or two photos sit beside the text. Three or four make a gallery under it.

**Update your résumé:** upload a new PDF with the **same name**, `Abby-Koch-Resume.pdf`, to the
main folder. GitHub will ask whether to replace it; say yes.

**Hide a section:** delete its items, or put `#` at the start of each of its lines.

## Need a hand?

Ask Claude: *"Update my portfolio: add ___"*. The site files are in
`Documents\5. Claude\Portfolio\site`.
