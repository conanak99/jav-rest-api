"use strict";
var redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || process.env.IP || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASS 
    });

class CachedApi {
    constructor() {
        this._api = require('./api');
    }

    findActress(name, page = 1, resultPerPage = 100) {
        let key = `findActress-${name}-${page}-${resultPerPage}`;
        return this._getFromCache(key, this._api.findActress.bind(this._api, name, page, resultPerPage));
    }

    findVideos(actressId, page = 1, resultPerPage = 100) {
        let key = `findVideos-${actressId}-${page}-${resultPerPage}`;
         return this._getFromCache(key, this._api.findVideos.bind(this._api, actressId, page, resultPerPage));
    }

    getVideos(page = 1, resultPerPage = 100) {
        let key = `getVideos-${page}-${resultPerPage}`;
        return this._getFromCache(key, this._api.getVideos.bind(this._api, page, resultPerPage));
    }

    _getFromCache(key, boundFunction) {
        return new Promise((resolve, reject) => {
            client.get(key, function(err, reply) {
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
