"use strict";

require("dotenv").config({ path: "../../.env" });
const connectToDatabase = require("../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3001;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// Collection
describe("collection", async () => {
  beforeEach(async () => {
    const { Collection, sequelize } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Collection.create({
          Title: "name " + i,
          Description: "desc " + i,
          PopularityIndex: 55
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /collection", () => {
    it("should Get Collections", done => {
      chai
        .request(url + port)
        .get("/collections")
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

  describe("Post /collections", () => {
    it("should Post Collections", done => {
      chai
        .request(url + port)
        .post("/collections")
        .send({
          Title: "a posted title",
          Description: "a posted description",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Title: "a posted title",
            Description: "a posted description",
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should Post Collections with valid info", done => {
      chai
        .request(url + port)
        .post("/collections")
        .send({
          Title: "a posted title",
          Description: "a posted description",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Title: "a posted title",
            Description: "a posted description",
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should not Post Collections with null PopularityIndex", done => {
      chai
        .request(url + port)
        .post("/collections")
        .send({
          PopularityIndex: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /collections/x", () => {
      it("should Get specific relations", done => {
        chai
          .request(url + port)
          .get("/collections/2")
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
          .get("/collections/20")
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
          .get("/collections/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /collections/x", () => {
      it("should Put specific values in relations", done => {
        chai
          .request(url + port)
          .put("/collections/8")
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
          .put("/collections/8")
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

    describe("Delete /collections/x", () => {
      it("should Delete specific relations", done => {
        chai
          .request(url + port)
          .delete("/collections/8")
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
              .get("/collections/8")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      it("should return 404 on inexisting realtion Delete specific relations", done => {
        chai
          .request(url + port)
          .delete("/collections/55")
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
