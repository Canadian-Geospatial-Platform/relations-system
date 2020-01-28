"use strict";

require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = require("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const ownershipRelationPort = 3008;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// CommunityRessource
describe("ownership-relation-community-resource", async () => {
  beforeEach(async () => {
    const {
      Community,
      Resource,
      CommunityResourceOwnershipRelation,
      sequelize
    } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Community.create({
          Name: "name " + i,
          Description: "desc " + i
        });
      } catch (err) {
        console.log(err);
      }
      try {
        await Resource.create({
          Title: "title " + i,
          Description: "desc " + i,
          ResourceUrl: "resrouce url " + i,
          PopularityIndex: i
        });
      } catch (err) {
        console.log(err);
      }
    }
    for (let i = 1; i < 10; i++) {
      try {
        await CommunityResourceOwnershipRelation.create({
          CommunityId: i,
          ResourceId: 10 - i,
          OwnershipTypeId: 1
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /ownershipRelations", () => {
    it("should Get ownershipRelations", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/community/resource")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              CommunityId: 8,
              ResourceId: 2,
              OwnershipTypeId: 1
            }
          ]);
          done();
        });
    });
  });

  describe("Post /ownershipRelations", () => {
    it("should Post ownershipRelations", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/community/resource")
        .send({
          CommunityId: 6,
          ResourceId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 6,
            ResourceId: 3,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should not Post ownershipRelations with invalid CommunityId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/community/resource")
        .send({
          CommunityId: 220,
          ResourceId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with invalid ResourceId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/community/resource")
        .send({
          CommunityId: 2,
          ResourceId: -1,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with null ResourceId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/community/resource")
        .send({
          CommunityId: 2,
          ResourceId: null,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with null OwnershipTypeId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/community/resource")
        .send({
          CommunityId: 2,
          ResourceId: 8,
          OwnershipTypeId: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe("Get /ownershipRelations/x/y", () => {
    it("should Get specific relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/community/2/resource/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 2,
            ResourceId: 8,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should return 404 on inexistant community", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/community/20/resource/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it("should return 404 on inexistant resource", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/community/2/resource/22")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it("should return 404 on invalid url", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/community/2/resource/null")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });

  describe("Put /ownershipRelations/x/y", () => {
    it("should Put specific values in relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .patch("/relations/ownerships/community/8/resource/2")
        .send({
          CommunityId: 8,
          ResourceId: 2,
          OwnershipTypeId: 5
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 8,
            ResourceId: 2,
            OwnershipTypeId: 5
          });
          done();
        });
    });

    it("should not Put values in Id fields", done => {
      chai
        .request(url + ownershipRelationPort)
        .patch("/relations/ownerships/community/8/resource/2")
        .send({
          CommunityId: 22,
          ResourceId: 22
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 8,
            ResourceId: 2,
            OwnershipTypeId: 1
          });
          done();
        });
    });
  });

  describe("Delete /ownershipRelations/x/y", () => {
    it("should Delete specific relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .delete("/relations/ownerships/community/8/resource/2")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 8,
            ResourceId: 2,
            OwnershipTypeId: 1
          });
        })
        .catch(function(err) {
          console.log(err);
          done(err);
        })
        .then(function(res) {
          chai
            .request(url + ownershipRelationPort)
            .get("/relations/ownerships/community/8/resource/2")
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(404);
              done();
            });
        });
    });

    it("should return 404 on inexisting realtion Delete specific relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .delete("/relations/ownerships/community/2/resource/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });
});
