const connectToDatabase = require("../../utils/db");
const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const Sequelize = require("sequelize");
const url = "127.0.0.1:";
const userPort = 3006;
const ownershipRelationPort = 3007;

chai.use(chaiHttp);
const { expect } = chai;

describe("ownership-relation", async () => {
  beforeEach(async () => {
    const {
      User,
      Community,
      UserCommunityOwnershipRelation
    } = await connectToDatabase();

    for (let i = 0; i < 10; i++) {
      await User.create({
        Name: "name " + i,
        Description: "desc " + i
      });
      await Community.create({
        Name: "name " + i,
        Description: "desc " + i
      });
    }
    await UserCommunityOwnershipRelation.create({
      UserId: 3,
      CommunityId: 7,
      OwnershipTypeId: 1
    });
  });
  describe("Get /ownershipRelations", () => {
    it("should match responses with matching bodies", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userCommunityOwnershipRelations")
        .end((err, res) => {
          console.log(res.body);
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });
});
