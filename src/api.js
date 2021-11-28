"use strict";
// Get image from xkcn.info
const request = require("request");
const converter = require("jp-conversion");
const _ = require('lodash');

class Api {
    constructor() {
        this._apiId = 'UrwskPfkqQ0DuVry2gYL';
        this._affiliateId = "10278-996";

        this._url = `https://api.dmm.com/affiliate/v3/`;
        this._cache = {};
    }

    findActress(name, offset = 1, resultPerPage = 100) {
        const hiraganaName = name ? converter.convert(name.toLowerCase()).hiragana : '';

        return new Promise((resolve, reject) => {
            request({
                url: this._url + 'ActressSearch',
                qs: {
                    api_id: this._apiId,
                    affiliate_id: this._affiliateId,
                    output: 'json',
                    offset: offset,
                    hits: resultPerPage,
                    keyword: hiraganaName,
                    sort: '-birthday'
                },
                method: "GET",
                json: true,

            }, (err, response, body) => {

                if (err) {
                    reject(err);
                    return;
                }

                if (body.result.result_count == 0) {
                    body.result.actress = [];
                }

                const actressesWithImage = body.result.actress.filter(actress => actress.imageURL);

                // Get actress with image only
                const result = actressesWithImage.map(actress => {
                    return {
                        id: actress.id,
                        name: actress.imageURL.large
                            .replace('http://pics.dmm.co.jp/mono/actjpgs/', '')
                            .replace('.jpg', '')
                            .replace('hu', 'fu')
                            .replace('tu', 'tsu')
                            .replace(/[0-9]/g, '')
                            .split('_')
                            .map(_.capitalize)
                            .filter(s => isNaN(s))
                            .join(' '),
                        japanName: actress.name,
                        bust: actress.bust,
                        waist: actress.waist,
                        hip: actress.hip,
                        height: actress.height,
                        birthday: actress.birthday,
                        imageUrl: actress.imageURL.large.replace('http', 'https'),
                        siteUrl: actress.listURL.digital
                    }
                });

                for (const actress of result) {
                    this._cache[actress.id] = actress
                }

                resolve({
                    count: parseInt(body.result.result_count, 10),
                    total: parseInt(body.result.total_count, 10),
                    result: result
                });
            })
        });
    }

    findActressByID(actressID) {
        const actress = this._cache[actressID] || {}
        return Promise.resolve(actress)
    }

    findVideos(actressId, offset = 1, resultPerPage = 100) {
        return new Promise((resolve, reject) => {
            request({
                url: this._url + 'ItemList',
                qs: {
                    api_id: this._apiId,
                    affiliate_id: this._affiliateId,
                    site: 'DMM.R18',
                    output: 'json',
                    service: 'digital',
                    floor: 'videoa',
                    article: 'actress',
                    article_id: actressId,
                    offset: offset,
                    hits: resultPerPage
                },
                method: "GET",
                json: true,

            }, (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (body.result.result_count == 0) {
                    body.result.items = [];
                }

                const result = body.result.items.map(item => {
                    return {
                        name: item.title,
                        siteUrl: item.URL,
                        imageUrl: item.imageURL.list,
                        date: item.date,
                        maker: item.iteminfo.maker,
                        review: item.review ? {
                            count: item.review.count,
                            average: parseFloat(item.review.average)
                        } : {
                            count: 0,
                            average: 3
                        },
                        actress: item.iteminfo.actress
                    };
                });

                resolve({
                    count: parseInt(body.result.result_count, 10),
                    total: parseInt(body.result.total_count, 10),
                    result: result
                });
            })
        });
    }
}

module.exports = new Api();