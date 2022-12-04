import BasePage from '../BasePage';
export default class HomePage extends BasePage{
    
    static checkBanner(){
        cy.get(".banner-container")
        .should('have.length',1)
    }
}