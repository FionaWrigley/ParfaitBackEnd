const app = require('../app.js')
const supertest = require('supertest')
const request = supertest(app)

let cookie;

///login tests/////////////////////////////////////////////////////////
describe('Login Endpoint', () => {

    it('Should log in', async done => {
        const res = await request.post('/login')
            .send({
                user: {
                    email: 'FionaHolt@hotmail.com',
                    password: 'fi',
                }
            })
            expect(res.statusCode).toEqual(204)
              
            const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
            cookie = cookies.join(';');
                    
        done()
    })

    it('Should be invalid input', async done => {
        const res = await request.post('/login')
            .send({
                user: {
                    email: 'FionaHolt@hotmail.com',
                    password: '',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })
    it('Should be invalid input', async done => {
        const res = await request.post('/login')
            .send({
                user: {
                    email: '',
                    password: '',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Should be invalid input', async done => {
        const res = await request.post('/login')
            .send({
                user: {
                    email: '',
                    password: 'werwer',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Should be unauthorized', async done => {
        const res = await request.post('/login')
            .send({
                user: {
                    email: 'FionaHolt@hotmail.com',
                    password: 'werwer',
                }
            })
            expect(res.statusCode).toEqual(401)
        done()
    })
})

describe('Logout Endpoint', () => {
    it('Should be successful', async done => {
        const res = await request.get('/logout').set('Cookie', cookie);
            expect(res.statusCode).toEqual(204)
        done()
    })
})