export default class Carousel {
    static checkInitialState(){
        cy.get('.carousel-image-wrap')
        .then(($el) => {
            return window.getComputedStyle($el[0])
        })
        .invoke('getPropertyValue','transform')
        .should('equal','translateX(-60vw)')

        cy.get('.carousel-image-wrap')
        .then(($el) => {
            return window.getComputedStyle($el[1])
        })
        .invoke('getPropertyValue','transform')
        .should('equal','translateX(0vw)')
    }
    static scrollLeft(){
        cy.get('.carousel-right')
        .click()
    }
    static scrollRight(){
        cy.get('.carousel-left')
        .click()
    }
    static checkAfterScrollLeft(){
        cy.get('.carousel-image-wrap')
        .then(($el) => {
            var length=$el.length
            cy.get('.carousel-image-wrap')
            .then(($el)=>{

            return window.getComputedStyle($el[0])

            })
            .invoke('getPropertyValue','transform')
            .should('equal',`translateX(${60*(length-2)}w)`)
        })
    }
}