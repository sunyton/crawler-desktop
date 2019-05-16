import * as puppeteer from 'puppeteer-core';
import  { Browser, Page } from 'puppeteer-core'
import { CHROME_PATH, UA } from '../src/constants/puppeteer';
import { string } from "prop-types";
import * as superagent from 'superagent';
import * as cheerio from 'cheerio';

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

let asinsPage:string[] = [];


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
              console.log("errrrrrrr")
              console.log(res.text)
              console.log(err);
              reject(err)
          } else {
              const $ = cheerio.load(res.text);
            // console.log(res.text)
              const infos: Infos = {};
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
                  resolve(infos)
              })
          }
          
      })
    
})





const getKeepasByAsin = async (infos: Infos) => {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true
    });
    const page = await browser.newPage();
    const asins = Object.keys(infos);
    page.setJavaScriptEnabled(true);
    page.setUserAgent(UA);
    page.setViewport({width: 1100, height: 1080})
    for (let i = 0; i< asins.length; i++) {
        

        // superagent 
        try {
            await page.goto('https://keepa.com/iframe_addon.html#1-0-' + asins[i]);
            await page.waitForSelector('.legendRange');    
// tslint:disable-next-line: max-line-length
            const days = await page.$$eval('.legendRange', ele => ele[ele.length-1].innerHTML.match(/\(([\s\S]*)\)/)![1]);
            console.log(await asins[i] + "  "  + days)
            const res = await superagent.get('https://www.amazon.com/dp/' + asins[i])
            // tslint:disable-next-line: max-line-length
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
            // tslint:disable-next-line: max-line-length
            .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3')
            .set('upgrade-insecure-requests', '1')

            const $ = cheerio.load(res.text)


            // 评分
            // tslint:disable-next-line: max-line-length
            const a = $('#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-left > div.a-section.a-spacing-none.a-spacing-top-mini.cr-widget-ACR > div > div > div.a-fixed-left-grid-col.a-col-right > div > span > span > a > span').text();
            // tslint:disable-next-line: max-line-length
            const b = $('#histogramTable > tbody > tr > td:nth-child(3)').map((i, ele) => $(ele).text()).get().join(' ');
            console.log(asins[i])
            console.log(a + " " + b)
            infos[asins[i]].data = a;
            // 排名
            console.log($('body').text().match(/#\d*?,?\d* in .*/g))
            // 日期
            // console.log($('body').text())
            // tslint:disable-next-line: max-line-length
            // console.log($('body').text().match(/(((January|February|March|April|May|June|July|August|September|October|November|December))( ?)(\d+),( ?)(\d{4}))/)[1])


        } catch (error) {
            console.log(error);
            
        }

        
    }

    await browser.close();
    return infos;

}

getAsinsByUrl('https://www.amazon.com/s?me=A2IAB2RW3LLT8D').then(infos => {
        getKeepasByAsin(<Infos>infos).then(infos => {
            console.log("finished")
            console.log(infos)
        })
    })
