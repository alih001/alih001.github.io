function exportToExcel() {

  // code to execute when the button is clicked
  console.log("Save button clicked")

  // We need to read the current table loaded in
  // JavaScript code to clone table1 and insert it into table2
      let table1 = document.getElementById('excel_data');
      let table2 = document.getElementById('save_table');
      let newTable = table1.cloneNode(true);

      const cellsToRemove = newTable.querySelectorAll('td:first-child, th:first-child');
      cellsToRemove.forEach(cell => cell.remove());
  
  // Per row, we need to convert all hidden rows into columns
      // How many hidden rows are there, we'll need this many new columns
      const visibleRows = table1.querySelectorAll('tr:not(.hidden)');
      const rowCount = visibleRows.length;
  
      // create an empty array to hold the item numbers
      const itemIds = [];
  
      // loop through all the table elements with ids formatted as "row20itemX"
      for (let i = 1; i <= 44; i++) {
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
        console.log(trs.length)
        for (let j = 0; j < itemIds.length; j++) {
  
          let cell = (i === 0) ? document.createElement('th') : document.createElement('td');
          let refCell = row.cells[itemIds[j]];
          let innertext = '';
  
          if (i > 0) {
              row_id = "row" + (i+1) + "item" + itemIds[j];
              let tr = table1.querySelector(`#${row_id}`);
              let select = tr.lastElementChild.querySelector('select');
              if (select) {
                innertext = select.options[select.selectedIndex].text;
              } else {
                innertext = tr.lastElementChild.innerHTML;
              }


          } else {
              row_id = "row" + (i+2) + "item" + itemIds[j];
              let tr = table1.querySelector(`#${row_id}`);
              let select = tr.lastElementChild.querySelector('select');

              const lastChild = tr.lastElementChild;
              const secondLastChild = lastChild.previousElementSibling;
              
              if (select) {
                innertext = secondLastChild.innerHTML;
              } else {
                innertext = secondLastChild.innerHTML;
              }  
            }
  
          let text = document.createTextNode(innertext);
          cell.appendChild(text);

              // add style attribute if cell has a yellow background
          if (refCell.style.backgroundColor === 'yellow') {
            cell.setAttribute('style', 'background-color: yellow');
          }
  
          row.insertBefore(cell, refCell.nextSibling);
        }
      }

      var filename = prompt("Enter a filename for the exported Excel file:");
      if (filename != null) {
        var fileExists = false;
        // Check if file exists
        var reader = new FileReader();
        reader.onload = function() {
          fileExists = true;
          var confirmed = confirm("The file already exists. Do you want to overwrite it?");
          if (confirmed) {
            var excelFile = XLSX.utils.table_to_book(newTable, {sheet: "sheet1"});
            XLSX.writeFile(excelFile, filename + '.xlsx');
          }
        };
        reader.onerror = function() {
          var excelFile = XLSX.utils.table_to_book(newTable, {sheet: "sheet1"});
          XLSX.writeFile(excelFile, filename + '.xlsx');
        };
        reader.readAsDataURL(new Blob([newTable]));
      }

    // Reset background colours now that we've saved
  // var trElements = document.querySelectorAll('tr');
  // for (var i = 0; i < trElements.length; i++) {
  //   trElements[i].removeAttribute('style');
  // }

  // var tdElements = document.querySelectorAll('td');
  // for (var i = 0; i < tdElements.length; i++) {
  //   tdElements[i].removeAttribute('style');
  // }

  // var hiddenTdElements = document.querySelectorAll('td[style*="display:none"][style*="background-color:yellow"]');
  // for (var i = 0; i < hiddenTdElements.length; i++) {
  //   hiddenTdElements[i].removeAttribute('style');
  // }
  }