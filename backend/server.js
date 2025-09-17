const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const promClient = require('prom-client');
const jwt = require('jsonwebtoken');

// Enable Prometheus metrics collection
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

const todosCreatedTotal = new promClient.Counter({
  name: 'todos_created_total',
  help: 'Total number of todos created',
  labelNames: ['code']
});

const todosDeletedTotal = new promClient.Counter({
  name: 'todos_deleted_total',
  help: 'Total number of todos deleted',
  labelNames: ['code']
});

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware for metrics
app.use((req, res, next) => {
  res.locals.startEpoch = Date.now();
  next();
});

// Auth routes (public)
app.use('/api/auth', require('./routes/auth'));

// Todo routes (protected)
app.use('/api/todos', (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}, require('./routes/todos'));

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Response handler for HTTP metrics
app.use((req, res, next) => {
  if (res.locals.startEpoch) {
    const responseTimeInMs = Date.now() - res.locals.startEpoch;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route ? req.route.path : '', res.statusCode)
      .observe(responseTimeInMs);
  }
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
});