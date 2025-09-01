const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { initDB } = require('./models/db');
const seed = require('./models/seed');

const authRoutes = require('./routes/auth.routes');
const coursesRoutes = require('./routes/courses.routes');
const qcmRoutes = require('./routes/qcm.routes');
const messagesRoutes = require('./routes/messages.routes');
const statsRoutes = require('./routes/stats.routes');
const errorHandler = require('./middleware/error.middleware');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

initDB();
seed();

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/qcm', qcmRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/stats', statsRoutes);

// Sert le frontend (build statique)
app.use('/', express.static(path.join(__dirname, '../../frontend')));

// Middleware global d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API & Frontend disponibles sur http://localhost:${PORT}`));
