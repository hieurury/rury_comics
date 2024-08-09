//thanh loader
const modalLoader = document.querySelector('.modal-loader');

function hiddenLoader() {
    modalLoader.style.display = 'none';
}
function showLoader() {
    modalLoader.style.display = 'flex';
}

//GET elements
const titleComic = document.querySelector('.nav-title');
const optionChapters = document.querySelector('ul.dropdown-menu');
const optionBtn = document.querySelector('.selectors a.dropdown-toggle');
const content = document.querySelector('.container .content');

//GET API from URL
const url = decodeURIComponent(document.URL).split('=');
const API = url[1];
const CURRENT_CHAPTER = url[2];
console.log(API, CURRENT_CHAPTER);

async function fetchAPI(api) {
    const dataAPI = await fetch(api);
    const dataConvert = await dataAPI.json();
    return dataConvert;
}
async function productLoad() {
    //lấy dữ liệu từ api
    showLoader();
    const dataJson = await fetchAPI(API);
    hiddenLoader();
    const APP_DOMAIN = 'https://img.otruyenapi.com/uploads/comics';
    console.log(dataJson);


    //render nav DOM
    const comicName = dataJson.data.item.name;
    const chaptersData = dataJson.data.item.chapters[0].server_data;
    const chaptersDataArray = chaptersData.map(chapter => {
        const apiChapter = `${API}=${chapter.chapter_name}`;
        return (
            `
                <li>
                    <a 
                        class="dropdown-item" 
                        href="reading.html?api=${encodeURIComponent(apiChapter)}"
                    >
                        Chương ${chapter.chapter_name}
                    </a>
                </li>
            `
        )
    })
    chaptersDataHTMLs = chaptersDataArray.join('');
    optionChapters.innerHTML = chaptersDataHTMLs;
    titleComic.innerHTML = `<h3>${comicName}</h3>`;
    titleComic.href = `product.html?api=${encodeURIComponent(API)}`;
    optionBtn.innerText = `Chương ${CURRENT_CHAPTER}`;
    //
    const CHAPTER_API = dataJson.data.item.chapters[0].server_data[CURRENT_CHAPTER].chapter_api_data;
    const chaptersJson = await fetchAPI(CHAPTER_API);
    console.log(chaptersJson);
    const CHAPTER_URL = `${chaptersJson.data.domain_cdn}/${chaptersJson.data.item.chapter_path}`;
    const dataImageArray = chaptersJson.data.item.chapter_image.map(item => {
        return (
            `<img src="${CHAPTER_URL}/${item.image_file}">`
        )
    })
    const dataImageHTMLs = dataImageArray.join('');
    console.log(dataImageHTMLs);
    content.innerHTML = dataImageHTMLs;
}
productLoad();