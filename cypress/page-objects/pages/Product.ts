export default class Product {
    static checkPresenceAndAdd(){
        cy.get('#productName')
        .should('have.length',1)

        cy.get('#productImage')
        .should('have.length',1)

        cy.get('#productDescription')
        .should('have.length',1)

        cy.get('#productQuantity')
        .should('have.length',1)
        .select(2)

        cy.get('#productPrice')
        .should('have.length')

        cy.get('#productAddToCart')
        .click()

        cy.get('#cart')
        .contains('You')
    }
}