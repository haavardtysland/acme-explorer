import { app } from '../index';
import chai from 'chai';
import chaiHttp from 'chai-http';
import FromData from 'form-data';
import fs from 'fs';
import path from 'path';

const { expect } = chai;

let adminUser = {
  email: 'Admin@admin.com',
  password: '123',
};
let explorerUser = {
  email: 'Explorer@explorer.com',
  password: '123',
};
let adminId;
let explorerId;
let adminToken;
let explorerToken;

chai.use(chaiHttp);

describe('Actor', () => {
  it('Post Actor', (done) => {
    chai
      .request(app)
      .post('/api/v0/Actors')
      .send({
        name: 'Explorer6Name',
        surname: 'Explorer6Surname',
        email: 'Explorer@explorer.com',
        password: '123',
        phone: '+34612345679',
        address: 'myAddress',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
  it('Log in admin', (done) => {
    chai
      .request(app)
      .post('/api/v0/Actors/Login')
      .send(adminUser)
      .end((err, res) => {
        adminToken = res.body.token;
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it('Get Actors with admin auth', (done) => {
    chai
      .request(app)
      .get('/api/v0/Actors')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        adminId = res.body[0]._id;
        explorerId = res.body[1]._id;
        expect(res).to.have.status(200);
        expect('Content-Type', 'json');
        if (err) done(err);
        else done();
      });
  });
  it('Log in explorer', (done) => {
    chai
      .request(app)
      .post('/api/v0/Actors/Login')
      .send(explorerUser)
      .end((err, res) => {
        explorerToken = res.body.token;
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it('Get Actors explorer', (done) => {
    chai
      .request(app)
      .get('/api/v0/Actors')
      .set({ Authorization: `Bearer ${explorerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect('Content-Type', 'json');
        if (err) done(err);
        else done();
      });
  });
  /*  it('Put actor', (done) => {
    //TODO fix when done
    chai
      .request(app)
      .put(`/api/v0/Actors/${explorerId}`)
      .send({
        name: 'ExplorerNewName',
        surname: 'Explorer6Surname',
        email: 'Explorer@explorer.com',
        password: '123',
        phone: '+34612345679',
        address: 'myAddress',
      })
      .set({ Authorization: `Bearer ${explorerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', 'json');
        if (err) done(err);
        else done();
      });
  }); */

  it('Get Actor with id', (done) => {
    chai
      .request(app)
      .get(`/api/v0/Actors/${adminId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', 'json');
        if (err) done(err);
        else done();
      });
  });
  it('Delete Actor with id', (done) => {
    chai
      .request(app)
      .get(`/api/v0/Actors/${explorerId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect('Content-Type', 'json');
        if (err) done(err);
        else done();
      });
  });

  it('Post Manager', (done) => {
    chai
      .request(app)
      .post('/api/v0/Manager')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        name: 'Manager6Name',
        surname: 'Manager6Surname',
        email: 'Manager@manager.com',
        password: '123',
        phone: '+34612345679',
        address: 'myAddress',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });
});

/* describe('Trip', () => {
  it('Post Trip', () => {
    const form = new FormData();
    form.append('object', JSON.stringify({ name: 'John Doe', age: 30 }));
    form.append('string', 'Hello, world!');
    chai
      .request(app)
      .post('/api/v0/Trips')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({})
      .end((err, res) => {});
  });
}); */
