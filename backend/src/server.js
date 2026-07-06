import app from './app.js';

const PORT = process.env.PORT || 5000;

// Start the HTTP server and listen on the configured port.
app.listen(PORT, () => {
  console.log(`Secure Library API listening on port ${PORT}`);
});
