const connectToDatabase = require("../../utils/db");
const assert = require("assert");
const chai = require("chai");
const Sequelize = require("sequelize");
const url = "127.0.0.1:";
const resourcePort = 3004;
const userPort = 3006;
const ownershipRelationPort = 3007;

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
      } catch (err) {}
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

    it("should not Post ownershipRelations with invalid UserId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/userCommunityOwnershipRelations")
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
        .post("/userCommunityOwnershipRelations")
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
        .post("/userCommunityOwnershipRelations")
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
        .post("/userCommunityOwnershipRelations")
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

    it("should return 404 on inexistant user", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userCommunityOwnershipRelations/20/8")
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
        .get("/userCommunityOwnershipRelations/2/22")
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
        .get("/userCommunityOwnershipRelations/2/null")
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

    it("should not Put values in Id fields", done => {
      chai
        .request(url + ownershipRelationPort)
        .put("/userCommunityOwnershipRelations/8/2")
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

    it("should return 404 on inexisting realtion Delete specific relations", done => {
      chai
        .request(url + ownershipRelationPort)
        .delete("/userCommunityOwnershipRelations/2/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });
});
// UserRessource
describe("ownership-relation-user-resource", async () => {
  beforeEach(async () => {
    const {
      User,
      Resource,
      UserResourceOwnershipRelation,
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
        await UserResourceOwnershipRelation.create({
          UserId: i,
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
        .get("/userResourceOwnershipRelations")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              UserId: 8,
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
        .post("/userResourceOwnershipRelations")
        .send({
          UserId: 6,
          ResourceId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 6,
            ResourceId: 3,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should not Post ownershipRelations with invalid UserId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/userResourceOwnershipRelations")
        .send({
          UserId: 220,
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
        .post("/userResourceOwnershipRelations")
        .send({
          UserId: 2,
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
        .post("/userResourceOwnershipRelations")
        .send({
          UserId: 2,
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
        .post("/userResourceOwnershipRelations")
        .send({
          UserId: 2,
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
        .get("/userResourceOwnershipRelations/2/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 2,
            ResourceId: 8,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should return 404 on inexistant user", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userResourceOwnershipRelations/20/8")
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
        .get("/userResourceOwnershipRelations/2/22")
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
        .get("/userResourceOwnershipRelations/2/null")
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
        .put("/userResourceOwnershipRelations/8/2")
        .send({
          UserId: 8,
          ResourceId: 2,
          OwnershipTypeId: 5
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            ResourceId: 2,
            OwnershipTypeId: 5
          });
          done();
        });
    });

    it("should not Put values in Id fields", done => {
      chai
        .request(url + ownershipRelationPort)
        .put("/userResourceOwnershipRelations/8/2")
        .send({
          UserId: 22,
          ResourceId: 22
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
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
        .delete("/userResourceOwnershipRelations/8/2")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
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
            .get("/userResourceOwnershipRelations/8/2")
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
        .delete("/userResourceOwnershipRelations/2/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });
});
// UserTag
describe("ownership-relation-user-tag", async () => {
  beforeEach(async () => {
    const {
      User,
      Tag,
      UserTagOwnershipRelation,
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
        await Tag.create({
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
        await UserTagOwnershipRelation.create({
          UserId: i,
          TagId: 10 - i,
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
        .get("/userTagOwnershipRelations")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              UserId: 8,
              TagId: 2,
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
        .post("/userTagOwnershipRelations")
        .send({
          UserId: 6,
          TagId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 6,
            TagId: 3,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should not Post ownershipRelations with invalid UserId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/userTagOwnershipRelations")
        .send({
          UserId: 220,
          TagId: 3,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with invalid TagId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/userTagOwnershipRelations")
        .send({
          UserId: 2,
          TagId: -1,
          OwnershipTypeId: 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post ownershipRelations with null TagId", done => {
      chai
        .request(url + ownershipRelationPort)
        .post("/userTagOwnershipRelations")
        .send({
          UserId: 2,
          TagId: null,
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
        .post("/userTagOwnershipRelations")
        .send({
          UserId: 2,
          TagId: 8,
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
        .get("/userTagOwnershipRelations/2/8")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 2,
            TagId: 8,
            OwnershipTypeId: 1
          });
          done();
        });
    });

    it("should return 404 on inexistant user", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userTagOwnershipRelations/20/8")
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
        .get("/userTagOwnershipRelations/2/22")
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
        .get("/userTagOwnershipRelations/2/null")
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
        .put("/userTagOwnershipRelations/8/2")
        .send({
          UserId: 8,
          TagId: 2,
          OwnershipTypeId: 5
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            TagId: 2,
            OwnershipTypeId: 5
          });
          done();
        });
    });

    it("should not Put values in Id fields", done => {
      chai
        .request(url + ownershipRelationPort)
        .put("/userTagOwnershipRelations/8/2")
        .send({
          UserId: 22,
          TagId: 22
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            TagId: 2,
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
        .delete("/userTagOwnershipRelations/8/2")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            UserId: 8,
            TagId: 2,
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
            .get("/userTagOwnershipRelations/8/2")
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
        .delete("/userTagOwnershipRelations/2/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });
});
