const BASE_URL = "https://api.frankfurter.app/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");





for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if ((select.name === "from" && currCode === "USD") || 
        (select.name === "to" && currCode === "INR")) {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => updateFlag(evt.target));
}


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
};


const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value.trim();

  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const fromCurrency = fromCurr.value;
  const toCurrency = toCurr.value;

  if (fromCurrency === toCurrency) {
    msg.innerText = `${amtVal} ${fromCurrency} = ${amtVal} ${toCurrency}`;
    return;
  }

  const URL = `${BASE_URL}?from=${fromCurrency}&to=${toCurrency}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    let data = await response.json();
    console.log("API Response:", data);

    if (!data.rates[toCurrency]) {
      throw new Error("Invalid currency conversion data received.");
    }

    let rate = data.rates[toCurrency];
    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate!";
    console.error("Exchange Rate Fetch Error:", error);
  }
};


btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});


window.addEventListener("load", updateExchangeRate);
