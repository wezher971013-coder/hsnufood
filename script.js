let map = L.map('map').setView([25.0336592,121.5404218], 17);

var tags = ['OnePerson','Dating','Gathering','FastServe','SlowEat','eletronic payment'];
let tag_cur = []

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let restaurants = []; // 全域變數
let markers = [];


function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function drawMarkers(data) {
  clearMarkers();

  data.forEach(res => {
    let marker = L.marker([res.lat, res.lng])
      .addTo(map)
      .bindPopup(`<b>${res.name}</b><br>${res.desc}`);

    markers.push(marker);
  });
}

fetch("restaurants.json")
  .then(res => res.json())
  .then(data => {
    restaurants = data; 
    drawMarkers(restaurants);
    renderRestaurantBoxes(restaurants);
  });




//按鈕函式
function filterByTag(tag) {

  let filtered;

  if (tag === "全部") {
    filtered = restaurants; 
  } else {
    filtered = restaurants.filter(res =>
      res.tags.includes(tag)
    );
  }

  drawMarkers(filtered);
}



//下拉選單函式
function filterByTag_sidebar(tag) {

  let filtered;

  if (tag === "全部") {
    filtered = restaurants; 
  } else {
    filtered = restaurants.filter(res =>
      res.Genre === tag
    );
  }

  renderRestaurantBoxes(filtered);
}


//定位師大附中
function Lhsnu() {
    map.setView([25.0336592,121.5404218], 17);

}

//這東東是左邊sidebar的生成程式
function renderRestaurantBoxes(data) {
  let list = document.getElementById("restaurantList");

  list.innerHTML = ""; // 清空

  data.forEach((res, index) => {

    let box = document.createElement("div");
    box.className = "resBox";
    
    box.innerHTML = `
      <a href=${res.url || ""}>${res.name}</a>
      <p>${res.desc || ""}</p>
       <small>${res.tags.join(", ")}</small>

    `;
    
    list.appendChild(box);
    box.onclick = () => {

    L.popup({
  offset: [0, -30] //以免popup蓋到marker
})
    .setLatLng([res.lat, res.lng])
    .setContent(`<b>${res.name}</b><br>${res.desc}`)
    .openOn(map);
    map.setView([res.lat, res.lng], 17);
    

    
};
  });
}



setTimeout(() => {
  map.invalidateSize();
}, 200);

