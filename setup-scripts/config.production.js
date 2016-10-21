module.exports = {
  "admin": {
    "url": "https://kong-adminapi-api-factory-asia.apps.axa.com.sg"
  },
  "apis": {
    "myaxa-apifactory": {
      "upstream_url": "http://172.30.179.9:8080/api"
    },
    "myaxa-apifactory-testendpoints": {
      "apiGateway": false
    },
    "myaxa-apifactory-oracle": {
      "apiGateway": false
    },
    "myaxa-apifactory-ods": {
      "apiGateway": false
    }
  },
  "consumers": {
    "myaxa-ph": {"username": "myaxa-ph","custom_id": "myaxa-ph", "active": true},
    "myaxa-sg": {"username": "myaxa-sg","custom_id": "myaxa-sg", "active": false},
    "tester": {"username": "tester","custom_id": "tester", "active": true}
  },
  "plugins": {
    "key-auth": {
      "consumerConfigs": [
        {
          "regexp": "tester",
          "pluginPath": "/key-auth",
          "data": {"key": "1144c56b32dc4dd6aaccf37fa95b30a6"}
        },
        {
          "regexp": "myaxa-ph",
          "pluginPath": "/key-auth",
          "data": {"key": "6b61152842474d1892ac67688ac92340"}
        }
      ]
    },
    "ip-restriction": {
      "apiConfigs": [
        {
          "regexp": ".*",
          "exclude": ["gelato-admin"],
          "data": {
            "name": "ip-restriction",
            "config": {"whitelist": ["52.69.161.182", "52.69.182.95", "122.55.32.233"]}
          }
        }
      ]
    }
  }
}
