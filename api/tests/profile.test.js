//profile route testing
const app = require('../app.js')
const supertest = require('supertest')
const request = supertest(app)

let cookie;

//before setting endpoints, login and create session
beforeAll(async done => 
{const res = await request.post('/login')
.send({
    user: {
        email: 'FionaHolt@hotmail.com',
        password: 'fi',
    }
})
  
const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
cookie = cookies.join(';');    
done()});

describe('Get Profile Endpoint', () => {

    it('Should return unauthorized', async done => {
        const res = await request.get('/profile')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('Should get member profile', async done => {
        const res = await request.get('/profile').set('Cookie', cookie)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('fname')
        done()
    })
})

describe('Get profile pic', () => {

    it('Should return unauthorized', async done => {
        const res = await request.get('/profilepic')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('Should return 200', async done => {
        const res = await request.get('/profilepic').set('Cookie', cookie)
        expect(res.statusCode).toEqual(200)
        done()
    })
})

describe('Update Profile Endpoint', () => {

    it('Should be unauthorized', async done => {
        const res = await request.post('/profile')
            .send({
                user: {
                    fname: "Fiona",
                    lname: "Wrigley",
                    phone: '0444111111',
                    email: 'FionaHolt@hotmail.com',
                }
            })
            expect(res.statusCode).toEqual(401)
        done()
    })

    it('Invalid fname - should return 422', async done => {
        const res = await request.post('/profile').set('Cookie', cookie)
            .send({
                user: {
                    fname: "1",
                    lname: "Wrigley",
                    phone: '0444111111',
                    email: 'FionaHolt@hotmail.com',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid lname - should return 422', async done => {
        const res = await request.post('/profile').set('Cookie', cookie)
            .send({
                user: {
                    fname: "Fiona",
                    lname: "1",
                    phone: '0444111111',
                    email: 'FionaHolt@hotmail.com',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid phone - should return 422', async done => {
        const res = await request.post('/profile').set('Cookie', cookie)
            .send({
                user: {
                    fname: "Fiona",
                    lname: "Wrigley",
                    phone: '04411111',
                    email: 'FionaHolt@hotmail.com',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid email - should return 422', async done => {
        const res = await request.post('/profile').set('Cookie', cookie)
            .send({
                user: {
                    fname: "Fiona",
                    lname: "Wrigley",
                    phone: '0444111111',
                    email: '',
                }
            })
            expect(res.statusCode).toEqual(422)
        done()
    })

    it('Update with existing email, should return 409', async done => {
        const res = await request.post('/profile').set('Cookie', cookie)
            .send({
                user: {
                    fname: "Fiona",
                    lname: "Wrigley",
                    phone: '0444111111',
                    email: 'suzie@hotmail.com',
                }
            })
            expect(res.statusCode).toEqual(409)
        done()
    })

    it('Should update profile', async done => {
        const res = await request.post('/profile').set('Cookie', cookie)
            .send({
                user: {
                    fname: "Fi",
                    lname: "Wrigley",
                    phone: '0444111111',
                    email: 'FionaHolt@hotmail.com',
                }
            })
            expect(res.statusCode).toEqual(204)
        done()
    })
})