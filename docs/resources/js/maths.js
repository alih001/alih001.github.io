let referenceData = {}
fetch('./json/MenuScoreReference.json')
  .then(response => response.json())
  .then(menu_json => {
    referenceData = menu_json
  })

let mathsData = {}
fetch('./json/equations.json')
  .then(response => response.json())
  .then(maths_json => {
    mathsData = maths_json
  })

function calculateEquationValue (equation, rowReference) {
  const values = equation.values.map(value => {
    const tdValue =
      document.getElementsByClassName(value)[rowReference - 1].textContent
    return parseInt(tdValue)
  })

  if (equation.type === 'sum') {
    return values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    )
  } else if (equation.type === 'product') {
    return values.reduce(
      (accumulator, currentValue) => accumulator * currentValue,
      1
    )
  }
}

function calculateOutput (equation, rowReference) {
  const value = calculateEquationValue(equation, rowReference)
  const outputCell = document.getElementsByClassName(equation.output)[
    rowReference - 1
  ]
  outputCell.innerHTML = value
  return value
}

function calculateCustomProduct (equation, rowReference, tempValues) {
  const tdValue = document.getElementsByClassName(equation.values[0])[
    rowReference - 1
  ]
  const value = tdValue.innerHTML * equation.values[1]
  tempValues.push([equation.output, value])
}

function calcUpdate (event, mathsData, rowReference, tempValues) {
  mathsData.Equations.forEach(equation => {
    if (equation.type === 'calculate') {
      var output = 0

      tempValues.forEach(x => {
        if (x[0] === equation.values[0]) {
          output += x[1]
        }
      })

      const outputCell = document.getElementsByClassName(equation.output)[
        rowReference - 1
      ]
      outputCell.innerHTML = (output * equation.values[1]).toFixed(2)
    } else if (equation.type === 'custom product') {
      calculateCustomProduct(equation, rowReference, tempValues)
    } else {
      calculateOutput(equation, rowReference, tempValues)
    }
  })
}

document
  .querySelector('.table-editable')
  .addEventListener('change', function (event) {
    if (referenceData.hasOwnProperty(event.target.id)) {
      const output = referenceData[event.target.id]
      const selectedText = event.target.options[event.target.selectedIndex].text

      let selectedValue = event.target.value
      let targetTd = event.target
        .closest('tr')
        .nextElementSibling.querySelector('td[class="' + output + '"]')
      targetTd.innerText = selectedValue

      eventId = event.target.closest('tr').id
      event.target.className = selectedText

      const rowName = eventId.slice(0, eventId.indexOf('item'))
      const rowReference = parseInt(rowName.replace('row', ''), 10) - 1
      calcUpdate(targetTd, mathsData, rowReference, [])

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
  })
