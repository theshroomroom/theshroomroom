export default class BasePage{
    static pause(ms:number){
        cy.wait(ms)
    }
    static logInfo(message:string){
        cy.log(message)
    }
    static checkHeader(){
        cy.get('#header')
        .should('have.length',1)
    }
    static checkFooter(){
        cy.get('#footer')
        .should('have.length',1)
    }
    static setMobileViewport() {
        cy.viewport('iphone-x');

    }
    static setTabletViewport() {
        cy.viewport('ipad-2');
    }
    static setDesktopViewport() {
        cy.viewport('macbook-13');
    }
    static setLargeDesktopViewport() {
        cy.viewport(1980,1080)
    }
}