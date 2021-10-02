/**
 * Queries for update of live data for a single users portfolio
 */
function refreshData() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      console.log('Portfolio refreshed');
      document.getElementById('portfolioDisplay').innerHTML = this.responseText;
    }
  };
  xhttp.open('GET', 'portfolio/portfolioData', true);
  xhttp.send();
};
/**
 * Sets up reccuring asychnronous data refreshing.
 */
function beginPolling() {
  console.log('Fetching Portfolio');
  setInterval(function() {
    refreshData();
  }, 5000);
}
