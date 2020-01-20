"use strict";

require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = require("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const ownershipRelationPort = 3000;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// CommunityCollection
describe("ownership-relation-community-collection", async () => {
  beforeEach(async () => {
    const {
      Community,
      Collection,
      CommunityCollectionOwnershipRelation,
      sequelize
    } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Community.create({
          Name: "name " + i,
          Description: "desc " + i
        });
      } catch (err) {}
      try {
        await Collection.create({
          Title: "title " + i,
          Description: "desc " + i,
          PopularityIndex: i
        });
      } catch (err) {
        console.log(err);
      }
    }
    for (let i = 1; i < 10; i++) {
      try {
        await CommunityCollectionOwnershipRelation.create({
          CommunityId: i,
          CollectionId: 10 - i,
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
        .get("/communityCollectionOwnershipRelations")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              CommunityId: 8,
              CollectionId: 2,
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
        .post("/communityCollectionOwnershipRelations")
        .send({
          CommunityId: 6,
          CollectionId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 6,
            CollectionId: 3,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should not Post ownershipRelations with invalid CommunityId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/communityCollectionOwnershipRelations")
        .send({
          CommunityId: 220,
          CollectionId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with invalid CollectionId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/communityCollectionOwnershipRelations")
        .send({
          CommunityId: 2,
          CollectionId: -1,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with null CollectionId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/communityCollectionOwnershipRelations")
        .send({
          CommunityId: 2,
          CollectionId: null,
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
        .post("/communityCollectionOwnershipRelations")
        .send({
          CommunityId: 2,
          CollectionId: 8,
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
        .get("/communityCollectionOwnershipRelations/2/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 2,
            CollectionId: 8,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should return 404 on inexistant community", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/communityCollectionOwnershipRelations/20/8")
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
        .get("/communityCollectionOwnershipRelations/2/22")
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
        .get("/communityCollectionOwnershipRelations/2/null")
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
        .put("/communityCollectionOwnershipRelations/8/2")
        .send({
          CommunityId: 8,
          CollectionId: 2,
          OwnershipTypeId: 5
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 8,
            CollectionId: 2,
            OwnershipTypeId: 5
          });
          done();
        });
    });

    it("should not Put values in Id fields", done => {
      chai
        .request(url + ownershipRelationPort)
        .put("/communityCollectionOwnershipRelations/8/2")
        .send({
          CommunityId: 22,
          CollectionId: 22
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 8,
            CollectionId: 2,
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
        .delete("/communityCollectionOwnershipRelations/8/2")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 8,
            CollectionId: 2,
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
            .get("/communityCollectionOwnershipRelations/8/2")
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
        .delete("/communityCollectionOwnershipRelations/2/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });
});
