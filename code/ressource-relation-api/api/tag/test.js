require("dotenv").config({ path: "../../.env" });
import connectToDatabase from "../../utils/db";
const chai = require("chai");
const url = "127.0.0.1:";
const port = 3005;

chai.use(require("chai-subset"));
chai.use(require("chai-http"));

const { expect } = chai;

// Tag
describe("tag", async () => {
  beforeEach(async () => {
    const { Tag, sequelize } = await connectToDatabase();

    await sequelize.sync({ force: true });

    for (let i = 1; i < 10; i++) {
      try {
        await Tag.create({
          Title: "name " + i,
          Description: "desc " + i,
          PopularityIndex: 55
        });
      } catch (err) {
        console.log(err);
      }
    }
  });

  describe("Get /tag", () => {
    it("should Get Tags", done => {
      chai
        .request(url + port)
        .get("/tags")
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

  describe("Post /tags", () => {
    it("should Post Tags", done => {
      chai
        .request(url + port)
        .post("/tags")
        .send({
          Title: "a posted title",
          Description: "a posted description",
          PopularityIndex: 123
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.deep.contain({
            Title: "a posted title",
            Description: "a posted description",
            PopularityIndex: 123
          });
          done();
        });
    });

    it("should not Post Tags with null PopularityIndex", done => {
      chai
        .request(url + port)
        .post("/tags")
        .send({
          PopularityIndex: null
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("Get /tags/x", () => {
      it("should Get specific tags", done => {
        chai
          .request(url + port)
          .get("/tags/2")
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

      it("should return 404 on inexistant community", done => {
        chai
          .request(url + port)
          .get("/tags/20")
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
          .get("/tags/null")
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(404);
            expect(res.body).to.deep.equal({});
            done();
          });
      });
    });

    describe("Put /tags/x", () => {
      it("should Put specific values in tags", done => {
        chai
          .request(url + port)
          .patch("/tags/8")
          .send({
            Title: "a posted title",
            Description: "a posted description",
            PopularityIndex: 123
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.containSubset({
              Id: 8,
              Title: "a posted title",
              Description: "a posted description",
              PopularityIndex: 123
            });
            done();
          });
      });

      it("should not Put values in Id fields", done => {
        chai
          .request(url + port)
          .patch("/tags/8")
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

    describe("Delete /tags/x", () => {
      it("should Delete specific tags", done => {
        chai
          .request(url + port)
          .delete("/tags/8")
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
              .get("/tags/8")
              .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(404);
                done();
              });
          });
      });

      it("should return 404 on inexisting realtion Delete specific tags", done => {
        chai
          .request(url + port)
          .delete("/tags/55")
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
