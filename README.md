# AI News Timeline

A minimal dashboard that aggregates the latest Artificial Intelligence news from multiple trusted sources into a single timeline.

The site is fully static and hosted on **GitHub Pages**, while a **GitHub Action automatically fetches new articles every few hours**.

---

## Sources

The timeline currently pulls RSS feeds from:

* OpenAI Blog
* HuggingFace Blog
* TechCrunch AI
* VentureBeat AI
* arXiv (AI research papers)

Each source contributes **up to 10 articles per run**, ensuring balanced coverage.

---

## How It Works

```
RSS feeds
    ↓
Node script (fetchNews.js)
    ↓
data/news.json generated
    ↓
Static website loads JSON
    ↓
GitHub Pages serves UI
```

A GitHub Action runs every few hours to update the data automatically.

---

## Features

* Aggregates AI news from multiple sources
* Deduplicates articles automatically
* Limits fetch to **10 articles per source**
* Maintains a rolling archive of **200 articles**
* Clean minimal UI with:

  * search
  * source filters
  * relative timestamps

---

## Project Structure

```
ai-news-timeline

index.html
app.js
styles.css

data/
  news.json

scripts/
  fetchNews.js

.github/workflows/
  update-news.yml
```

---

## Run Locally

Install dependencies:

```
npm install
```

Run the fetch script:

```
node scripts/fetchNews.js
```

Open:

```
http://localhost:8000
```
