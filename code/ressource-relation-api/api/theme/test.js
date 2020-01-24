"use strict";

require("dotenv").config({ path: "../../.env" });
const connectToDatabase = require("../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3016;
const communityPort = 3002;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// Theme
describe("theme", async () => {
  beforeEach(async () => {
    const { Theme, Community, sequelize } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Community.create({
          Name: "name " + i,
          Description: "desc " + i,
          PopularityIndex: 55
        });
        await Theme.create({
          Title: "theme name " + i,
          Description: "theme desc " + i,
          PopularityIndex: 55,
          CommunityId: i
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /theme", () => {
    it("should Get Themes", done => {
      chai
        .request(url + port)
        .get("/themes")
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

  describe("Post /themes", () => {
    it("should Post Themes", done => {
      chai
        .request(url + port)
        .post("/themes")
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

    it("should not Post Themes with null PopularityIndex", done => {
      chai
        .request(url + port)
        .post("/themes")
        .send({
          PopularityIndex: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /themes/x", () => {
      it("should Get specific themes", done => {
        chai
          .request(url + port)
          .get("/themes/2")
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

      it("should return 404 on inexistant theme", done => {
        chai
          .request(url + port)
          .get("/themes/20")
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
          .get("/themes/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /themes/x", () => {
      it("should Put specific values in themes", done => {
        chai
          .request(url + port)
          .put("/themes/8")
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
          .put("/themes/8")
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

    describe("Delete /themes/x", () => {
      it("should Delete specific themes", done => {
        chai
          .request(url + port)
          .delete("/themes/8")
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
              .get("/themes/8")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      describe("Delete /Community/x", () => {
        it("a theme should be deleted on community deletion", done => {
          chai
            .request(url + communityPort)
            .delete("/communities/8")
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
                .get("/themes")
                .end((err, res) => {
                  if (err) done(err);
                  expect(res.body).to.be.an("array");
                  expect(res.body).not.to.containSubset([
                    {
                      CommunityId: 8
                    }
                  ]);
                  done();
                });
            });
        });
      });

      it("should return 404 on inexisting realtion Delete specific themes", done => {
        chai
          .request(url + port)
          .delete("/themes/55")
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
