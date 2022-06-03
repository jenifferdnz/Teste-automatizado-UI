/// <reference types="cypress" />
import contrato from '../contracts/produtos.contracts'

describe('Testes de Funcionalidade Produtos', () => {
     let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn =>{token = tkn})
    })
 

    it.only('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
        
    });


    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url:'http://localhost:3000/produtos'
        }).then((response) => {
            expect(response.body.produtos[4].nome).to.equal('Produto EBAC 5753735')
            expect(response.status).to.equal(200)
        })
        
    });

    it('Cadastrar produto', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random()* 10000000)}`
        cy.request({
            method:'POST',
            url: 'produtos',
            body:{
                "nome": produto,
                "preco": 3499,
                "descricao": "Curso",
                "quantidade": 200
            },
            headers: {authorization: token}

        }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')  
        })
        
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "produto EBAC 456", "3499", "Curso", "200")
                
        .then((response) =>{
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')  
        })
    });

    it('Deve editar um produto já cadastrado', () => {
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

    it('Deve editar um produto cadastrado previamente', () => {
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