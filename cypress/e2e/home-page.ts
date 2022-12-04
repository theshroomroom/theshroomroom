import HomePage from '../page-objects/pages/HomePage'
import Carousel from '../page-objects/components/Carousel'
describe('home page is cool',()=>{
    it('home page up and running has functioning carousel and banner',()=>{
        HomePage.checkHeader()
        HomePage.checkFooter()
        HomePage.checkBanner()
        Carousel.checkInitialState()
        Carousel.scrollLeft()
        Carousel.checkAfterScrollLeft
        Carousel.scrollRight()
        Carousel.checkInitialState()
    })
})