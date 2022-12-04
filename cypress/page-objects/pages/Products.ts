import BasePage from "../BasePage";

export class Products extends BasePage {
    title=''
    constructor(title:string){
        super()
        this.title=title
    }
    interceptGet(){

        cy.intercept({
            method:'GET',
            url:`/api/products${this.title==='all'?'':`?type=${this.title}`}`
        },
        []).as('getProducts')
    }
    visit(){
        cy.visit(`/products/${this.title}`)
    }
    checkProducts(){
        var length;
        cy.get('body')
        .then((body)=>{
            if(body.find('.product')){
                length=true
            }
        })

        if(length){
            cy.get('.product') 
            .then((el)=>{
                const length = el.length
    
                var wrapped = cy.wrap(el)
                console.log(wrapped)
                wrapped.get('.product-image')
                .should('have.length',length)
                wrapped.get('.product-description')
                .should('have.length',length)
                wrapped.get('.product-quantity')
                .should('have.length',length)
    
    
                wrapped.get('.product-name')
                .should('have.length',length)
                wrapped.get('.product-price')
                .should('have.length',length)
    
                wrapped.get('.product-add-to-cart-button')
                .should('have.length',length)
                .click({multiple:true})
                cy.get('#cart')
                .contains(`You have ${length} items in your basket.`)
            })
        }
       

        
    }
    checkNoProducts(){
        cy.get('#noProducts')
        .contains('No products available.')
        .should('have.length',1)
    }
}