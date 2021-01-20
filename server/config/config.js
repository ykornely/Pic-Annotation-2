// Check environment

// env is either development or production. Default value: development
var env = process.env.NODE_ENV || 'development';

// Fetch environment config
var config = require('./config.json');
// envConfig is either the development or production section from config.json
envConfig = config[env];
// add environment config values to process.env
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
// process.env.MONGODB_URI has access to the current URI