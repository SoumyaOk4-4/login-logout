const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const SECRET_KEY = "fuck_you";

const signup = async (req, res) => {
    const { username, email, password  } = req.body;
    try {
        const existingUser = await userModel.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hasedPassword = await bcrypt.hash(password, 11);

        const userCreate = await userModel.create({
            email: email,
            password: hasedPassword,
            username: username
        });

        const token = jwt.sign({
            email: userCreate.email,
            id: userCreate._id
        }, SECRET_KEY);
        res.status(200).json({
            user: userCreate,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({
            email: email
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id,
        }, SECRET_KEY);
        res.status(201).json({ user: existingUser, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { signup, signin };