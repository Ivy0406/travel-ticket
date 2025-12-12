const Api_Url =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
// 預設圖片可以設為常數，或是直接寫在邏輯裡
const Default_Img =
  "https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// 1. DOM 選取優化：只選大區塊，不要選細節 Input
const dom = {
  list: document.querySelector(".ticket-card-area"),
  regionSearch: document.querySelector(".region-search"),
  searchResult: document.querySelector("#search-result-text"),
  addForm: document.querySelector(".add-ticket-form"),
  addBtn: document.querySelector(".add-ticket-btn"),
  chart: "#region-chart", // C3 chart 直接用字串 ID 即可
};

let allTicketsData = [];

// 初始化
init();

async function init() {
  try {
    const res = await axios.get(Api_Url);
    allTicketsData = res.data.data;
    renderCards(allTicketsData);
  } catch (err) {
    console.error(err);
  }
}

// 2. 渲染優化：使用解構賦值，並將 HTML 模板簡化
function renderCards(data) {
  dom.searchResult.textContent = `本次搜尋共 ${data.length} 筆資料`;

  const str = data
    .map(({ id, name, imgUrl, area, description, group, price, rate }) => {
      // 修正：ID 不應重複，這裡將樣板內的 id 改為 class
      return `
      <li class="ticket-card" data-id="${id}">
        <div class="ticket-card-img">
          <a href="#"><img src="${imgUrl}" alt="${name}"></a>
          <div class="ticket-card-region">${area}</div>
          <div class="ticket-card-rank">${rate}</div>
        </div>
        <div class="ticket-card-content">
          <div>
            <h3><a href="#" class="ticket-card-name">${name}</a></h3>
            <p class="ticket-card-description">${description}</p>
          </div>
          <div class="ticket-card-info">
            <p class="ticket-card-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span class="ticket-card-num-text">${group}</span> 組
            </p>
            <p class="ticket-card-price">
              TWD <span class="ticket-card-price-text">$${price}</span>
            </p>
          </div>
        </div>
      </li>`;
    })
    .join("");

  dom.list.innerHTML = str;
  updateChart(data);
}

// 圖表邏輯維持原本思路，稍微精簡寫法
function updateChart(data) {
  const regionCounts = {};
  data.forEach((item) => {
    regionCounts[item.area] = (regionCounts[item.area] || 0) + 1;
  });

  c3.generate({
    bindto: dom.chart,
    data: {
      columns: Object.entries(regionCounts),
      type: "donut",
      colors: { 台北: "#26C0C7", 台中: "#5151D3", 高雄: "#E68619" },
    },
    donut: { title: "套票地區比重", width: 12, label: { show: false } },
    size: { width: 182, height: 212 },
  });
}

// 3. 新增與驗證優化：直接操作 form 元素
function handleAddTicket() {
  // 取得表單內所有 input 欄位
  const inputs = dom.addForm.elements;
  let isValid = true;

  // 自動抓取所有需要驗證的欄位 (HTML 記得在 input 上加 id)
  const fields = [
    "ticket-name",
    "ticket-img-url",
    "ticket-region",
    "ticket-price",
    "ticket-num",
    "ticket-rate",
    "ticket-description",
  ];

  fields.forEach((id) => {
    const input = inputs[id]; // 直接用 name 或 id 取
    const message = document.querySelector(`#${id}-message`); // 假設你的錯誤訊息結構沒變
    if (!message) return; // 防呆

    // 簡單驗證：非空值
    if (!input.value.trim()) {
      isValid = false;
      message.style.display = "block"; // 建議錯誤訊息預設 display:none，這裡改成 block 即可
    } else {
      message.style.display = "none";
    }
  });

  if (!isValid) return;

  // 整理資料：直接用 inputs 取值，不用再宣告一堆變數
  const newTicket = {
    id: allTicketsData.length,
    name: inputs["ticket-name"].value,
    imgUrl: inputs["ticket-img-url"].value || Default_Img,
    area: inputs["ticket-region"].value,
    price: Number(inputs["ticket-price"].value),
    group: Number(inputs["ticket-num"].value),
    rate: Number(inputs["ticket-rate"].value),
    description: inputs["ticket-description"].value,
  };

  allTicketsData.push(newTicket);
  renderCards(allTicketsData);
  dom.addForm.reset(); // 原生清除表單方法

  // 隱藏所有錯誤訊息 (防呆用)
  document
    .querySelectorAll(".alert-message")
    .forEach((el) => (el.style.display = "none"));
}

// 監聽器
dom.addBtn.addEventListener("click", handleAddTicket);

dom.regionSearch.addEventListener("change", (e) => {
  const target = e.target.value;
  if (target === "地區搜尋" || target === "全部地區") {
    renderCards(allTicketsData);
  } else {
    renderCards(allTicketsData.filter((item) => item.area === target));
  }
});
