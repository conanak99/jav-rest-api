"use strict";
var redis = require("redis");
var config = {
        host: process.env.REDIS_HOST || process.env.IP || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASS
    };

class CachedApi {
    constructor() {
        this._client = redis.createClient(config);
        this._api = require('./api');
        console.log(config);
    }

    findActress(name, page = 1, resultPerPage = 100) {
        let key = `findActress-${name}-${page}-${resultPerPage}`;
        return this._getFromCache(key, this._api.findActress.bind(this._api, name, page, resultPerPage));
    }

    findVideos(actressId, page = 1, resultPerPage = 100) {
        let key = `findVideos-${actressId}-${page}-${resultPerPage}`;
         return this._getFromCache(key, this._api.findVideos.bind(this._api, actressId, page, resultPerPage));
    }

    _getFromCache(key, boundFunction) {
	const client = this._client;
        return new Promise((resolve, reject) => {
           client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (reply === null) {
                    console.log("Cache miss: " + key);
                    boundFunction().then(result => {
                        client.set(key, JSON.stringify(result));
                        resolve(result);
                    });
                }
                else {
                    console.log("Cache hit: " + key);
                    resolve(JSON.parse(reply));
                }
            });
        });
    }
}

module.exports = new CachedApi();
