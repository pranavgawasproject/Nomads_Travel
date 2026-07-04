import { config } from "dotenv";

config();
const errorHandler = (err, req, res, _next) => {
  return res.status(500).json(err);
};

export default errorHandler;
