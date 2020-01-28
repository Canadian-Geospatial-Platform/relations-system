"use strict";

require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = require("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const ownershipRelationPort = 3011;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

describe("ownership-relation-user-community", async () => {
  beforeEach(async () => {
    const {
      User,
      Community,
      UserCommunityOwnershipRelation,
      sequelize
    } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await User.create({
          Name: "name " + i,
          Description: "desc " + i
        });
      } catch (err) {
        console.log(err);
      }
      try {
        await Community.create({
          Name: "name " + i,
          Description: "desc " + i
        });
      } catch (err) {
        console.log(err);
      }
    }
    for (let i = 1; i < 10; i++) {
      try {
        await UserCommunityOwnershipRelation.create({
          UserId: i,
          CommunityId: 10 - i,
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
        .get("/relations/ownerships/user/community")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              UserId: 8,
              CommunityId: 2,
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
        .post("/relations/ownerships/user/community")
        .send({
          UserId: 6,
          CommunityId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 6,
            CommunityId: 3,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should not Post ownershipRelations with invalid UserId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/user/community")
        .send({
          UserId: 220,
          CommunityId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with invalid CommunityId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/user/community")
        .send({
          UserId: 2,
          CommunityId: -1,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with null CommunityId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/relations/ownerships/user/community")
        .send({
          UserId: 2,
          CommunityId: null,
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
        .post("/relations/ownerships/user/community")
        .send({
          UserId: 2,
          CommunityId: 8,
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
        .get("/relations/ownerships/user/2/community/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 2,
            CommunityId: 8,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should return 404 on inexistant user", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/user/20/community/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it("should return 404 on inexistant community", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/relations/ownerships/user/2/community/22")
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
        .get("/relations/ownerships/user/2/community/null")
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
        .patch("/relations/ownerships/user/8/community/2")
        .send({
          UserId: 8,
          CommunityId: 2,
          OwnershipTypeId: 5
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            CommunityId: 2,
            OwnershipTypeId: 5
          });
          done();
        });
    });

    it("should not Put values in Id fields", done => {
      chai
        .request(url + ownershipRelationPort)
        .patch("/relations/ownerships/user/8/community/2")
        .send({
          UserId: 22,
          CommunityId: 22
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            CommunityId: 2,
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
        .delete("/relations/ownerships/user/8/community/2")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            CommunityId: 2,
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
            .get("/relations/ownerships/user/8/community/2")
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
        .delete("/relations/ownerships/user/2/community/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });
});
