const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const quoteAuthor = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
let requestCounter = 0;

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

async function getQuoteFromApi() {
  showLoadingSpinner();
  const proxyUrl = "https://stormy-waters-81463.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    // If author is blank, add "Unknow"
    if (data.quoteAuthor === "") {
      quoteAuthor.innerText = "Unknown";
    } else {
      quoteAuthor.innerText = data.quoteAuthor;
    }

    // Reduce font size for long quote
    if (data.quoteText.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }

    quoteText.innerText = data.quoteText;

    removeLoadingSpinner();
  } catch (error) {
    if (requestCounter < 10) {
      getQuoteFromApi();
      requestCounter++;
    } else {
      console.log("Something went wrong", error);
    }
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = quoteAuthor.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;

  window.open(twitterUrl, "_blank");
}

// Event Listeners
newQuoteBtn.addEventListener("click", getQuoteFromApi);
twitterBtn.addEventListener("click", tweetQuote);

//On Load
getQuoteFromApi();
