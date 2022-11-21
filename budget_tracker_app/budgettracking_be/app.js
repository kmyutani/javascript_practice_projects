// Imports
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');

// Constants
const PORT = process.env.PORT || 4000;
const app = express();

// Database Connection
require('./utils/db');

// Essential Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users/', userRoutes);
app.use('/api/categories/', categoriesRoutes);
app.use('/api/transactions/', transactionsRoutes);


// Error Handling Middlewares
app.use((res, req, next)=>{

    const error = new Error('Not Found');
    error.status = 404;
    next(error);

});

app.use((err, req, res, next)=>{

    res.status(err.status || 500).send({

        error: {
            message: err.message

        }
    })
});

// Connection Listener
app.listen(PORT, ()=> {
    console.log(`Server is running on port: ${PORT}`);
});