let colData = {};
fetch('./json/ddm_items.json')
  .then(response => response.json())
  .then(menu_json => {
    colData = menu_json
    console.log(colData)
  })

$("#add_row").click(function () {
  var select = $("<select></select>");
  $.each(colData, function (key, value) {
    select.append($("<option></option>").attr("value", key).text(key));
  });
  $("#alt_table tbody").append("<tr><td contenteditable='true'>Enter Category Name</td><td>" + select[0].outerHTML + "</td><td contenteditable='true'>1</td><td><button class='delete_row'><i class='fa fa-minus-circle'></i></button></td></tr>");
});

$("#alt_table").on("click", ".delete_row", function () {
  $(this).closest("tr").remove()
})

$("#alt_table").on("input", "td:nth-child(3)[contenteditable='true']", function () {
  if (isNaN($(this).text())) {
    $(this).text("");
  }
});

function calculateSums() {
  
  const sumtable = document.getElementById("alt_table");
  const tbody = sumtable.getElementsByTagName("tbody")[0];
  const rows = tbody.getElementsByTagName("tr");
  const sums = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const selectElement = row.getElementsByTagName("td")[1].getElementsByTagName("select")[0];
    const columnsValue = selectElement.options[selectElement.selectedIndex].text;

    const multiplierCell = row.getElementsByTagName("td")[2];
    const multiplierValue = parseFloat(multiplierCell.innerHTML);

    if (!sums[columnsValue]) {
      sums[columnsValue] = 0;
    }

    sums[columnsValue] += multiplierValue;
  }

  console.log(sums);

  // Get all the td elements with class "Rank" in the different table
  const rankTds = document.querySelectorAll("#excel_data td.Total");

  // Loop through all the rankTds and update their innerHTML based on the corresponding sums value
  rankTds.forEach((rankTd) => {
    const columnsValue = rankTd.parentNode.querySelector("td.Weir.Complex").innerHTML;
    if (sums[columnsValue]) {

      rankTd.innerHTML = (parseFloat(rankTd.innerHTML) * sums[columnsValue]).toFixed(2);
      console.log(rankTd.innerHTML)
      console.log((parseFloat(rankTd.innerHTML) * sums[columnsValue]).toFixed(2))
    }
  });

  $(".Total")
  .map(function(){return $(this).text()})
  .get()
  .sort(function(a,b){return a - b })
  .reduce(function(a, b){ if (b != a[0]) a.unshift(b); return a }, [])
  .forEach((v,i)=>{
      $('.Total').filter(function() {return $(this).text() == v;}).next().text(i + 1);
  });

}

function addCalculateSumsListener() {
  const button = document.getElementById("calculate-button");
  button.addEventListener("click", calculateSums);
}

addCalculateSumsListener();