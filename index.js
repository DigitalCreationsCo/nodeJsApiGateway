const express = require('express');
const helmet = require('helmet');
const app = express();
const registry = require('./routes/registry.json');
const PORT = 3000;
const routes = require('./routes');

app.use(express.json());
app.use(helmet())

const auth = (req, res, next) => {
  const url = req.protocol + '://' + req.hostname + PORT + req.path
  const authString = Buffer.from(req.headers.authorization, 'base64').toString('utf-8')
  const authParts = authString.split(':')
  const username = authParts[0]
  const password = authParts[1]
  console.log(username + ' | ' + password)
  const user = registry.auth.users[username]
  if(user){
    if(user.username === username && user.password === password) {
      next()
    } else {
      res.send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: Incorrect Password.' });
    }
  } else {
    res.send({ authenticated: false, path: url, message: 'Authentication Unsuccessful: User ' + username + ' does not exist.' });
  }
}
app.use(auth);
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Gateway is listening on PORT ${PORT}.`);
});