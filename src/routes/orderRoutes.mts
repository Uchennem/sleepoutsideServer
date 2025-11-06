import type {Request, Response} from "express";
import {Router} from "express";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import { OrderSchema } from "../database/json-schema.ts";
import type { Order } from "../models/types.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { calculateServerPricedOrder, calculateShippingCost } from "../models/orderModel.mts";

// @ts-ignore
const ajv = new Ajv();
// @ts-ignore
addFormats(ajv);

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
    // get the body of the request
    const body = req.body as Order;

    if (!body.orderItems) {
        throw new EntityNotFoundError({
            message: "Missing orderItems",
            statusCode: 400
        });
    }

    const { orderItems, subtotal, missingProductIds } = await calculateServerPricedOrder(body.orderItems as any);
    
    if (missingProductIds.length > 0) {
        throw new EntityNotFoundError({
            message: "Some products were not found. Please try again later.",
            statusCode: 400
        });
    }
    
    // build out a new order object
    const newOrder:Order = {
        ...req.body,
        status: 'pending',
        totalPrice: subtotal,
        shippingCost: calculateShippingCost(orderItems),
        taxAmount: subtotal * 0.06,
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