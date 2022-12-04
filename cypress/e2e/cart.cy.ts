import Cart from "../page-objects/pages/Cart"
import Product from "../page-objects/pages/Product"

describe('Check cart and single product page to add good product to cart',()=>{
    cy.visit('/')
    .get('#cart')
    .click()

    cy.get('h2')
    .contains('PLEASE ADD SOME SHROOMS TO YOUR BASKET')
    
    cy.get('li')
    .contains('Products')
    .trigger('mouseover')

    cy.get('li')
    .contains('All')
    .click()

    cy.get('a')
    .then(($el)=>{
        return $el[0]
    })
    .click()

    Product.checkPresenceAndAdd()
    cy.get('#cart')
    .click()
    Cart.checkPresence()
    cy.get('.product-price')
    .then(($el)=>{
       var price = Number($el.text())
       Cart.changeQuantity(2,1,()=>{
           cy.get('.product-price')
           .then(($el)=>{
               var newPrice=Number($el.text())
               expect(price).to.equal(newPrice/2)
           })
       })
    })
    cy.get('.product-save')
    .click()
    cy.get('.product-delete')
    .click()
    
    cy.visit('/products/all')
    
    cy.get('.product-add-to-cart-button')
    .then(($el)=>{
        return $el[0]
    })
    .click()
    
    cy.get('#cart')
    .click()

    cy.get('#checkout')
    .click()

    cy.url()
    .contains('checkout')
})