var tableReset = document.getElementById('excel_data').innerHTML;
var riskTable = document.getElementById('alt_table').innerHTML;
var colData = {};
var refData = {};

fetch('./json/ddm_items.json')
  .then(response => response.json())
  .then(menu_json => {
    colData = menu_json.Attribute
    refData = menu_json.Reference
    var select1 = $('<select></select>')
    $.each(Object.keys(colData), function (key, value) {
      select1.append($('<option></option>').attr('value', value).text(value))
    })
    $('#alt_table tbody').append(
      "<tr class = 'hidden'><td>" +
        select1[0].outerHTML +
        "</td><td></td><td contenteditable='true'>1</td><td id='Comment' contenteditable='true'>Enter Comment</td><td></td><td><button class='delete_row'><i class='fa fa-minus-circle'></i></button></td></tr>"
    )

    var select2 = $('<select></select>')
    $.each(colData.Complex, function (key, value) {
      select2.append($('<option></option>').attr('value', value).text(value))
    })
    $('#alt_table tbody')
      .find('tr:last-child td:nth-child(2)')
      .append(select2[0].outerHTML)

    select1.change(function () {
      var value = $(this).val()
      var select2 = $('<select></select>')
      $.each(colData[value], function (key, value) {
        select2.append($('<option></option>').attr('value', value).text(value))
      })
      $(this).closest('tr').find('td:nth-child(2)').html(select2)
    })
  })

$('#add_row').click(function () {
  var select1 = $('#alt_table tbody').find(
    'tr:last-child td:nth-child(1) select'
  )
  var select2 = $('#alt_table tbody').find(
    'tr:last-child td:nth-child(2) select'
  )
  var clone1 = select1.clone()
  var clone2 = select2.clone()
  clone1.change(function () {
    var value = $(this).val()
    var select2 = $('<select></select>')
    $.each(colData[value], function (key, value) {
      select2.append($('<option></option>').attr('value', value).text(value))
    })
    $(this).closest('tr').find('td:nth-child(2)').html(select2)
  })
  clone2.change(function () {
    var value = $(this).val()
    var select1 = $(this).closest('tr').find('td:nth-child(1) select')
    var select2 = $('<select></select>')
    $.each(colData[select1.val()], function (key, value) {
      select2.append($('<option></option>').attr('value', value).text(value))
    })
    $(this).closest('tr').find('td:nth-child(2)').html(select2)
  })
  select1.parent().html(clone1)
  $('#alt_table tbody').append(
    "<tr class = 'hidden'><td>" +
      clone1[0].outerHTML +
      '</td><td>' +
      clone2[0].outerHTML +
      "</td><td contenteditable='true'>1</td><td id='Comment' contenteditable='true'>Enter Comment</td><td></td><td><button class='delete_row'><i class='fa fa-minus-circle'></i></button></td></tr>"
  )

  const rows = document
    .getElementById('alt_table')
    .querySelector('tbody')
    .querySelectorAll('tr')

  for (let i = 0; i < rows.length - 1; i++) {
    rows[i].classList.remove('hidden')
  }
})

$('#alt_table').on('click', '.delete_row', function () {
  $(this).closest('tr').remove()
})

$('#alt_table').on(
  'input',
  "td:nth-child(3)[contenteditable='true']",
  function () {
    if (isNaN($(this).text())) {
      $(this).text('')
    }
  }
)

function calculateSums () {
  console.log("we're changing values")

  const sumtable = document.getElementById('alt_table')
  const tbody = sumtable.getElementsByTagName('tbody')[0]
  const rows = tbody.getElementsByTagName('tr')
  const sums = {}
  const referenceArr = {}

  for (let i = 0; i < rows.length - 1; i++) {
    const row = rows[i]

    const attributeElement = row
      .getElementsByTagName('td')[0]
      .getElementsByTagName('select')[0]
    const attributeValue =
      attributeElement.options[attributeElement.selectedIndex].text

    console.log(attributeValue)

    const selectElement = row
      .getElementsByTagName('td')[1]
      .getElementsByTagName('select')[0]
    const columnsValue = selectElement.options[selectElement.selectedIndex].text

    const multiplierCell = row.getElementsByTagName('td')[2]
    const multiplierValue = parseFloat(multiplierCell.innerHTML)

    if (!sums[columnsValue]) {
      sums[columnsValue] = 0
    }

    sums[columnsValue] += multiplierValue

    if (!referenceArr[columnsValue]) {
      referenceArr[columnsValue] = attributeValue
    }
  }

  // Get a reference to the table element
  const excelDataTable = document.querySelector('#excel_data')

  for (let columnValue in sums) {
    // Use querySelectorAll to select only the select elements with the desired ID within the table
    const targetClass = referenceArr[columnValue]
    const targetText = columnValue

    // This looks for a select element
    // We also need to look for any classname matches even if they aren't a select element

    var selectElements = excelDataTable.querySelectorAll(
      `td[id='${targetClass}']`)
    
    if (selectElements.length === 0) {
      // If there are no elements with the target class, select all td elements with the target class
      selectElements = excelDataTable.querySelectorAll(`select[id='${targetClass}']`);
    }

    for (let i = 0; i < selectElements.length; i++) {
      const td = selectElements[i]
      if (td.className === targetText) {
        // Find where the next tr is

        const tr = td.parentElement.parentElement.nextElementSibling
        const lastTd = tr.querySelector('td:last-of-type')
        const lastTdValue = parseFloat(lastTd.textContent)
        const newValue = (lastTdValue * sums[columnValue]).toFixed(2)

        eventId = td.closest('tr').id
        lastTd.textContent = newValue

        // We then need to recalculate the maths
        const rowName = eventId.slice(0, eventId.indexOf('item'))
        const rowReference = parseInt(rowName.replace('row', ''), 10) - 1

        calcUpdate(lastTd, mathsData, rowReference, [])

        // We also want to turn the parent-parent tr element yellow if a multiplier is changed and the one itself
        const secondToLastTd = lastTd.previousElementSibling
        const rowNumber = `row${parseInt(tr.id.match(/row(\d+)/)[1])}item2`
        const targetCell = document.querySelector(`td[id*="${rowNumber}"]`)

        setBackground(secondToLastTd, 'yellow')
        setBackground(targetCell.parentElement, 'yellow')

        // Update the comment cell in the parent tr to point out that multipliers have been applied
        // Get the current contents of the comment td element
        const commentTD = targetCell.parentElement.querySelector('#comment')
        const currentContents = commentTD.innerHTML
        const newString = lastTd.className + ' multiplier added'
        // Update comment
        if (!currentContents.includes(newString)) {
          const newContents = currentContents + '<br>' + newString
          commentTD.innerHTML = newContents
        }
      }
    }
  }

  $('.Total')
    .map(function () {
      return $(this).text()
    })
    .get()
    .sort(function (a, b) {
      return a - b
    })
    .reduce(function (a, b) {
      if (b != a[0]) a.unshift(b)
      return a
    }, [])
    .forEach((v, i) => {
      $('.Total')
        .filter(function () {
          return $(this).text() == v
        })
        .next()
        .text(i + 1)
    })
}

function addCalculateSumsListener () {

  hideAllRows()
  const button = document.getElementById('calculate-button')

  button.addEventListener('click', () => {
    if (!tableReset) {
      console.log('table is empty')
      tableReset = document.getElementById('excel_data').innerHTML
    } else {
      console.log('Already populated')
    }

    const commentCells = document.querySelectorAll('#alt_table #Comment')
    for (let i = 0; i < commentCells.length - 1; i++) {
      const cell = commentCells[i]
      if (cell.textContent === 'Enter Comment') {
        alert(
          'Please enter comments if multipliers are used. Multipliers will not be applied without an accompanying comment. If a multiplier column is not being used, use the delete button to remove that row.'
        )
        break
      }
    }
    calculateSums()
  })
}

const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', () => {
  console.log('reset button clicked')

  const current_table = document.getElementById('excel_data')
  current_table.innerHTML = tableReset
})

addCalculateSumsListener()
