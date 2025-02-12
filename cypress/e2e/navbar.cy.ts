describe('navbar', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('should exist navbar', () => {
    cy.get('#navbar').should('exist');
  });

  it('should be a title', () => {
    cy.get('#navbar').should('have.text', 'EXPENSE TRACKER');
  })

});
