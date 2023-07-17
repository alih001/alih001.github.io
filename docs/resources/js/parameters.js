// Call the toggleTables() function on page load to set the initial state
toggleTables()

function toggleTables () {
  var switchElement = document.getElementById('status')
  var table1 = document.getElementById('excel_data')
  var table2 = document.getElementById('cost_data')

  if (switchElement.checked) {
    table1.style.display = 'none'
    setTimeout(function () {
      table2.style.display = 'table'
    }, 750)
  } else {
    table2.style.display = 'none'
    setTimeout(function () {
      table1.style.display = 'table'
    }, 750)
  }
}

function handleSelectChange (selectElement) {
  const selectedOption = selectElement.value
  console.log(selectElement)
  const selectId = selectElement.id
  const parts = selectId.split('_') // Split the id using underscore as a separator
  const type = parts[0]
  const row = parts[1]
  console.log(type)
  console.log(row)

  const tdElement = document.querySelector(`td[id="${row}item8"]`)

  if (tdElement) {
    // Found the matching <td> element
    console.log('Matching <td> element:', tdElement)
    const new_val = tdElement.innerHTML * (selectedOption / 100)

    const typeCostVal = document.querySelector(
      `td[id="${row}_costcatConstr"][class="${type}"]`
    )
    typeCostVal.innerHTML = new_val.toFixed(2)

    yearCalculator(selectElement, true)
  } else {
    // No matching <td> element found
    console.log('No matching <td> element found.')
  }
}

function yearCalculator (selectElement, percentCheck) {
  const selectId = selectElement.id
  const parts = selectId.split('_')
  const type = parts[0]
  const row = parts[1]

  tdClassName = type + row + 'costValues'

  const tdElements = document.querySelectorAll(`td.${tdClassName}`)

  tdElements.forEach(td => {
    td.remove()
  })

  if (percentCheck === true) {
    percentElement = selectElement.parentElement
    durationElement = percentElement.nextElementSibling
  } else {
    percentElement = selectElement.parentElement.previousElementSibling
    durationElement = selectElement.parentElement
  }

  percentValue = percentElement.querySelector('select').value
  durationValue = durationElement.querySelector('select').value
  costValue = durationElement.nextElementSibling.innerHTML

  costValue = (costValue / durationValue).toFixed(2)

  if (durationValue !== null) {
    for (let i = 0; i < durationValue; i++) {
      durationElement.nextElementSibling.insertAdjacentHTML(
        'afterend',
        '<td class="' + tdClassName + '">' + costValue + '</td>'
      )
    }
  }
}
