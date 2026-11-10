/* Merlino2D manual: sidebar, outline, code helpers.
   To add a page: create the .html file (copy an existing one) and add it to PAGES below. */
const PAGES = [
  { href: "index.html",             title: "Introduction" },
  { href: "installation.html",      title: "Installation" },
  { href: "basic-workflow.html",    title: "Basic workflow" },
  { href: "mesh-identifiers.html",  title: "Mesh identifiers" },
  { href: "species-database.html",  title: "Species database" },
  { href: "input-parameters.html",  title: "Input parameters" },
];
const REPO = "https://github.com/PTL-Unibo/Merlino2D";

const here = document.body.dataset.page || "index.html";
const content = document.getElementById("content");

/* ---------- Heading anchors ---------- */
content.querySelectorAll("h2[id], h3[id]").forEach(h => {
  const a = document.createElement("a");
  a.className = "anchor"; a.href = "#" + h.id; a.textContent = "#";
  a.setAttribute("aria-label", "Link to this section");
  h.appendChild(a);
});

/* ---------- Sidebar ---------- */
const sidebar = document.getElementById("sidebar");
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let navHtml = "<ul>";
PAGES.forEach(p => {
  const current = p.href === here;
  navHtml += `<li><a href="${p.href}"${current ? ' aria-current="page"' : ""}>${esc(p.title)}</a>`;
  if (current) {
    const heads = [...content.querySelectorAll("h2[id], h3[id]")];
    if (heads.length) {
      navHtml += "<ul>" + heads.map(h => {
        const label = h.childNodes[0].textContent.trim();
        return `<li><a class="${h.tagName === "H3" ? "sub" : ""}" href="#${h.id}">${esc(label)}</a></li>`;
      }).join("") + "</ul>";
    }
  }
  navHtml += "</li>";
});
navHtml += "</ul>";
sidebar.innerHTML = `
  <a class="brand" href="index.html">Merlino2D<small>User manual</small></a>
  <input id="filter" class="filter" type="search" placeholder="Filter sections" aria-label="Filter sections">
  <nav id="nav" aria-label="Manual">${navHtml}</nav>
  <div class="side-links"><a href="${REPO}">Code on GitHub</a></div>`;

/* Filter: matches page titles and section names */
document.getElementById("filter").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  sidebar.querySelectorAll("#nav ul ul li").forEach(li => {
    li.classList.toggle("hidden", q && !li.textContent.toLowerCase().includes(q));
  });
  sidebar.querySelectorAll("#nav > ul > li").forEach(li => {
    const title = li.firstElementChild.textContent.toLowerCase();
    const anyChild = li.querySelector("ul li:not(.hidden)");
    li.classList.toggle("hidden", q && !title.includes(q) && !anyChild);
  });
});

/* Highlight the section being read */
const links = new Map([...sidebar.querySelectorAll('#nav ul ul a')].map(a => [a.getAttribute("href").slice(1), a]));
if ("IntersectionObserver" in window && links.size) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.remove("active"));
        const a = links.get(en.target.id);
        if (a) { a.classList.add("active"); a.scrollIntoView({ block: "nearest" }); }
      }
    });
  }, { rootMargin: "0px 0px -75% 0px" });
  content.querySelectorAll("h2[id], h3[id]").forEach(h => io.observe(h));
}

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menu-btn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  sidebar.addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("menu-open"); });
}

/* ---------- Previous / next ---------- */
const i = PAGES.findIndex(p => p.href === here);
const pager = document.getElementById("pager");
if (pager && i >= 0) {
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  pager.innerHTML =
    (prev ? `<a class="prev" href="${prev.href}"><small>Previous</small>&larr; ${esc(prev.title)}</a>` : "") +
    (next ? `<a class="next" href="${next.href}"><small>Next</small>${esc(next.title)} &rarr;</a>` : "");
}

/* ---------- MATLAB syntax colouring ---------- */
const KW = /^(function|end|if|else|elseif|for|while|switch|case|otherwise|return)$/;
function colourMatlab(el) {
  const src = el.textContent;
  const re = /(%.*$)|("(?:[^"\n]|"")*"|'[^'\n]*')|(\b\d+\.?\d*(?:e[+-]?\d+)?\b)|(\b[A-Za-z_]\w*\b)/gm;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const t = m[0];
    if (m[1]) out += `<span class="tok-com">${esc(t)}</span>`;
    else if (m[2]) out += `<span class="tok-str">${esc(t)}</span>`;
    else if (m[3]) out += `<span class="tok-num">${esc(t)}</span>`;
    else if (KW.test(t)) out += `<span class="tok-kw">${esc(t)}</span>`;
    else out += esc(t);
    last = m.index + t.length;
  }
  el.innerHTML = out + esc(src.slice(last));
}
content.querySelectorAll("code.language-matlab, code.m").forEach(colourMatlab);

/* ---------- Copy buttons ---------- */
content.querySelectorAll("pre").forEach(pre => {
  const btn = document.createElement("button");
  btn.className = "copy"; btn.type = "button"; btn.textContent = "Copy";
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(pre.querySelector("code").innerText); btn.textContent = "Copied"; }
    catch { btn.textContent = "Press Ctrl+C"; }
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
  pre.appendChild(btn);
});

/* ---------- Maths (KaTeX, bundled in assets/vendor) ---------- */
window.addEventListener("load", () => {
  if (window.renderMathInElement) {
    renderMathInElement(content, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }
});
