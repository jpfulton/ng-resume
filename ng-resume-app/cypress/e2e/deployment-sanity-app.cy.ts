/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */

describe("Deployment Sanity Tests [APP]", () => {
  it("[APP] Visits the resume page", () => {
    cy.visit("/");
    cy.contains("J. Patrick Fulton");

    cy.screenshot();
  });

  it("[APP] Visits the error page", () => {
    cy.visit("/error");
    cy.contains("Something went wrong.");

    cy.screenshot();
  });

  it("[APP] Visits the cookie policy page", () => {
    cy.visit("/cookiepolicy");
    cy.contains("cookie");

    cy.screenshot();
  });

  it("[APP] Visits the privacy policy page", () => {
    cy.visit("/privacy");
    cy.contains("privacy");

    cy.screenshot();
  });

  it("[APP] Visits the not found page", () => {
    cy.visit("/oops");
    cy.contains("not found");

    cy.screenshot();
  });

  it("[APP] Resume page contains prerendered SEO tags", () => {
    const domParser = new DOMParser();

    cy.request("/").then((response) => {
      const contentType = response.headers["content-type"];
      expect(contentType).to.be.contains("text/html", "Should be html content.");
      
      const body = response.body;
      const dom = domParser.parseFromString(body, "text/html");

      const headTag = dom.head;
      const metaTags = headTag.getElementsByTagName("meta");
      expect(metaTags.length).to.be.greaterThan(0, "Should have meta tags.");
      
      const metaTitle = headTag.querySelector("meta[name='title']");
      expect(metaTitle).to.be.a.instanceof(Element, "Should contain a meta tag with title.");

      const metaOgImage = headTag.querySelector("meta[property='og\\:image']");
      expect(metaOgImage).to.be.a.instanceof(Element, "Should contain a meta tag with og:image property.");

      const metaTwitterCreator = headTag.querySelector("meta[name='twitter\\:creator']");
      expect(metaTwitterCreator).to.be.a.instanceof(Element, "Should contain a meta tag with twitter:creator name.");
    });
  });
});
