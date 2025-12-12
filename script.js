const Api_Url =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
const Default_Img =
  "https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const dom = {
  list: document.querySelector(".ticket-card-area"),
  regionSearch: document.querySelector(".region-search"),
  searchResult: document.querySelector("#search-result-text"),
  addBtn: document.querySelector(".add-ticket-btn"),
  addForm: document.querySelector(".add-ticket-form"),
};

let allTicketsData = [];

getAllTicketsData();

async function getAllTicketsData() {
  try {
    let res = await axios.get(Api_Url);
    allTicketsData = res.data.data;
    renderCards(allTicketsData);
  } catch (error) {
    console.log(error);
  }
}

function renderCards(ticketsToRender) {
  dom.searchResult.textContent = `本次搜尋共 ${allTicketsData.length} 筆資料`;
  let cardsStr = ticketsToRender
    .map((ticket) => {
      let card = `<li class="ticket-card">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src=${ticket.imgUrl}
                alt${ticket.name}
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
              <p class="ticket-card-num">
                <span>
                  <i class="fas fa-exclamation-circle"></i>
                </span>
                剩下最後 <span id="ticket-card-num"> ${ticket.group} </span> 組
              </p>
              <p class="ticket-card-price">
                TWD
                <span id="ticket-card-price">$${ticket.price}</span>
              </p>
            </div>
          </div>
        </li>`;
      return card;
    })
    .join("");

  dom.list.innerHTML = cardsStr;
  updateChart(ticketsToRender);
}

function updateChart(ticketsForChart) {
  const regionCounts = ticketsForChart.reduce((countsObj, ticket) => {
    countsObj[ticket.area] = (countsObj[ticket.area] || 0) + 1;
    return countsObj;
  },{});

  const regionCountsAry = Object.entries(regionCounts);

  const chart = c3.generate({
    bindto: "#region-chart",
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

function filterRegions(regionSelected) {
  if (regionSelected === "全部地區") {
    renderCards(allTicketsData);
  } else {
    let ticketsSelected = allTicketsData.filter(
      (ticket) => ticket.area === regionSelected
    );
    renderCards(ticketsSelected);
  }
}

function addNewCard() {
  let isFinished = true;
  let inputs = dom.addForm.elements;
  const requiredFields = [
    "ticket-name",
    "ticket-region",
    "ticket-price",
    "ticket-num",
    "ticket-rate",
    "ticket-description",
  ];

  requiredFields.forEach((id) => {
    let input = inputs[id];
    let alert = document.querySelector(`#${id}-message`).parentElement;
    if (!input.value.trim()) {
      alert.style.display = "flex";
      isFinished = false;
    } else {
      alert.style.display = "none";
    }
  });

  if (!isFinished) return;

  let newTicket = {
    id: Number(allTicketsData.length),
    name: inputs["ticket-name"].value.trim(),
    imgUrl: inputs["ticket-img-url"].value || Default_Img,
    area: inputs["ticket-region"].value.trim(),
    description: inputs["ticket-description"].value.trim(),
    group: Number(inputs["ticket-num"].value),
    price: Number(inputs["ticket-price"].value),
    rate: Number(inputs["ticket-rate"].value),
  };
  allTicketsData.push(newTicket);
  renderCards(allTicketsData);
  dom.addForm.reset();
  document.querySelectorAll('.alert-message').forEach(field=>field.style.display = 'none');
}

dom.addBtn.addEventListener("click", addNewCard);

dom.regionSearch.addEventListener("change", function (e) {
  let regionSelected = e.target.value;
  filterRegions(regionSelected);
});
