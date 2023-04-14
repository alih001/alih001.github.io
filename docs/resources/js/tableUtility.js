(function (document) {
  'use strict';

  const TableFilter = (() => {
    const searchTable = (searchInput, tables) => {
      const rows = getRowsFromTables(tables);
      rows.forEach(row => {
        if (!row.classList.contains('hidden')) {
          const textContent = row.textContent.toLowerCase();
          const searchVal = searchInput.value.toLowerCase();
          row.style.display = textContent.includes(searchVal) ? '' : 'none';
        }
      });
    };

    const getRowsFromTables = (tables) => {
      return Array.from(tables).flatMap(table => Array.from(table.tBodies[0].rows));
    };

    const attachInputListeners = () => {
      const searchInputs = document.querySelectorAll('.search-input');
      Array.from(searchInputs).forEach(searchInput => {
        searchInput.addEventListener('input', e => {
          const tables = document.querySelectorAll(`.${searchInput.dataset.table}`);
          searchTable(searchInput, tables);
        });
      });
    };

    const init = () => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          attachInputListeners();
        }
      });
    };

    return {
      init,
    };
  })();

  TableFilter.init();
})(document);

function toggle(btnID, eIDs) {
  const theRows = [...document.querySelectorAll(eIDs)];
  const theButton = document.getElementById(btnID);
  const isExpanded = theButton.dataset.expanded === "true";

  theRows.forEach(row => {
    row.classList.toggle("shown", isExpanded);
    row.classList.toggle("hidden", !isExpanded);

  });

  theButton.dataset.expanded = isExpanded ? "false" : "true";
}

function highlightTableCells() {
  const dropdowns = document.querySelectorAll("#excel_data select");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("change", () => {
      const parentCell = dropdown.parentNode;
      const parentTr = parentCell.parentElement;
      const previousCell = parentCell.previousElementSibling;
      const rowNumber = `row${parseInt(parentTr.id.match(/row(\d+)/)[1])}item2`;
      const targetCell = document.querySelector(`td[id*="${rowNumber}"]`);

      setBackground(previousCell, "yellow");
      setBackground(targetCell.parentElement, "yellow");
    });
  });
}

function setBackground(element, color) {
  element.style.backgroundColor = color;
}