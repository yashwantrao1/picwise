export interface SiteLinks {
  github: string;
  linkedin: string;
  portfolio: string;
  instagram: string;
  email: string;
  buyMeACoffee: string;
}

export interface SiteConfig {
  name: string;
  author: string;
  description: string;
  links: SiteLinks;
}

export const siteConfig: SiteConfig = {
  name: "Picwise",
  author: "Yashwant Rao",
  description: "Smart tools for your images.",
  links: {
    github: "https://github.com/yashwantrao1",
    linkedin: "https://www.linkedin.com/in/yashwant-rao0024/",
    portfolio: "https://yashwantrao.in/",
    instagram: "https://www.instagram.com/yashu024/",
    email: "mailto:raoyashwant024@gmail.com",
    buyMeACoffee: "https://www.buymeacoffee.com/yashu024",
  },
};
