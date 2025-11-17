beforeEach(() => {
  cy.fixture('/user.json').then(data => {
    localStorage.setItem('accessToken', data.accessToken);
    cookieStore.set('refreshToken', data.refreshToken);
  }).then(() => {
    cy.intercept('GET', `/api/ingredients`, { fixture: '/ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', `/api/auth/user`, { fixture: '/user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', `/api/orders`, { fixture: '/order.json', headers: {
      authorization: localStorage.getItem('accessToken')
    } }).as(
      'postOrder'
    );
  })

  cy.visit('/');
});

afterEach(() => {
  localStorage.removeItem('accessToken');
  cookieStore.delete('refreshToken');
})

it('Работа конструктора', () => {
  cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
  cy.contains('Биокотлета из марсианской Магнолии')
    .parent()
    .contains('Добавить')
    .click();
  cy.get('.constructor-element.constructor-element_pos_top').should(
    'contain',
    'Краторная булка N-200i'
  );
  cy.get('.constructor-element.constructor-element_pos_bottom').should(
    'contain',
    'Краторная булка N-200i'
  );
  cy.get(
    '.constructor-element:not(.constructor-element_pos_top):not(.constructor-element_pos_bottom)'
  ).should('contain', 'Биокотлета из марсианской Магнолии');
});

it('Модальные окна', () => {
  cy.contains('Биокотлета из марсианской Магнолии').parent().click();
  cy.get('#modals').should('contain', 'Биокотлета из марсианской Магнолии');
  cy.get('#modals button').click();
  cy.get('#modals').children().should('not.exist');
  cy.contains('Биокотлета из марсианской Магнолии').parent().click();
  cy.get('#modals').children().last().click('topLeft', { force: true });
  cy.get('#modals').children().should('not.exist');
});

it('Оформление заказа', () => {
  cy.contains('Флюоресцентная булка R2-D3')
    .parent()
    .contains('Добавить')
    .click();
  cy.contains('Соус Spicy-X').parent().contains('Добавить').click();
  cy.contains('Биокотлета из марсианской Магнолии')
    .parent()
    .contains('Добавить')
    .click();
  cy.contains('Оформить заказ').click();
  cy.get('#modals h2').should('contain', '99');
  cy.get('#modals button').click();
  cy.contains('Оформить заказ').parent().prev().should('contain', 'Выберите булки');
  cy.contains('Оформить заказ').parent().prev().prev().should('contain', 'Выберите начинку');
  cy.contains('Оформить заказ').parent().prev().prev().prev().should('contain', 'Выберите булки');
});
