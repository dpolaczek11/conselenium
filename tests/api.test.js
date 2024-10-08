import pkg from 'pactum';
const { spec } = pkg;
import { expect, use } from "chai";
import { baseUrl, userID, secretPassword, user } from '../helpers/data.js';

let token;

describe("API tests", () => {
    it.skip("first test", async () => {
        const response = await spec()
            .get(`${baseUrl}/BookStore/v1/Books`);
        expect(response.statusCode).to.eql(200);
        expect(response.body.books[0].title).to.eql("Git Pocket Guide");
        expect(response.body.books[4].author).to.eql("Kyle Simpson");
    })

    it.skip("create account", async () => {
        const response = await spec()
            .post(`${baseUrl}/Account/v1/User`)
            .withBody({
                userName: user,
                password: secretPassword,
            });
            expect(response.statusCode).to.eql(201);
            
    })

    it("generate token", async () => {
        const response = await spec()
          .post(`${baseUrl}/Account/v1/GenerateToken`)
          .withBody({
            userName: user,
            password: secretPassword,
          });
          expect(response.statusCode).to.eql(200);
          token = response.body.token;
         // console.log(token);
          
    })

    it("get user id", async () => {
        const response = await spec()
        .get(`${baseUrl}/Account/v1/User/${userID}`)
        .withBearerToken(token)
        expect(response.statusCode).to.eql(200);
          
    })

    it("add book", async () => {
        const response = await spec()
        .post(`${baseUrl}/BookStore/v1/Books`)
        .withBearerToken(token)
        .withBody({
            "userId": userID,
            "collectionOfIsbns": [
                {
                 "isbn": "9781449325862",
                 "isbn": "9781449331818",
                 "isbn": "9781449337711"
                }
            ] 
        })
        
        expect(response.statusCode).to.eql(201);
          
    })

    it("delete book", async () => {
        const response = await spec()
        .delete(`${baseUrl}/BookStore/v1/Book`)
        .withBearerToken(token)
        .withBody({
            "isbn": "9781449331818",
            "userId": userID
        })
        //.inspect()
        
        expect(response.statusCode).to.eql(204);
          
    })

    it("delete all books", async () => {
        const response = await spec()
        .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userID}`)
        .withBearerToken(token)
        
        //.inspect()
        
        expect(response.statusCode).to.eql(204);
          
    })

});