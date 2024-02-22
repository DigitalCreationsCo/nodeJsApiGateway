const express = require('express')
const app = express()
const helmet = require('helmet')
const axios = require('axios')
const HOST = "localhost"
const PORT = 3005
const httpClient = axios

app.use(express.json())
app.use(helmet())

app.post('/login', (req, res) => {
  res.send("logged in to the test api.")
})

app.post('/register', (req, res, next) => {
  httpClient({
    method: "POST",
    url: "http://localhost:3000/registerservice",
    headers: {
      "Content-Type": "application/json" 
    },
    data: {
      apiName: "testapi",
      protocol: "http",
      host: HOST,
      port: PORT,
    }
  })
  .then((response) => {
    res.send(response.data)
  })
  .catch((e) => {
    console.error({"error": e})
  })
})
app.post("/unregister", (req, res, next) => {
  httpClient({
    method: "POST",
    url: "http://localhost:3000/unregister",
    headers: { "Content-Type": "application/json" },
    data: {
      apiName: "testapi",
      protocol: "http",
      host: HOST,
      port: PORT,
    }
  })
  .then((response) => {
    res.send(response.data)
  })
  .catch((e) => {
    console.error({"error": e})
  })
})
app.listen(PORT, () => {
  const authString = 'johndoe:password'
  const encodedAuthString = Buffer.from(authString, 'utf-8').toString('base64')
  console.log(encodedAuthString)

  httpClient({
    method: "POST",
    url: "http://localhost:3000/registerservice",
    headers: { 
      "authorization": encodedAuthString,
      "Content-Type": "application/json" 
    },
    data: {
      apiName: "testapi",
      protocol: "http",
      host: HOST,
      port: PORT,
    }
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((e) => {
    console.error({"error": e})
  })
  console.log(`fakeAPI launch on port ${PORT}`)
})