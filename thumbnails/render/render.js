import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

(async () => {

  const directoryPath = path.join(__dirname, 'shared');
  let files = [];

  if (process.argv.length > 2) {
    files = process.argv.slice(2);
  } else {
    files = fs.readdirSync(directoryPath);
  }

  const browser = await puppeteer.launch({
    args: [`--no-sandbox`, `--headless`, `--disable-gpu`, `--disable-dev-shm-usage`]
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 128,
    height: 128,
    deviceScaleFactor: 1,
  });


  for (const file of files) {

    console.log(file);

    const cw = path.parse(file).name

    await page.goto(`https://editor.clockwise.page/thumbnail.html?cw=${cw}`, { waitUntil: 'networkidle2' });

    // Wait for 1 second to ensure rendering is complete
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: `exported/${cw}.png` });

  };


  await browser.close();

  console.log('End of execution');

  await browser.close();
})();