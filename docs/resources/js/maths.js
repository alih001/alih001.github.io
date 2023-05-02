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

function calcUpdate (event, mathsData, rowReference, updatedClasses) {
  const filteredArray = mathsData.Equations.filter(equation =>
    equation.values.includes(event.className)
  )

  filteredArray.forEach(equation => {
    if (updatedClasses.includes(equation.output)) {
      return
    }
    const sum = equation.values.reduce((accumulator, currentValue) => {
      const tdValue =
        document.getElementsByClassName(currentValue)[rowReference - 1]
          .textContent
      return accumulator + parseInt(tdValue)
    }, 0)

    const updateCell = document.getElementsByClassName(equation.output)[
      rowReference - 1
    ]
    updateCell.innerHTML = sum
    updatedClasses.push(equation.output)

    if (mathsData.Equations.some(eq => eq.values.includes(equation.output))) {
      calcUpdate(
        { className: equation.output },
        mathsData,
        rowReference,
        updatedClasses
      )
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
