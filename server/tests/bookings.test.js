import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import generator from './generator';
import Users from '../models/user';
chai.use(chaiHttp)
const expect = chai.expect;
let authToken;
let userToken;
describe('Bookings', () => {
  before((done) => {
    generator.generateUsers();
    generator.generateTrips();
    generator.generateBookings();
    chai
      .request(app)
      .post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send({email : 'bihames4vainqueur@gmail.com', password : 'usertest'})
      .then(res => {
        authToken = res.body.data.token;
        done();
      });
  });
  it('should return an error with a 401 status when the user is not authenticated while booking a seat on a trip', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .send({
            trip_id : 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(401)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('error')
          done();
        })
  });
  it('should return an error with a 400 status when there is no trip specified', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${authToken}`)
        .send()
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('error')
          expect(res.body.status).to.equal('error')
          done();
        })
  });
  it('should return an error with a 404 status when the trip on which a seat is needed does not exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            trip_id : 10
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('error')
          done();
        })
  });
  it('should return an error with a 400 status when the trip on which a seat is needed is not active', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            trip_id : 2
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('error')
          done();
        })
  });
  it('should return an error with a 400 status when the specified seat_number is greater than the trip seating_capacity', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            trip_id : 1,
            seat_number : 6
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('error')
          done();
        })
  });
  it('should return an error with a 400 status when the specified seat_number is already taken', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            trip_id : 1,
            seat_number : 1
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('error')
          expect(res.body.status).to.equal('error')
          done();
        })
  });
  it('should return an object with a 201 status when all credentials are correctly fulfilled', (done) => {
      chai
        .request(app)
        .post('/api/v1/bookings')
        .set('Content-type', 'application/json')
        .set('Content-type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            trip_id : 1,
            seat_number : 2
        })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('data')
          expect(res.body.status).to.equal('success')
          done();
        })
  });
})