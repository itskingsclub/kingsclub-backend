const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const challengeRoutes = require('./src/routes/challengeRoutes')
const paymentRoutes = require('./src/routes/payementRoutes')
const sequelize = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database and tables created!');
});

app.use(express.json());

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/challenge', challengeRoutes);
app.use('/payment', paymentRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});