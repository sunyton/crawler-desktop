import { app, BrowserWindow, ipcMain, Event } from "electron";
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { CHROME_PATH, UA } from './constants/puppeteer';
import { string } from "prop-types";
import superagent from 'superagent';
import cheerio from 'cheerio';

let mainWindow: Electron.BrowserWindow | null;

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

ipcMain.on('url', (event: Event, msg: string) => {
    
    
})

// getAsins 
const getAsinsByUrl = (url:string) => new Promise((resolve, reject) => {

    superagent.get('https://www.amazon.com/s?me=A2IAB2RW3LLT8D')
// tslint:disable-next-line: max-line-length
      .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
// tslint:disable-next-line: max-line-length
      .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
      .set('upgrade-insecure-requests', '1')
      .end((err, res) => {

          if (err) {
              console.log(err);
              reject(err)
          } else {
              const $ = cheerio.load(res.text);
            // console.log(res.text)
                let infos: Infos = {};
              $('[data-asin][data-index]').each((i, ele) => {
                  
                  const info: Info = {
                      name: '',
                      price: ''

                  };
                  const asin:string = $(ele).data().asin;
                  const name = $('[data-asin="'+asin+'"] h2').text().trim();
                  const price = $('[data-asin="'+asin+'"] [data-a-size="l"] .a-offscreen').text()
                  
                  info.name = name;
                  info.price = price;
                    // getKeepa
                    // getOthers
                  infos[asin] = info;
              })
          }
          
      })
    
})


const getOthersByInfos = (infos: Info[]) => {

}


const getOthersByAsin = (asin: string) => {
    superagent.get('https://www.amazon.com/dp/' + asin)
// tslint:disable-next-line: max-line-length
        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
// tslint:disable-next-line: max-line-length
      .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
      .set('upgrade-insecure-requests', '1')
      .end((err, res) => {
          if (err) {
              console.log(err)
          } else {
              const $ = cheerio.load(res.text)

            // 评分
              const a = $('#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-left > div.a-section.a-spacing-none.a-spacing-top-mini.cr-widget-ACR > div > div > div.a-fixed-left-grid-col.a-col-right > div > span > span > a > span').text();
              const b = $('#histogramTable > tbody > tr > td:nth-child(3)').map((i, ele) => $(ele).text()).get().join(' ');
              console.log(a + " " + b)

          // 排名
              console.log($('body').text().match(/#\d*?,?\d* in .*/g))
          // 日期
          // console.log($('body').text())
              console.log($('body').text().replace(/\n|\r|\t/g, "").match(/Date first .*\n*(((January|February|March|April|May|June|July|August|September|October|November|December))( ?)(\d+),( ?)(\d{4}))/)[1])


          }
      })
}


const getKeepasByAsin = async (asin: string) => {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    const page = await browser.newPage();
    page.setJavaScriptEnabled(true);
    page.setUserAgent(UA);
    page.setViewport({width: 1100, height: 1080})
    await page.goto('https://keepa.com/iframe_addon.html#1-0-' + asin);
    await page.waitForSelector('.legendRange');    
    const days = await page.$eval('.legendRange', ele => ele.innerHTML.match(/\((.*)\)/)[1])
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