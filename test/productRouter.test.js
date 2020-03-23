// jest är en kombination av mocha och chai = assertion och execute 
// supertest = intergration test
// chai brukar kolla upp expected värde
// execute = mocha 

const app = require("../index");
const productRouter = require("../router/productRouter");
const request = require("supertest");

describe("home router testing", () => {
    it("tests home router", (done) => {
        request(app).get("/").expect(200).expect("Welcome user", done);
    });
});

describe("createProduct router testing", () =>{
    it("testing create product router", (done) => {
        request(productRouter).get("/createProduct")
        .send({})
        .expect(200)
        done()
    });
    it("post req product create testing", (done) => {
        request(productRouter).get("/createProduct")
        .then(res => {
            const body = res.body
            expect(body).toHaveProperty("_id");
            // expect(body).to.contain.property("name");
        })
        .catch(err => done(err))
        done();
    });
});