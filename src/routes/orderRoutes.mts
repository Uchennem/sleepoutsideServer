import type {Request, Response} from "express";
import {Router} from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import { OrderSchema } from "../database/json-schema.ts";
import type { Order } from "../models/types.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";

// @ts-ignore
const ajv = new Ajv();
// @ts-ignore
addFormats(ajv);

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
    // get the body of the request
    const body = req.body as Order;
    
        // we shouldn't trust that the amounts sent in the body are correct. They are too easy to change clientside. So we should calculate our own totals here. You can probably re-use some of the code from the client...
        // You can map over body.orderItems...for each item you need to do a lookup in the database, then insert the values for price, and finalPrice into the item. Then make a function to calculate tax, shipping, and total.
        // You will need to make the callback in your map async because we are making calls to the database. This means that you will get an array of promises back from map. You can use Promise.all() to wait for all of them to resolve before we continue.
        
        // build out a new order object
    const newOrder:Order = {
        ...req.body,
        status: 'pending',
        totalPrice: 0, // luke to do
        // the rest of the stuff we need to update like orderTotal, tax, shipping, etc
    }
        console.log(newOrder)
        const validate = ajv.compile(OrderSchema)
        if(!validate(newOrder)) {
            if(validate.errors) {
                // validate.errors is an array.  I've never seen more than one error come back...but just in case we can map over it and pull out the message(s)
                // We need to do this because our errorHandler is expecting a string...not an array of objects.
                const message = validate.errors.map((error:any)=> error.instancePath+" "+error.message).join(", ");
                throw new EntityNotFoundError({message:message, statusCode:400 });
            }
        }
        //  use a model function to actually create our order in the database
         
    res.status(201).json({message : 'Order Created'});
});


export default router; // Export the router to use it in the main file