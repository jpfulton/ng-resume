/* eslint-disable @typescript-eslint/no-inferrable-types */

import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { DEFAULT_SEO_CONFIG } from '../constants/seo-constants';

/**
 * SeoService configuration value object interface.
 */
export interface SeoConfig {
  title: string;
  image: string;
  description: string;
  author: string;
  twitterUsername: string;
  keywords: string[];
  locale: string;
  type: string;
  baseUrl: string;
}

/**
 * Service to manage head tags supporting search engine optimization. While the Google crawler
 * now supports meta tags set by JavaScript, most other crawlers have yet to follow suit. This
 * service is designed to work in both SSR and browser rendering environments.
 * 
 * Meta tags to support iMessage previews, Open Graph previews and Twitter cards are managed
 * here.
 * 
 * References:
 *  https://developer.apple.com/library/archive/technotes/tn2444/_index.html
 *  https://ogp.me
 *  https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
 *  https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private routerService: Router
  ) 
  { }

  /**
   * Updates header tags with values derived from the SeoConfig overrides and defaults.
   * @param {Partial<SeoConfig>} seoConfig SeoConfig overrides to drive header tag generation.
   * @param {boolean} allowRobotIndexing Allows robot indexing. Defaults to true.
   */
  updateSeoHeaderTags(seoConfig: Partial<SeoConfig>, allowRobotIndexing: boolean = true) : void {
    const config : SeoConfig = { ...DEFAULT_SEO_CONFIG, ...seoConfig };
    const metaTagDefinitions : MetaDefinition[] = this.createMetaDefinitions(config, allowRobotIndexing);

    this.titleService.setTitle(config.title);
    this.metaService.addTags(metaTagDefinitions);
  }

  private createMetaDefinitions(config: SeoConfig, allowRobotIndexing: boolean = true) : MetaDefinition[] {
    const definitions : MetaDefinition[] = [];

    definitions.push(...this.createStandardMetaDefinitions(config, allowRobotIndexing));
    definitions.push(...this.createOpenGraphMetaDefinitions(config));
    definitions.push(...this.createTwitterMetaDefinitions(config));

    return definitions;
  }

  private createStandardMetaDefinitions(config: SeoConfig, allowRobotIndexing: boolean = true) : MetaDefinition[] {
    const definitions: MetaDefinition[] = [
      { name: "title", content: config.title },
      { name: "description", content: config.description },
      { name: "author", content: config.author },
      { name: "robots", content: allowRobotIndexing ? "index, follow" : "noindex" }
    ];

    if (config.keywords.length !== 0) definitions.push(
      { name: "keywords", content: config.keywords.join(", ") }
    );

    return definitions;
  }

  private createOpenGraphMetaDefinitions(config: SeoConfig) : MetaDefinition[] {
    const definitions: MetaDefinition[] = [
      { property: "og:title", content: config.title },
      { property: "og:description", content: config.description },
      { property: "og:author", content: config.author },
      { property: "og:type", content: config.type },
      { property: "og:locale", content: config.locale },
      { property: "og:url", content: config.baseUrl + this.routerService.url },
      { property: "og:image", content: config.baseUrl + config.image }
    ];

    return definitions;
  }

  private createTwitterMetaDefinitions(config: SeoConfig) : MetaDefinition[] {
    const definitions: MetaDefinition[] = [
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: config.twitterUsername },
      { name: "twitter:creator", content: config.twitterUsername }
    ];

    return definitions;
  }
}
