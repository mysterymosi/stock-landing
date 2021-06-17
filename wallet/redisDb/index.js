'use strict';
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype);

// Connect to redis at 127.0.0.1 port 6379 no password.
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASS
});

client
  .on('connect', function () {
    console.log('connected')
  })

module.exports = {
    client
}
 