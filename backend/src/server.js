const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { PORT, UPLOAD_DIR } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const useCaseRoutes = require('./routes/useCaseRoutes');
const llmRoutes = require('./routes/llmRoutes');
const costRoutes = require('./routes/costRoutes');
const roiRoutes = require('./routes/roiRoutes');
const riskRoutes = require('./routes/riskRoutes');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/use-cases', useCaseRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/cost', costRoutes);
app.use('/api/roi', roiRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
