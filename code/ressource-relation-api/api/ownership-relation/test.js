const connectToDatabase = require("../../utils/db");
const assert = require("assert");
const chai = require("chai");
const Sequelize = require("sequelize");
const url = "127.0.0.1:";
const userPort = 3006;
const ownershipRelationPort = 3007;

chai.use(require("chai-shallow-deep-equal"));
chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

describe("ownership-relation", async () => {
  beforeEach(async () => {
    const {
      User,
      Community,
      UserCommunityOwnershipRelation
    } = await connectToDatabase();

    for (let i = 0; i < 10; i++) {
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
    for (let i = 0; i < 10; i++) {
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
    it("should match responses with matching bodies", done => {
      chai
        .request(url + ownershipRelationPort)
        .get("/userCommunityOwnershipRelations")
        .end((err, res) => {
          console.log(res.body);
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              Id: 10,
              UserId: 8,
              CommunityId: 2,
              OwnershipTypeId: 1
            }
          ]);
          done();
        });
    });
  });
});
