const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

//assertion style
chai.should();

chai.use(chaiHttp);

describe('GET /reports', () => {
    it("It should GET the report",(done) => {
        chai.request(server)
            .get("/reports")
            .end((err,response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');  
            done();
            });
    });
    
}) 

describe('POST /reports', () => {
    it("It should POST the report",(done) => {
        const task = {
            "userID": "user-1",
            "marketID": "market-1",
            "marketName": "Vashi Navi Mumbai",
            "cmdtyID": "cmdty-1",
            "marketType": "Mandi",
            "cmdtyName": "Potato",
            "priceUnit": "Pack",
            "convFctr": 50,
            "price": 700
          }        
        chai.request(server)
            .post('/reports')
            .send(task)
            .end((err,response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('status').eq('success');
                response.body.should.have.property('reportID');
            done();
            });
    });
    
});