const md5 = require('md5');
const { StatusCodes } = require('http-status-codes');
const BaseService = require('../BaseService');
const { tokenGenerator } = require('../token');
const { User } = require('../../database/models');
const CustomError = require('../../utils/customError');
const loginValidator = require('./Validator');

class UserService extends BaseService {
  constructor(model = User) {
  super(model);
}

  async login(email, pass) {
    loginValidator({ email, password: pass });
    const hashedPassword = md5(pass);
    const user = await this.model.findOne({ where: { email, password: hashedPassword } });
    if (!user) {
      throw new CustomError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }
    const payload = user.get();
    delete payload.password;
    console.log('>>>>>>>>>', payload);
    const token = tokenGenerator(payload);
    return { role: payload.role, token };
}

  async create(body) {
    const { password } = body;
    const hashedPassword = md5(password);
    const [user, created] = await this.model.findOrCreate({
        where: { email: body.email },
        defaults: { ...body, password: hashedPassword },
      });
    if (!created) throw new CustomError('User allready exists', StatusCodes.CONFLICT);        
    const payload = user.get();
    delete payload.password;

    const token = tokenGenerator(payload);
    return ({ ...payload, token });
  }
}

module.exports = UserService;