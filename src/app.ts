import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Local Imports (NOTE: .mts extension is required in ESM)
import routes from './routes/index.mts';
import EntityNotFoundError from './errors/EntityNotFoundError.mts';
import {globalErrorHandler} from './middleware/error.middleware.mts';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app: express.Application = express();
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // to parse the incoming requests with URL parameters
app.use(express.json({ limit: '10kb' })); // To parse the incoming requests with JSON payloads

// --- 1. GLOBAL MIDDLEWARES ---

// Set security HTTP headers
// (Protects against XSS, sniffer attacks, etc.)
app.use(helmet());


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting (Prevent Brute Force & DOS attacks)
// Limits requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// --- 2. ROUTES ---
// We use versioning (/v1) so we can update the API later without breaking old clients
app.use('/api/v1/', routes);


// Health Check (Used by Docker/AWS to check if app is alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

// --- 3. ERROR HANDLING ---

// Handle Unhandled Routes (404)
// If code reaches here, it means no route matched above
    app.use((req, res, next) => {
    next(new EntityNotFoundError({message: `Can't find ${req.originalUrl} on this server!`, code: 'ERR_NF', statusCode: 404}));
    });

// Global Error Handler
app.use(globalErrorHandler);

// Default export replaces module.exports
export default app;