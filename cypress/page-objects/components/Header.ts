export default class Header {
    static signUp(name:string,username:string,password:string){
        cy.get('#signUp')
        .click()

        cy.get('#name')
        .type(name)

        cy.get('#username')
        .type(username)

        cy.get('#password')
        .type(password)
    }

}