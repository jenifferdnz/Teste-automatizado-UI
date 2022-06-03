/// <reference types="cypress" />

describe('Deve fazer login com sucesso', () => {

    it('Deve fazer login', () => {
        cy.request({
            method: 'POST',
            url:'localhost:3000/login',
            body: {
                "email": "n",
                "password": "teste"
             }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })
    
    });
    
});