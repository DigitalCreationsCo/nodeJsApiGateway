const express = require('express');
const helmet = require('helmet');
const app = express();
const PORT = 3000;
const routes = require('./routes');

app.use(express.json());
app.use(helmet())
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Gateway is listening on PORT ${PORT}.`);
});