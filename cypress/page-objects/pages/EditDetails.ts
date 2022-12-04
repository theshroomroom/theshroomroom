export default class EditDetails {
    static fillInDeets(dFirstName:string,dSurname:string,dFirstLine:string,dCity:string,dPostcode:string,bFirstName:string,bSurname:string,bFirstLine:string,bCity:string,bPostcode:string){
        cy.get('#dFirstName')
        .type(dFirstName)
        
        cy.get('#dSurname')
        .type(dSurname)

        cy.get('#dFirstLine')
        .type(dFirstLine)

        cy.get('#dCity')
        .type(dCity)

        cy.get('#dPostcode')
        .type(dPostcode)

        cy.get('#bFirstName')
        .type(bFirstName)
        
        cy.get('#bSurname')
        .type(bSurname)

        cy.get('#bFirstLine')
        .type(bFirstLine)

        cy.get('#bCity')
        .type(bCity)

        cy.get('#bPostcode')
        .type(bPostcode)
    }
}