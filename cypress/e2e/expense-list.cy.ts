describe('Expense list', () => {

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/expenses').as('getAllExpenses');
    cy.visit('http://localhost:4200/');
  })

  it('should table be visible', () => {
    cy.get("#expenses-list").should('exist');

    cy.wait('@getAllExpenses').then((expense) => {
      expect(expense.response?.statusCode).to.eq(200);
      expect(expense.response!.body).to.be.an('array');
      expect(expense.response!.body).to.have.length.greaterThan(0);
    })

  });

  it('should add new expenses', () => {
    cy.get('button').contains('Add new expense').click()
    cy.get('input[id="id"]').type("100")
    cy.get('input[id="description"]').type("Test")
    cy.get('#amount').clear().type("120")
    cy.get('input[id="category"]').type("Test Category")

    cy.get('button').contains('Save').click()

    cy.get('#expenses-list .p-datatable-tbody tr').its('length').then((length) => {
      cy.get('#expenses-list .p-datatable-tbody tr').eq(length - 1).children('td').eq(0).should('have.text', "100");
    })
  });

  it('should delete expense', () => {
    cy.intercept("DELETE", "http://localhost:3000/expenses/100").as('deleteExpense');

    cy.get('#expenses-list .p-datatable-tbody tr').its('length').then((length) => {
      cy.get('#expenses-list .p-datatable-tbody tr').eq(length - 1).children('td').eq(0).should('have.text', "100");
      cy.get('#expenses-list .p-datatable-tbody tr').eq(length - 1).children('td').eq(5).contains('Delete').click()

      cy.wait('@deleteExpense').then((expense) => {
        cy.get('#expenses-list .p-datatable-tbody tr').eq(length - 2).children('td').eq(0).should('not.have.text', "100");
      })
    })
  });

  it('should edit expenses', () => {
    cy.intercept("PUT", "http://localhost:3000/expenses/1").as('putExpense');

    cy.get('#expenses-list .p-datatable-tbody tr').eq(0).children('td').eq(5).contains('Edit').click();

    cy.get('input[id="description"]').should('be.visible').clear().type("Test Cypress");

    cy.get("button").contains('Save').click()

    cy.wait('@putExpense').then((expense) => {
      cy.get('#expenses-list .p-datatable-tbody tr').eq(0).children('td').eq(1).contains('Test Cypress')

    })

  })

})
