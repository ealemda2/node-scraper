const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { createTable, insertPart } = require("./database");

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "car_parts_db",
  password: "123qweasd",
  port: 5432,
});

// Connect
client.connect();

// Create car_parts table if it doesn't already exist
createTable(client);
const range = (start, end) =>
  new Array(end - start).fill().map((d, i) => i + start);
const pageRange = range(1, 2);

pageRange.map((currPage) => {
  (async () => {
    let browser, page;
    try {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      const url = `https://www.gmpartssolutions.com/search?search_str=&page=${currPage}&year=&make=&model=&ptid=undefined`;
      const content = await page.goto(url);
      const html = await page.content();
      const $ = cheerio.load(html);
      $(".catalog-product").each(function () {
        //  Raw
        const title = $(this).find(".product-title").text().trim();
        const list_price =
          $(this).find(".add-to-cart-col > .list-price").text().trim() || null;
        const sale_price =
          $(this).find(".add-to-cart-col > .sale-price").text().trim() || null;
        const part_number = $(this)
          .find(".catalog-product-id")
          .text()
          .replace("Part Number:", "")
          .toLowerCase()
          .trim();
        const other_info = $(this)
          .find(".product-more-info")
          .text()
          .replace("Other Names:", "")
          .trim();
        insertPart(
          client,
          title,
          part_number,
          other_info,
          list_price,
          sale_price
        );
      });
      await page.close();
    } catch (e) {
      console.error("Any Error occurred Shutting down.");
      throw e;
    }
    await browser.close();
    client.end();
  })();
});
