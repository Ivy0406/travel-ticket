// 宣告全域變數
let ticketsJsonUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';

let defaultNewTicketImgUrl = 'https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// 獲取資料
let ticketsJson = [];
async function getTicketsJson(){
  try{
    const res = await axios.get(ticketsJsonUrl);
    ticketsJson = res.data.data;
    renderTicketCardArea(ticketsJson);
    updateDonutChart(ticketsJson);
  }catch(error){
    console.log(error);
  }
}




// 抓取DOM
const TicketCardArea = document.querySelector('.ticket-card-area');
const RegionSearch = document.querySelector('.region-search')
const SearchResultText = document.querySelector('#search-result-text');
const AddNewTicketCardBtn = document.querySelector('.add-ticket-btn');
const InputForm = document.querySelector('.add-ticket-form');
// input欄位
const InputName = document.querySelector('#ticket-name');
const InputImgUrl = document.querySelector('#ticket-img-url');
const InputRegion = document.querySelector('#ticket-region');
const InputPrice = document.querySelector('#ticket-price');
const InputNum = document.querySelector('#ticket-num');
const InputRate = document.querySelector('#ticket-rate');
const InputDescription = document.querySelector('#ticket-description');
const AlertMessageFields = document.querySelectorAll('.alert-message');

// function區

function renderTicketCardArea(ticketsToRender){
  let ticketsToRenderNum = ticketsToRender.length;
  SearchResultText.textContent = `本次搜尋共 ${ticketsToRenderNum} 筆資料`;
  let ticketCardsStr = ticketsToRender.map(ticket =>{
    let ticketCard = `<li class="ticket-card">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src=${ticket.imgUrl}
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
        </li>`
        return ticketCard;
  }).join('');
  TicketCardArea.innerHTML = ticketCardsStr;
}

function filterTicketCards(regionSelected){
  if(['','地區搜尋'].includes(regionSelected)){
    renderTicketCardArea(ticketsJson);
  }else{
    let filterResult = ticketsJson.filter(ticket => ticket.area === regionSelected);
    renderTicketCardArea(filterResult);
  }
}

function updateDonutChart(currentTickets){
		// 統計各地區數量
	const regionCountsObj = currentTickets.reduce((countsObj,ticket)=>{
		if(countsObj[ticket.area] === undefined){
			countsObj[ticket.area] = 0;
		}
		countsObj[ticket.area] += 1;
		return countsObj;
	},{})
	const regionCountsAry = Object.entries(regionCountsObj);
	// 再製作圖表
	let donutChart = c3.generate({
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

function checkRequiredFields(){
  let requiredFields = [
    'ticket-name',
    'ticket-region',
    'ticket-price',
    'ticket-price',
    'ticket-num',
    'ticket-rate',
    'ticket-description'
  ];
  let isValid = true;

  requiredFields.forEach(fieldId =>{
    let targetField = document.querySelector(`#${fieldId}`).value.trim();
    let targetAlertMessage = document.querySelector(`#${fieldId}-message`).parentElement;
    if(!targetField){
      isValid = false;
      targetAlertMessage.style.display = 'flex';
    }
    else{
      targetAlertMessage.style.display = 'none';
    }
  })
  return isValid;
}
function clearInputForm(){
  InputForm.reset();
  AlertMessageFields.forEach(field=>{
    field.style.display = 'none';
  });
}

function makeNewTicketCard(){
  let currentTicketsNum = ticketsJson.length;
  const newTicketData = {
    id: Number(currentTicketsNum),
    name: InputName.value.trim(),
    imgUrl: InputImgUrl.value || defaultNewTicketImgUrl,
    area: InputRegion.value.trim(),
    description: InputDescription.value,
    group: Number(InputNum.value),
    price: Number(InputPrice.value),
    rate: Number(InputRate.value)
  };
  ticketsJson.push(newTicketData);
  console.log(ticketsJson);
  renderTicketCardArea(ticketsJson);
  updateDonutChart(ticketsJson);
  
}

function addNewTicketCard(){
  let inputIsValid = checkRequiredFields();
  if(!inputIsValid){
    return;
  }else{
    makeNewTicketCard();
    clearInputForm();
  }
}

// 事件監聽

RegionSearch.addEventListener('change',function(event){
  let regionSelected = event.target.value;
  filterTicketCards(regionSelected);
})

AddNewTicketCardBtn.addEventListener('click', addNewTicketCard)

// 呼叫function
getTicketsJson();
