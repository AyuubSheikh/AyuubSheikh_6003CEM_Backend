const app = require('./index.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Messages Endpoints', () => {

    it('should get all new messages', async () => {
        const res = await requestWithSupertest.get('/messages/');
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body));
    });

    it('should get history of all messages', async () => {
        const res = await requestWithSupertest.get('/messages/history');
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body));
    });

    it('should create new message', async () => {
        const res = await requestWithSupertest
            .post('/messages/')
            .send({
                senderId: `6193eddf70b5e94decd80997`,
                message: `Test message from jest`,
                date: Date.now()
            });

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("_id");
    });

    it('should create a reply to a message', async () => {
        const res = await requestWithSupertest
            .post('/messages/reply')
            .send({
                messageId: `6194ae82242e7e6100046ea1`,
                repliedBy: `6192af7b40dee40418a916d0`,
                reply: `Reply message from jest`,
                dateReplied: Date.now()
            });

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("_id");
    });
});

describe('Class Endpoints', () => {

    it('should get all classes', async () => {
        const res = await requestWithSupertest
            .post('/classes/find')
            .send({
                keyword: ``
            });
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body));
    });

    it('should create a new class', async () => {
        const res = await requestWithSupertest
            .post('/classes/')
            .send({
                title: `Class from Jest`, 
                description: `This class is created using jest testing`
            });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("_id");
    });

    it('should update a class', async () => {
        const res = await requestWithSupertest
            .post(`/classes/update/6194b013bec34715d8df1d29`)
            .send({
                title: `Class from Jest e`, 
                description: `This class is created using jest testing ee`
            });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("_id");
    });
});

describe('Users Endpoints', () => {

    it('should create a new user signup request', async () => {
        const res = await requestWithSupertest
            .post('/users/signup')
            .send({
                name: "Jest User",
                address: "Jest address",
                email: "user@jest.com",
                password: "admin",
                goal: "Boxing",
                experienced: "Yes",
                paymentTitle: "Jest User",
                paymentNumber: "123456789",
                paymentCvv: "123",
                history: "None",
                type: 2,
                active: false
            });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("_id");
    });

    it('should login for a existing user', async () => {
        const res = await requestWithSupertest
            .post('/users/login')
            .send({
                email: "user@jest.com",
                password: "admin"
            });
        expect(res.status).toEqual(400);
        expect(res.body.user).toHaveProperty("_id");
        expect(res.body.user.active).toEqual(false);
    });
    
});