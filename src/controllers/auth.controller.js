import User from "../models/User";
import Role from "../models/Role";

import jwt from "jsonwebtoken";
import config from "../config";

export const signUp = async (req, res) => {
  // Si no existe el usuario, lo creo, sino no
  const { username, email, password, roles } = req.body;

  const newUser = new User({
    username,
    email,
    password: await User.encryptPassword(password),
  });

  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role._id];
  }

  console.log(newUser);

  const savedUser = await newUser.save();

  const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
    expiresIn: 86400, // 24hs
  });
  res.status(200).json({ token });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email: email }).populate("roles");
  if (!userFound)
    return res.status(400).json({ token: null, message: "User not found" });
  const matchPassword = await User.comparePassword(
    password,
    userFound.password
  );
  if (!matchPassword)
    return res.status(401).json({ token: null, message: "invalid password" });
  const token = jwt.sign({ id: userFound._id }, config.SECRET, {
    expiresIn: 86400, // 24hs
  });
  res.status(401).json({ token: token, message: "Welcome" });
};
