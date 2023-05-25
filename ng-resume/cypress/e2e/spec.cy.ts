describe('My First Test', () => {
  it('Visits the resume page', () => {
    cy.visit('/')
    cy.contains('J. Patrick Fulton')
  })
})
