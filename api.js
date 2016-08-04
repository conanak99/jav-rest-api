"use strict";
// Get image from xkcn.info
var request = require("request");
var converter = require("jp-conversion");
var _ = require('lodash');

class Api {
    constructor() {
        this._apiId = 'UrwskPfkqQ0DuVry2gYL';
        this._affiliateId = "10278-996";

        this._url = `https://api.dmm.com/affiliate/v3/`;
    }

    findActress(name, page = 1, resultPerPage = 100) {
        
        var hiraganaName = name ? converter.convert(name.toLowerCase()).hiragana : '';

        return new Promise((resolve, reject) => {
            request({
                url: this._url + 'ActressSearch',
                qs: {
                    api_id: this._apiId,
                    affiliate_id: this._affiliateId,
                    output: 'json',
                    offset: page,
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

                var actressesWithImage = body.result.actress.filter(actress => actress.imageURL);

                // Get actress with image only
                var result = actressesWithImage.map(actress => {
                    return {
                        id: actress.id,
                        name: actress.imageURL.large
                            .replace('http://pics.dmm.co.jp/mono/actjpgs/', '')
                            .replace('.jpg', '').split('_')
                            .map(_.capitalize).join(' '),
                        japanName: actress.name,
                        bust: actress.bust,
                        waist: actress.waist,
                        hip: actress.hip,
                        height: actress.height,
                        birthday: actress.birthday,
                        imageUrl: actress.imageURL.large,
                        siteUrl: actress.listURL.digital
                    }
                });
                resolve({
                    count: body.result.result_count,
                    total: body.result.total_count,
                    result: result
                });
            })
        });
    }

    findVideos(actressId, page = 1, resultPerPage = 100) {

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
                    offset: page,
                    hits: resultPerPage
                },
                method: "GET",
                json: true,

            }, (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Get actress with image only
                var result = body.result.items.map(item => {
                    return {
                        name: item.title,
                        siteUrl: item.URL,
                        imageUrl: item.imageURL.small,
                        date: item.date,
                        maker: item.iteminfo.maker,
                        review: item.review,
                        actress: item.iteminfo.actress
                    };
                });

                resolve({
                    count: body.result.result_count,
                    total: body.result.total_count,
                    result: result
                });
            })
        });
    }

    getVideos(page = 1, resultPerPage = 100) {

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
                    offset: page,
                    hits: resultPerPage
                },
                method: "GET",
                json: true,

            }, (err, response, body) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Get actress with image only
                var result = body.result.items.map(item => {
                    return {
                        name: item.title,
                        siteUrl: item.URL,
                        imageUrl: item.imageURL.small,
                        date: item.date,
                        review: item.review,
                        maker: item.iteminfo.maker,
                        actress: item.iteminfo.actress
                    };
                });

                resolve({
                    count: body.result.result_count,
                    total: body.result.total_count,
                    result: result
                });
            })
        });
    }
}

module.exports = new Api();
