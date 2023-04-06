// let saveButton = document.getElementById('save_file');

// saveButton.addEventListener('click', function() {
//   // code to execute when the button is clicked
//     console.log("Save button clicked")

// // We need to read the current table loaded in
// // JavaScript code to clone table1 and insert it into table2
//     let table1 = document.getElementById('excel_data');
//     let table2 = document.getElementById('save_table');
//     let newTable = table1.cloneNode(true);
//     table2.appendChild(newTable);

// // Per row, we need to convert all hidden rows into columns
//     // How many hidden rows are there, we'll need this many new columns
//     const visibleRows = table1.querySelectorAll('tr:not(.hidden)');
//     const rowCount = visibleRows.length;

//     // create an empty array to hold the item numbers
//     const itemIds = [];

//     // loop through all the table elements with ids formatted as "row20itemX"
//     for (let i = 1; i <= 30; i++) {
//     const tableElement = document.getElementById(`row2item${i}`);
//     if (tableElement && tableElement.classList.contains('hidden')) {
//         // extract the item number and add it to the array
//         const itemNumber = parseInt(tableElement.getAttribute('id').match(/item(\d+)/)[1]);
//         itemIds.push(itemNumber)
//     }
//     }

//     const hiddenRows = table2.querySelectorAll('tr.hidden');
//     hiddenRows.forEach(row => row.remove());

//     // Per row, just take all the hidden rows and chonk them into our new empty headers
//     let trs = table2.querySelectorAll('tr');

//     for (let i = 0; i < trs.length; i++) {
//       let row = trs[i];
//       for (let j = 0; j < rowCount - 1; j++) {

//         let cell = (i === 0) ? document.createElement('th') : document.createElement('td');
//         let refCell = row.cells[itemIds[j]];
//         let innertext = '';

//         if (i > 0) {
//             row_id = "row" + (i+1) + "item" + itemIds[j];
//             let tr = table1.querySelector(`#${row_id}`);
//             innertext = tr.lastElementChild.innerHTML
//         } else {
//             row_id = "row" + (i+2) + "item" + itemIds[j];
//             let tr = table1.querySelector(`#${row_id}`);
//             innertext = tr.lastElementChild.previousElementSibling.innerHTML
//         }

//         let text = document.createTextNode(innertext);
//         cell.appendChild(text);

//         row.insertBefore(cell, refCell.nextSibling);
//       }
//     }

// // Now we have our updated table we can use table2excel to save the output into an excel file.

// });


function exportToExcel() {

  // code to execute when the button is clicked
  console.log("Save button clicked")

  // We need to read the current table loaded in
  // JavaScript code to clone table1 and insert it into table2
      let table1 = document.getElementById('excel_data');
      let table2 = document.getElementById('save_table');
      let newTable = table1.cloneNode(true);
      table2.appendChild(newTable);
  
  // Per row, we need to convert all hidden rows into columns
      // How many hidden rows are there, we'll need this many new columns
      const visibleRows = table1.querySelectorAll('tr:not(.hidden)');
      const rowCount = visibleRows.length;
  
      // create an empty array to hold the item numbers
      const itemIds = [];
  
      // loop through all the table elements with ids formatted as "row20itemX"
      for (let i = 1; i <= 30; i++) {
      const tableElement = document.getElementById(`row2item${i}`);
      if (tableElement && tableElement.classList.contains('hidden')) {
          // extract the item number and add it to the array
          const itemNumber = parseInt(tableElement.getAttribute('id').match(/item(\d+)/)[1]);
          itemIds.push(itemNumber)
      }
      }
  
      const hiddenRows = table2.querySelectorAll('tr.hidden');
      hiddenRows.forEach(row => row.remove());
  
      // Per row, just take all the hidden rows and chonk them into our new empty headers
      let trs = table2.querySelectorAll('tr');
  
      for (let i = 0; i < trs.length; i++) {
        let row = trs[i];
        for (let j = 0; j < rowCount - 1; j++) {
  
          let cell = (i === 0) ? document.createElement('th') : document.createElement('td');
          let refCell = row.cells[itemIds[j]];
          let innertext = '';
  
          if (i > 0) {
              row_id = "row" + (i+1) + "item" + itemIds[j];
              let tr = table1.querySelector(`#${row_id}`);
              innertext = tr.lastElementChild.innerHTML
          } else {
              row_id = "row" + (i+2) + "item" + itemIds[j];
              let tr = table1.querySelector(`#${row_id}`);
              innertext = tr.lastElementChild.previousElementSibling.innerHTML
          }
  
          let text = document.createTextNode(innertext);
          cell.appendChild(text);
  
          row.insertBefore(cell, refCell.nextSibling);
        }
      }

  }