//thanh loader
const modalLoader = document.querySelector('.modal-loader');

function hiddenLoader() {
    modalLoader.style.display = 'none';
}
function showLoader() {
    modalLoader.style.display = 'flex';
}


const blogItem = document.querySelector('.me-comics-content');
const MAIN_API = 'https://otruyenapi.com/v1/api/';
const homePageApi = MAIN_API + '/home';
async function fetchAPI(api) {
    const dataAPI = await fetch(api);
    const dataConvert = await dataAPI.json();
    return dataConvert;
}

async function loadData() {
    showLoader();
    const dataJson = await fetchAPI(homePageApi);
    hiddenLoader();
    const dataItem = dataJson.data.items;
    let dataString = dataItem.map(item => {
        return `
            <div class="me-comics">
              <a href="" class="me-comics-item" data-api="https://otruyenapi.com/v1/api/truyen-tranh/${item.slug}">
                <div class="me-wraper-img">
                  <img
                    src="https://otruyenapi.com/uploads/comics/${item.thumb_url}"
                    alt=""
                  />
                </div>
                <div class="me-content-wraper">
                    <h5 class="me-item-title">${item.name}</h5>
                </div>
                
              </a>
            </div>
        `
    })
    const htmlElements = dataString.join('');
    blogItem.innerHTML = htmlElements;

    const listItem = document.querySelectorAll('.me-comics .me-comics-item');
    listItem.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const api = item.getAttribute('data-api');
            window.location.href = `product.html?api=${encodeURIComponent(api)}`;
        })
    })

}
loadData();