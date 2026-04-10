const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1";

let allCoins = [];
let currentCoins = [];

const coinsDiv = document.getElementById("coins");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

async function fetchCoins() {
  loading.style.display = "block";

  const res = await fetch(url);
  const data = await res.json();

  allCoins = data;
  currentCoins = data;

  displayCoins(currentCoins);

  loading.style.display = "none";
}

function displayCoins(coins) {
  coinsDiv.innerHTML = coins.map(coin => `
    <div class="coin">
      <img src="${coin.image}" width="40">
      <h3>${coin.name}</h3>
      <p>Price: $${coin.current_price}</p>
      <p>Market Cap: $${coin.market_cap}</p>
      <p class="${coin.price_change_percentage_24h > 0 ? 'green' : 'red'}">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </p>
    </div>
  `).join("");
}

/* 🔍 SEARCH */
searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  currentCoins = allCoins.filter(coin =>
    coin.name.toLowerCase().includes(text)
  );

  displayCoins(currentCoins);
});

/* 🔽 SORT */
sortSelect.addEventListener("change", () => {
  let sorted = [...currentCoins];

  if (sortSelect.value === "price") {
    sorted.sort((a, b) => b.current_price - a.current_price);
  }

  if (sortSelect.value === "marketcap") {
    sorted.sort((a, b) => b.market_cap - a.market_cap);
  }

  if (sortSelect.value === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  displayCoins(sorted);
});

/* 📈 FILTER (Top Gainers) */
document.getElementById("gainers").addEventListener("click", () => {
  const filtered = allCoins.filter(coin =>
    coin.price_change_percentage_24h > 0
  );

  displayCoins(filtered);
});

/* INIT */
fetchCoins();
