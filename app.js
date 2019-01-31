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
let counter = 0;
const returnStock = function() {
    const quoteSymbol = $(this).attr('data-name');
    const quoteURL = `${endPoint}/stock/${quoteSymbol}/batch?types=quote,logo,news&range=1m&last=10`;
    $.ajax({
        url: quoteURL,
        method: 'GET'
    }).then(function(response) {
        let newsSlides;
        for (i=1; i<response.length; i++) {
            let slide = $(`<div class='carousel-item'>
            <p><b>${response.news[i].headline}</b></p>
            <p>${response.news[i].summary}</p>
            </div>`);
            newsSlides.append(slide);
        };
        const newRow = $(`<div class='row'>
            <div class='col-2 logo'>
                <img src=${response.logo.url}>
            </div>
            <div class='col-3 info' id='${quoteSymbol}${counter}'>
                <h2>${response.quote.companyName}</h2>
                <h3>$${response.quote.latestPrice}</h3>
            </div>
            <div class='col-7'>
                <div class='carousel slide' data-ride='carousel' data-interval='4000'>
                    <div class='carousel-inner'>
                        <div class='carousel-item active'>
                            <p><b>${response.news[0].headline}</b></p>
                            <p>${response.news[0].summary}</p>
                        </div>
                        ${newsSlides}
                    </div>
                </div>
            </div>
        </div>`);
        counter++;
        $('.cardList').prepend(newRow);
    });
};

$('#button-list').on('click', '.btn', returnStock);