;(function (document) {
  'use strict'

  const TableFilter = (() => {
    let debounceTimer

    const searchTable = (searchInput, tables) => {
      clearTimeout(debounceTimer)

      debounceTimer = setTimeout(() => {
        const searchText = searchInput.value.toLowerCase()

        if (searchText.trim() === '') {
          Array.from(tables).forEach(table => {
            const rows = table.tBodies[0].rows
    
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i]
              row.style.display = ''
            }
          })
          return;
        }

        Array.from(tables).forEach(table => {
          const rows = table.tBodies[0].rows
          const searchVal = searchText.toLowerCase()

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i]

            if (row.classList.contains('hidden')) {
              const textContent = row.textContent.toLowerCase()
              const rowNumber = parseInt(row.id.match(/row(\d+)/)[1])

              if (!row.id.includes(`row${rowNumber}`)) {
                row.style.display = 'none'
                continue // Skip to the next iteration if rowNumber doesn't match
              }

              if (textContent.includes(searchVal)) {
                const targetCells = document.querySelectorAll(
                  `tr[id*="row${rowNumber}"]`
                )
                const parentCell = document.querySelector(
                  `td[id="row${rowNumber}item2"]`
                )

                parentCell.parentElement.style.display = ''
                targetCells.forEach(targetCell => {
                  targetCell.style.display = ''
                })
              }
            } else {
              const textContent = row.textContent.toLowerCase()
              row.style.display = textContent.includes(searchVal) ? '' : 'none'
            }
          }
        })
      }, 200) // Adjust the debounce delay as needed (in milliseconds)
    }

    const attachInputListeners = () => {
      const searchInputs = document.querySelectorAll('.search-input')
      Array.from(searchInputs).forEach(searchInput => {
        const tables = document.querySelectorAll(
          `.${searchInput.dataset.table}`
        )
        searchInput.addEventListener('input', () => {
          searchTable(searchInput, tables)
        })
      })
    }

    const init = () => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          attachInputListeners()
        }
      })
    }

    return {
      init
    }
  })()

  TableFilter.init()
})(document)

function toggle (btnID, eIDs) {
  const theRows = [...document.querySelectorAll(eIDs)]
  const theButton = document.getElementById(btnID)
  const isExpanded = theButton.dataset.expanded === 'true'

  theRows.forEach(row => {
    row.classList.toggle('shown', isExpanded)
    row.classList.toggle('hidden', !isExpanded)
  })

  theButton.dataset.expanded = isExpanded ? 'false' : 'true'
}

function highlightTableCells () {
  const dropdowns = document.querySelectorAll('#excel_data select')
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', () => {
      const parentCell = dropdown.parentNode
      const parentTr = parentCell.parentElement
      const previousCell = parentCell.previousElementSibling
      const rowNumber = `row${parseInt(parentTr.id.match(/row(\d+)/)[1])}item2`
      const targetCell = document.querySelector(`td[id*="${rowNumber}"]`)

      setBackground(previousCell, 'yellow')
      setBackground(targetCell.parentElement, 'yellow')
    })
  })
}

function setBackground (element, color) {
  element.style.backgroundColor = color
}
