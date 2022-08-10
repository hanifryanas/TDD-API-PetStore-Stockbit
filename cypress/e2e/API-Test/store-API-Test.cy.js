describe('store-API-Test', () => {
    const api = Cypress.env('api');
    let token = null;
    it('user login', () => {
        cy.request({
            method: 'GET',
            url: `${api}/user/login`,
            body: {
                username: 'String1',
                password: 'String1'
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Login successful');
            expect(response.body.token).to.not.be.null;
            token = response.body.token;
        })
    })
    it('create new order', () => {
        const body = [{
            id : 1,
            petId : 0,
            quantity : 1,
            shipDate : '2022-12-12',
            status : 'placed',
            complete : false
        }, 
        {
            id : 1,
            petId : 0,
            quantity : 1,
            shipDate : '2022-12-12',
            status : 'placed',
            complete : false
        }, 
        {
            id : 2,
            petId : 0,
            quantity : 1,
            shipDate : null,
            status : 'placed',
            complete : false
        }, 
        {
            id : 2,
            petId : 0,
            quantity : 1,
            shipDate : '2022-12-12',
            status : 'placed',
            complete : false
        }, 
        {
            id : 2,
            petId : 1,
            quantity : 1,
            shipDate : '2022-12-12',
            status : 'placed',
            complete : false
        }] 
        cy.request({
            method: 'POST',
            url: `${api}/store/order`,
            body : body[0],
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq('Order created successfully');
            expect(response.body.order.id).to.eq(body[0].id);
            expect(response.body.order.petId).to.eq(body[0].petId);
            expect(response.body.order.quantity).to.eq(body[0].quantity);
            expect(response.body.order.shipDate).to.contains(body[0].shipDate);
            expect(response.body.order.status).to.eq(body[0].status);
            expect(response.body.order.complete).to.eq(body[0].complete);
        })
        cy.request({
            method: 'POST',
            url: `${api}/store/order`,
            body : body[1],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(409);
            expect(response.body.message).to.eq('Order already exists');
        })
        cy.request({
            method: 'POST',
            url: `${api}/store/order`,
            body : body[2],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input order supplied');
        })
        cy.request({
            method: 'POST',
            url: `${api}/store/order`,
            body : body[3],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('This pet is not available');
        })
        cy.request({
            method: 'POST',
            url: `${api}/store/order`,
            body : body[4],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('Pet not found');
        })
    })
    it('get order by id', () => {
        const params = [1,200]
        cy.request({
            method: 'GET',
            url: `${api}/store/order/${params[0]}`,
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.null
        })
        cy.request({
            method: 'GET',
            url: `${api}/store/order/${params[1]}`,
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('Order not found');
        })
    })
    it('get stock (supposed to be empty)', () => {
        cy.request({
            method: 'GET',
            url: `${api}/store/inventory`,
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('Stock is empty');
        })
    })
    it('delete order', () => {
        const params = [1, 1000];
        cy.request({
            method: 'DELETE',
            url: `${api}/store/order/${params[1]}`,
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('Order not found');
        })
        cy.request({
            method: 'DELETE',
            url: `${api}/store/order/${params[0]}`,
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Order deleted successfully');
        })
    })
    it('set back to default pet status', () => {
        cy.request({
            method: 'PUT',
            url: `${api}/pet`,
            body: {
                id : 0,
                status : 'available'
            },
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Pet updated successfully');
            expect(response.body.pet.status).to.eq('available');
        })
    })
    it('get stock (supposed to be available)', () => {
        cy.request({
            method: 'GET',
            url: `${api}/store/inventory`,
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.null
        })
    })
})