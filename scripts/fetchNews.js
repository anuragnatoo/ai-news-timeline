const Parser = require("rss-parser")
const fs = require("fs")
const path = require("path")
const MAX_ARTICLES = 200
const ARTICLES_PER_SOURCE = 10
const MAX_RUNTIME = 5 * 1000
const REQUEST_TIMEOUT = 15000
const startTime = Date.now()
const parser = new Parser({
  timeout: REQUEST_TIMEOUT
})
const sources = [
  { name: "OpenAI", url: "https://openai.com/blog/rss.xml" },
  { name: "HuggingFace", url: "https://huggingface.co/blog/feed.xml" },
  { name: "TechCrunch", url: "https://techcrunch.com/tag/artificial-intelligence/feed/" },
  { name: "VentureBeat", url: "https://venturebeat.com/category/ai/feed/" },
  { name: "arXiv", url: "http://export.arxiv.org/rss/cs.AI" }
]
/*
Load existing timeline
*/
const dataPath = path.join(__dirname, "..", "data", "news.json")
let items = []
if (fs.existsSync(dataPath)) {
  items = JSON.parse(fs.readFileSync(dataPath))
}
/*
Track existing URLs to prevent duplicates
*/
const existingUrls = new Set(items.map(n => n.url))
async function fetchNews() {
  for (const source of sources) {
    if (Date.now() - startTime > MAX_RUNTIME) {
      console.log("Max runtime reached")
      break
    }
    console.log("Fetching:", source.name)
    try {
      let count = 0
      const feed = await parser.parseURL(source.url)
      for (const entry of feed.items) {
        if (count >= ARTICLES_PER_SOURCE) break
        const url = (entry.link || "").split("?")[0]
        if (!url || existingUrls.has(url)) continue
        const article = {
          source: source.name,
          title: entry.title || "Untitled",
          date: entry.pubDate || entry.isoDate || new Date().toISOString(),
          url: url
        }
        items.push(article)
        existingUrls.add(url)
        count++
      }
    } catch (err) {
      console.log("Feed failed:", source.name)
    }
  }
  items.sort((a, b) => new Date(b.date) - new Date(a.date))
  items = items.slice(0, MAX_ARTICLES)
  const dataDir = path.join(__dirname, "..", "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir)
  }
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2))
  console.log(`Saved ${items.length} articles`)
}
async function main(){
  await fetchNews();
  process.exit(0);
}
main();