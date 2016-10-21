'use strict';

/**
 * Configure KONG API
 */

function delay(time) {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, time);
  });
}

function getConfigObj() {
  var envConfigObj = null;
  try {
    fs.statSync(envConfigJsPath);
    envConfigObj = require(envConfigJsPath);
  } catch(e) {
    try {
      fs.statSync(localConfigJsPath);
      envConfigObj = require(localConfigJsPath);
    } catch(e) {}
  }
  // configObj = envConfigObj;
  return _.defaultsDeep(envConfigObj || {}, defaultConfigObj);
}

const process = require('process');
const fetch = require('node-fetch');
const co = require('co');
const fs = require('fs');
const _ = require('lodash');

const defaultConfigObj = require('./config.json');
const envConfigJsPath = `./config.${process.env.NODE_ENV}.js`;
const localConfigJsPath = './config.local.js';
const configObj = getConfigObj();
const adminUrl = configObj.admin.url;
const headers = { "Content-Type": "application/json" };
const jsonHeaders = JSON.stringify(headers);
const consumersUrl = adminUrl + "/consumers";
const apisUrl = adminUrl + "/apis";
const apiGateway = process.env.API_GATEWAY || false;
const delayMs = 1500;

var stream = fs.createWriteStream("/tmp/kong-plugins-setup.sh");
stream.write('#!/bin/bash\n');

co(function* () {

  console.log("Running setup script against Kong Admin url " + adminUrl);

  console.log('-- => Deleting consumers...')
  yield Promise.all(deleteConsumers());

  console.log('-- => Deleting APIs...')
  yield delay(delayMs);
  yield Promise.all(deleteApis());

  console.log('++ => Creating APIs...')
  yield delay(delayMs);
  yield Promise.all(addApis());

  console.log('++ => Creating Consumers...')
  yield delay(delayMs);
  yield Promise.all(addConsumers());

  console.log('++ => Configuring API Plugins...')
  yield delay(delayMs);
  yield configApiPlugins();

  console.log('++ => Configuring Consumer Plugins...')
  yield delay(delayMs);
  yield configConsumerPlugins();

  stream.end();
  fs.chmodSync('/tmp/kong-plugins-setup.sh', 0o755);

  console.log('!! => Done.');
  console.log(Array(63).join("*"));
  console.log('* Please run /tmp/kong-plugins-setup.sh to complete plugin setup. *');
  console.log(Array(63).join("*"));

}).catch(err => console.log(err));

function deleteConsumers() {
  return Object.keys(configObj.consumers).map( key => {
    return fetch(`${consumersUrl}/${configObj.consumers[key].custom_id}`, { method: 'DELETE' });
  })
}

function deleteApis() {

  return Object.keys(configObj.apis).map(key => {
    if (!configObj.apis[key].apiGateway && !apiGateway) {
      return [];
    }
    const swagger = require(configObj.apis[key].swagger_file_path);
    return Object.keys(swagger.paths).map(path => {
      const requestPath = configObj.apis[key].request_base_path + path;
      const url = apisUrl + "/" + requestPath.substring(1).replace(/\//g, '-');
      return fetch(url, { method: 'DELETE' });
    });

  }).reduce((a, b) => { return a.concat(b) }, []); // flatten array of arrays
}

function addApis() {
  return Object.keys(configObj.apis).map(key => {
    if (!configObj.apis[key].apiGateway && !apiGateway) {
      return [];
    }

    const swagger = require(configObj.apis[key].swagger_file_path);

    return Object.keys(swagger.paths).map(path => {

      const requestPath = configObj.apis[key].request_base_path + path;

      const data = JSON.stringify({
        "name": requestPath.substring(1).replace(/\//g, '-'),
        "request_path": requestPath,
        "upstream_url": configObj.apis[key].upstream_url,
        "strip_request_path": configObj.apis[key].strip_request_path
      });

      return fetch(apisUrl, { method: 'PUT', headers: headers, body: data });
    });

  }).reduce((a, b) => { return a.concat(b) }, []); // flatten array of arrays
}

function addConsumers() {
  return Object.keys(configObj.consumers).map(key => {
    var fetchObj = null;
    if(configObj.consumers[key].active)
    {
      const data = JSON.stringify({
        "username": configObj.consumers[key].username,
        "custom_id": configObj.consumers[key].custom_id
      });
      fetchObj = fetch(consumersUrl, { method: 'PUT', headers: headers, body: data });
    }
    return fetchObj;
  });
}

function configApiPlugins() {
  return co(function*() {

    const res = yield fetch(apisUrl);
    let apiList = yield res.json();
    apiList = apiList.data;

    return Object.keys(configObj.plugins).map(key => {
      if (key == "ip-restriction" && process.env.IPRESTRICTION == "NO") return [];
      return configObj.plugins[key].apiConfigs.map(apiConfig =>{
        const rule = new RegExp("^"+ apiConfig.regexp + "$");
        const excludeList = apiConfig.exclude || [];
        const filteredApiList = _.filter(apiList, item => {
          const result = ((rule.test(item.name)) && (excludeList.indexOf(item.name) === -1));
          return result;
        });
        return filteredApiList.map(api => {
          let body = JSON.stringify({
            name: apiConfig.data.name,
            config: apiConfig.data.config
          });
          stream.write(`curl -XPUT -H 'Content-Type: application/json' -d '${body}' ${apisUrl}/${api.name}/plugins \n`);
        });
      });
    });
  }).catch(err => console.log(err));

}

function configConsumerPlugins() {
  return co(function*(){
    const res = yield fetch(consumersUrl);
    let consumerList = yield res.json();
    consumerList = consumerList.data;

    return Object.keys(configObj.plugins).map(key => {
      if (key == "ip-restriction" && process.env.IPRESTRICTION == "NO") return;
      if (!configObj.plugins[key].consumerConfigs) return;
      return configObj.plugins[key].consumerConfigs.map(consumerConfig => {
        const rule = new RegExp(consumerConfig.regexp);
        const excludeList = consumerConfig.exclude || [];
        const filteredConsumerList = _.filter(consumerList, item => {
          return rule.test(item.custom_id) && excludeList.indexOf(item.custom_id) === -1;
        });
        return filteredConsumerList.map(consumer => {
          let body = {};
          if (consumerConfig.data) {
            body = JSON.stringify(consumerConfig.data);
          };
          let url = `${consumersUrl}/${consumer.custom_id}${consumerConfig.pluginPath}`;
          //return fetch(url, { method: 'PUT', headers: headers, body: body });
          stream.write(`curl -XPUT -H 'Content-Type: application/json' -d '${body}' ${url} \n`);
        });
      });
    });
  }).catch(err => console.log(err));;
}
