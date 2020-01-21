"use strict";

require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = require("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const relationPort = 3003;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// CollectionResource
describe("relation-collection-resource", async () => {
  beforeEach(async () => {
    const {
      Collection,
      Resource,
      CollectionResourceRelation,
      sequelize
    } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Collection.create({
          Title: "title " + i,
          Description: "desc " + i
        });
      } catch (err) {
        console.log(err);
      }
      try {
        await Resource.create({
          Title: "title " + i,
          Description: "desc " + i,
          ResourceUrl: "url" + i,
          PopularityIndex: i
        });
      } catch (err) {
        console.log(err);
      }
    }
    for (let i = 1; i < 10; i++) {
      try {
        await CollectionResourceRelation.create({
          CollectionId: i,
          ResourceId: 10 - i
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /relations", () => {
    it("should Get Relations", done => {
      chai
        .request(url + relationPort)
        .get("/collectionResourceRelations")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              CollectionId: 8,
              ResourceId: 2
            }
          ]);
          done();
        });
    });
  });

  describe("Post /relations", () => {
    it("should Post Relations", done => {
      chai
        .request(url + relationPort)
        .post("/collectionResourceRelations")
        .send({
          CollectionId: 6,
          ResourceId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CollectionId: 6,
            ResourceId: 3
          });
          done();
        });
    });

    it("should not Post Relations with invalid CollectionId", done => {
      chai
        .request(url + relationPort)
        .post("/collectionResourceRelations")
        .send({
          CollectionId: 220,
          ResourceId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post Relations with invalid ResourceId", done => {
      chai
        .request(url + relationPort)
        .post("/collectionResourceRelations")
        .send({
          CollectionId: 2,
          ResourceId: -1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post Relations with null ResourceId", done => {
      chai
        .request(url + relationPort)
        .post("/collectionResourceRelations")
        .send({
          CollectionId: 2,
          ResourceId: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /relations/x/y", () => {
      it("should Get specific relations", done => {
        chai
          .request(url + relationPort)
          .get("/collectionResourceRelations/2/8")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CollectionId: 2,
              ResourceId: 8
            });
            done();
          });
      });

      it("should return 404 on inexistant collection", done => {
        chai
          .request(url + relationPort)
          .get("/collectionResourceRelations/20/8")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it("should return 404 on inexistant resource", done => {
        chai
          .request(url + relationPort)
          .get("/collectionResourceRelations/2/22")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it("should return 404 on invalid url", done => {
        chai
          .request(url + relationPort)
          .get("/collectionResourceRelations/2/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /relations/x/y", () => {
      it("should Put specific values in relations", done => {
        chai
          .request(url + relationPort)
          .put("/collectionResourceRelations/8/2")
          .send({
            CollectionId: 8,
            ResourceId: 2
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CollectionId: 8,
              ResourceId: 2
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + relationPort)
          .put("/collectionResourceRelations/8/2")
          .send({
            CollectionId: 22,
            ResourceId: 22
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CollectionId: 8,
              ResourceId: 2
            });
            done();
          });
      });
    });

    describe("Delete /relations/x/y", () => {
      it("should Delete specific relations", done => {
        chai
          .request(url + relationPort)
          .delete("/collectionResourceRelations/8/2")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CollectionId: 8,
              ResourceId: 2
            });
          })
          .catch(function(err) {
            console.log(err);
            done(err);
          })
          .then(function(res) {
            chai
              .request(url + relationPort)
              .get("/collectionResourceRelations/8/2")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      it("should return 404 on inexisting realtion Delete specific relations", done => {
        chai
          .request(url + relationPort)
          .delete("/collectionResourceRelations/2/2")
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
