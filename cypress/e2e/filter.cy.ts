import {Expense} from '../../src/models/expenses';

describe("filter", () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  })

  it('should exist filter', () => {
    cy.get('#filter').should('exist');
  })

  it('open filter and get results', () => {
    cy.intercept('GET', 'http://localhost:3000/expenses').as('getAllExpenses');

    cy.get('.p-autocomplete-dropdown').should('exist');
    cy.get('.p-autocomplete-dropdown').click();

    cy.wait('@getAllExpenses').then((interception) => {
      const expenses: Expense[] = interception.response!.body;

      expect(interception.response!.statusCode).to.eq(200);
      expect(expenses).to.be.an('array');
      expect(expenses).to.have.length.greaterThan(0);

      expenses.forEach((expense) => {
        expect(expense).to.have.property('id').that.is.a('string');
        expect(expense).to.have.property('description').that.is.a('string');
        expect(expense).to.have.property('amount').that.is.a('number');
        expect(expense).to.have.property('category').that.is.a('string');
        expect(expense).to.have.property('date').that.is.a('string');
      });
    });

    cy.get(".p-autocomplete-list-container").should('exist');
    cy.get(".p-autocomplete-list-container > ul").should('exist');
  })

  it('should filter by value', () => {
    let param: string;

    cy.get('.p-autocomplete-dropdown').click();
    cy.get(".p-autocomplete-list-container > ul > li").eq(6).click()

    cy.get(".p-inputtext").invoke('val').then((val) => param = val as string)

    cy.get('#expenses-list .p-datatable-tbody tr')
      .each(($row) => {
        console.log(param);
        cy.wrap($row)
          .find('td').eq(3).should('have.text', param);
      })
  });

})
