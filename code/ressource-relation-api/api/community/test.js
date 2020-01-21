"use strict";

require("dotenv").config({ path: "../../.env" });
const connectToDatabase = require("../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3002;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// Community
describe("community", async () => {
  beforeEach(async () => {
    const { Community, sequelize } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Community.create({
          Name: "name " + i,
          Description: "desc " + i,
          PopularityIndex: 55
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /community", () => {
    it("should Get Communitys", done => {
      chai
        .request(url + port)
        .get("/communitys")
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

  describe("Post /communitys", () => {
    it("should Post Communitys", done => {
      chai
        .request(url + port)
        .post("/communitys")
        .send({
          Name: "a posted name",
          Description: "a posted description",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Name: "a posted name",
            Description: "a posted description",
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should Post Communitys with valid info", done => {
      chai
        .request(url + port)
        .post("/communitys")
        .send({
          Name: "a posted name",
          Description: "a posted description",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Name: "a posted name",
            Description: "a posted description",
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should not Post Communitys with null PopularityIndex", done => {
      chai
        .request(url + port)
        .post("/communitys")
        .send({
          PopularityIndex: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /communitys/x", () => {
      it("should Get specific communitys", done => {
        chai
          .request(url + port)
          .get("/communitys/2")
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
          .get("/communitys/20")
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
          .get("/communitys/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /communitys/x", () => {
      it("should Put specific values in communitys", done => {
        chai
          .request(url + port)
          .put("/communitys/8")
          .send({
            Name: "a posted name",
            Description: "a posted description",
            PopularityIndex: 123
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              Id: 8,
              Name: "a posted name",
              Description: "a posted description",
              PopularityIndex: 123
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + port)
          .put("/communitys/8")
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

    describe("Delete /communitys/x", () => {
      it("should Delete specific communitys", done => {
        chai
          .request(url + port)
          .delete("/communitys/8")
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
              .get("/communitys/8")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      it("should return 404 on inexisting realtion Delete specific communitys", done => {
        chai
          .request(url + port)
          .delete("/communitys/55")
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
