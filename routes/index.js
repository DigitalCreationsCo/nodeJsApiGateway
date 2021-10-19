const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')
const fs = require('fs')
const loadBalancer = require("../util/loadBalancer")
const { resolveSoa } = require('dns')
const httpClient = axios

router.post("/enable/:apiName", (req, res) => {
  const apiName = req.params.apiName
  const requestBody = req.body
  const instances = registry.services[apiName].instances
  const index = getIndex(requestBody)
  if (index == -1) {
    res.send({ status: 'error', message: "Could not find " + requestBody.url + " for service " + apiName })
  } else {
    instances[index].enabled = requestBody.enabled
    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
      if (error) {
        res.send("Could not " + (requestBody.enabled ? "enable '" : "disable '") + requestBody.url + "' for service " + apiName + "\n" + error)
      } else {
        res.send("Successfully " + (requestBody.enabled ? "enabled '" : "disabled '") + requestBody.url + "' for service " + apiName + "\n")
      }
    })
  }
})

router.all("/:apiName/:path", (req, res) => {
  const service = registry.services[req.params.apiName]
  if (service) {
    if (!service.loadBalanceStrategy) {
      service.loadBalanceStrategy = "ROUND_ROBIN"
      fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
        if (error) {
          res.send("Couldn't write load balance strategy." + error)
        }
      })
    }
    const newIndex = loadBalancer[service.loadBalanceStrategy](service)
    const url = service.instances[newIndex].url
    console.log(url + req.params.path)
    httpClient({
      method: req.method,
      url: url + req.params.path,
      headers: req.headers,
      data: req.body
    })
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      res.status(500).send({"ERROR: ": error})
    })
  } else{
    res.send("Api Name doesn't exist!")
  }
})

router.post("/registerservice", (req, res) => {
  const registrationInfo = req.body
  registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host +
    ":" + registrationInfo.port + "/";

  if(apiExists(registrationInfo)){
    console.log(registrationInfo)
    res.send("Configuration exists for " + registrationInfo.apiName +
    "at " + registrationInfo.url)
  } else {
    registry.services[registrationInfo.apiName].instances.push({ ...registrationInfo })
    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
      if (error) {
        res.send("Error registering " + registrationInfo.apiName + '\n' + error)
      } else {
        res.send("Successfully registered " + registrationInfo.apiName)
      }
    })
  }
})

router.post("/unregister", (req, res) => {
  const registrationInfo = req.body
  if (apiExists(registrationInfo)) {
    const index = getIndex(registrationInfo)
    registry.services[registrationInfo.apiName].instances.splice(index, 1)
    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
      if (error) {
        res.send("Error removing " + registrationInfo.apiName + '\n' + error)
      } else {
        res.send(registrationInfo.apiName + " at " + registrationInfo.url + " has been successfully removed from the registry.")
      }
    })
  } else {
    res.send("Configuration does not exist for " + registrationInfo.apiName + "at " + registrationInfo.url)
  }
})

function apiExists(registrationInfo) {
  let exists = false

  registry.services[registrationInfo.apiName].instances.forEach(instance => {
    if (instance.url === registrationInfo.url) {
      exists = true
      return
    }
  })
  return exists
}

function getIndex(registrationInfo) {
  let index = registry.services[registrationInfo.apiName].instances.findIndex((instance) => {
    return registrationInfo.url === instance.url
  })
  return index
}

module.exports = router