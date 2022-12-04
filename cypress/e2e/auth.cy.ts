describe("Check sign up, sign out, sign in and delete account",()=>{

    it('Page loaded',()=>{
        cy.log(Cypress.env('url'))
        cy.visit('/');
        cy.clearCookies()
        cy.clearLocalStorage()
    })
    it('Check sign out is not visible and go to sign in page',()=>{
        cy.get("#signOut")
        .should('not.exist')

        cy.get('#signIn')
        .contains('Sign In')
        .click()
    })
    it("Check username and password labels are present",()=>{
        cy.get("label")
        .contains("Username")
        cy.get("label")
        .contains("Password")

    })
    it("Enter text and sign in",()=>{
        cy.get("#username")
        .type("test1@test1.com")
        cy.get("#password")
        .type("test1{enter}")

        cy.url().should('eq',Cypress.config().baseUrl)

        cy.get("#signIn")
        .should('not.exist')

        cy.get("#cart")
        .contains("You have 0 items in your basket.")

        cy.get("#welcomeMessage")
        .contains("Hi test 1")

    })
    it("Sign out and and sign in with test 2, test 2 cart and name load",()=>{
        cy.get("#signOut")
        .click()
        .wait(2000)

        cy.get("#signIn")
        .click()
        .wait(5000)

        
        cy.get("#username")
        .type("test2@test2.com")
        cy.get("#password")
        .type("test2{enter}")
        .wait(5000)


        cy.url().should('eq',Cypress.config().baseUrl)

        cy.get("#signIn")
        .should('not.exist')

        cy.get("#cart")
        .contains("You have 1 item in your basket.")

        cy.get("#welcomeMessage")
        .contains("Hi test 2")
    })
})