import { config } from "dotenv";

config();
const errorHandler = (err, req, res, next) => {
  return res.status(500).json(err);
};

export default errorHandler;
