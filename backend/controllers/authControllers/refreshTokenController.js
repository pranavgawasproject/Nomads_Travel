import jwt from "jsonwebtoken";
import NomadUser from "../../models/NomadUser.js";

export const refreshTokenController = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.roamiqCookie) {
      return res.sendStatus(401);
    }
    const refreshToken = cookie?.roamiqCookie;

    const user = await NomadUser.findOne({ refreshToken }).lean().exec();
    if (!user) {
      return res.sendStatus(401);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          { userInfo: { ...decoded.userInfo } },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        delete user.password;
        delete user.refreshToken;
        res.status(200).json({ user, accessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};
