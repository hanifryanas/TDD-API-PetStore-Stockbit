describe('user-API-Test', () => {
    const api = Cypress.env('api');
    let token = null;
    it('create new user', () => {
        const body = [{
            id : 2,
            username : "String2",
            firstName : "String2",
            lastName: "String2",
            email: "String2",
            password: "String2",
            phone : "String2",
            userStatus: true
        },
        {
            id : 2,
            username : "String2",
            firstName : "String2",
            lastName: "String2",
            email: "String2",
            password: "String2",
            phone : "String2",
            userStatus: true
        },
        {
            id : 3,
            username : "Str3",
            firstName : "String3",
            lastName: "String3",
            email: "String3",
            password: "String3",
            phone : "String3",
            userStatus: true
        }]
        cy.request({
            method: 'POST',
            url: `${api}/user`,
            body: body[0]
        }).
        then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.username).to.eq(body[0].username);
        })
        cy.request({
            method: 'POST',
            url: `${api}/user`,
            body: body[1],
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(409);
            expect(response.body.message).to.eq('Username already exists');
        })
        cy.request({
            method: 'POST',
            url: `${api}/user`,
            body: body[2],
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input user supplied');
        })
    })
    it('get user by username', () => {
        let firstUsername = 'String2';
        let secondUsername = 'string3';
        cy.request({
            method: 'GET',
            url: `${api}/user/${firstUsername}`,
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.username).to.eq(firstUsername);
        })
        cy.request({
            method: 'GET',
            url: `${api}/user/${secondUsername}`,
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('User not found');
        })
    });
    it('user login', () => {
        let firstUsername = 'String2';
        let firstPassword = 'String2';
        let secondUsername = 'string3';
        let secondPassword = 'string3';
        const body = [
            {
                username: firstUsername,
                password: firstPassword
            },
            {
                username: secondUsername,
                password: firstPassword
            },
            {
                username: firstUsername,
                password: secondPassword
            }
        ]
        cy.request({
            method: 'GET',
            url: `${api}/user/login`,
            body: body[0]
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Login successful');
            expect(response.body.token).to.not.be.null;
            token = response.body.token;
        })
        cy.request({
            method: 'GET',
            url: `${api}/user/login`,
            body: body[1],
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body.message).to.eq('User not found');
        })
        cy.request({
            method: 'GET',
            url: `${api}/user/login`,
            body: body[2],
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('Wrong password');
        })
    });
    it('user logout', () => {
        cy.request({
            method: 'GET',
            url: `${api}/user/logout`
        })
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Logout successful');
            expect(response.body.token).to.be.null;
        })
    })
    it('update user by username', () => {
        const params = ['String2', 'String1'];
        const body = [{
            id : 2,
            username : "String2",
            firstName : "String22",
            lastName: "String2",
            email: "String2",
            password: "String2",
            phone : "String2",
            userStatus: true
        },
        {
            id : 2,
            username : "String2",
            firstName : "String22",
            lastName: null,
            email: "String2",
            password: "String2",
            phone : "String2",
            userStatus: true
        }]
        cy.request({
            method: 'PUT',
            url: `${api}/user/${params[0]}`,
            body: body[0],
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('User updated');
        })
        cy.request({
            method: 'PUT',
            url: `${api}/user/${params[0]}`,
            body: body[0],
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('No token provided');
        })
        cy.request({
            method: 'PUT',
            url: `${api}/user/${params[1]}`,
            body: body[0],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('Invalid token');
        })
        cy.request({
            method: 'PUT',
            url: `${api}/user/${params[0]}`,
            body: body[1],
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(405);
            expect(response.body.message).to.eq('Invalid input user supplied');
        })
    })
    it('delete user by username', () => {
        const params = ['String2', 'String1'];
        cy.request({
            method: 'DELETE',
            url: `${api}/user/${params[1]}`,
            headers: {
                'Authorization': token
            },
            failOnStatusCode: false
        }).
        then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('Invalid token');
        })
        cy.request({
            method: 'DELETE',
            url: `${api}/user/${params[0]}`,
            headers: {
                'Authorization': token
            }
        }).
        then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('User deleted');
        })
    })
})