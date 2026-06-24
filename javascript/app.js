import config from "./config.js";
import router from "./router.js";
import ui from "./ui.js";

// ── PÁGINAS ──────────────────────────────────────────────
async function loadPage(name) {
  try {
    const html = await ui.loadPage(name);
    ui.setContent(html);
    if (name === "home") await initHome();
  } catch (e) {
    notFound();
  }
}

// ── POSTS ─────────────────────────────────────────────────
async function renderPost(slug) {
  try {
    const res = await fetch(config.paths.posts);
    const posts = await res.json();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      notFound();
      return;
    }

    const mdRes = await fetch(`${config.paths.postsDir}${post.file}`);
    const md = await mdRes.text();
    const html = window.marked.parse(md);

    const tags = Array.isArray(post.tag)
      ? post.tag
      : post.tag
        ? [post.tag]
        : [];
    const tagHtml = tags.length ? " · " + tags.join(", ") : "";

    ui.setContent(`
      <a class="back-link" href="#/">← voltar</a>
      <article>
        <header class="article-header">
          <h1>${post.title}</h1>
          <p class="article-meta">${post.date}${tagHtml}</p>
        </header>
        <div class="article-body">${html}</div>
      </article>
    `);
  } catch (e) {
    ui.setContent("<p>Erro ao carregar post.</p>");
  }
}

// ── HOME ──────────────────────────────────────────────────
async function initHome() {
  try {
    const res = await fetch(config.paths.posts);
    const posts = await res.json();
    const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderPostList(sorted);

    document.getElementById("search-input")?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = q
        ? sorted.filter((p) => {
            const tags = Array.isArray(p.tag) ? p.tag : p.tag ? [p.tag] : [];
            return (
              p.title.toLowerCase().includes(q) ||
              (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
              tags.some((t) => t.toLowerCase().includes(q))
            );
          })
        : sorted;
      renderPostList(filtered);
    });
  } catch (e) {
    document.getElementById("post-list-wrap").innerHTML =
      "<p>Erro ao carregar posts.</p>";
  }
}

function renderPostList(posts) {
  const wrap = document.getElementById("post-list-wrap");
  if (!wrap) return;

  if (posts.length === 0) {
    wrap.innerHTML = '<p style="color:var(--muted)">nenhum resultado.</p>';
    return;
  }

  wrap.innerHTML = `
    <ul class="post-list">
      ${posts
        .map((post) => {
          const tags = Array.isArray(post.tag)
            ? post.tag
            : post.tag
              ? [post.tag]
              : [];
          const tagHtml = tags.length
            ? " · " +
              tags.map((t) => `<span class="post-tag">${t}</span>`).join(" ")
            : "";
          return `
          <li class="post-item">
            <p class="post-date">${post.date}${tagHtml}</p>
            <h2 class="post-title"><a href="#/p/${post.slug}">${post.title}</a></h2>
            ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ""}
          </li>
        `;
        })
        .join("")}
    </ul>
  `;
}

// ── 404 ───────────────────────────────────────────────────
function notFound() {
  ui.setContent(`
    <div class="not-found">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <a href="#/">← voltar ao início</a>
    </div>
  `);
}

// ── INIT ──────────────────────────────────────────────────
function init() {
  ui.renderNavbar();
  ui.renderFooter();

  router.register("/", () => loadPage("home"));
  router.register("/about", () => loadPage("about"));
  router.register("/contact", () => loadPage("contact"));
  router.register("/404", notFound);
  router.register("/p/:slug", renderPost);

  router.init();
}

init();
