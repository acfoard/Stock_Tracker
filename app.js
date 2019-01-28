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

//Return stock info
const returnStock = function() {
    const quoteSymbol = $(this).attr('data-name');
    const quoteURL = `${endPoint}/stock/${quoteSymbol}/quote`;
    $.ajax({
        url: quoteURL,
        method: 'GET'
    }).then(function(response) {
        const stockDiv = $('<div>').addClass("row");
        const companyName = response.quote.companyName;
        const nameDiv = $(`<div class="col-3">`).html(`<h2>${companyName}</h2>`);
        const stockPrice = $('<h1>').text(response.quote.latestPrice);
        nameDiv.append(stockPrice);
        stockDiv.append(nameDiv);
    });
};