buildTable();
function buildTable(filtertype = false) {
  fetch("https://isko88.github.io/creditdata.json")
    .then((response) => response.json())
    .then((data) => {
      // clear table
      const maintableTR = document.querySelectorAll(
        "section.table table tbody tr"
      );
      let h = false;
      maintableTR.forEach((tr) => {
        if (!h) {
          h = true;
        } else {
          tr.remove();
        }
      });
      switch (filtertype) {
        case "Active Loans":
          data = FilterActiveLoans(data);
          break;
        case "Default":
          data = Default_Filter(data);
          break;
        default:
          break;
      }

      let cnt = 0;
      for (const index in data) {
        cnt++;
        if (Object.hasOwnProperty.call(data, index)) {
          const customer_data = data[index];
          const customer_id = customer_data["id"];
          const customer_img = customer_data["img"];
          const customer_name = customer_data["name"];
          const customer_surname = customer_data["surname"];
          const customer_salary = customer_data["salary"]["value"];
          const res = customer_data["loans"].find(
            (info) => info["closed"] == false
          );
          const hasActiveLoan = res != undefined ? true : false;
          let isActiveLoan;
          if (hasActiveLoan) {
            isActiveLoan =
              '<div class="active-loan">' +
              "          <ul>" +
              "              <li>Active</li>" +
              "          </ul>" +
              "      </div>";
          } else {
            isActiveLoan =
              '<div class="inactive-loan">' +
              "        <ul>" +
              "            <li>Inactive</li>" +
              "        </ul>" +
              "    </div>";
          }
          let total_pay = 0;
          customer_data["loans"].forEach((data) => {
            if (!data["closed"]) {
              total_pay += data["perMonth"]["value"];
            }
          });

          let can_next_loan = total_pay < customer_salary * 0.45 ? true : false;
          if (can_next_loan) {
            can_next_loan = "Green_Light_Icon.svg";
          } else {
            can_next_loan = "Red_Light_Icon.svg";
          }
          const trInnerHtml =
            "              <td>" +
            cnt +
            "</td>" +
            '              <td class="customer-photo"><img src="  ' +
            customer_img +
            '  " alt="user photo"></td>' +
            "              <td>" +
            customer_name +
            " " +
            customer_surname +
            "</td>" +
            "              <td>" +
            customer_salary +
            ` (${customer_data["salary"]["currency"]})` +
            "</td>" +
            "              <td>" +
            isActiveLoan +
            "</td>" +
            "              <td class='text-center'>" +
            total_pay +
            "</td>" +
            "              <td class='text-center opacity'>" +
            `<img src='./assets/images/icons/${can_next_loan}' alt='icon' width="25px" height="25px" ` +
            "</td>";
          const tr = document.createElement("tr");
          tr.setAttribute("data-id", customer_id);
          tr.addEventListener("click", function () {
            const modaltbody = document.querySelectorAll(
              "#CustomerModal table tbody tr"
            );
            let j = false;
            modaltbody.forEach((tr) => {
              if (!j) {
                j = true;
              } else {
                tr.remove();
              }
            });
            const clickedCustomerID = this.getAttribute("data-id");
            if (customer_data["id"] == clickedCustomerID) {
              let i = 1;
              const customerPhotoURL = customer_data["img"];
              const customerFullName =
                customer_data["name"] + " " + customer_data["surname"];
              document.querySelector(
                "#current-customer-photo"
              ).src = customerPhotoURL;
              document.querySelector(
                "#current-customer-fullname"
              ).innerText = customerFullName;
              customer_data["loans"].forEach((loan) => {
                const loaner = loan["loaner"];
                const amount = loan["amount"]["value"];
                let isActive = loan["closed"];
                const monthlyPay = loan["perMonth"]["value"];
                const dueAmount = loan["dueAmount"]["value"];
                const startDate = loan["loanPeriod"]["start"];
                const endDate = loan["loanPeriod"]["end"];

                if (!isActive) {
                  isActive =
                    '<div class="active-loan">' +
                    "          <ul>" +
                    "              <li>Active</li>" +
                    "          </ul>" +
                    "      </div>";
                } else {
                  isActive =
                    '<div class="inactive-loan">' +
                    "        <ul>" +
                    "            <li>Inactive</li>" +
                    "        </ul>" +
                    "    </div>";
                }

                const ModalTR = document.createElement("tr");
                ModalTR.innerHTML =
                  `<td>${i++}</td>` +
                  `                    <td>${loaner}</td>` +
                  `                    <td>${amount}</td>` +
                  `                    <td>${isActive}</td>` +
                  `                    <td>${monthlyPay}</td>` +
                  `                    <td>${dueAmount}</td>` +
                  `                    <td>${startDate}</td>` +
                  `                    <td>${endDate}</td>`;

                document
                  .querySelector("#CustomerModal table tbody")
                  .append(ModalTR);
                document.querySelector("#CustomerModal").style.display =
                  "block";
                document.querySelector("#CustomerModal").style.opacity = "1";
              });
            }
          });
          tr.innerHTML = trInnerHtml;
          document.querySelector("section.table table tbody").append(tr);
        }
      }
    });
}

function FilterByFullName() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.querySelector("#search-input");
  filter = input.value.toLowerCase();
  table = document.querySelector("section.table table");
  tr = table.querySelectorAll("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].querySelectorAll("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
