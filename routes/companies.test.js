process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
let testInvoices

beforeEach( async () => {
    const result = await db.query(`
    INSERT INTO companies (code,name, description) 
    VALUES ('guava','Guava', 'makes iphones and computers') 
    RETURNING code, name, description`);
    testCompany = result.rows[0];
    const result2 = await db.query(`
    INSERT INTO invoices (comp_Code, amt, paid, paid_date)
    VALUES ('guava', 100, false, null) 
    RETURNING comp_Code, amt, paid, paid_date`);
    testInvoices = result2.rows[0];
    
})

afterEach( async () =>{
    
    await db.query('DELETE FROM companies')})

afterAll( async () => { await db.end()})


// describe("testing test-Company", ()=>{
//     test("Company", ()=>{
//         console.log(testCompany);


//     })
//     expect(1).toBe(1);
// })


//  GET /companies returns  all companies

describe("GET /companies", () => {

    test("Get a list with one company", async ()=>{
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        
        expect(res.body).toEqual({companies:[testCompany]})
    })
})

//  GET /companies returns  all companies

describe("GET /companies/:id", () => {


    test("Get a single Company", async ()=>{
        const res = await request(app).get(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        testCompany.invoices = testInvoices
        // console.log(JSON.stringify(res.body, null, 2));
        // console.log({code:testCompany.code, name:testCompany.name,description:testCompany.description, invoices:{amt:testInvoices.amt, comp_code:testInvoices.comp_code, paid:testInvoices.paid, paid_date:testInvoices.paid_date}})

        expect(res.body).toEqual({"company": {"company": {"code": "guava", "description": "makes iphones and computers", "invoices": [expect.any(Number)], "name": "Guava"}}})
    })
})

describe("POST /companies creates a single Company", ()=>{
    test("Creates a single Company", async ()=>{
        const res = await request(app).post(`/companies`).send({code:'pear', name:"Pear", description:"makes pear computers"});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ company:{code: 'pear', name:"Pear",description:"makes pear computers"}}
        );
        })


} )

describe("PATCH /companies updates a single company", ()=>{
    test("Updates a single company", async ()=>{
        const res = await request(app).patch(`/companies/${testCompany.code}`).send({name:"bananas", description:"make banana computers"});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ company:{code: testCompany.code, name:"bananas",description:"make banana computers"}}
        );
        })


} )

describe("DELETE /companies updates a single Company", ()=>{
    test("Deletes a single Company", async ()=>{
        const res = await request(app).delete(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({status:"deleted"})
        })


} )