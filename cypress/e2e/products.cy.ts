import {Products} from '../page-objects/pages/Products'

describe('product pages work',()=>{
    it('products load on all products',()=>{
        let product =new Products('all');
        product.visit()
        product.checkProducts()
    })
    it('displays correct message without products all',()=>{
    
        let product = new Products('all')
        product.interceptGet()
        product.visit()
        product.checkNoProducts()

    })

    it('products load mushrooms',()=>{
        let product =new Products('mushrooms');
        product.visit()
        product.checkProducts()
    })
    it('displays correct message without products mushrooms',()=>{
        
        let product = new Products('mushrooms')
        product.interceptGet()
        product.visit()
        product.checkNoProducts()

    })
    it('products load equipment',()=>{
        let product =new Products('equipment');
        product.visit()
        product.checkProducts()
    })
    it('displays correct message without products equipment',()=>{
    
        let product = new Products('equipment')
        product.interceptGet()
        product.visit()
        product.checkNoProducts()

    })

    it('products load mycological supplies',()=>{
        let product =new Products('mycological-supplies');
        product.visit()
        product.checkProducts()
    })
    it('displays correct message without products mycological supplies',()=>{
        
        let product = new Products('mycological-supplies')
        product.interceptGet()
        product.visit()
        product.checkNoProducts()

    })
})