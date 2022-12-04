import Header from "../page-objects/components/Header"
import Checkout from "../page-objects/pages/Checkout"
import EditDetails from "../page-objects/pages/EditDetails"
import { Products } from "../page-objects/pages/Products"

describe('place an order',()=>{
    it('check validation',()=>{
        cy.session("keepCookies",()=>{
            

        cy.visit('/products/all')
        
        cy.get('.product-add-to-cart-button')
        .then(($el)=>{
            return $el[0]
        })
        .click()
        cy.getCookie("Cart")
        .then(el=>{
            expect(el.name).to.equal('Cart')
        })
        cy.get('#cart')
        .click()
        .wait(5000)

        cy.getCookie("Cart")
        .then(el=>{
            expect(el.name).to.equal('Cart')
        })
        cy.visit('/checkout')

        cy.getCookie("Cart")
        .then(el=>{
            expect(el.name).to.equal('Cart')
        })
        cy.get('#placeOrder')
        .click()

        cy.get('.form-error')
        .contains("Please enter form details correctly")

        cy.get('#dFirstName')
        .focus()
        .blur()
        
        cy.get('#dSurname')
        .focus()
        .blur()

        cy.get('#dFirstLine')
        .focus()
        .blur()

        cy.get('#dCity')
        .focus()
        .blur()

        cy.get('#dPostcode')
        .focus()
        .blur()

        cy.get('#bFirstName')
        .focus()
        .blur()
        
        cy.get('#bSurname')
        .focus()
        .blur()

        cy.get('#bFirstLine')
        .focus()
        .blur()

        cy.get('#bCity')
        .focus()
        .blur()

        cy.get('#bPostcode')
        .focus()
        .blur()

        cy.get('#Field-numberInput')
        .type('4')
        .blur()

        cy.get('#Field-expiryInput')
        .type('2')
        .blur()

        cy.get('#Field-cvcInput')
        .focus()
        .blur()

        cy.get('#Field-postalCodeInput')
        .focus()
        .blur()

        cy.get('error-text')
        .should('have.length',10)

        cy.get('p-FieldError Error')
        .should('have.length',4)
    })
    it('Fill in details on edit details page in my account check autofill',()=>{
        const dFirstName='asdfa'
        const dSurname='asdfa'
        const dFirstLine='ahaaa';
        const dCity = 'yo'
        const dPostcode='oiii';
        const bFirstName='yehhh';
        const bSurname='eyyyy';
        const bFirstLine='oiiiiii';
        const bCity='yeppp';
        const bPostcode='uhuuuu'
        Header.signUp('Harry','harryyyyyyyyyyyyyyyyyyyyyyy@testing.test.testingggggggggggggggg','password')
        cy.visit('/myaccount/edit')
        EditDetails.fillInDeets(dFirstName,dSurname,dFirstLine,dCity,dPostcode,bFirstName,bSurname,bFirstLine,bCity,bPostcode)
        cy.visit('/products/all')
        cy.get('.product-add-to-cart-button')
        .then(($el)=>{
            return $el[0]
        })
        .click()
        cy.visit('/checkout')
        Checkout.checkDeets(dFirstName,dSurname,dFirstLine,dCity,dPostcode,bFirstName,bSurname,bFirstLine,bCity,bPostcode)
        Checkout.fillInCardDeets()
        cy.get('#placeOrder')
        .click()
        cy.get('p')
        .contains('Payment Made')

    })
    })
    
})