Cypress.Commands.add('login',(username,password)=>{
    
    cy.get('#signIn')
    .contains('Sign In')
    .click()
    cy.get("#username")
    .type("test1@test1.com")
    cy.get("#password")
    .type("test1{enter}")
    cy.url().should('eq',Cypress.config().baseUrl)
})