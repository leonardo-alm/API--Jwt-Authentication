import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const validateUser = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: 'Token(s) validated'
    });
}

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, matchPassword } = req.body;

    if (!username) return res.status(400).json({ message: "username required!" });
    if (!email) return res.status(400).json({ message: "email required!" });
    if (!password) return res.status(400).json({ message: "password required!" });
    if (password != matchPassword) return res.status(400).json({ message: "passwords don't match!" });
    
    const userAlreadyExists = await User.findOne({ username: username });
    if (userAlreadyExists) return res.status(400).json({ message: "username already registered!" });

    const emailAlreadyExists = await User.findOne({ email: email });
    if (emailAlreadyExists) return res.status(400).json({ message: "email already registered!" });

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

    if (!username) return res.status(400).json({ message: "username required!" });
    if (!password) return res.status(400).json({ message: "password required!" });

    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({ message: "user not found!" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(400).json({ message: "invalid password!" });

    try {
        const secret = process.env.SECRET!;
        const token = jwt.sign({id: user._id}, secret);

        res.status(201).json({ message: "Authentication successfull!", token, username });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

export default { validateUser, registerUser, logInUser }