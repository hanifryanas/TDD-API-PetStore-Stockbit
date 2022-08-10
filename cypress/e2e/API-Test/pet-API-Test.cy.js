describe('pet-API-Test', () => {
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
    it('create new pet', () => {
        const body = {
            id : 1,
            name: 'String1',
            category: {
                id: 1,
                name: 'String1'
            },
            photoUrls : ['String1'],
            tags: [
                {
                    id: 1,
                    name: 'String1'
                }
            ],
            status : 'available'
        };
        cy.request({
            method: 'POST',
            url: `${api}/pet`,
            body : body,
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq('Pet created successfully');
            expect(response.body.pet.name).to.eq('String1');
            expect(response.body.pet.category.name).to.eq('String1');
            expect(response.body.pet.tags[0].name).to.eq('String1');
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet`,
            body : body,
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(409);
            expect(response.body.message).to.eq('Pet already exists');
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet`,
            body : body,
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('No token provided');
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet`,
            body : {
                id : 1,
                name: null,
                photoUrls : ['String1'],
                tags: [
                    {
                        id: 1,
                        name: 'String1'
                    }
                ],
                status : 'available'
            },
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input pet supplied');
        })
    })
    it('update pet name and status', () => {
        const params = [1,20];
        const body = [{
            status : 'sold'
        },
        {
            name : 11,
            status : 'available'
        }]
        cy.request({
            method: 'POST',
            url: `${api}/pet/${params[0]}`,
            body : body[0],
            headers: {
                'Authorization': token
            },
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Pet updated successfully');
            expect(response.body.pet.status).to.eq(body[0].status);
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet/${params[1]}`,
            body : body[0],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('Pet not found');
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet/${params[0]}`,
            body : body[1],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input pet supplied');
        })
    })
    it('upload pet images', () => {
        const params = [1,20];
        const body = [{
        },
        {
            photoUrls : ['String2', 'String3']
        }]
        cy.request({
            method: 'POST',
            url: `${api}/pet/${params[0]}/uploadImage`,
            body : body[1],
            headers: {
                'Authorization': token
            },
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Pet image uploaded successfully');
            expect(response.body.pet.photoUrls).to.contain(body[1].photoUrls[0]);
            expect(response.body.pet.photoUrls).to.contain(body[1].photoUrls[1]);
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet/${params[0]}/uploadImage`,
            body : body[0],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input pet supplied');
        })
        cy.request({
            method: 'POST',
            url: `${api}/pet/${params[1]}/uploadImage`,
            body : body[1],
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
    it('update pet', () => {
        const body = [{
            id : 1,
            name: 'String1',
            category: {
                id: 1,
                name: 'String1'
            },
            photoUrls : ['String1'],
            tags: [
                {
                    id: 1,
                    name: 'String1'
                }
            ],
            status : 'available'
        },{},{id:20, name : 'String20'}]
        cy.request({
            method: 'PUT',
            url: `${api}/pet`,
            body : body[0],
            headers: {
                'Authorization': token
            },
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Pet updated successfully');
            expect(response.body.pet.name).to.eq(body[0].name);
            expect(response.body.pet.category.name).to.eq(body[0].category.name);
            expect(response.body.pet.tags[0].name).to.eq(body[0].tags[0].name);
        })
        cy.request({
            method: 'PUT',
            url: `${api}/pet`,
            body : body[1],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input pet supplied');
        })
        cy.request({
            method: 'PUT',
            url: `${api}/pet`,
            body : body[2],
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
    it('delete pet by id', () => {
        const params = [1, 2];
        cy.request({
            method: 'DELETE',
            url: `${api}/pet/${params[1]}`,
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('Pet not found');
        })
        cy.request({
            method: 'DELETE',
            url: `${api}/pet/${params[0]}`,
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Pet deleted successfully');
        })
    })
})