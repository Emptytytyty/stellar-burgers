import ingredients from './ingredients.json';
import user from './user.json';
import order from './order.json';

describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:5173', async () => {
    cy.intercept('GET', `/api/ingredients`, {
      statusCode: 200,
      body: JSON.stringify(ingredients)
    }).as('getIngredients');

    cy.intercept('GET', `/api/auth/user`, {
      statusCode: 200,
      headers: {
        authorization: 'accessToken'
      },
      body: JSON.stringify(user)
    }).as('getUser');

    cy.intercept('POST', `/api/orders`, {
      statusCode: 200,
      headers: {
        authorization: 'accessToken'
      },
      body: JSON.stringify(order)
    }).as('postOrder');
    
    cy.visit('http://localhost:4000');

    cy.get('button')
      .should('contain', 'Добавить')
      .each((el, index) => {
        if (index % 2) cy.wrap(el).click();
      });
    cy.get('ul>li>a>img').first().click();
    cy.get('#modals button').click();
    cy.get('ul>li>a>img').first().click();
    cy.get('#modals div').last().click({ force: true });
    cy.contains('Оформить заказ').click();
    cy.get('#modals div').first().should('be.visible');
    cy.get('#modals h2').should('contain', '99');
    cy.get('#modals button').click();
    cy.get('#modals div').should('not.exist');
    cy.get('#root').should('contain', 'Выберите булки');
    cy.get('#root').should('contain', 'Выберите начинку');
  });
});
