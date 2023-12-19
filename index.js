const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const challengeRoutes = require('./src/routes/challengeRoutes')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/auth', otpRoutes);
app.use('/challenge', challengeRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});