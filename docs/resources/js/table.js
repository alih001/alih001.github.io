const excel_file = document.getElementById('excel_file');
var options;
// This function adds in a search function to a specific table
(function (document) {
    'use strict';

    var TableFilter = (function (myArray) {
        var search_input;

        function _onInputSearch(e) {
            search_input = e.target;
            var tables = document.getElementsByClassName(search_input.getAttribute('data-table'));
            myArray.forEach.call(tables, function (table) {
                myArray.forEach.call(table.tBodies, function (tbody) {
                    myArray.forEach.call(tbody.rows, function (row) {
                        var text_content = row.textContent.toLowerCase();
                        var search_val = search_input.value.toLowerCase();
                        row.style.display = text_content.indexOf(search_val) > -1 ? '' : 'none';
                    });
                });
            });
        }

        return {
            init: function () {
                var inputs = document.getElementsByClassName('search-input');
                myArray.forEach.call(inputs, function (input) {
                    input.oninput = _onInputSearch;
                });
            }
        };
    })(Array.prototype);

    document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
            TableFilter.init();
        }
    });

})

    (document);

// This function lets you load in an excel worksheet into the webapp
excel_file.addEventListener('change', async (event) => {

    const response = await fetch("./json/DropdownItems.json");
    const json_data = await response.json();
    console.log(json_data)

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
        var sheet_name = work_book.SheetNames;
        var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], { header: 1 });
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
                        table_output += '<th class="visually-hidden">' + sheet_data[row][cell] + '</th><th></th>';
                    }
                    else if (row == 1 && trueArray.indexOf(cell) === -1) {
                        table_output += '<th id ="' + sheet_data[row][cell] + '">' + sheet_data[row][cell] + '</th>';
                    }

                    if (row > 1 && trueArray.indexOf(cell) === -1) {
                        table_output += '<td contenteditable="true" id="' + rowItem + '" class="' + sheet_data[1][cell] + '">' + sheet_data[row][cell] + '</td>';
                    }
                }

                table_output += '</tr>';
                if (row == 1) { table_output += '</thead>' }

                for (var hidden_cell = 0; hidden_cell < sheet_data[row].length; hidden_cell++) {

                    desiredText = sheet_data[1][hidden_cell]
                    rowItem = 'row' + row + 'item' + hidden_cell

                    if (row > 1 && trueArray.includes(hidden_cell) && json_data.hasOwnProperty(desiredText)) {
                        // console.log("Replace this with a ddm: " + desiredText + ", value is" + sheet_data[row][hidden_cell])
                        table_output += '<tr id="' + rowItem + '" class="hidden"><td></td><td class="hidden-header">' + sheet_data[1][hidden_cell] + '</td><td><select id="' + desiredText + '" class="' + sheet_data[row][hidden_cell] + '"></select></td></tr>';
                    }

                    else if (row > 1 && trueArray.includes(hidden_cell)) {
                        // console.log(sheet_data[1][hidden_cell])
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
                    // console.log(optionArray)
                    // console.log(selectElement.className)
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

// This function adds the functionality to open/close hidden rows defined in the worksheet
function toggle(btnID, eIDs) {
    // Feed the list of ids as a selector
    var theRows = document.querySelectorAll(eIDs);
    // Get the button that triggered this
    var theButton = document.getElementById(btnID);
    // If the button is not expanded...
    if (theButton.getAttribute("aria-expanded") == "false") {
        // Loop through the rows and show them
        for (var i = 0; i < theRows.length; i++) {
            theRows[i].classList.add("shown");
            theRows[i].classList.remove("hidden");
        }
        // Now set the button to expanded
        theButton.setAttribute("aria-expanded", "true");
        // Otherwise button is not expanded...
    } else {
        // Loop through the rows and hide them
        for (var i = 0; i < theRows.length; i++) {
            theRows[i].classList.add("hidden");
            theRows[i].classList.remove("shown");
        }
        // Now set the button to collapsed
        theButton.setAttribute("aria-expanded", "false");
    }
}

const table = document.getElementById("excel_data");

function highlightTableCells() {
    // Get all dropdown menus in the table
    var dropdowns = document.querySelectorAll("#excel_data select");
    // Loop through the dropdown menus
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener("change", function () {
            // Get the parent cell of the changed dropdown menu
            var parentCell = this.parentNode;
            console.log(parentCell)
            var previousCell = parentCell.previousElementSibling;
            // Highlight the previous cell with yellow background color
            previousCell.style.backgroundColor = "yellow";
        });
    }
}