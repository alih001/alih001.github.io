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
          var parent_tr = parentCell.parentElement
          var previousCell = parentCell.previousElementSibling;

          const rowNumber = 'row' + parseInt(parent_tr.getAttribute('id').match(/row(\d+)/)[1]) +'item2';
          const td = document.querySelector(`td[id*="${rowNumber}"]`);

          // Highlight the previous cell with yellow background color
          previousCell.style.backgroundColor = "yellow";
          td.parentElement.style.backgroundColor = "yellow";
      });
  }
}