var rerankButton = document.querySelector("#reRankButton");

rerankButton.addEventListener("click", function(event) {

  event.preventDefault(); // prevent default behavior of the button
  // Get the table element containing the ranking column
  const originalTable = document.getElementById('excel_data');

  // Get the existing table element for the top 10 rows
  const top10TableBody = document.querySelector('#summary_table tbody');

  // Clear the contents of the existing table
  top10TableBody.innerHTML = '';

  // Get an array of the table rows that have a td element with class "Rank"
  const rows = Array.from(originalTable.getElementsByTagName('tr'))

  // Filter and sort the rows based on the rank value
  const filteredRows = rows.filter(row => row.querySelector('td.Rank')).sort((a, b) => {
    const aRank = parseInt(a.querySelector('td.Rank').innerText);
    const bRank = parseInt(b.querySelector('td.Rank').innerText);
    return aRank - bRank;
  });

    // Loop through the filtered and sorted rows and append rankCell and nameCell to top10Table
    for (let i = 0; i < 10 && i < filteredRows.length; i++) {
      
      const row = filteredRows[i];
      const nameCell = row.querySelector('td.Name');
      const rankCell = row.querySelector('td.Rank');
      const newRow = document.createElement('tr');

      newRow.appendChild(nameCell.cloneNode(true));
      newRow.appendChild(rankCell.cloneNode(true));

      top10TableBody.appendChild(newRow);
    }
});