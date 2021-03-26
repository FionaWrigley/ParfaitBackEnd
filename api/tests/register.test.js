//profile route testing
const app = require('../app.js')
const supertest = require('supertest')
const request = supertest(app)

////////////////////register endpoints/////////////////////////
describe('Register Endpoint', () => {

    it('Invalid fname - should return 422', async done => {
        const res = await request.post('/register')
            .send({
                user: {
                    fname: "1",
                    lname: "Stephan",
                    phone: '0444111111',
                    email: 'Lachlan@hotmail.com',
                    password: 'Candyman*1',
                    userType: 'member',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid lname - should return 422', async done => {
        const res = await request.post('/register')
            .send({
                user: {
                    fname: "Lachlan",
                    lname: "1",
                    phone: '0444111111',
                    email: 'Lachlan@hotmail.com',
                    password: 'Candyman*1',
                    userType: 'member',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid phone - should return 422', async done => {
        const res = await request.post('/register')
            .send({
                user: {
                    fname: "Lachlan",
                    lname: "Stephan",
                    phone: '04441111f',
                    email: 'Lachlan@hotmail.com',
                    password: 'Candyman*1',
                    userType: 'member',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
   })

   it('Invalid Email - should return 422', async done => {
    const res = await request.post('/register')
        .send({
            user: {
                fname: "Lachlan",
                lname: "Stephan",
                phone: '0444111111',
                email: 'Lachlanhotmail.com',
                password: 'Candyman*1',
                userType: 'member',
            }
        })
        expect(res.statusCode).toEqual(422)
    done()
})

it('Weak Password - should return 422', async done => {
    const res = await request.post('/register')
        .send({
            user: {
                fname: "Lachlan",
                lname: "Stephan",
                phone: '0444111111',
                email: 'Lachlanhotmail.com',
                password: 'Candy',
                userType: 'member',
            }
        })
        expect(res.statusCode).toEqual(422)
    done()
})

it('No Password - should return 422', async done => {
    const res = await request.post('/register')
        .send({
            user: {
                fname: "Lachlan",
                lname: "Stephan",
                phone: '0444111111',
                email: 'Lachlanhotmail.com',
                password: '',
                userType: 'member',
            }
        })
        expect(res.statusCode).toEqual(422)
    done()
})

it('Email already in use - should return 409', async done => {
    const res = await request.post('/register')
        .send({
            user: {
                fname: "Fiona",
                lname: "Wrigley",
                phone: '0444111111',
                email: 'FionaHolt@hotmail.com',
                password: 'Candyman*1',
                userType: 'member',
            }
        })
        expect(res.statusCode).toEqual(409)
    done()
})
    it('Should register successfully', async done => {
        const res = await request.post('/register')
            .send({
                user: {
                    fname: "Lachlan",
                    lname: "Stephan",
                    phone: '0444111111',
                    email: 'Lachlan@hotmail.com',
                    password: 'Candyman*1',
                    userType: 'member',
                }
            })
            expect(res.statusCode).toEqual(204)
        done()
    })
})