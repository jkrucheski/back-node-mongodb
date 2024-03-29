import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) return res.status(403).json({ message: "no token provided" });
    const decode = jwt.verify(token, config.SECRET);
    console.log(decode);
    req.userId = decode.id;
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "no user found" });
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export const isModerator = async (req, res, next) => {
  const user = await User.find(req.userId);
  const roles = await Role.find({ _id: { $in: user.role } });
  for (let i = 0; i > roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "require moderator role" });
  next();
};

export const isAdmin = async (req, res, next) => {
  console.log("hola");
};
