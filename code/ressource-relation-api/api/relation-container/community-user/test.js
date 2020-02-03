

require("dotenv").config({ path: "../../../.env" });
const connectToDatabase = require("../../../utils/db");
const chai = require("chai");
const url = "127.0.0.1:";
const relationPort = 3015;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// CommunityUser
describe("relation-community-user", async () => {
  beforeEach(async () => {
    const {
      Community,
      User,
      CommunityUserRelation,
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
        await User.create({
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
        await CommunityUserRelation.create({
          CommunityId: i,
          UserId: 10 - i
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
        .get("/relations/containers/community/user")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              CommunityId: 8,
              UserId: 2
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
        .post("/relations/containers/community/user")
        .send({
          CommunityId: 6,
          UserId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            CommunityId: 6,
            UserId: 3
          });
          done();
        });
    });

    it("should not Post Relations with invalid CommunityId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/community/user")
        .send({
          CommunityId: 220,
          UserId: 3
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post Relations with invalid UserId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/community/user")
        .send({
          CommunityId: 2,
          UserId: -1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    it("should not Post Relations with null UserId", done => {
      chai
        .request(url + relationPort)
        .post("/relations/containers/community/user")
        .send({
          CommunityId: 2,
          UserId: null
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
          .get("/relations/containers/community/2/user/8")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CommunityId: 2,
              UserId: 8
            });
            done();
          });
      });

      it("should return 404 on inexistant community", done => {
        chai
          .request(url + relationPort)
          .get("/relations/containers/community/20/user/8")
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
          .get("/relations/containers/community/2/user/22")
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
          .get("/relations/containers/community/2/user/null")
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
          .patch("/relations/containers/community/8/user/2")
          .send({
            CommunityId: 8,
            UserId: 2
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CommunityId: 8,
              UserId: 2
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + relationPort)
          .patch("/relations/containers/community/8/user/2")
          .send({
            CommunityId: 22,
            UserId: 22
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CommunityId: 8,
              UserId: 2
            });
            done();
          });
      });
    });

    describe("Delete /relations/x/y", () => {
      it("should Delete specific relations", done => {
        chai
          .request(url + relationPort)
          .delete("/relations/containers/community/8/user/2")
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              CommunityId: 8,
              UserId: 2
            });
          })
          .catch(function(err) {
            console.log(err);
            done(err);
          })
          .then(function(res) {
            chai
              .request(url + relationPort)
              .get("/relations/containers/community/8/user/2")
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
          .delete("/relations/containers/community/2/user/2")
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
