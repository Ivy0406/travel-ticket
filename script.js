let allTicketsUrl =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
let defaultImgUrl = "https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

let allTicketsJson = [];

const RegionSearch = document.querySelector(".region-search");
const TicketCardsArea = document.querySelector(".ticket-card-area");
const AddNewTicketBtn = document.querySelector(".add-ticket-btn");
const ResultText = document.querySelector("#search-result-text");
const InputForm = document.querySelector(".add-ticket-form");
const AllAlertMessageFields = document.querySelectorAll(".alert-message");

const InputName = document.querySelector("#ticket-name");
const InputImgUrl = document.querySelector("#ticket-img-url");
const InputRegion = document.querySelector("#ticket-region");
const InputPrice = document.querySelector("#ticket-price");
const InputNum = document.querySelector("#ticket-num");
const InputRate = document.querySelector("#ticket-rate");
const InputDescription = document.querySelector("#ticket-description");

getAllTicketsJson();

async function getAllTicketsJson() {
  try {
    let res = await axios.get(allTicketsUrl);
    allTicketsJson = res.data.data;
    renderTicketCardsArea(allTicketsJson);
    updateDonutChart(allTicketsJson);
  } catch (error) {
    console.log(error);
  }
}

function renderTicketCardsArea(tikcetsToRender) {
  let ticketsNum = tikcetsToRender.length;
  ResultText.textContent = `本次搜尋共 ${ticketsNum} 筆資料`;

  let tikcetCardsStr = tikcetsToRender
    .map((ticket) => {
      let ticketCardStr = `<li class="ticket-card">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src=${ticket.imgUrl}
                alt=${ticket.name}
              />
            </a>
            <div class="ticket-card-region">${ticket.area}</div>
            <div class="ticket-card-rank">${ticket.rate}</div>
          </div>
          <div class="ticket-card-content">
            <div>
              <h3>
                <a href="#" class="ticket-card-name">${ticket.name}</a>
              </h3>
              <p class="ticket-card-description">
                ${ticket.description}
              </p>
            </div>
            <div class="ticket-card-info">
              <div class="ticket-card-num">
                <p>
                  <span><i class="fas fa-exclamation-circle"></i></span>
                  剩下最後 <span id="ticket-card-num"> ${ticket.group} </span> 組
                </p>
              </div>
              <p class="ticket-card-price">
                TWD <span id="ticket-card-price">$${ticket.price}</span>
              </p>
            </div>
          </div>
        </li>`;
      return ticketCardStr;
    })
    .join("");
  TicketCardsArea.innerHTML = tikcetCardsStr;
  updateDonutChart(tikcetsToRender);
}

function updateDonutChart(tikcetsToRender) {
  const regionCounts = tikcetsToRender.reduce((countsObj, ticket) => {
    countsObj[ticket.area] = (countsObj[ticket.area] || 0) + 1;
    return countsObj;
  }, {});

  const regionCountsAry = Object.entries(regionCounts);

  const donutChart = c3.generate({
    bindto: "#region-donut-chart",
    data: {
      columns: regionCountsAry,
      type: "donut",
      colors: {
        台北: "#26C0C7",
        台中: "#5151D3",
        高雄: "#E68619",
      },
    },
    donut: {
      title: "套票地區比重",
      label: { show: false },
      width: 12,
    },
    size: {
      width: 182,
      height: 212,
    },
  });
}

function filterRegion(regionSelected) {
  if(['全部地區'].includes(regionSelected)){
    renderTicketCardsArea(allTicketsJson);
  }else{
    let ticketsSelected = allTicketsJson.filter(
    (ticket) => ticket.area === regionSelected
  );
  renderTicketCardsArea(ticketsSelected);
  }

  
}

function addNewTicketCard() {
  let inputIsValid = checkRequiredFields();
  if (!inputIsValid) {
    return;
  } else {
    makeNewCard();
    clearInputForm();
  }
}

function checkRequiredFields() {
  const requiredFields = [
    "ticket-name",
    "ticket-region",
    "ticket-price",
    "ticket-num",
    "ticket-rate",
    "ticket-description",
  ];

  let isFinished = true;
  requiredFields.forEach((field) => {
    let targetFieldValue = document.querySelector(`#${field}`).value.trim();
    let targetMessageField = document.querySelector(
      `#${field}-message`
    ).parentElement;
    if (!targetFieldValue) {
      targetMessageField.style.display = "flex";
      isFinished = false;
    } else {
      targetMessageField.style.display = "none";
    }
  });

  return isFinished;
}

function makeNewCard() {
  let currentTicketsNum = allTicketsJson.length;
  const newTicketData = {
    id: Number(currentTicketsNum),
    name: InputName.value.trim(),
    imgUrl:
      InputImgUrl.value || defaultImgUrl,
    area: InputRegion.value,
    description: InputDescription.value.trim(),
    group: Number(InputNum.value),
    price: Number(InputPrice.value),
    rate: Number(InputRate.value)
  };
  allTicketsJson.push(newTicketData);
  renderTicketCardsArea(allTicketsJson);
}

function clearInputForm() {
  InputForm.reset();
  AllAlertMessageFields.forEach(field=>field.style.display = "none");
}

AddNewTicketBtn.addEventListener("click", addNewTicketCard);

RegionSearch.addEventListener("change", function (e) {
  let regionSelected = e.target.value;
  filterRegion(regionSelected);
});
