import type { Request, Response, NextFunction  } from 'express';
import CustomError from '../errors/CustomError.mts';

const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    } 
    if (typeof err === 'string') {
        return err;
    } 
    if(err && typeof err === 'object' && "message" in err) {
        return String(err.message);
    }
    return "An unknown error occurred";
};
   
 
/**
 * Global error handling middleware.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
export const globalErrorHandler = (err: unknown, req:Request, res:Response, next:NextFunction) => {

    /**
     * If the response has already been sent, prevent double rendering. This can happen if the
     * process of rendering an error triggers an error itself.
     */
    if (res.headersSent) {
        // console.log(`Attempted to render again for: ${req.url}`);
        //next(err);
        return;
    }
   // what is a CustomError? Go check out errors/CustomError.mts for more info.
    if(err instanceof CustomError) {
        res.status(err.statusCode).json({ error:{
            message: err.message,
            statusCode: err.statusCode,
            code: err.code
        }});
        return;
    } 
 
     // Catch all: Send a generic 500 error message if we don't know what the error is.
    res.status(500).json({error: {message: getErrorMessage(err) || "An Error occurred. Please try again later."}});
};