/**
 * Queries for update of live data for a single stock portfolio
 * @param stockId symbol of the stock that is being traded.
 */
function refreshData(stockId) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      respData = JSON.parse(this.responseText);
      console.log('Current Price refreshed '+ respData.price);
      document.getElementById('currentPrice').innerHTML= respData.price /100;
      recalculateTotalValue(respData.price /100);
    }
  };
  console.log('/info/stockData/'+stockId);
  xhttp.open('GET', '/info/stockData/'+stockId, true);
  xhttp.send();
};
/**
 * Update the total value of the trade.
 */
function recalculateTotalValue(price) {
  quantity = parseInt(document.getElementById('inputQuantity').value);
  value = quantity*price;
  console.log(quantity+' '+price+' '+value);
  document.getElementById('totalValue').innerHTML = value;
};
/**
   * Sets up reccuring asychnronous data refreshing.
   * @param stockId symbol of the stock that is being traded.
   */
function beginPolling(stockId) {
  console.log('Fetching Current Price '+ stockId);
  setInterval(function() {
    refreshData(stockId);
  }, 5000);
  document.getElementById('inputQuantity')
      .addEventListener('keyup', function() {
        recalculateTotalValue();
      });
}
