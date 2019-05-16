import { app, BrowserWindow, ipcMain, Event } from "electron";
import * as puppeteer from 'puppeteer-core'
import { Browser, Page } from 'puppeteer-core';
import { CHROME_PATH, UA } from './constants/puppeteer';
import * as superagent from 'superagent';
import * as cheerio from 'cheerio';

import * as fs from 'fs';
let mainWindow: Electron.BrowserWindow | null;
let testAsins:string[] = [];
let infos: Infos = {};
let page = 1;
type Info = {
    name: string;
    price: string;
    rate?: string;
    rank?: string;
    data?: string;
    days?: string;
}

type Infos = {
    [key: string]: Info
};

// tslint:disable-next-line: max-line-length
const reg1 = /(((January|February|March|April|May|June|July|August|September|October|November|December))( ?)(\d+),( ?)(\d{4}))/;

ipcMain.on('url', (event: Event, msg: string) => {
    console.log(msg)
    get2(msg).then(mag => {
        console.log(mag)
        event.sender.send('page', mag)
    })
})

const get2 = async (url: string) => {
        const asins:string[] = [];
        let res = null;
        try {
            res = await superagent.get('https://www.amazon.com/s?me=A2IAB2RW3LLT8D'+'&page='+page)
    // tslint:disable-next-line: max-line-length
        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
    // tslint:disable-next-line: max-line-length
        .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
        .set('upgrade-insecure-requests', '1').timeout({
                    response: 5000,  // Wait 5 seconds for the server to start sending,
                    deadline: 10000, // but allow 1 minute for the file to finish loading.
                })
        } catch (error) {
            return 'error';
        }
        const $ = cheerio.load(res!.text);
        // console.log(res.text)
        if ($('[data-asin][data-index]').length > 0) {
            $('[data-asin][data-index]').each((i, ele) => {

            const info: Info = {
                name: '',
                price: ''

            };
            const asin:string = $(ele).data().asin;
            asins.push(asin)
            const name = $('[data-asin="'+asin+'"] h2').text().trim();
            const price = $('[data-asin="'+asin+'"] [data-a-size="l"] .a-offscreen').text()

            info.name = name;
            info.price = price;
            
            // getKeepa
            // getOthers
            infos[asin] = info;
            })
            // other data
            await getOthersByAsins(asins)
            page++;
            console.log(await "finish 1 to go to "+page)
            await get2(url)
        } else {
            return 'success';
        }
        

}


// getAsins 
const getAsinsByUrl = (url:string) => new Promise<string[]>((resolve, reject) => {
    let asinst:string[] = [];
    try {
        superagent.get('https://www.amazon.com/s?me=A2IAB2RW3LLT8D')
// tslint:disable-next-line: max-line-length
      .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
// tslint:disable-next-line: max-line-length
      .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
      .set('upgrade-insecure-requests', '1').timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
                deadline: 10000, // but allow 1 minute for the file to finish loading.
            })
      .end((err, res) => {
            fs.writeFileSync('asin.html', res.text)
          if (err) {
              console.log(err);
              reject(err)
          } else {
              const $ = cheerio.load(res.text);
            // console.log(res.text)
              
              $('[data-asin][data-index]').each((i, ele) => {
                  
                  const info: Info = {
                      name: '',
                      price: ''

                  };
                  const asin:string = $(ele).data().asin;
                  asinst.push(asin)
                  const name = $('[data-asin="'+asin+'"] h2').text().trim();
                  const price = $('[data-asin="'+asin+'"] [data-a-size="l"] .a-offscreen').text()
                  
                  info.name = name;
                  info.price = price;
                    // getKeepa
                    // getOthers
                  infos[asin] = info;
                  resolve(asinst)
              })
          }
          
      })
    } catch (error) {
        console.log(error)
    }
    
})


const getOthersByAsins = async (asins: string[]) => {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    // const asins = Object.keys(infos)
    const page = await browser.newPage();
    let tmp:string[] = [];
    page.setJavaScriptEnabled(true);
    page.setUserAgent(UA);
    page.setViewport({width: 1100, height: 1080})
    for (let i = 0; i< asins.length; i++) {
        // superagent 
        try {
            await page.goto('https://keepa.com/iframe_addon.html#1-0-' + asins[i]);
            await page.waitForSelector('.legendScale');    
            const days = await page.$$eval('.legendRange', ele => ele.length > 0 ? ele[ele.length-1].innerHTML.match(/\(([\s\S]*)\)/)![1] : '') ;
            console.log(await asins[i] + "  "  + days)
            const res = await superagent.get('https://www.amazon.com/dp/' + asins[i])
            // tslint:disable-next-line: max-line-length
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
            // tslint:disable-next-line: max-line-length
            .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
            .set('upgrade-insecure-requests', '1').timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
                deadline: 10000, // but allow 1 minute for the file to finish loading.
            })
            // fs.writeFileSync(asins[i]+'.html', res.text)
            const $ = cheerio.load(res.text)


            // 评分
            // tslint:disable-next-line: max-line-length
            const a = $('#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-left > div.a-section.a-spacing-none.a-spacing-top-mini.cr-widget-ACR > div > div > div.a-fixed-left-grid-col.a-col-right > div > span > span > a > span').text();
            
            // tslint:disable-next-line: max-line-length
            const b = $('#histogramTable > tbody > tr > td:nth-child(3)').map((i, ele) => $(ele).text()).get().join(' ');
            infos[asins[i]].rate = a+" "+ b;
            console.log(asins[i])
            console.log(a + " " + b)
            // 排名
            
            infos[asins[i]].rank = $('body').text().match(/#\d*?,?\d* in .*/g)+""
            // 日期
            // console.log($('body').text())
            // tslint:disable-next-line: max-line-length
            let date = 'NONE'
            if (/Date first /.test($('body').text())) {
// tslint:disable-next-line: max-line-length
                date = $('body').text().match(reg1)![1];
                
            }
            infos[asins[i]].data = date
            

        } catch (error) {
            console.log(error);
            tmp.push(asins[i])
        }
        
    }
    
    await browser.close();
    if (tmp.length > 0) {
        console.log(tmp)
        getOthersByAsins(tmp)
    }else {
        return;
    }
}




const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true

    });
    mainWindow.loadURL(`http://localhost:8081`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}





app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})