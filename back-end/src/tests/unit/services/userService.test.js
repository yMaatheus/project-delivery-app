const { expect } = require('chai');
const sinon = require('sinon');
const { User } = require('../../../database/models');
const { userMockWithId, userMockSequelize } = require('../../mocks/userMock');
const Jwt = require('../../../providers/Jwt');
const AppError = require('../../../providers/AppError');
const UserService = require('../../../services/user/UserService');
const userSchema = require('../../../schemas/userSchema');
const { StatusCodes } = require('http-status-codes');
const loginSchema = require('../../../schemas/loginSchema');
const  userValidator  = require('../../../services/user/Validator');

describe('User Service', () => {
  const userService = new UserService();

  afterEach(() => sinon.restore())

  describe('Login', () => {
    it('Success', async () => {
      sinon.stub(loginSchema, 'validate').resolves();
      sinon.stub(UserService, 'hashPassword').returns('fakePassword');
      sinon.stub(User, 'findOne').resolves(userMockWithId);
      sinon.stub(Jwt, 'sign').returns('TOKEN_VALIDO');

      const result = await userService.login();

      expect(result).to.be.have.property('role');
      expect(result).to.be.have.property('token');
    })

    describe('Failure', () => {
      it('Validate error', async () => {
        sinon.stub(loginSchema, 'validate').returns({ error: true });
        let error;
        try {
          await userService.login();
        } catch (err) {
          error = err
        }

        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.be.equal(StatusCodes.BAD_REQUEST);
      })

      it('User Login error', async () => {
        sinon.stub(loginSchema, 'validate').returns({ error: {message: 'invalid email'} });
        // sinon.stub(UserService, 'hashPassword').returns('fakePassword');
        // sinon.stub(User, 'findOne').resolves(null);
        let error;
        try {
          await userService.login({ email: 'fakeEmail', password: 'fakePassword' });
        } catch (err) {
          error = err
        }
        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.be.equal('invalid email');
        // expect(error.statusCode).to.be.equal(StatusCodes.UNAUTHORIZED);
      })

    })
  })

  describe('Create', () => {
    it('Success', async () => {
      sinon.stub(userSchema, 'validate').resolves();
      sinon.stub(UserService, 'hashPassword').returns('fakePassword');
      sinon.stub(User, 'findOrCreate').resolves([userMockSequelize, true]);
      sinon.stub(Jwt, 'sign').returns('TOKEN_VALIDO');

      const result = await userService.create({});

      expect(result).to.be.have.property('id');
      expect(result).to.be.have.property('name');
      expect(result).to.be.have.property('email');
      expect(result).to.be.have.property('role');
      expect(result).to.be.have.property('token');
    })

    describe('Failure', () => {
      it('Validate error', async () => {
        sinon.stub(userSchema, 'validate').returns({ error: true });
        let error;
        try {
          await userService.create();
        } catch (err) {
          error = err
        }

        expect(error).to.be.instanceOf(AppError);
        expect(error.statusCode).to.be.equal(StatusCodes.BAD_REQUEST);
      })

      it('Email not found or password not match', async () => {
        sinon.stub(userSchema, 'validate').returns({ error: false });
        sinon.stub(UserService, 'hashPassword').returns('fakePassword');
        sinon.stub(User, 'findOrCreate').resolves([null, false]);

        let error;
        try {
          await userService.create({ });
        } catch (err) {
          error = err
        }

        expect(error).to.be.instanceOf(AppError);
        expect(error.message).to.be.equal('User allready exists');
        expect(error.statusCode).to.be.equal(StatusCodes.CONFLICT);
      })

    })
  })
});