const createError = require("http-errors");
const User = require("../Models/User.model");
const authSchema = require("../Schema/Auth.schema");
const userSchema = require("../Schema/User.schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");
const redisClient = require("../helpers/init_redis");
const { success } = require("../helpers/responseApi");

const register = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });

    if (doesExist) throw createError.Conflict("Email already exists");

    const user = new User(result);

    await user.save();

    res.status(201).send(success("User has been created", user, 201));
  } catch (error) {
    if (error.isJoi == true) error.status = 422;
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });

    if (!user) throw createError.NotFound("User not exists");

    const isMatch = await user.isValidPassword(result.password);

    if (!isMatch)
      throw createError.Unauthorized("Username or password is not valid");

    const { token: accessToken, expiresIn } = await signAccessToken(
      user._id.toString(),
      user.role
    );
    const refreshToken = await signRefreshToken(user._id.toString());

    res.send(success("Logged in successfully", { accessToken, refreshToken, expiresIn }, 200));
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Username or Password"));
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    const user = await User.findById(userId);

    if (!user) throw createError.NotFound("User not exists");

    const { token: accessToken, expiresIn } = await signAccessToken(
      userId,
      user.role
    );

    const newRefreshToken = await signRefreshToken(userId);

    res.send({ accessToken, refreshToken: newRefreshToken, expiresIn });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();

    const userId = await verifyRefreshToken(refreshToken);

    redisClient.DEL(userId).catch((err) => {
      console.log(err.message);
      throw createError.InternalServerError();
    });

    res.status(204).send(success("Logout successfully", null, 204));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await userSchema.validateAsync(req.body);

    await User.findByIdAndUpdate(result._id, {
      email: result.email,
      password: result.password,
      role: result.role,
    });

    res.send(success("User has been updated", null, 200));
  } catch (error) {
    if (error.isJoi == true) error.status = 422;
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    let users;

    if (req.query.id) {
      users = await User.findById(req.query.id);
    } else {
      users = await User.find();
    }
    console.log(users)
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  update,
  get
};
