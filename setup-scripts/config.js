'use strict'

const upstreamHost = process.env.MYAXA_APIFACTORY_SERVICE_HOST || '192.168.33.1'
const upstreamPort = process.env.MYAXA_APIFACTORY_SERVICE_PORT || 3000

const upstreamUrl = `http://${upstreamHost}:${upstreamPort}/api`

module.exports = {
  'admin': {
    'url': 'http://localhost:8001'
  },
  'apis': {
    'myaxa-apifactory': {
      'request_base_path': '',
      'upstream_url': upstreamUrl,
      'strip_request_path': false,
      'swagger_file_path': './swagger/api-factory-asia-swagger.json',
      'apiGateway': true
    },
    'myaxa-apifactory-testendpoints': {
      'request_base_path': '',
      'upstream_url': upstreamUrl,
      'strip_request_path': false,
      'swagger_file_path': './swagger/api-factory-asia-testendpoints.json',
      'apiGateway': true
    },
    'myaxa-apifactory-oracle': {
      'request_base_path': '',
      'upstream_url': 'http://192.168.33.1:3001/api',
      'strip_request_path': false,
      'swagger_file_path': './swagger/api-factory-oracle-swagger.json',
      'apiGateway': true
    },
    'myaxa-apifactory-ods': {
      'request_base_path': '',
      'upstream_url': upstreamUrl,
      'strip_request_path': false,
      'swagger_file_path': './swagger/api-factory-asia-ods-swagger.json',
      'apiGateway': true
    }
  },
  'consumers': {
    'myaxa-ph': {'username': 'myaxa-ph','custom_id': 'myaxa-ph', 'active': true},
    'myaxa-sg': {'username': 'myaxa-sg','custom_id': 'myaxa-sg', 'active': true},
    'myaxa-hk': {'username': 'myaxa-hk','custom_id': 'myaxa-hk', 'active': true},
    'tester': {'username': 'tester','custom_id': 'tester', 'active': true}
  },
  'plugins': {
    'acl': {
      'consumerConfigs': [
        {
          'regexp': '.*',
          'exclude': ['gelato-admin'],
          'pluginPath': '/acls',
          'data': {
            'group': 'myaxa-asia'
          }
        }
      ],
      'apiConfigs': [
        {
          'regexp': '.*',
          'exclude': ['gelato-admin'],
          'data': {
            'name': 'acl',
            'config': {'whitelist': 'myaxa-asia'}
          }
        }
      ]
    },
    'key-auth': {
      'consumerConfigs': [
        {
          'regexp': 'tester',
          'pluginPath': '/key-auth',
          'data': {'key': '1144c56b32dc4dd6aaccf37fa95b30a6'}
        },
        {
          'regexp': 'myaxa-ph',
          'pluginPath': '/key-auth',
          'data': {'key': '343056c9d1ed45a68954248b509b6664'}
        },
        {
          'regexp': 'myaxa-sg',
          'pluginPath': '/key-auth',
          'data': {'key': 'fefb3316999b4ceab5609a252702c8eb'}
        },
        {
          'regexp': 'myaxa-hk',
          'pluginPath': '/key-auth',
          'data': {'key': '0470018f232c4c4baa7ef74d2636c57f'}
        }
      ],
      'apiConfigs': [
        {
          'regexp': '.*',
          'exclude': ['gelato-admin'],
          'data': {
            'name': 'key-auth',
            'config': {'key_names': 'x-api-key'}
          }
        }
      ]
    },
    'rate-limiting': {
      'apiConfigs': [
        {
          'regexp': '.*',
          'exclude': ['gelato-admin'],
          'data': {
            'name': 'rate-limiting',
            'config': {'second': 200}
          }
        }
      ]
    },
    'file-log': {
      'apiConfigs': [
        {
          'regexp': '.*',
          'exclude': ['gelato-admin'],
          'data': {
            'name': 'file-log',
            'config': {'path': '/proc/1/fd/1'}
          }
        }
      ]
    },
    'correlation-id': {
      'apiConfigs': [
        {
          'regexp': '.*',
          'exclude': ['gelato-admin'],
          'data': {
            'name': 'correlation-id',
            'config': {
              'header_name': 'x-axa-contextheader-correlation-id',
              'generator': 'uuid#counter',
              'echo_downstream': true
            }
          }
        }
      ]
    },
    'hmac-auth': {
      'consumerConfigs': [
        {
          'regexp': 'tester',
          'pluginPath': '/hmac-auth',
          'data': {'username': 'tester', 'secret': 'tester'}
        },
        {
          'regexp': 'myaxa-ph',
          'pluginPath': '/hmac-auth',
          'data': {'username': 'myaxa-ph', 'secret': 'myaxa-ph'}
        },
        {
          'regexp': 'myaxa-sg',
          'pluginPath': '/hmac-auth',
          'data': {'username': 'myaxa-sg', 'secret': 'myaxa-sg'}
        },
        {
          'regexp': 'myaxa-hk',
          'pluginPath': '/hmac-auth',
          'data': {'username': 'myaxa-hk', 'secret': 'myaxa-hk'}
        }
      ],
      'apiConfigs': [
        {
          'regexp': 'v1-passwords-forgot-tokens-generate',
          'data': {
            'name': 'hmac-auth',
            'config': {
              'hide_credentials': false,
              'clock_skew': 300
            }
          }
        },
        {
          'regexp': 'v1-passwords-change-with-forgot-token',
          'data': {
            'name': 'hmac-auth',
            'config': {
              'hide_credentials': false,
              'clock_skew': 300
            }
          }
        },
        {
          'regexp': 'v1-passwords-reset',
          'data': {
            'name': 'hmac-auth',
            'config': {
              'hide_credentials': false,
              'clock_skew': 300
            }
          }
        }

      ]
    }
  }
}
