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
    // If running from fs.readdirSync, it gives us basenames
    try {
      files = fs.readdirSync(directoryPath).map(f => path.join(directoryPath, f));
    } catch (e) {
      console.error(`Error reading ${directoryPath}: ${e.message}`);
      process.exit(1);
    }
  }

  // Get branch from environment variable, default to 'main'
  const branch = process.env.CLOCK_CLUB_BRANCH || 'main';
  console.log(`Using branch: ${branch}`);

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

    console.log(`Processing: ${file}`);
    const cw = path.parse(file).name

    // Pass the branch parameter to the URL
    await page.goto(`https://editor.clockwise.page/thumbnail.html?cw=${cw}&branch=${branch}`, { waitUntil: 'networkidle2' });

    // Wait for 1 second to ensure rendering is complete
    await new Promise(r => setTimeout(r, 1000));

    const outputDir = path.join(__dirname, 'exported');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await page.screenshot({ path: path.join(outputDir, `${cw}.png`) });
    console.log(`Generated thumbnail for ${cw}`);

  };


  await browser.close();

  console.log('End of execution');
})();