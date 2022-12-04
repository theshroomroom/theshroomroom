export default class MyAccount{
    static visit(){
        cy.get('#myAccount')
        .click()
    }
    static deleteAccount(){
        cy.get('#deleteAccountModal')
        .should('not.exist')

        cy.get('#deleteAccount')
        .click()

        cy.get('#cancelDeleteAccount')
        .click()

        cy.get('#deleteAccount')
        .click()

        cy.get('#confirmDeleteAccount')
        .click()
        cy.get('#signOut')
        .should('not.exist')
    }
    static changePassword(currentPassword:string,newPassword:string,confirmPassword:string){
        cy.get('#currentPassword')
        .type(currentPassword)
        cy.get('#newPassword')
        .type(newPassword)
        cy.get('#confirmPassword')
        .type(confirmPassword)
        cy.get('#changePassword')
        .click()

        cy.get('#message')
        .contains('Password successfully changed')
    }

}