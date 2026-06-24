import config from "./config.js";

function renderNavbar() {
  const navEl = document.getElementById("navbar");
  const links = config.nav
    .map(({ label, href }) => `<li><a href="${href}">${label}</a></li>`)
    .join("");

  navEl.innerHTML = `
    <nav>
      <a class="nav-brand" href="#/">${config.website.name}</a>
      <ul class="nav-links">${links}</ul>
    </nav>
  `;

  setActiveLink();
}

function setActiveLink() {
  const hash = window.location.hash || "#/";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === hash);
  });
}

function renderFooter() {
  const footerEl = document.getElementById("footer");
  footerEl.innerHTML = `
    <p>© ${config.website.year} · ${config.website.author}</p>
  `;
}

async function loadPage(name) {
  const res = await fetch(`${config.paths.pages}${name}.html`);
  if (!res.ok) throw new Error(`página não encontrada: ${name}`);
  return res.text();
}

function setContent(html) {
  document.getElementById("app").innerHTML = html;
}

window.addEventListener("hashchange", setActiveLink);

export default { renderNavbar, renderFooter, loadPage, setContent };
