const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const challengeRoutes = require('./src/routes/challengeRoutes')
const sequelize = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database and tables created!');
});

app.use(express.json());

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/auth', otpRoutes);
app.use('/challenge', challengeRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});