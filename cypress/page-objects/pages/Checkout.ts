export default class Checkout {

    static checkDeets(dFirstName:string,dSurname:string,dFirstLine:string,dCity:string,dPostcode:string,bFirstName:string,bSurname:string,bFirstLine:string,bCity:string,bPostcode:string){
        cy.get('#dFirstName')
        .contains(dFirstName)
        
        cy.get('#dSurname')
        .contains(dSurname)

        cy.get('#dFirstLine')
        .contains(dFirstLine)

        cy.get('#dCity')
        .contains(dCity)

        cy.get('#dPostcode')
        .contains(dPostcode)

        cy.get('#bFirstName')
        .contains(bFirstName)
        
        cy.get('#bSurname')
        .contains(bSurname)

        cy.get('#bFirstLine')
        .contains(bFirstLine)

        cy.get('#bCity')
        .contains(bCity)

        cy.get('#bPostcode')
        .contains(bPostcode)
    }
    static fillInCardDeets() {
        cy.get('#Field-numberInput')
        .type('4242424242424242')

        cy.get('#Field-numberInput')
        .type('02')
        .type('25')

        cy.get('#Field-cvcInput')
        .type('444')

        cy.get('#Field-postalCodeInput')
        .type('WS11 4DB')
    }

}