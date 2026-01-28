import mongodb from "./database/index.mts";
import app from "./app.ts";

const port = process.env.PORT || 3000;


// Initialize the database connection, we pass a callback into the function to handle any errors that may occur during the connection process.
mongodb.initDb((err:Error) => {
  if (err) {
    console.error("Error initializing database:", err);
    return;
  } else {
    // Start the server after successful initialization of the database
      const server = app.listen(port, () => console.log(`Server is listening on port ${port}...`));

      if (process.env.NODE_ENV === 'production') {
        // we only want this to happen in production
      // Graceful Shutdown for SIGTERM (e.g., Heroku/AWS/Kubernetes restarts)
      process.on('SIGTERM', () => {
        console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
        server.close(() => {
          console.log('💥 Process terminated!');
        });
      });
    }
}
});

