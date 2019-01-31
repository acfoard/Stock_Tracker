const endPoint = 'https://api.iextrading.com/1.0';

//Initialize stocks
const stocks = ['MKL','AHL','AXS','NFLX'];

//Create validation list
const verifyURL = `${endPoint}/ref-data/symbols`;
const verifyList = [];
$.ajax({
    url: verifyURL,
    method: 'GET'
}).then(function(verifyResponse) {
    for(i=0; i<verifyResponse.length; i++) {
        let symbol = verifyResponse[i].symbol;
        verifyList.push(symbol);
    };
    console.log(verifyList);
});

//Render buttons
const renderButtons = function () {
    $('#button-list').empty();
    for (let i=0; i<stocks.length; i++) {
        let newButton = $('<button>');
        newButton.addClass('btn btn-primary btn-block stock-button');
        newButton.attr('data-name', stocks[i]);
        newButton.text(stocks[i]);
        $('#button-list').append(newButton);
    };
};

renderButtons();

//Add stock button fucntion
const addButton = function() {
    event.preventDefault();
    let newStock = $('#newStock').val().trim().toUpperCase();
    if (verifyList.includes(newStock)) {
        stocks.push(newStock);
        renderButtons();
    } else {
        alert(`${newStock} is not a valid Stock Symbol`);
    }
    $('#newStock').val('');
};

$('#newStockBtn').on('click', addButton);

//Return Stock info
const returnStock = function() {
  const stock = $(this).attr('data-name');

  const queryURL = `${endPoint}/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {

    const stockDiv = $('<div>').addClass('stock');

    const logoSource = response.logo.url;
    const logoHolder = $('<img>');
    logoHolder.attr('src', logoSource);
    stockDiv.append(logoHolder);

    const companyName = response.quote.companyName;

    const nameHolder = $('<h2>').text(`Company Name: ${companyName}`);

    stockDiv.append(nameHolder);

    const stockSymbol = response.quote.symbol;

    const symbolHolder = $('<h3>').text(`Stock Symbol: ${stockSymbol}`);

    stockDiv.append(symbolHolder);

    const stockPrice = response.quote.latestPrice;

    const priceHolder = $('<h3>').text(`Stock Price: $${stockPrice}`);

    stockDiv.append(priceHolder);

    const summaryHolder = $('<div>');
    for (i=0; i<response.news.length; i++) {
        const companyNews = response.news[i].headline;  const articleSummary = $('<p>').text(`News Headline: ${companyNews}`);
        summaryHolder.append(articleSummary);
    }    
    
    stockDiv.append(summaryHolder);

    $('#stock-info').prepend(stockDiv);
  });
}

$('#button-list').on('click', '.btn', returnStock);