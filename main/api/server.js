const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
// Konfigurasi .env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve folder uploads
app.use(cors({ origin: "http://localhost:3001" }));

// Hubungkan ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Failed:', err));

// Routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

//Handling Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Jalankan server
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
