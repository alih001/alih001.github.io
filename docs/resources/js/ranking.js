const rerankButton = document.querySelector('#reRankButton')

rerankButton.addEventListener('click', function (event) {
  event.preventDefault()

  // Get the table element containing the ranking column
  const originalTable = document.getElementById('excel_data')

  // Get the existing table element for the top rows
  const summaryTableBody = document.querySelector('#summary_table tbody')

  // Clear the contents of the existing table
  while (summaryTableBody.firstChild) {
    summaryTableBody.removeChild(summaryTableBody.firstChild)
  }

  const rows = [...originalTable.getElementsByTagName('tr')]

  // Filter and sort the rows based on the rank value
  const filteredRows = rows
    .filter(row => row.querySelector('td.Rank'))
    .sort((a, b) => {
      const aRank = parseInt(a.querySelector('td.Rank').innerText)
      const bRank = parseInt(b.querySelector('td.Rank').innerText)
      return aRank - bRank
    })

  // Append the filtered and sorted rows to the summary table
  const numRowsToShow = 10
  for (let i = 0; i < numRowsToShow && i < filteredRows.length; i++) {
    const row = filteredRows[i]
    const nameCell = row.querySelector('td.Name')
    const rankCell = row.querySelector('td.Rank')
    const newRow = document.createElement('tr')

    newRow.appendChild(nameCell.cloneNode(true))
    newRow.appendChild(rankCell.cloneNode(true))

    summaryTableBody.appendChild(newRow)
  }
})
