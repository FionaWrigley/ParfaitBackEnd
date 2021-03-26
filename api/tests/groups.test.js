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


describe('Get Group Endpoint', () => {
    it('Should be unauthorized', async done => {
        const res = await request.get('/groups')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('Should return groups', async done => {
        const res = await request.get('/groups').set('Cookie', cookie)
        expect(res.statusCode).toEqual(200)
        done()
    })
})

describe('Create Group Endpoint', () => {

    it('Get user list - should return unauthorized', async done => {
        const res = await request.get('/users/Bob')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('Get user list - search for current user - should return empty', async done => {
        const res = await request.get('/users/Fiona').set('Cookie', cookie)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toStrictEqual([]);
        done()
    })

    it('Get user list - valid search should return 200 and user details', async done => {
        const res = await request.get('/users/Penny').set('Cookie', cookie).set('Accept', 'application/json');
        expect(res.statusCode).toEqual(200)
        expect(res.body).toStrictEqual([{"email": "penny@fakeemail.com", "fname": "Penny", "lname": "Showman", "memberID": 24, "password": "nJad30VAeePUOZc7urY+piM+QIc=", "phone": "0444444422", "profilePic": null, "profilePicPath": "", "userType": "Member"}]);
        done()
    })

    it('Create group, should return unauthorized', async done => {
        const res = await request.post('/creategroup')
        .send({
            group: {
                name: "John's javascripters",
                description: 'A bunch of rogue programmers',
                members: [{
                    memberID: '21',
                    fname: 'Fiona',
                    lname: 'Wrigley'
                },
                {
                    memberID: '19',
                    fname: 'Bob',
                    lname: 'Jane'
                }]
            }
        })
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('Invalid group - should return 422', async done => {
        const res = await request.post('/creategroup').set('Cookie', cookie)
        .send({
            group: {
                name: "",
                description: 'A bunch of rogue programmers',
                members: [{
                    memberID: '21',
                    fname: 'Fiona',
                    lname: 'Wrigley'
                },
                {
                    memberID: '19',
                    fname: 'Bob',
                    lname: 'Jane'
                }]
            }
        })
        expect(res.statusCode).toEqual(422)
        done()
    })

    it('Should create new group', async done => {
        const res = await request.post('/creategroup').set('Cookie', cookie)
        .send({
            group: {
                name: "John's javascripters",
                description: 'A bunch of rogue programmers',
                members: [{
                    memberID: '21',
                    fname: 'Fiona',
                    lname: 'Wrigley'
                },
                {
                    memberID: '19',
                    fname: 'Bob',
                    lname: 'Jane'
                }]
            }
        })
        expect(res.statusCode).toEqual(200)
        done()
    })
})

describe('Group Schedule', () => {
    
    it('Get group sched - should be unathorized', async done => {
        const res = await request.get('/groupschedule/65/2021-03-22/7')
        expect(res.statusCode).toEqual(401)
        done()
    })

    it('Invalid groupID - Should return 422', async done => {
        const res = await request.get('/groupschedule/f/2021-03-22/7').set('Cookie', cookie)
        expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid date - Should return 422', async done => {
        const res = await request.get('/groupschedule/65/2021-22/7').set('Cookie', cookie)
        expect(res.statusCode).toEqual(422)
        done()
    })

    it('Invalid number of days - Should return 422', async done => {
        const res = await request.get('/groupschedule/65/2021-22/f').set('Cookie', cookie)
        expect(res.statusCode).toEqual(422)
        done()
    })

    it('Should return groups', async done => {
        const res = await request.get('/groupschedule/65/2021-03-22/7').set('Cookie', cookie)
        expect(res.statusCode).toEqual(200)
        done()
    })
})

   
