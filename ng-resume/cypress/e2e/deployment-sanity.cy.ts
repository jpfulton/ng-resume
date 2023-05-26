describe("Deployment Sanity Tests", () => {
  afterEach(() => {
    cy.screenshot();
  });
  
  it("Visits the resume page", () => {
    cy.visit("/");
    cy.contains("J. Patrick Fulton");
  });

  it("Visits the error page", () => {
    cy.visit("/error");
    cy.contains("Something went wrong.");
  });

  it("Visits the cookie policy page", () => {
    cy.visit("/cookiepolicy");
    cy.contains("cookie");
  });

  it("Visits the not found page", () => {
    cy.visit("/oops");
    cy.contains("Not found");
  });
});
