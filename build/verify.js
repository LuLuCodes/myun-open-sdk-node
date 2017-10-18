"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function Verify(params, secret) {
    var entrys = Object.keys(params);
    entrys.sort();
    var str = '';
    entrys.forEach(function (key) {
        str += ('&' + key + '=' + encodeURIComponent(typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]));
    });
    str += secret;
    // console.log('请求参数', JSON.stringify(params));
    str = str.toUpperCase().substr(1, str.length).replace(/%20/g, '+');
    // console.log('加密串', str);
    var hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
exports.Verify = Verify;
;
