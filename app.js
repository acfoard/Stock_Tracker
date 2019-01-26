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
    console.log(newStock);
    let message = `${newStock} is not a valid Stock Symbol`;
    for (let i=0; i<verifyList[i]; i++) {
        if (newStock === verifyList[i]) {
            stocks.push(newStock);
            message = `${newStock} has been added`;
        };
    };
    $('#newStock').val('');
    renderButtons();
    alert(message);
};

$('#newStockBtn').on('click', addButton);