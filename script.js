let allTicketsApiUrl =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
let allTicketsJson = [];
let defaultNewTicketImgUrl =
  "https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// 執行區
getAllTicketsJson();



// DOM區

const TicketCardArea = document.querySelector(".ticket-card-area");
const RegionSearch = document.querySelector(".region-search");
const RegionSearchResultText = document.querySelector("#search-result-text");
const AddTicketForm = document.querySelector(".add-ticket-form");
const AllAlertMessageFields = document.querySelectorAll(".alert-message");
const AddTicketBtn = document.querySelector(".add-ticket-btn");

const InputName = document.querySelector("#ticket-name");
const InputImgUrl = document.querySelector("#ticket-img-url-message");
const InputRegion = document.querySelector("#ticket-region");
const InputPrice = document.querySelector("#ticket-price");
const InputNum = document.querySelector("#ticket-num");
const InputRate = document.querySelector("#ticket-rate");
const InputDescription = document.querySelector('#ticket-description')


// 函式庫

async function getAllTicketsJson() {
  try {
    let res = await axios.get(allTicketsApiUrl);
    allTicketsJson = res.data.data;
    renderTicketsCard(allTicketsJson);
    updateDonutChart(allTicketsJson);
  } catch (error) {
    console.log(error);
  }
}

function renderTicketsCard(ticketsToRender) {
  let tikcetsNum = ticketsToRender.length;
  RegionSearchResultText.textContent = `本次搜尋共 ${tikcetsNum} 筆資料`;
  let ticketCardsStr = ticketsToRender.map((tikcet) => {
      let ticketCardStr = `<li class="ticket-card">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src=${tikcet.imgUrl}
                alt="travel_1"
              />
            </a>
            <div class="ticket-card-region">${tikcet.area}</div>
            <div class="ticket-card-rank">${tikcet.rate}</div>
          </div>
          <div class="ticket-card-content">
            <div>
              <h3>
                <a href="#" class="ticket-card-name">${tikcet.name}</a>
              </h3>
              <p class="ticket-card-description">
                ${tikcet.description}。
              </p>
            </div>
            <div class="ticket-card-info">
              <p class="ticket-card-num">
                <span>
                  <i class="fas fa-exclamation-circle"></i>
                </span>
                剩下最後 <span id="ticket-card-num"> ${tikcet.group} </span> 組
              </p>
              <p class="ticket-card-price">
                TWD
                <span id="ticket-card-price">$${tikcet.price}</span>
              </p>
            </div>
          </div>
        </li>`;
      return ticketCardStr;
    })
    .join("");
  TicketCardArea.innerHTML = ticketCardsStr;
}

function updateDonutChart(currentTickets) {
  // 先統計數量
  const regionCountsObj = currentTickets.reduce((countsObj,ticket)=>{
    if(countsObj[ticket.area] === undefined){
      countsObj[ticket.area] = 0;
    }
    countsObj[ticket.area] += 1;
    return countsObj;
  },{})

  // 再組成卡片

  const regionCountsAry = Object.entries(regionCountsObj);

  let regionDonutChart = c3.generate({
    bindto: "#region-donut-chart",
    data: {
      columns: regionCountsAry,
      type: "donut",
      colors: {
        '台北': '#26C0C7',
        '台中': '#5151D3',
        '高雄': '#E68619'
        }
    },
    donut: {
      title: "套票地區比重",
      label: { show: false },
      width: 12,
    },
    size: {
      width:192,
      height: 192,
    }

  });

}

function filterRegions(regionSelected) {
  if(["地區搜尋",""].includes(regionSelected)){
    renderTicketsCard(allTicketsJson);
  }else{
    let ticketsSelected = allTicketsJson.filter(ticket => ticket.area === regionSelected)
    renderTicketsCard(ticketsSelected);
  }
}

function checkRequiredFields() {
  let requiredFields = [
    "ticket-name",
    "ticket-region",
    "ticket-price",
    "ticket-num",
    "ticket-rate"
  ];
  let fieldsCompleted = true;

  requiredFields.forEach(fieldId =>{
    let targetField = document.querySelector(`#${fieldId}`);
    let targetAlertMessage = document.querySelector(`#${fieldId}-message`).parentElement;
    if(!targetField.value.trim()){
      fieldsCompleted = false;
      targetAlertMessage.style.display = "flex";
    }else{
      targetAlertMessage.style.display = "none";
    }
  })
  
  return fieldsCompleted;

}

function clearInputForm() {
  AddTicketForm.reset();
  AllAlertMessageFields.forEach(messageField =>{
    messageField.style.display = "none";
  })

}

function makeNewTicketCard() {
  let currentTicketsNum = allTicketsJson.length;
  let newCard = {
    id: Number(currentTicketsNum),
    name: InputName.value.trim(),
    imgUrl: InputImgUrl.value || defaultNewTicketImgUrl,
    area: InputRegion.value,
    description: InputDescription.value.trim(),
    group: Number(InputNum.value),
    price: Number(InputPrice.value),
    rate: Number(InputRate.value)
  };
  allTicketsJson.push(newCard);
  renderTicketsCard(allTicketsJson);
  updateDonutChart(allTicketsJson);
}

function addNewTicketCard() {
  let inputIsValid = checkRequiredFields();
  if(!inputIsValid){
    return
  }else{
    makeNewTicketCard();
    clearInputForm();
  }
}

// 事件監聽

RegionSearch.addEventListener("change",function(event){
  let regionSelected = event.target.value;
  filterRegions(regionSelected);
}
)

AddTicketBtn.addEventListener("click",addNewTicketCard);
