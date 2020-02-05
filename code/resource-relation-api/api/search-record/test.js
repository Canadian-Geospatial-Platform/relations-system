require("dotenv").config({ path: "../../.env" });
import connectToDatabase from "../../utils/db";
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3018;
const UserPort = 3006;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// SearchRecord
describe("searchRecord", async () => {
  beforeEach(async () => {
    const { SearchRecord, User, sequelize } = await connectToDatabase();

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
        await SearchRecord.create({
          Type: "type " + i,
          Value: "value " + i,
          UserId: i,
          PopularityIndex: 55
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /searchRecord", () => {
    it("should Get SearchRecords", done => {
      chai
        .request(url + port)
        .get("/search-records")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.containSubset([
            {
              Id: 8
            }
          ]);
          done();
        });
    });
  });

  describe("Post /search-records", () => {
    it("should Post SearchRecords", done => {
      chai
        .request(url + port)
        .post("/search-records")
        .send({
          Type: "a posted type",
          Value: "a posted value",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Type: "a posted type",
            Value: "a posted value",
            PopularityIndex: 123
          });
          done();
        });
    });
  });

  it("should not Post SearchRecords with null PopularityIndex", done => {
    chai
      .request(url + port)
      .post("/search-records")
      .send({
        PopularityIndex: null
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("Get /search-records/x", () => {
    it("should Get specific searchRecords", done => {
      chai
        .request(url + port)
        .get("/search-records/2")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            Id: 2
          });
          done();
        });
    });

    it("should return 404 on inexistant searchRecord", done => {
      chai
        .request(url + port)
        .get("/search-records/20")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it("should return 404 on invalid url", done => {
      chai
        .request(url + port)
        .get("/search-records/null")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });

  describe("Put /search-records/x", () => {
    it("should Put specific values in searchRecords", done => {
      chai
        .request(url + port)
        .patch("/search-records/8")
        .send({
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            Id: 8,
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should not Put values in Id fields", done => {
      chai
        .request(url + port)
        .patch("/search-records/8")
        .send({
          Id: 22
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            Id: 8
          });
          done();
        });
    });
  });

  describe("Delete /search-records/x", () => {
    it("should Delete specific searchRecords", done => {
      chai
        .request(url + port)
        .delete("/search-records/8")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.containSubset({
            Id: 8
          });
        })
        .catch(function(err) {
          console.log(err);
          done(err);
        })
        .then(function(res) {
          chai
            .request(url + port)
            .get("/search-records/8")
            .end((err, res) => {
              if (err) done(err);
              expect(res).to.have.status(404);
              done();
            });
        });
    });

    it("should return 404 on inexisting searchRecord Delete", done => {
      chai
        .request(url + port)
        .delete("/search-records/55")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
  });

  it("should not delete records on user deletion", done => {
    chai
      .request(url + UserPort)
      .delete("/users/2")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.containSubset({
          Id: 2
        });
      })
      .catch(function(err) {
        console.log(err);
        done(err);
      })
      .then(function() {
        chai
          .request(url + port)
          .get("/search-records/2")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              UserId: null
            });
            done();
          });
      });
  });
});
