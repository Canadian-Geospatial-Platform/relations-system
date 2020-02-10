require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = import("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const relationPort = 3021;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// TagResource
describe("relation-tag-resource", async () => {
  beforeEach(async () => {
    const { Tag, Resource, TagResourceRelation, sequelize } = connectToDatabase;

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Tag.create({
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
        await TagResourceRelation.create({
          TagId: i,
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
        .get("/relations/containers/collection/resource")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              TagId: 8,
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
        .post("/relations/containers/collection/resource")
        .send({
          TagId: 6,
          ResourceId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            TagId: 6,
            ResourceId: 3
          });
          done();
        });
    });

    it("should not Post Relations with invalid TagId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/collection/resource")
        .send({
          TagId: 220,
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
        .post("/relations/containers/collection/resource")
        .send({
          TagId: 2,
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
        .post("/relations/containers/collection/resource")
        .send({
          TagId: 2,
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
          .get("/relations/containers/collection/2/resource/8")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              TagId: 2,
              ResourceId: 8
            });
            done();
          });
      });

      it("should return 404 on inexistant collection", done => {
        chai
          .request(url + relationPort)
          .get("/relations/containers/collection/20/resource/8")
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
          .get("/relations/containers/collection/2/resource/22")
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
          .get("/relations/containers/collection/2/resource/null")
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
          .patch("/relations/containers/collection/8/resource/2")
          .send({
            TagId: 8,
            ResourceId: 2
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              TagId: 8,
              ResourceId: 2
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + relationPort)
          .patch("/relations/containers/collection/8/resource/2")
          .send({
            TagId: 22,
            ResourceId: 22
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              TagId: 8,
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
          .delete("/relations/containers/collection/8/resource/2")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              TagId: 8,
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
              .get("/relations/containers/collection/8/resource/2")
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
          .delete("/relations/containers/collection/2/resource/2")
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
