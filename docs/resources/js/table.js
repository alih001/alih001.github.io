const excel_file = document.getElementById('excel_file');
var options;
var versionControl

// This function lets you load in an excel worksheet into the webapp
excel_file.addEventListener('change', async (event) => {

    const response = await fetch("./json/DropdownItems.json");
    const json_data = await response.json();
    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type)) {
        document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';
        excel_file.value = '';
        return false;
    }
    var reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = function (event) {

        var data = new Uint8Array(reader.result);
        var work_book = XLSX.read(data, { type: 'array' });
        var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets['Table Outputs'], { header: 1 });
        versionControl = XLSX.utils.sheet_to_json(work_book.Sheets['Version Control']);

        let trueArray = []

        if (sheet_data.length > 0) {
            var table_output = '<table class="table-editable">';

            const filterName = 'Collapsable'
            const key_count = Object.keys(sheet_data);
            const lenth = key_count.length


            for (var collapse_cell = 0; collapse_cell <= sheet_data.length; collapse_cell++) {
                if (sheet_data[0][collapse_cell] === 'Collapsable Header') {
                    trueArray.push(collapse_cell)
                }
            }
            let index_ids = []
            for (var row = 1; row <= sheet_data.length; row++) {
                let row_id = []

                for (var item = 0; item < trueArray.length; item++) {
                    if (item == trueArray.length - 1) {
                        row_id += "#row" + row + "item" + trueArray[item]
                    }
                    else {
                        row_id += "#row" + row + "item" + trueArray[item] + " "
                    }
                }
                index_ids[row - 1] = row_id.replace(/ /g, ",")
            }

            for (var row = 1; row < sheet_data.length; row++) {

                if (row == 1) { table_output += '<thead>' };
                table_output += '<tr>'
                button_id = row + "_id"

                if (row > 1) {
                    table_output += '<td class = "table_button">' +
                        '<button type="button" id="' + button_id + '" onclick="toggle(this.id,' + "'" + index_ids[row - 1] + "'" + ');"aria-expanded="false" ;"><i class="fas fa-sharp fa-solid fa-list"></i></button>' +
                        '</td>'
                }

                for (var cell = 0; cell < sheet_data[row].length; cell++) {

                    rowItem = 'row' + row + 'item' + cell

                    if (row == 1 && trueArray.indexOf(cell) === -1 && cell == 0) {
                        table_output += '<th class="visually-hidden"></th><th>' + sheet_data[row][cell] + '</th>';
                    }
                    else if (row == 1 && trueArray.indexOf(cell) === -1) {
                        table_output += '<th id ="' + sheet_data[row][cell] + '">' + sheet_data[row][cell] + '</th>';
                    }

                    if (row == 1 && cell == sheet_data[row].length - 1) {
                        table_output += '<th id ="comment">Comment</th>';
                    }

                    if (row > 1 && trueArray.indexOf(cell) === -1) {
                        table_output += '<td contenteditable="true" id="' + rowItem + '" class="' + sheet_data[1][cell] + '">' + sheet_data[row][cell] + '</td>';
                    }
                    if (row > 1 && cell == sheet_data[row].length - 1) {
                        table_output += '<td contenteditable="true" id="comment">...if applicable</td>';
                    }
                }
                if (row == 1 && trueArray.indexOf(cell) === -1 && cell == 0) {
                    table_output += '<th class="visually-hidden">' + sheet_data[row][cell] + '</th><th></th>';
                }

                table_output += '</tr>';
                if (row == 1) { table_output += '</thead>' }

                for (var hidden_cell = 0; hidden_cell < sheet_data[row].length; hidden_cell++) {

                    desiredText = sheet_data[1][hidden_cell]
                    rowItem = 'row' + row + 'item' + hidden_cell

                    if (row > 1 && trueArray.includes(hidden_cell) && json_data.hasOwnProperty(desiredText)) {
                        table_output += '<tr id="' + rowItem + '" class="hidden"><td></td><td class="hidden-header">' + sheet_data[1][hidden_cell] + '</td><td><select id="' + desiredText + '" class="' + sheet_data[row][hidden_cell] + '"></select></td></tr>';
                    }

                    else if (row > 1 && trueArray.includes(hidden_cell)) {
                        table_output += '<tr id="' + rowItem + '" class="hidden"><td></td><td class="hidden-header">' + sheet_data[1][hidden_cell] + '</td><td class="' + desiredText + '">' + sheet_data[row][hidden_cell] + '</td></tr>';
                    }
                }

            }
            table_output += '</table>';
            document.getElementById('excel_data').innerHTML = table_output;
            excel_file.value = '';

            var selectElements = document.getElementsByTagName("select");
            for (var i = 0; i < selectElements.length; i++) {
                var selectElement = selectElements[i];
                var selectId = selectElement.id;

                if (json_data.hasOwnProperty(selectId)) {
                    var optionArray = json_data[selectId];
                    var desiredText = selectElement.className

                    for (var j = 0; j < optionArray.length; j++) {
                        var option = optionArray[j];
                        var optionElement = document.createElement("option");
                        optionElement.value = option.value;
                        optionElement.text = option.text;
                        selectElement.appendChild(optionElement);
                        if (option.text == desiredText) {
                            var chosen_value = option.value
                        }
                    }
                }
                selectElement.value = chosen_value
            }
        }
        highlightTableCells();
    }
});

function exportToExcel() {

    const table1 = document.getElementById('excel_data');
    const rows = table1.querySelectorAll('tr');
    let errorFound = false;
    rows.forEach((row) => {
      if (row.style.backgroundColor === 'yellow') {
        const commentCell = row.querySelector('#comment');
        if (commentCell && commentCell.innerText === '...if applicable') {
          errorFound = true;
        }
      }
    });
    
    if (errorFound) {
        alert('Error: Updates were made in Weir Ranking table without an accompanying comment. Please ensure all rows highlighted yellow have an appropriate comment entered.');
    } else {

        const newTable = table1.cloneNode(true);
        const cellsToRemove = newTable.querySelectorAll('td:first-child, th:first-child');
        cellsToRemove.forEach(cell => cell.remove());
          
        const itemIds = [];
        for (let i = 1; i <= 44; i++) {
            const tableElement = document.getElementById(`row2item${i}`);
            if (tableElement && tableElement.classList.contains('hidden')) {
                const itemNumber = parseInt(tableElement.getAttribute('id').match(/item(\d+)/)[1]);
                itemIds.push(itemNumber);
            }
        }

        const hiddenRows = newTable.querySelectorAll('tr.hidden');
        hiddenRows.forEach(row => row.remove());
        
            // Per row, just take all the hidden rows and chonk them into our new empty headers
            let trs = newTable.querySelectorAll('tr');
        
            for (let i = 0; i < trs.length; i++) {
              let row = trs[i];
              let innertext = '';
              
              for (let j = 0; j < itemIds.length; j++) {
                let cell = (i === 0) ? document.createElement('th') : document.createElement('td');
                let refCell = row.cells[itemIds[j]];
                
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
                        innertext = secondLastChild.innerHTML; // reset innertext for each row
                    }
                }
            
                let text = document.createTextNode(innertext);
                cell.appendChild(text);
                row.insertBefore(cell, refCell.nextSibling);
              }
            }

            // Get the modal
            var modal = document.getElementById("myModal");
            var username;
            modal.style.display = "block";

            // When the user clicks the "Save" button, store the username and close the modal
            var saveBtn = document.getElementById("saveBtn");
            saveBtn.onclick = function() {
                filename = document.getElementById("filename").value;
                username = document.getElementById("username").value;
                email = document.getElementById("email").value;
                summary = document.getElementById("summary").value;

                modal.style.display = "none";

                let newRow = {
                    Filename: filename,
                    Username: username,
                    Email: email,
                    Summary: summary
                };
                
                versionControl.push(newRow);

                const factorTable = document.getElementById('alt_table');

                if (filename != null) {
                    var wb = XLSX.utils.book_new();
                    var ws1 = XLSX.utils.json_to_sheet(versionControl);
                    var ws2 = XLSX.utils.table_to_sheet(newTable);
                    var ws3 = XLSX.utils.table_to_sheet(factorTable);
            
                    XLSX.utils.book_append_sheet(wb, ws1, "Version Control");
                    XLSX.utils.book_append_sheet(wb, ws2, "Table Outputs");
                    XLSX.utils.book_append_sheet(wb, ws3, "Risk Factors");
                    XLSX.writeFile(wb, filename + ".xlsx");
                }
      
          // Reset background colours now that we've saved
            const trElements = document.querySelectorAll('tr');
            trElements.forEach(tr => tr.removeAttribute('style'));
            
            const hiddenTdElements = document.querySelectorAll('td[style*="display:none"][style*="background-color:yellow"]');
            hiddenTdElements.forEach(td => td.removeAttribute('style'));
            }
    }
  }