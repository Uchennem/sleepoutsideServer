import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongodb from "./database/index.mts";
import baseRoutes from "./routes/index.ts";
import { globalErrorHandler } from "./middleware/error-handlers.mts";
import cors from 'cors';

// Because we are using ESModules instead of CommonJS modules these two expected variables will not get set. We can build them manually to avoid any problems later
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

const app = express();
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // to parse the incoming requests with URL parameters
app.use(express.json()); // To parse the incoming requests with JSON payloads

// load all our routes. See routes/index.ts for more info
app.use(cors());
app.use("/", baseRoutes);

// load error handler middleware
app.use(globalErrorHandler);
// Initialize the database connection, we pass a callback into the function to handle any errors that may occur during the connection process.
mongodb.initDb((err:Error) => {
  if (err) {
    console.error("Error initializing database:", err);
    return;
  } else
    // Start the server after successful initialization of the database
      app.listen(port, () => console.log(`Server is listening on port ${port}...`));
});
