"use strict";

require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = require("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const relationPort = 3014;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// CollectionCollection
describe("relation-collection-collection", async () => {
  beforeEach(async () => {
    const {
      Collection,
      CollectionCollectionRelation,
      sequelize
    } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Collection.create({
          Name: "name " + i,
          Description: "desc " + i
        });
      } catch (err) {
        console.log(err);
      }
    }
    for (let i = 1; i < 10; i++) {
      try {
        await CollectionCollectionRelation.create({
          ParentId: i,
          ChildId: 10 - i
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
        .get("/relations/containers/collection/collection")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              ParentId: 8,
              ChildId: 2
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
        .post("/relations/containers/collection/collection")
        .send({
          ParentId: 6,
          ChildId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            ParentId: 6,
            ChildId: 3
          });
          done();
        });
    });

    it("should not Post Relations with invalid ParentId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/collection/collection")
        .send({
          ParentId: 220,
          ChildId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post Relations with invalid ChildId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/collection/collection")
        .send({
          ParentId: 2,
          ChildId: -1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post Relations with null ChildId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/collection/collection")
        .send({
          ParentId: 2,
          ChildId: null
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
          .get("/relations/containers/collection/2/collection/8")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              ParentId: 2,
              ChildId: 8
            });
            done();
          });
      });

      it("should return 404 on inexistant collection", done => {
        chai
          .request(url + relationPort)
          .get("/relations/containers/collection/20/collection/8")
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
          .get("/relations/containers/collection/2/collection/22")
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
          .get("/relations/containers/collection/2/collection/null")
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
          .put("/relations/containers/collection/8/collection/2")
          .send({
            ParentId: 8,
            ChildId: 2
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              ParentId: 8,
              ChildId: 2
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + relationPort)
          .put("/relations/containers/collection/8/collection/2")
          .send({
            ParentId: 22,
            ChildId: 22
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              ParentId: 8,
              ChildId: 2
            });
            done();
          });
      });
    });

    describe("Delete /relations/x/y", () => {
      it("should Delete specific relations", done => {
        chai
          .request(url + relationPort)
          .delete("/relations/containers/collection/8/collection/2")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              ParentId: 8,
              ChildId: 2
            });
          })
          .catch(function(err) {
            console.log(err);
            done(err);
          })
          .then(function(res) {
            chai
              .request(url + relationPort)
              .get("/relations/containers/collection/8/collection/2")
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
          .delete("/relations/containers/collection/2/collection/2")
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
