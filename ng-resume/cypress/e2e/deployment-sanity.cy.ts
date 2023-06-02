/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */

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

  it("[API] Invoke the education api function to get all", () => {
    cy.request("/api/education").then((response) => {
      expectJsonResponseBody(response);
      assertResponseBodyContainsObjectWithId(response, "a36e4bd3-95e2-4a7b-974c-89a35ee4c0f7");
    });
  });

  it("[API] Invoke the education api function to get by id", () => {
    cy.request("/api/education/a36e4bd3-95e2-4a7b-974c-89a35ee4c0f7").then((response) => {
      expectJsonResponseBody(response);
      assert.isObject(response.body, "Body should contain a single object.");
      expect(response.body.id).to.be.equals("a36e4bd3-95e2-4a7b-974c-89a35ee4c0f7");
    });
  });

  it("[API] Invoke the work history api function to get all", () => {
    cy.request("/api/workhistory").then((response) => {
      expectJsonResponseBody(response);
      assertResponseBodyContainsObjectWithId(response, "564bab1a-77a5-4a3c-98a5-d57e5bf1a0ef");
    });
  });

  it("[API] Invoke the work history api function to get by id", () => {
    cy.request("/api/workhistory/564bab1a-77a5-4a3c-98a5-d57e5bf1a0ef").then((response) => {
      expectJsonResponseBody(response);
      assert.isObject(response.body, "Body should contain a single object.");
      expect(response.body.id).to.be.equals("564bab1a-77a5-4a3c-98a5-d57e5bf1a0ef");
    });
  });

  function expectJsonResponseBody(response: Cypress.Response<any>) : void {
    expect(response.headers["content-type"])
      .to.be.contains("application/json", "Should be JSON content.");
  }

  function assertResponseBodyContainsObjectWithId(response: Cypress.Response<any>, itemId: string) : void {
    expect(response.body.length).to.be.greaterThan(0, "Body array should contain more than 0 objects.");
    
    const item = response.body.find(
      (i: { id: string; }) => i.id === itemId
    );
    assert.isObject(item, "Body contains object with expected id property.");
  }
});
