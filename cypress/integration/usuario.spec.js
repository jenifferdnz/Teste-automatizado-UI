/// <reference types="cypress" />
import contrato from '../contracts/login.contracts'

describe('Testes de Funcionalidade Produtos', () => {
     let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn =>{token = tkn})
    })
 

    it('Deve validar contrato de usuário', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
        
    });


    it('Listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url:'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.body).to.have.property('quantidade')
        })
    });

    it.only('Cadastrar usuário com sucesso', () => {
        var faker = require('faker-br')
        const email = faker.internet.email()

        cy.request({
            method:'POST',
            url: 'usuarios',
            body:{
                "nome": 'Maria Ebac',
                "email": email,
                "password": "teste",
                "administrador": "true"
            },
            //headers: {authorization: token}

        }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')  
        })
        
    });

    it('Validar um usuário com email inválido', () => {
        cy.request({
            failOnStatusCode: false,
            method:'POST',
            url: 'usuarios',
            body:{
                "nome": 'Madia Eduarda',
                "email": 'duda2ebac.com',
                "password": "teste",
                "administrador": "true"
            },
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.email).to.equal("email deve ser um email válido")  
        })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        cy.request('usuarios').then(response => { 
            var id = response.body.usuarios[1]._id
            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                headers: {authorization: token},
                body:
                {
                    "nome": "Nome user Editado",
                    "email": "duda44@ebac.com",
                    "password": "teste",
                    "administrador": "true"

                }
            }).then(response =>{
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })

    });

    it.only('Deve deletar um usuário previamente cadastrado', () => {

        cy.request('usuarios').then(response => {
            var id = response.body.usuarios[1]._id
            cy.request({
                method: 'DELETE', 
                url: `usuarios/${id}`, 
                
            }).then(response => {
                expect(response.body.message).to.equal("Registro excluído com sucesso")
                expect(response.status).to.equal(200)
            })
        })
    })
        
});