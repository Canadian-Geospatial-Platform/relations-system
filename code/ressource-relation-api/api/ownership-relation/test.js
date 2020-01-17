const connectToDatabase = require("../../utils/db");
const assert = require("assert");
const chai = require("chai");
const Sequelize = require("sequelize");
const url = "127.0.0.1:";
const userPort = 3006;
const ownershipRelationPort = 3007;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

describe("ownership-relation", async () => {
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
      } catch (err) {}
      try {
        await Community.create({
          Name: "name " + i,
          Description: "desc " + i
        });
      } catch (err) {}
    }
    for (let i = 1; i < 10; i++) {
      try {
        await UserCommunityOwnershipRelation.create({
          UserId: i,
          CommunityId: 10 - i,
          OwnershipTypeId: 1
        });
      } catch (err) {}
    }
  });

  describe("Get /ownershipRelations", () => {
    it("should Get ownershipRelations", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userCommunityOwnershipRelations")
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
        .post("/userCommunityOwnershipRelations")
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
  });

  describe("Get /ownershipRelations/x/y", () => {
    it("should Get specific relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userCommunityOwnershipRelations/2/8")
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
  });

  describe("Put /ownershipRelations/x/y", () => {
    it("should Put specific values in relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .put("/userCommunityOwnershipRelations/8/2")
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
  });

  describe("Delete /ownershipRelations/x/y", () => {
    it("should Delete specific relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .delete("/userCommunityOwnershipRelations/8/2")
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
            .get("/userCommunityOwnershipRelations/8/2")
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(404);
              done();
            });
        });
    });
  });
});
