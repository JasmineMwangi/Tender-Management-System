// backend/server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const listEndpoints = require('express-list-endpoints');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const { connectDB, sequelize } = require('./config/database');

const tenderRoutes = require('./routes/tenderRoutes');
const bidRoutes = require('./routes/bidRoutes');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileroutes');
const bidEvaluationRoutes  = require('./routes/bidEvaluation');
const anomalyRoutes        = require('./routes/anomaly');
const recommendationRoutes = require('./routes/recommendation');

const app = express();

// ------------------- Security Middleware -------------------
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

// ------------------- Rate Limiting -------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP
});
app.use('/api/', limiter);

// ------------------- Body Parsing -------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ------------------- Logging -------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ------------------- Static Files -------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------- Routes -------------------
app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/bids', bidRoutes); 
app.use('/api/profiles', profileRoutes);

// Evaluation, Anomaly & Recommendation routes
// const bidEvaluationRoutes  = require('./routes/bidEvaluation');
// const anomalyRoutes        = require('./routes/anomaly');
// const recommendationRoutes = require('./routes/recommendation');

app.use('/api/evaluations',     bidEvaluationRoutes);
app.use('/api/anomalies',       anomalyRoutes);
app.use('/api/recommendations', recommendationRoutes);

// ------------------- Health Check -------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ------------------- Error Handling -------------------
app.use(notFound);
app.use(errorHandler);

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true, logging: false }); // change to { alter: true } in production

    console.table(listEndpoints(app)); // ✅ Log available routes
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
