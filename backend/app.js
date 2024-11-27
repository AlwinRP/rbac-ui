const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS middleware
const authRoute = require('./routes/auth');
const permissionsRouter = require('./routes/permissions');
const rolesRouter = require('./routes/roles');
const usersRouter = require('./routes/users');
const activityRouter=require('./routes/activities');
const systemRoutes = require('./routes/system'); // Import the new system status route
const auth = require('./middleware/auth');


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
}).then(() => console.log('Connected to MongoDB')) 
.catch((err) => console.error('Could not connect to MongoDB',err));

const corsOptions = {
    origin: 'http://localhost:3000', // Replace this with your frontend URL
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Use the CORS middleware with options
app.use(bodyParser.json());
app.use('/auth', authRoute);
app.use('/permissions', permissionsRouter);
app.use('/roles', rolesRouter);
app.use('/users',  usersRouter);
app.use('/activities', activityRouter); // Use the new activities route
app.use('/system', systemRoutes); // Use the new system status route

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
