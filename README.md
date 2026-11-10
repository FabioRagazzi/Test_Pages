# Merlino2D manual (website)

Static website version of `user_manual.tex`. No build step.

## Preview locally
    python3 -m http.server 8000
then open http://localhost:8000

## Publish
Settings -> Pages -> Deploy from a branch -> branch `main`, folder `/docs`.

## Editing
- Text: edit the `.html` files directly (one per section of the manual).
- Add a page: copy an existing `.html` file and add it to `PAGES` at the top of `assets/site.js`.
- Colours and fonts: the `:root` block at the top of `assets/style.css`.
- Maths uses KaTeX (bundled in `assets/vendor/katex`): write `\( ... \)` inline or `\[ ... \]` for display.
- Parameter links: `<a class="param" href="input-parameters.html#bc-flag">BC_FLAG</a>`
