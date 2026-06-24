const routes = {};

function register(path, handler) {
  routes[path] = handler;
}

async function resolve() {
  window.scrollTo(0, 0);
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";

  if (path.startsWith("/p/")) {
    const slug = path.replace("/p/", "");
    if (routes["/p/:slug"]) {
      await routes["/p/:slug"](slug);
      return;
    }
  }

  const handler = routes[path] || routes["/404"];
  if (handler) await handler();
}

function init() {
  window.addEventListener("hashchange", resolve);
  resolve();
}

function navigate(path) {
  window.location.hash = path;
}

export default { register, init, navigate };
