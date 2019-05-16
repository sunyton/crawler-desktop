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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var _this = this;
exports.__esModule = true;
var puppeteer = require("puppeteer-core");
var puppeteer_1 = require("../src/constants/puppeteer");
var superagent = require("superagent");
var cheerio = require("cheerio");
var asinsPage = [];
// getAsins 
var getAsinsByUrl = function (url) { return new Promise(function (resolve, reject) {
    superagent.get('https://www.amazon.com/s?me=A2IAB2RW3LLT8D')
        // tslint:disable-next-line: max-line-length
        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
        // tslint:disable-next-line: max-line-length
        .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
        .set('upgrade-insecure-requests', '1')
        .end(function (err, res) {
        if (err) {
            console.log("errrrrrrr");
            console.log(res.text);
            console.log(err);
            reject(err);
        }
        else {
            var $_1 = cheerio.load(res.text);
            // console.log(res.text)
            var infos_1 = {};
            $_1('[data-asin][data-index]').each(function (i, ele) {
                var info = {
                    name: '',
                    price: ''
                };
                var asin = $_1(ele).data().asin;
                var name = $_1('[data-asin="' + asin + '"] h2').text().trim();
                var price = $_1('[data-asin="' + asin + '"] [data-a-size="l"] .a-offscreen').text();
                info.name = name;
                info.price = price;
                // getKeepa
                // getOthers
                infos_1[asin] = info;
                resolve(infos_1);
            });
        }
    });
}); };
var getKeepasByAsin = function (infos) { return __awaiter(_this, void 0, void 0, function () {
    var browser, page, asins, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    executablePath: puppeteer_1.CHROME_PATH,
                    headless: true
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                asins = Object.keys(infos);
                page.setJavaScriptEnabled(true);
                page.setUserAgent(puppeteer_1.UA);
                page.setViewport({ width: 1100, height: 1080 });
                _loop_1 = function (i) {
                    var days, _a, _b, res, $_2, a, b, error_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 6, , 7]);
                                return [4 /*yield*/, page.goto('https://keepa.com/iframe_addon.html#1-0-' + asins[i])];
                            case 1:
                                _c.sent();
                                return [4 /*yield*/, page.waitForSelector('.legendRange')];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, page.$$eval('.legendRange', function (ele) { return ele[ele.length - 1].innerHTML.match(/\(([\s\S]*)\)/)[1]; })];
                            case 3:
                                days = _c.sent();
                                _b = (_a = console).log;
                                return [4 /*yield*/, asins[i]];
                            case 4:
                                _b.apply(_a, [(_c.sent()) + "  " + days]);
                                return [4 /*yield*/, superagent.get('https://www.amazon.com/dp/' + asins[i])
                                        // tslint:disable-next-line: max-line-length
                                        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
                                        // tslint:disable-next-line: max-line-length
                                        .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
                                        .set('upgrade-insecure-requests', '1')];
                            case 5:
                                res = _c.sent();
                                $_2 = cheerio.load(res.text);
                                a = $_2('#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-left > div.a-section.a-spacing-none.a-spacing-top-mini.cr-widget-ACR > div > div > div.a-fixed-left-grid-col.a-col-right > div > span > span > a > span').text();
                                b = $_2('#histogramTable > tbody > tr > td:nth-child(3)').map(function (i, ele) { return $_2(ele).text(); }).get().join(' ');
                                console.log(asins[i]);
                                console.log(a + " " + b);
                                infos[asins[i]].data = a;
                                // 排名
                                console.log($_2('body').text().match(/#\d*?,?\d* in .*/g));
                                return [3 /*break*/, 7];
                            case 6:
                                error_1 = _c.sent();
                                console.log(error_1);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < asins.length)) return [3 /*break*/, 6];
                return [5 /*yield**/, _loop_1(i)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, browser.close()];
            case 7:
                _a.sent();
                return [2 /*return*/, infos];
        }
    });
}); };
getAsinsByUrl('https://www.amazon.com/s?me=A2IAB2RW3LLT8D').then(function (infos) {
    getKeepasByAsin(infos).then(function (infos) {
        console.log("finished");
        console.log(infos);
    });
});
