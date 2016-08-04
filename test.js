var api = require("./api");
var converter = require("jp-conversion");

var cachedApi = require("./cachedApi");

//ZTNiMGM0NDI5OGZjMWMxNDlhZmJmNGM4OTk2ZmI5

/*
api.findActress('asami').then(rs => {
    console.log(rs);
});
*/

/*
var id = '20202';
api.findVideos(id).then(rs => {
    console.log(rs);
});
*/

/*
api.getVideos().then(rs => {
    console.log(rs);
})
*/


cachedApi.findActress('aki').then(rs => {
    console.log(rs);
});