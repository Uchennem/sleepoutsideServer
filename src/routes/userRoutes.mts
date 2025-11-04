import  { Router } from 'express';
import EntityNotFoundError from '../errors/EntityNotFoundError.mts';
import { getUserByEmail } from '../models/userModels.mts';
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken';
import mongodb from "../database/index.mts";
import authorize from '../middleware/authorize.mts';
import type { User } from '../models/types.mts';

import Ajv from "ajv";
import addFormats from "ajv-formats"
import { UserSchema } from "../database/json-schema.ts";
const router: Router = Router();
// @ts-ignore
const ajv = new Ajv();
// @ts-ignore
addFormats(ajv);

router.post('/login', async (req, res) => {
    try {
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
        const token = generateToken(user);
        
        // Send back the token and some user info in the response
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error: any) {
        console.log('Error: ', error);
        res.status(500).json({
            message: error.message || "Failed to login"
        });
    }
});
const generateToken = (user: any) => {
    // @ts-ignore
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
const isNotFound = (val:any) => {
    return (val === null || val === undefined || val === "" || val.length === 0);
}

router.post('/register', async (req, res, next) => {
    try {
        // get the email, name, and password
        const { email, name, password } = req.body || {};
        
        // validate we have all the fields
        if (isNotFound(email) || isNotFound(name) || isNotFound(password)) {
            res.status(400).json({
                message: "Missing email, name, or password"
            });
            return;
        }

        // Check if the user already exists in the database.
        if (await getUserByEmail(email)) {
            res.status(401).json({
                message: "Email already in use"
            });
            return;
        }

        // create a new user object
        const newUser: User = {
            email,
            password_hash: await argon2.hash("password"),
            name,
            cart: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        };
        
        // validate schema
        const validate = ajv.compile(UserSchema);
        if(!validate(newUser)) {
            res.status(400).json({
                message: validate.errors
            });
            return;
        }

        // add the user to the database
        const result = await mongodb.getDb().collection('users').insertOne(newUser as any);
        if (!result.acknowledged) {
            res.status(500).json({
                message: "Failed to create user"
            });
            return;
        }

        // get the newly created user
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(500).json({
                message: "Failed to create user"
            });
            return;
        }

        // generate a token
        const token = generateToken(newUser);

        // Send back the token and some user info in the response
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to register"
        });
    }
});

router.get('/protected', authorize, (req, res) => {
    console.log(res.locals.user);
    res.json({ message: `Hello, ${res.locals.user.email}!` });
});

// GET /users/:userId/wishlist - Get user's wishlist
router.get('/:userId/wishlist', authorize, async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify the user is accessing their own wishlist
        if (res.locals.user._id !== userId) {
            res.status(403).json({ message: 'Forbidden: Cannot access another user\'s wishlist' });
            return;
        }

        const user = await mongodb.getDb().collection<User>('users').findOne({ _id: userId } as any);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ wishlist: user.wishlist || [] });
    } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch wishlist' });
    }
});

// POST /users/:userId/wishlist - Add item to wishlist
router.post('/:userId/wishlist', authorize, async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        // Verify the user is accessing their own wishlist
        if (res.locals.user._id !== userId) {
            res.status(403).json({ message: 'Forbidden: Cannot modify another user\'s wishlist' });
            return;
        }

        if (!productId) {
            res.status(400).json({ message: 'Missing productId' });
            return;
        }

        // Verify the product exists
        const product = await mongodb.getDb().collection('products').findOne({ id: productId });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        // Add the product to the wishlist (using $addToSet to avoid duplicates)
        const result = await mongodb.getDb().collection('users').updateOne(
            { _id: userId } as any,
            {
                $addToSet: { wishlist: productId },
                $set: { modifiedAt: new Date().toISOString() }
            }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Product added to wishlist', productId });
    } catch (error: any) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: error.message || 'Failed to add product to wishlist' });
    }
});

// DELETE /users/:userId/wishlist/:productId - Remove item from wishlist
router.delete('/:userId/wishlist/:productId', authorize, async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Verify the user is accessing their own wishlist
        if (res.locals.user._id !== userId) {
            res.status(403).json({ message: 'Forbidden: Cannot modify another user\'s wishlist' });
            return;
        }

        // Remove the product from the wishlist
        const result = await mongodb.getDb().collection('users').updateOne(
            { _id: userId } as any,
            {
                $pull: { wishlist: productId } as any,
                $set: { modifiedAt: new Date().toISOString() }
            }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Product removed from wishlist', productId });
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: error.message || 'Failed to remove product from wishlist' });
    }
});

export default router;