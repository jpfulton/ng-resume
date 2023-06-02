/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */

describe("Deployment Sanity Tests [APP]", () => {
  afterEach(() => {
    cy.screenshot();
  });
  
  it("[APP] Visits the resume page", () => {
    cy.visit("/");
    cy.contains("J. Patrick Fulton");
  });

  it("[APP] Visits the error page", () => {
    cy.visit("/error");
    cy.contains("Something went wrong.");
  });

  it("[APP] Visits the cookie policy page", () => {
    cy.visit("/cookiepolicy");
    cy.contains("cookie");
  });

  it("[APP] Visits the privacy policy page", () => {
    cy.visit("/privacy");
    cy.contains("privacy");
  });

  it("[APP] Visits the not found page", () => {
    cy.visit("/oops");
    cy.contains("not found");
  });
});
