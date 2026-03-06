import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

// Find next available screenshot number
let n = 1;
while (true) {
  const name = label
    ? `screenshot-${n}-${label}.png`
    : `screenshot-${n}.png`;
  if (!existsSync(join(dir, name))) {
    var filename = join(dir, name);
    break;
  }
  n++;
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2' });
await page.screenshot({ path: filename, fullPage: false });
await browser.close();

console.log(`Screenshot saved: ${filename}`);
