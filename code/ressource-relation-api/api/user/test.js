"use strict";

require("dotenv").config({ path: "../../.env" });
const connectToDatabase = require("../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3006;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// User
describe("user", async () => {
  beforeEach(async () => {
    const { User, sequelize } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await User.create({
          Name: "name " + i,
          Description: "desc " + i,
          PopularityIndex: 55
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /user", () => {
    it("should Get Users", done => {
      chai
        .request(url + port)
        .get("/users")
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

  describe("Post /users", () => {
    it("should Post Users", done => {
      chai
        .request(url + port)
        .post("/users")
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

    it("should not Post Users with null PopularityIndex", done => {
      chai
        .request(url + port)
        .post("/users")
        .send({
          PopularityIndex: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /users/x", () => {
      it("should Get specific users", done => {
        chai
          .request(url + port)
          .get("/users/2")
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
          .get("/users/20")
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
          .get("/users/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /users/x", () => {
      it("should Put specific values in users", done => {
        chai
          .request(url + port)
          .put("/users/8")
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
          .put("/users/8")
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

    describe("Delete /users/x", () => {
      it("should Delete specific users", done => {
        chai
          .request(url + port)
          .delete("/users/8")
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
              .get("/users/8")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      it("should return 404 on inexisting realtion Delete specific users", done => {
        chai
          .request(url + port)
          .delete("/users/55")
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
