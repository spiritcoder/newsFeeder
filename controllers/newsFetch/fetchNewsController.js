const fetch = require("node-fetch");
const rp = require("request-promise");
const cherrioFinder = require("cheerio");
const request = require("request");
const dotenv = require("dotenv");
const { createResponse } = require("../../utils/createResponse");
dotenv.config();

let Parser = require("rss-parser");
let parser = new Parser();

const MemberModel = "Member";

class NewsFeeder {
  async fetchAllNews(req, res, error) {
    let feedURLs = [
      "https://www.legit.ng/rss/all.rss",
      "https://rss.punchng.com/v1/category/latest_news",
    ];
    let returnedNewsItems = await fetchSuppliedNews(feedURLs);
    for (var newsItem = 0; newsItem < returnedNewsItems.length; newsItem++) {
      if (returnedNewsItems[newsItem].url.includes("punch")) {
        let content = await fetchWebContent(
          returnedNewsItems[newsItem].url,
          ".entry-single p"
        );
        returnedNewsItems[newsItem].content = content;
      } else {
        let content = await fetchWebContent(
          returnedNewsItems[newsItem].url,
          ".js-article-body"
        );
        returnedNewsItems[newsItem].content = content;
      }
    }
    return createResponse(res, 200, "returned news", returnedNewsItems);
  }

  async fetchCategoryNews(req, res) {
    let category = req.params.category_name.toLowerCase();
    let feedURLs = [`https://rss.punchng.com/v1/category/${category}`];
    if (category == "business") {
      feedURLs[1] = `https://www.legit.ng/rss/wealth.rss`;
    } else {
      feedURLs[1] = `https://www.legit.ng/rss/${category}.rss`;
    }
    let returnedNewsItems = await fetchSuppliedNews(feedURLs);
    for (var newsItem = 0; newsItem < returnedNewsItems.length; newsItem++) {
      if (returnedNewsItems[newsItem].url.includes("punch")) {
        let content = await fetchWebContent(
          returnedNewsItems[newsItem].url,
          ".entry-single p"
        );
        returnedNewsItems[newsItem].content = content;
      } else {
        let content = await fetchWebContent(
          returnedNewsItems[newsItem].url,
          ".js-article-body"
        );
        returnedNewsItems[newsItem].content = content;
      }
    }
    return createResponse(res, 200, "returned news", returnedNewsItems);
  }
}
async function fetchWebContent(url, tagToFind) {
  let seenContent = "";
  await rp(url)
    .then(function (html) {
      seenContent = cherrioFinder(tagToFind, html).text();
      if (url.includes("punch")) {
        seenContent = seenContent.replace(
          "(adsbygoogle = window.adsbygoogle || []).push({});",
          ""
        );
        seenContent = seenContent.replace("Details later;", "");
        seenContent = seenContent.replace(
          "\n\n\n\n\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\n\n\n\n\n\n\n",
          " "
        );
        seenContent = seenContent.replace("\n\n\n\n\n\n\n\n\n\n\n\n\n", " ");
      } else {
        let regexMatch = /Source: Legit.+(\\.+)$/gm;
        seenContent = seenContent.replace(regexMatch," ");
      }
    })
    .catch(function (err) {
      //handle error
    });
  return seenContent;
}

async function fetchSuppliedNews(feedURLs) {
  let newsFeedJson = [];

  for (var i = 0; i < feedURLs.length; i++) {
    try {
      let feed = await parser.parseURL(feedURLs[i]);
      feed.items.forEach(async (item) => {
        try {
          newsFeedJson.push({
            title: item.title,
            url: item.link,
            imageUrl: item.enclosure.url,
          });
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  return newsFeedJson;
}

module.exports = new NewsFeeder();
