export default class Cart {
    static checkPresence(){
        cy.get('.product-name')
        .should('have.length',1)

        cy.get('.product-image')
        .should('have.length',1)

        cy.get('.product-description')
        .should('have.length',1)

        cy.get('.product-price')
        .should('have.length',1)

        cy.get('.product-save')
        .should('have.length',1)
        
        cy.get('.product-delete')
        .should('have.length',1)
    }
    static changeQuantity(qty:number,idx:number,cb:any){
        cy.get(`#quantity${idx}`)
        .select(qty)
        cb()
    }
    static goToCheckout(){
        cy.get('#checkout')
        .click()
    }
}