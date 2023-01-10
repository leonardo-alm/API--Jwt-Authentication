import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, matchPassword } = req.body;

    if (!username) return res.status(422).json({ msg: "username required!" });
    if (!email) return res.status(422).json({ msg: "email required!" });
    if (!password) return res.status(422).json({ msg: "password required!" });
    if (password != matchPassword) return res.status(422).json({ msg: "passwords don't match!" });
    
    const userAlreadyExists = await User.findOne({ username: username });
    if (userAlreadyExists) return res.status(422).json({ msg: "Username already registered!" });

    const emailAlreadyExists = await User.findOne({ email: email });
    if (emailAlreadyExists) return res.status(422).json({ msg: "Email already registered!" });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: hashedPassword
    });

    return user
        .save()
        .then((user) => res.status(201).json({ user }))
        .catch((error) => res.status(500).json({ error }));
};

const logInUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username) return res.status(422).json({ msg: "username required!" });
    if (!password) return res.status(422).json({ msg: "password required!" });

    const user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ msg: "User not found!" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(422).json({ msg: "Invalid password!" });

    try {
        const secret = process.env.SECRET!;
        const token = jwt.sign({id: user._id}, secret);

        res.status(200).json({ msg: "Authentication successfull!", token });
    }
    catch (error) {
        res.status(500).json({ msg: error });
    }
}

const getRegisterUserPage = (req: Request, res: Response, next: NextFunction) => {
    //return res.render('registration page')
    res.status(200).json({msg: "user registration page"})
}

const getLogInUserPage = (req: Request, res: Response, next: NextFunction) => {
    //return res.render('login page')
    res.status(200).json({msg: "user login page"})
}

export default { registerUser, logInUser, getLogInUserPage, getRegisterUserPage }