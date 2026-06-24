const config = {
  website: {
    name: "liberstack",
    description: "Guias & Projetos para Desenvolvedores.",
    author: "Guilherme Ribeiro",
    year: new Date().getFullYear(),
  },
  paths: {
    pages: "./pages/",
    posts: "./data/posts.json",
    postsDir: "./posts/",
  },
  nav: [
    { label: "home", href: "#/" },
    { label: "sobre", href: "#/about" },
    { label: "contato", href: "#/contact" },
  ],
};

export default config;
