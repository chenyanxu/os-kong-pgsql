module.exports = {
  "apis": {
    "myaxa-apifactory": {
      "upstream_url": "http://172.30.16.38:8080/api"
    },
    "myaxa-apifactory-testendpoints": {
      "upstream_url": "http://172.30.16.38:8080/api",
      "apiGateway": true
    },
    "myaxa-apifactory-oracle": {
      "apiGateway": false
    },
    "myaxa-apifactory-ods": {
      "upstream_url": "http://172.30.213.176:3000/api",
      "apiGateway": false
    }
  }
}
