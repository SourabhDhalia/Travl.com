(function () {
  const tool = document.querySelector("[data-currency-tool]");
  if (!tool) return;

  const amountInput = tool.querySelector("[data-currency-amount]");
  const baseSelect = tool.querySelector("[data-currency-base]");
  const results = tool.querySelector("[data-currency-results]");
  const date = tool.querySelector("[data-currency-date]");
  const source = tool.querySelector("[data-currency-source]");

  let latestPayload = null;

  function formatAmount(value) {
    return Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function renderOptions(currencies) {
    baseSelect.textContent = "";
    currencies.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.code;
      option.textContent = `${currency.code} - ${currency.name}`;
      baseSelect.appendChild(option);
    });
    baseSelect.value = "USD";
  }

  function renderResults() {
    if (!latestPayload) return;

    const amount = Number(amountInput.value || 0);
    results.textContent = "";

    latestPayload.currencies.forEach((currency) => {
      const rate = latestPayload.rates[currency.code];
      if (!rate) return;

      const card = document.createElement("article");
      card.className = "currency-result";

      const code = document.createElement("strong");
      code.textContent = currency.code;

      const details = document.createElement("div");
      const converted = document.createElement("p");
      converted.textContent = `${currency.symbol} ${formatAmount(amount * rate)}`;
      const label = document.createElement("span");
      label.textContent = currency.name;

      details.appendChild(converted);
      details.appendChild(label);
      card.appendChild(code);
      card.appendChild(details);
      results.appendChild(card);
    });
  }

  async function loadRates(base) {
    date.textContent = "Loading rates...";
    results.innerHTML = '<div class="currency-spinner"></div>';

    const response = await fetch(`/api/currency/latest?base=${encodeURIComponent(base)}`);
    latestPayload = await response.json();

    if (!baseSelect.options.length) {
      renderOptions(latestPayload.currencies);
    }

    baseSelect.value = latestPayload.base;
    date.textContent = `Rates for ${latestPayload.date}`;
    source.textContent = `Source: ${latestPayload.source}`;
    renderResults();
  }

  amountInput.addEventListener("input", renderResults);
  baseSelect.addEventListener("change", () => loadRates(baseSelect.value));

  loadRates("USD").catch(() => {
    date.textContent = "Rates are unavailable right now.";
  });
})();
