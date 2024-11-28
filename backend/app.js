const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS middleware
const authRoute = require('./routes/auth');
const permissionsRouter = require('./routes/permissions');
const rolesRouter = require('./routes/roles');
const usersRouter = require('./routes/users');
const activityRouter = require('./routes/activities');
const systemRoutes = require('./routes/system'); // Import the new system status route
const auth = require('./middleware/auth');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// CORS Options
const corsOptions = {
    origin: ['http://localhost:3000', 'https://rbac-client.vercel.app'], // No trailing slash
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
    allowedHeaders: ['Content-Type', 'Authorization'], // Include headers your client will send
    credentials: true, // Allow credentials if needed
    optionsSuccessStatus: 200, // Legacy browsers support
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Middleware to parse request body
app.use(bodyParser.json());

// Route handlers
app.use('/auth', authRoute);
app.use('/permissions', permissionsRouter);
app.use('/roles', rolesRouter);
app.use('/users', usersRouter);
app.use('/activities', activityRouter); 
app.use('/system', systemRoutes); 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
