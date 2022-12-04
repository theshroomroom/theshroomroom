export default class Footer {
    static checkFooterLinks(){
        var footerlinks =cy.get('#footer')
        .get('a')
        footerlinks
        .contains('Privacy')
        .click()

        cy.url()
        .should('include','privacy')

        footerlinks
        .contains('Cookies')
        .click()

        cy.url()
        .should('include','cookies')

        footerlinks
        .contains('delivery')
        .click()

        cy.url()
        .should('include','delivery')

        footerlinks
        .contains('returns')
        .click()
        cy.url()
        .should('include','returns')
    }
}