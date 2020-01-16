const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiFetch = require("chai-fetch");
const fetch = require("node-fetch");
const url = "localhost:3007";

chai.use(chaiFetch);
chai.use(chaiHttp);
const { expect } = chai;

beforeEach(async function() {});

describe("ownership-relation", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  describe("Get /ownershipRelations", () => {
    it("should match responses with matching bodies", done => {
      chai
        .request(url)
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
