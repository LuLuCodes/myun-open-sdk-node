"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var verify_1 = require("./verify");
function dateFormat(date, fmt) {
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
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
var CloudHttp = /** @class */ (function () {
    function CloudHttp(config) {
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
        var options = {
            baseURL: "http://" + this.ip + ":" + this.port,
            timeout: this.timeout,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        };
        this.axios = axios_1.default.create(options);
    }
    CloudHttp.prototype.getQueryTemplate = function () {
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
    };
    CloudHttp.prototype.getActionTemplate = function () {
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
    };
    CloudHttp.prototype.getEDITemplate = function () {
        return {
            CompanyCode: this.companyCode,
            UserSysNo: 1,
            Extra: {}
        };
    };
    CloudHttp.prototype.postWeb = function (url, json) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json.Verify.MySign = verify_1.Verify(json, this.myAppSecret);
                        console.log("http req: " + url + "###" + JSON.stringify(json));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post(url, json)];
                    case 2:
                        res = _a.sent();
                        data = res.data;
                        if (!data) {
                            return [2 /*return*/, { IsSuccess: false, ErrorMsg: url + "###\u4E91\u7AEF\u672A\u8FD4\u56DEdata" }];
                        }
                        if (data.HasError) {
                            console.error("http res error: " + url + "###" + data.Fault.ErrorDescription);
                            return [2 /*return*/, { IsSuccess: false, ErrorMsg: url + "###" + data.Fault.ErrorDescription }];
                        }
                        return [2 /*return*/, { IsSuccess: true, Data: data.Body, Paging: data.Paging }];
                    case 3:
                        error_1 = _a.sent();
                        console.error("http res: " + url + "###" + error_1.message);
                        return [2 /*return*/, { IsSuccess: false, ErrorMsg: url + "###" + error_1.message }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CloudHttp.prototype.postEDI = function () {
    };
    return CloudHttp;
}());
exports.default = CloudHttp;
