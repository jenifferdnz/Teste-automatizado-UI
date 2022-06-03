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

    it('Cadastrar usuário com sucesso', () => {
        cy.request({
            method:'POST',
            url: 'usuarios',
            body:{
                "nome": 'Madia Eduarda',
                "email": 'duda2@ebac.com',
                "password": "teste",
                "administrador": "true"
            },
            //headers: {authorization: token}

        }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')  
        })
        
    });

    it.only('Validar um usuário com email inválido', () => {
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
        cy.request('produtos').then(response => {
            let id = response.body.produtos[24]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body:
                {
                    "nome": "PRODUTO 1000",
                    "preco": 299,
                    "descricao": "Novo produto",
                    "quantidade": 109

                }
            }).then(response =>{
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })

    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random()* 10000000)}`
        cy.cadastrarProduto(token, produto, "5000", "Curso", "200")
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: {authorization: token},
                body:
                {
                    "nome": produto,
                    "preco": 2022,
                    "descricao": "Novo produto",
                    "quantidade": 109

                }
            }).then(response =>{
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })


    });

    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random()* 10000000)}`
        cy.cadastrarProduto(token, produto, "5000", "Curso", "200")
        .then(response =>{
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })        
    });
});