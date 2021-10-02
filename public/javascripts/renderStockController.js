/**
 * Queries for update of live data for a single users portfolio
 * @param {string} page - Page number of data to be requested.
 * @param {string} size - Number of items to be included in page.
 */
function refreshData(page, size) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      document.getElementById('stockPriceDisplay').innerHTML=this.responseText;
    }
  };
  xhttp.open('GET', 'stockData?size='+size+'&page='+page, true);
  xhttp.send();
};
/**
 * Sets up reccuring asychnronous data refreshing.
 * @param {string} page - Page number of data to be requested.
 * @param {string} size - Number of items to be included in page.
 */
function beginPolling(page, size) {
  setInterval(function() {
    refreshData(page, size);
  }, 5000);
}
