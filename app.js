const BASE_URL = "https://v6.exchangerate-api.com/v6/87a87df72f0cbe8ac1556ffb";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const fromFlag = document.querySelector(".from img");
const toFlag = document.querySelector(".to img");

const fetchSupportedCurrencies = async () => {
  try {
    let response = await fetch(`${BASE_URL}/codes`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    let data = await response.json();
    let supportedCurrencies = data.supported_codes;

    dropdowns.forEach(select => {
      select.innerHTML = "";
      supportedCurrencies.forEach(([code, name]) => {
        let newOption = document.createElement("option");
        newOption.innerText = `${code} - ${name}`;
        newOption.value = code;
        select.append(newOption);
      });
    });

    fromCurr.value = "USD";
    toCurr.value = "INR";
    updateFlags();
    updateExchangeRate();
  } catch (error) {
    console.error("Error fetching currencies:", error);
    msg.innerText = "Error loading currencies!";
  }
};

const updateFlags = () => {
  const fromCode = fromCurr.value;
  const toCode = toCurr.value;
  fromFlag.src = `https://flagsapi.com/${countryList[fromCode]}/flat/64.png`;
  toFlag.src = `https://flagsapi.com/${countryList[toCode]}/flat/64.png`;
};

const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value.trim();
  amtVal = isNaN(amtVal) || amtVal < 1 ? 1 : parseFloat(amtVal);
  amountInput.value = amtVal;

  const fromCurrency = fromCurr.value;
  const toCurrency = toCurr.value;

  if (fromCurrency === toCurrency) {
    msg.innerText = `${amtVal} ${fromCurrency} = ${amtVal} ${toCurrency}`;
    return;
  }

  const URL = `${BASE_URL}/latest/${fromCurrency}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    let data = await response.json();
    let rate = data.conversion_rates[toCurrency];
    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate!";
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

fromCurr.addEventListener("change", updateFlags);
toCurr.addEventListener("change", updateFlags);

window.addEventListener("load", fetchSupportedCurrencies);