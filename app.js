'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('express-handlebars')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const api = require('./routes')
const config = require('./config')
const helmet = require('helmet')
const session = require('cookie-session')
const { expressCspHeader, NONCE } = require('express-csp-header')

const csp = require(`helmet-csp`)
const uuid = require(`uuid`)
const winston = require('winston');

const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDocument = require('swagger-jsdoc')
const swaggerDocument = YAML.load('./swagger-ui/openapi.yaml')

const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ subdomain: 'https://appiot.localtunnel.me', port: 3000, local_https: true });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  tunnel.url
  tunnel.on('close', () => {
    // tunnels are closed
  })
})()

console.log(localtunnel)



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// https://swagger.io/specification/

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: "1.0.0",
            title: 'REST API con Swagger',
            description: "Información del API",
            contact: {
                name: "Homero Torrijos",
                email: 'homertoch@hotmail.com',
                url: 'https://www.linkedin.com/in/homerotorrijos/'
            },
            license: {
                name: "MIT Licence",
                url: "https://opensource.org/licenses/MIT"
            }
        },
        servers: [{
            url: 'https://localhost:3005/',
            description: 'Servidor local'
          }],
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        tags: [
          {
            name: 'Endpoints (recursos)'
          }
        ],
        paths: {
          '/api/v1/users': {
            get: {
              summary: "Obtine los Usuarios",
              tags: ['Usuarios'],
              description: 'Muestra todos los usuarios ',
              operationId: 'getUsers',
              
              responses: {
                '200': {
                  description: 'Users were obtained',
                }
              }
            },
            
          },
          '/api/v1/signUp':{
            post: {
                summary: "Creas un usuario",
                tags: ['Usuarios'],
                description: 'Registra un usuario',
                operationId: 'createUsers',
                parameters: [

                ],
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  },
                  required: true
                },
                responses: {
                  '200': {
                    description: 'Nuevo usuario creado'
                  },
                  '201': {
                    description: 'Obtención de Token de acceso',
                    content:{
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/TokenId'
                        }
                      }
                    }
                  },
                  '500': {
                    description: 'Invalid parameters',
                    content: {
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/Error'
                        },
                        example: {
                          message: 'User identificationNumbers 10, 20 already exist',
                          internal_code: 'invalid_parameters'
                        }
                      }
                    }
                  }
                }
              }
          },
          '/api/v1/signIn':{
            post: {
                summary: "Incio de sesión",
                tags: ['Usuarios'],
                description: 'Inicio de sesión',
                operationId: 'userlogin',
                parameters: [

                ],
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/UserLogin'
                      }
                    }
                  },
                  required: true
                },
                responses: {
                  '200': {
                    description: 'Usuario logeado correctamente',
                    content:{
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/TokenId'
                        }
                      }
                    }
                  },
                  '500': {
                    description: 'Invalid parameters',
                    content: {
                      'application/json': {
                        schema: {
                          $ref: '#/components/schemas/Error'
                        },
                        example: {
                          message: 'User identificationNumbers 10, 20 already exist',
                          internal_code: 'invalid_parameters'
                        }
                      }
                    }
                  }
                }
              }
          },

          '/api/v1/sensortag': {
            get: {
              summary: "Obtine todo los sensores registrados",
              tags: ['Sensortag'],
              description: 'Muestra todos los usuarios ',
              //operationId: 'getSensotag',
              responses: {
                '200': {
                  description: '',
                }
              }
            },
            post: {
              summary: "Obtiene un registro con el sensotagId",
              tags: ['Sensortag'],
              description: 'Muestra todos los usuarios ',
              //operationId: 'getSensotag',
              responses: {
                '200': {
                  description: '',
                }
              }
            }
          },

          '/api/v1/sensortag/sensotagId': {
            get: {
              summary: "Obtiene un registro con el sensotagId",
              tags: ['Sensortag'],
              description: 'Muestra todos los usuarios ',
              //operationId: 'getSensotag',
              responses: {
                '200': {
                  description: '',
                }
              }
            },
            put: {
              summary: "Obtiene un registro con el sensotagId",
              tags: ['Sensortag'],
              description: 'Muestra todos los usuarios ',
              //operationId: 'getSensotag',
              responses: {
                '200': {
                  description: '',
                }
              }
            },
            delete: {
              summary: "Obtiene un registro con el sensotagId",
              tags: ['Sensortag'],
              description: 'Muestra todos los usuarios ',
              //operationId: 'getSensotag',
              responses: {
                '200': {
                  description: '',
                }
              }
            },
          },


          

         

          
        },
        components: {
          schemas: {

            // Datos del usuario
          
            email: {
              type: 'string',
              description: 'Es único es irrepetible, se valida',
              example: "mail@mail.com"
            },
            name: {
              type: 'string',
              example: 'raparicio'
            },
            password: {
              type: 'string',
              description: 'alfanuermico',
              example: "89$278"
            },
            singupDate: {
              type: 'date',
              description: 'Fecha',
              example: "2020-05-09T19:58:45.299Z"
            },
            lastLogin: {
              type: 'date',
              description: 'Fecha',
              example: "2019-03-09T19:58:45.299Z"
            },

            // Usuario propiedades
            User: {
              type: 'object',
              properties: {
                email: {
                  $ref: '#/components/schemas/email'
                },
                name: {
                  $ref: '#/components/schemas/name'
                },
                password: {
                  $ref: '#/components/schemas/password'
                }
              }
            },

            UserLogin: {
              type: 'object',
              properties: {
                email: {
                  $ref: '#/components/schemas/email'
                },
                password: {
                  $ref: '#/components/schemas/password'
                }
              }
            },


            // Estructura completa del usuario
            Users: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },

            token:{
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
            },

            //Token
            TokenId: {
              type: 'object',
              properties: {
                token: {
                    $ref: '#/components/schemas/token'
                  }
                }
            },

            //Error
            Error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                },
                internal_code: {
                  type: 'string'
                }
              }
            }
          },
          securitySchemes: {
            ApiKeyAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'x-api-key'
            }
          }
        }
      },
    // ['routes/*.js']
    apis: ["app.js"]
}


//  

winston.loggers.add('development', {
  console: {
    level: 'silly',
    colorize: 'true',
    label: 'category one'
  },
  file: {
    filename: './console/logs.log',
    level: 'warn'
  }
});



const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 Hora

app.use(session({
  name: 'session',
  keys: [config.KEY_TOKEN, config.REFRESH_KEY_TOKEN],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: '192.168.0.9',
    path: '/api/v1',
    expires: expiryDate
  }
}))





app.disable('x-powered-by')
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By")
  next()
})


/* app.use(cors())
app.use((req, res, next) => {
  //res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com")
  //res.header("Content-Type", "application/json")
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Access-Control-Allow-Origin', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Allow', 'GET, POST, PUT, DELETE')
  next()
}) */


//app.use(helmet())

/* app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
 */



/* app.use(
  helmet({
    contentSecurityPolicy: false,
  })
) */

// BLOQUEA HTTP y SOLO USA HTTPS

/* app.all('*', function(req, res, next){

  console.log('Solicitud (req) inicia: ', req.secure, req.hostname, req.url)

 if (req.secure) {
  return next()
 }  

 //res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
 
})  
 */

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.engine('.hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs'
}))

app.use(helmet())

app.set('view engine', '.hbs')

app.use('/api', api)


//Rutas


app.get('/accessControl', (req, res) =>{
    res.render('accessControl')
})

app.get('/logout', (req, res) =>{
  res.render('logout')
})

app.get('/sensortag', (req, res) =>{
    res.render('sensortag')
})

app.use((req, res, next) => {
  const err = new Error('Recurso no valido')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    Mensaje: err.message,
    Error: err
  })
})



module.exports = app