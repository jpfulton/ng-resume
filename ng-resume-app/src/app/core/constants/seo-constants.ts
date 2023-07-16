import { SeoConfig } from "../services/seo.service";

/**
 * Default SeoService configuation values.
 */
export const DEFAULT_SEO_CONFIG: SeoConfig = {
  title: "",
  image: "/assets/images/riverwalk.png",
  description: "A professional website for J. Patrick Fulton.",
  author: "J. Patrick Fulton",
  twitterUsername: "@jpatrickfulton",
  keywords: [],
  locale: "en_US",
  type: "website",
  baseUrl: "https://www.jpatrickfulton.com",
};
