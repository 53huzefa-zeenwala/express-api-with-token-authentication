const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const redisClient = require("../helpers/init_redis");

module.exports = {
  signAccessToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const accessTokenExpTime = "5m"; //* m == minute change m also require in change in client side
      const payload = { role };
      const options = {
        expiresIn: accessTokenExpTime,
        audience: userId,
      };

      const secret = process.env.ACCESS_TOKEN_SECRET;
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.error(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve({ token, expiresIn: accessTokenExpTime });
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next(createError.Unauthorized());

    const bearerToken = authHeader.split(" ");

    const token = bearerToken[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    JWT.verify(token, secret, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(err.message,));
      }
      res.payload = payload;
      next();
    });
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "1h", // change this also need to change below redis EX time which is in second
        audience: userId,
      };

      const secret = process.env.REFRESH_TOKEN_SECRET;
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.error(err.message);
          reject(createError.InternalServerError());
          return;
        }

        redisClient
          .SET(userId, token, {
            EX: 60 * 60,
          })
          .catch((err) => {
            console.log(err.message);
            reject(createError.InternalServerError());
          });

        resolve(token);
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      const secret = process.env.REFRESH_TOKEN_SECRET;

      JWT.verify(refreshToken, secret, (err, payload) => {
        if (err) {
          const message =
            err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
          return reject(createError.Unauthorized(err.message));
        }
        const userId = payload.aud;
        redisClient
          .GET(userId)
          .catch((err) => {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          })
          .then((token) => {
            if (token && refreshToken == token) return resolve(userId);
            return reject(createError.Unauthorized());
          });
      });
    });
  },
  verifyAdminAccessToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return next(createError.Unauthorized());

    const bearerToken = authHeader.split(" ");

    const token = bearerToken[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    JWT.verify(token, secret, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(err.message));
      }
      
      if (payload.role.toLowerCase() !== "admin")
        return next(createError.Unauthorized("Admin only route"));

      res.payload = payload;
      next();
    });
  },
};
