let allTicketsApiUrl = "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let defaultNewTicketImgUrl = 'https://images.unsplash.com/photo-1600256698889-61ff2cd73cd8?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

let allTicketsJson = [];

getAllTicketsJson();


async function getAllTicketsJson(){
    try{
        let res = await axios.get(allTicketsApiUrl);
        allTicketsJson = res.data.data;
        renderTicketCardsArea(allTicketsJson);
        updateDonutChart(allTicketsJson);
    }catch(error){
        console.log(error);
    }
}