// 1. Copy buttons on every code block
document.querySelectorAll("pre").forEach(pre => {
  const btn = document.createElement("button");
  btn.className = "copy"; btn.type = "button"; btn.textContent = "Copy";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector("code").innerText);
      btn.textContent = "Copied";
    } catch { btn.textContent = "Press Ctrl+C"; }
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
  pre.appendChild(btn);
});

// 2. Sidebar filter: hides nav links that don't match what you type
const filter = document.getElementById("filter");
if (filter) {
  filter.addEventListener("input", () => {
    const q = filter.value.trim().toLowerCase();
    document.querySelectorAll(".sidebar li").forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

// 3. Mobile menu toggle
const menu = document.getElementById("menu-btn");
if (menu) menu.addEventListener("click", () =>
  document.querySelector(".sidebar").classList.toggle("open"));
