describe("Deployment Sanity Tests", () => {
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

  it("[API] Invoke the message test api function", () => {
    cy.request("/api/messagetest?name=cypress")
      .its("body")
      .should("include", "Hello, cypress.");
  });
});
