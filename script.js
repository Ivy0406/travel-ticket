const API_Url = " https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
const Default_Img = "https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
let allTicketsJson = [];

const TicketCardArea = document.querySelector('.ticket-card-area');
const RegionSelection = document.querySelector('.region-search');
const AddNewCardBtn = document.querySelector('.add-ticket-btn');
const ResultText = document.querySelector('#search-result-text');
const InputForm = document.querySelector('.add-ticket-form');
const InputName = document.querySelector('#ticket-name');
const InputImgUrl = document.querySelector('#ticket-img-url');
const InputRegion = document.querySelector('#ticket-region');
const InputPrice = document.querySelector('#ticket-price');
const InputNum = document.querySelector('#ticket-num');
const InputRate = document.querySelector('#ticket-rate');
const InputDescription = document.querySelector('#ticket-description');
const AllMedssageFields = document.querySelectorAll('.alert-message');

getAllTicketsJson();

async function getAllTicketsJson() {
  try {
    let res = await axios.get(API_Url);
    allTicketsJson = res.data.data;
    renderTicketCard(allTicketsJson);
  } catch (error) {
    console.log(error);
  }
}

function renderTicketCard(ticketsToRender) {
  let ticketsNum = ticketsToRender.length;
  ResultText.textContent = `本次搜尋共 ${ticketsNum} 筆資料`;
  let cards = ticketsToRender
    .map((ticket) => {
      let card = `<li class="ticket-card">
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
  TicketCardArea.innerHTML = cards;
  updateChart(ticketsToRender);
}

function updateChart(ticketsforChart) {
  let regionCounts = ticketsforChart.reduce((counts, ticket) => {
    counts[ticket.area] = (counts[ticket.area] || 0) + 1;
    return counts;
  },{});
  console.log(regionCounts);

  let regionCountsAry = Object.entries(regionCounts);

  let donutChart = c3.generate({
    bindto: "#search-result-chart",
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
  if (["地區搜尋", "全部地區"].includes(regionSelected)) {
    renderTicketCard(allTicketsJson);
  } else {
    let ticketsSelected = allTicketsJson.filter(
      (ticket) => ticket.area === regionSelected
    );
    renderTicketCard(ticketsSelected);
  }
}

function addNewCard() {
  let isValid = checkInput();
  if (!isValid) {
    return;
  } else {
    let ticketsNum = allTicketsJson.length;
    let newCard = {
      id: Number(ticketsNum),
      name: InputName.value.trim(),
      imgUrl: InputImgUrl.value || Default_Img,
      area: InputRegion.value,
      description: InputDescription.value.trim(),
      group: Number(InputNum.value),
      price: Number(InputPrice.value),
      rate: Number(InputRate.value),
    };
    allTicketsJson.push(newCard);
    renderTicketCard(allTicketsJson);
    clearForm();
  }
}

function checkInput() {
  let requiredFields = [
    "ticket-name",
    "ticket-region",
    "ticket-price",
    "ticket-num",
    "ticket-rate",
    "ticket-description",
  ];

  let isFinished = true;

  requiredFields.forEach(field=>{
    let targetField = document.querySelector(`#${field}`);
    let targetAlert = document.querySelector(`#${field}-message`).parentElement;
    if(!targetField.value.trim()){
        targetAlert.style.display = 'flex';
        isFinished = false;
    }else{
        targetAlert.style.display = "none";
    }
  })
  return isFinished;
}

function clearForm() {
    InputForm.reset()
    AllMedssageFields.forEach(field=>field.style.display = 'none')
}

RegionSelection.addEventListener("change", function (e) {
  let regionSelected = e.target.value;
  filterRegion(regionSelected);
});

AddNewCardBtn.addEventListener('click',addNewCard)
