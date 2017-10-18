import axios from 'axios';
import {Verify} from './verify';

function dateFormat(date, fmt) { // 时间格式化
    let o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }

    return fmt;
}


interface CloudHttpConfig {
    IP: string;
    Port: number;
    TimeOut?: number;
    CompanyCode: number;
    ClientToken: string;
    MyAppKey: string;
    MyAppToken: string;
    MyVersion: string;
    MyAppSecret: string;
}

export default class CloudHttp {
    private ip;
    private port;
    private timeout;
    private axios;
    private companyCode;
    private clientToken;
    private myAppKey;
    private myAppToken;
    private myVersion;
    private myAppSecret;

    constructor(config: CloudHttpConfig) {
        this.ip = config.IP;
        this.port = config.Port;
        this.timeout = 25000;
        if (config.TimeOut) {
            this.timeout = config.TimeOut;
        }
        this.clientToken = config.ClientToken;
        this.myAppKey = config.MyAppKey;
        this.myAppToken = config.MyAppToken;
        this.myVersion = config.MyVersion;
        this.myAppSecret = config.MyAppSecret;
        this.companyCode = config.CompanyCode;
        let options = {
            baseURL: `http://${this.ip}:${this.port}`,
            timeout: this.timeout,
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
        };
        this.axios = axios.create(options);
    }

    public getQueryTemplate() {
        return {
            CompanyCode: this.companyCode,
            UserSysNo: 1,
            Extra: {},
            Filters: [],
            Sort: [],
            PageIndex: 0,
            PageSize: 0,
            Verify: {
                ClientToken: this.clientToken,
                MyAppKey: this.myAppKey,
                MyAppToken: this.myAppToken,
                MyTimeStamp: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                MyVersion: this.myVersion,
                MySign: ''
            }
        };
    }

    public getActionTemplate() {
        return {
            CompanyCode: this.companyCode,
            UserSysNo: 1,
            Body: {},
            Verify: {
                ClientToken: this.clientToken,
                MyAppKey: this.myAppKey,
                MyAppToken: this.myAppToken,
                MyTimeStamp: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                MyVersion: this.myVersion,
                MySign: ''
            }
        };
    }

    public getEDITemplate() {
        return {
            CompanyCode: this.companyCode,
            UserSysNo: 1,
            Extra: {}
        };
    }

    public async postWeb(url: string, json: any) {
        json.Verify.MySign = Verify(json, this.myAppSecret);
        console.log(`http req: ${url}###${JSON.stringify(json)}`);
        try {
            let res = await axios.post(url, json);
            let data = res.data;
            if (!data) {
                return {IsSuccess: false, ErrorMsg: `${url}###云端未返回data`};
            }

            if (data.HasError) {
                console.error(`http res error: ${url}###${data.Fault.ErrorDescription}`);
                return {IsSuccess: false, ErrorMsg: `${url}###${data.Fault.ErrorDescription}`};
            }
            return {IsSuccess: true, Data: data.Body, Paging: data.Paging};
        } catch (error) {
            console.error(`http res: ${url}###${error.message}`);
            return {IsSuccess: false, ErrorMsg: `${url}###${error.message}`};
        }
    }

    public postEDI() {

    }
}