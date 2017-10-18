import * as crypto from 'crypto';

export function  Verify(params:any, secret:string) {
    const entrys = Object.keys(params);
    entrys.sort();
    let str = '';
    entrys.forEach(key => {
        str += ('&' + key + '=' + encodeURIComponent(typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key]));
    });
    str += secret;
    // console.log('请求参数', JSON.stringify(params));
    str = str.toUpperCase().substr(1, str.length).replace(/%20/g, '+');
    // console.log('加密串', str);
    let hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
};