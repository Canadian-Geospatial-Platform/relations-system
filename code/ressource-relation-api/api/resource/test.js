require("dotenv").config({ path: "../../.env" });
import connectToDatabase from "../../utils/db";
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3004;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// Resource
describe("resource", async () => {
  beforeEach(async () => {
    const { Resource, sequelize } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Resource.create({
          Title: "name " + i,
          Description: "desc " + i,
          ResourceUrl: "www.test.ca",
          PopularityIndex: 55
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /resource", () => {
    it("should Get Resources", done => {
      chai
        .request(url + port)
        .get("/resources")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              Id: 8
            }
          ]);
          done();
        });
    });
  });

  describe("Post /resources", () => {
    it("should Post Resources", done => {
      chai
        .request(url + port)
        .post("/resources")
        .send({
          Title: "a posted title",
          Description: "a posted description",
          ResourceUrl: "a posted url",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Title: "a posted title",
            Description: "a posted description",
            ResourceUrl: "a posted url",
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should not Post Resources with null PopularityIndex", done => {
      chai
        .request(url + port)
        .post("/resources")
        .send({
          PopularityIndex: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /resources/x", () => {
      it("should Get specific resources", done => {
        chai
          .request(url + port)
          .get("/resources/2")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              Id: 2
            });
            done();
          });
      });

      it("should return 404 on inexistant community", done => {
        chai
          .request(url + port)
          .get("/resources/20")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it("should return 404 on invalid url", done => {
        chai
          .request(url + port)
          .get("/resources/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /resources/x", () => {
      it("should Put specific values in resources", done => {
        chai
          .request(url + port)
          .patch("/resources/8")
          .send({
            Title: "a posted title",
            Description: "a posted description",
            PopularityIndex: 123
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              Id: 8,
              Title: "a posted title",
              Description: "a posted description",
              PopularityIndex: 123
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + port)
          .patch("/resources/8")
          .send({
            Id: 22
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              Id: 8
            });
            done();
          });
      });
    });

    describe("Delete /resources/x", () => {
      it("should Delete specific resources", done => {
        chai
          .request(url + port)
          .delete("/resources/8")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              Id: 8
            });
          })
          .catch(function(err) {
            console.log(err);
            done(err);
          })
          .then(function(res) {
            chai
              .request(url + port)
              .get("/resources/8")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      it("should return 404 on inexisting realtion Delete specific resources", done => {
        chai
          .request(url + port)
          .delete("/resources/55")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });
  });
});
