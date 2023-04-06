let referenceData = {};
fetch('./json/MenuScoreReference.json')
  .then(response => response.json())
  .then(menu_json => {
    referenceData = menu_json
    // console.log(referenceData)
  })

let mathsData = {};
fetch('./json/equations.json')
  .then(response => response.json())
  .then(maths_json => {
    mathsData = maths_json
  })

function calcUpdate(event, mathsData, rowReference, updatedClasses) {

    const filteredArray = mathsData.Equations.filter(equation => equation.values.includes(event.className))
       
    filteredArray.forEach(equation => {
        if (updatedClasses.includes(equation.output)) {
            return;
        }
        const sum = equation.values.reduce((accumulator, currentValue) => {
            const tdValue = document.getElementsByClassName(currentValue)[rowReference-1].textContent;
            return accumulator + parseInt(tdValue);
        }, 0);

        const updateCell = document.getElementsByClassName(equation.output)[rowReference-1];
        updateCell.innerHTML = sum
        updatedClasses.push(equation.output);

        if (mathsData.Equations.some(eq => eq.values.includes(equation.output))) {
            calcUpdate({className: equation.output}, mathsData, rowReference, updatedClasses);
        }

    });
};

document.querySelector(".table-editable").addEventListener("change", function(event) {

    if (referenceData.hasOwnProperty(event.target.id)) {
        const output = referenceData[event.target.id]

        console.log(`Item that has been changed is ${event.target.id}`)
    
        let selectedValue = event.target.value;
        let targetTd = event.target.closest('tr').nextElementSibling.querySelector('td[class="'+output+'"]');
        targetTd.innerText = selectedValue;

        eventId = event.target.closest('tr').id
        const rowName = eventId.slice(0, eventId.indexOf("item"))
        const rowReference = parseInt(rowName.replace("row", ""), 10) - 1;

        calcUpdate(targetTd, mathsData, rowReference, []);

        $(".Total")
        .map(function(){return $(this).text()})
        .get()
        .sort(function(a,b){return a - b })
        .reduce(function(a, b){ if (b != a[0]) a.unshift(b); return a }, [])
        .forEach((v,i)=>{
            $('.Total').filter(function() {return $(this).text() == v;}).next().text(i + 1);
        });

    }

    // reRankFullTable()
    
});









// THE CODE BELOW WORKS BY LOOPING THROUGH THE DROPDOWN.JSON REPEATEDLY, IT'S NOT AS EFFICIENT BUT WORKS IF THE USER CAN'T ORDER THE JSON BY THE CALCULATION ORDER THEY WANT




// document.querySelector(".table-editable").addEventListener("change", function(event) {


//     if (referenceData.hasOwnProperty(event.target.id)) {
//         const output = referenceData[event.target.id]

//         console.log(`Item that has been changed is ${event.target.id}`)
    
//       // Get the selected value from the drop-down menu
//       let selectedValue = event.target.value;

//       // Get the target td element to be updated
//       let targetTd = event.target.closest('tr').nextElementSibling.querySelector('td[class="'+output+'"]');

//       // Update the target td based on the selected value
//       targetTd.innerText = selectedValue;

//       eventId = event.target.closest('tr').id
//       const rowName = eventId.slice(0, eventId.indexOf("item"))
//       const rowReference = parseInt(rowName.replace("row", ""), 10) - 1;

//       calcUpdate(targetTd, mathsData, rowReference)

//     }
    
//   });

// function calcUpdate(event, mathsData, rowReference) {

//     const filteredArray = mathsData.Equations.filter(equation => equation.values.includes(event.className))
       
//     filteredArray.forEach(equation => {
//         const sum = equation.values.reduce((accumulator, currentValue) => {
//             const tdValue = document.getElementsByClassName(currentValue)[rowReference-1].textContent;
//             return accumulator + parseInt(tdValue);
//         }, 0);

//         const updateCell = document.getElementsByClassName(equation.output)[rowReference-1];
//         updateCell.innerHTML = sum

//         if (mathsData.Equations.some(eq => eq.values.includes(equation.output))) {
//             calcUpdate({className: equation.output}, mathsData, rowReference);
//           }

//       });
// };