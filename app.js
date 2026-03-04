let allNews = []
let activeSource = null

function timeAgo(date) {

    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    const intervals = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60]
    ]

    for (const [name, value] of intervals) {
        const count = Math.floor(seconds / value)
        if (count > 0) {
            return count + " " + name + (count > 1 ? "s" : "") + " ago"
        }
    }

    return "just now"
}

function render(news) {

    const container = document.getElementById("news")
    container.innerHTML = ""

    news.forEach(item => {

        const card = document.createElement("div")
        card.className = "card"

        card.innerHTML = `

        <div class="meta">
            <span class="badge ${item.source}">
                ${item.source}
            </span>

            ${timeAgo(item.date)}
        </div>

        <a href="${item.url}" target="_blank">
            ${item.title}
        </a>
        `

        container.appendChild(card)

    })

}

function createFilters(news) {

    const sources = [...new Set(news.map(n => n.source))]

    const container = document.getElementById("filters")

    sources.forEach(source => {

        const btn = document.createElement("span")
        btn.className = "filter"
        btn.innerText = source

        btn.onclick = () => {

            if (activeSource === source) {
                activeSource = null
                btn.classList.remove("active")
                render(allNews)
                return
            }

            activeSource = source

            document
                .querySelectorAll(".filter")
                .forEach(b => b.classList.remove("active"))

            btn.classList.add("active")

            render(allNews.filter(n => n.source === source))

        }

        container.appendChild(btn)

    })

}

async function loadNews() {

    const res = await fetch("data/news.json")
    const news = await res.json()

    allNews = news

    render(news)
    createFilters(news)

}

document
    .getElementById("search")
    .addEventListener("input", e => {

        const term = e.target.value.toLowerCase()

        const filtered = allNews.filter(n =>
            n.title.toLowerCase().includes(term)
        )

        render(filtered)

    })

loadNews()