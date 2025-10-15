import  { Router } from 'express';
import { getUserByEmail } from '../models/userModels.mts';
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
const router: Router = Router();

router.post('/login', async (req, res) => {
    // get the email and password from the body of the request
    const {email, password} = req.body || {};

    if (!email || !password) {
        res.status(400).json({
            message: "Missing email or password"
        });
        return;
    }
    
    // Check if the user exists in the database.
    const user = await getUserByEmail(email);
    if (!user) {
        res.status(401).json({
            message: "Invalid email"
        });
        return;
    }

    // Check if the password is correct
    if (!(await argon2.verify(user.password_hash, password))) {
        res.status(401).json({
            message: "Invalid password"
        });
        return;
    }

    // If they user exists and password matches...
    // generate a token using jsonwebtoken
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    
    // Send back the token and some user info in the response
    res.status(200).json({
        token,
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    });
});


router.post('/register', async (req, res, next) => {
    try {
    const {email, name, password} = req.body;
    }catch {
        throw new Error }
});

export default router;