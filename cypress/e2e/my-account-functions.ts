import Header from "../page-objects/components/Header"
import MyAccount from "../page-objects/pages/MyAccount"

describe('register, delete account, change passwords and edit user',()=>{

    it('reach home page and click sign up',()=>{
        cy.visit('/')
        Header.signUp('Harry','surelyatestatestatestatestatest@testies.test','password')
        MyAccount.visit()
        MyAccount.changePassword('password','newPassword','newPassword')
        MyAccount.deleteAccount()
    })

})