//thanh loader
const modalLoader = document.querySelector('.modal-loader');

function hiddenLoader() {
    modalLoader.style.display = 'none';
}
function showLoader() {
    modalLoader.style.display = 'flex';
}

//poster elements
const thumnail = document.querySelector('.poster-img img');
const posterName = document.querySelector('h4.poster-title');
const posterDes = document.querySelector('p.poster-description');
const posterTypes = document.querySelector('ul.poster-types');
//chapters elements
const chaptersBody = document.querySelector('.table tbody');
console.log(chaptersBody);

//GET API from URL
const url = decodeURIComponent(document.URL).split('=');
const api = url[1];
console.log(api);

async function fetchAPI(api) {
    const dataAPI = await fetch(api);
    const dataConvert = await dataAPI.json();
    return dataConvert;
}
async function productLoad() {
    //lấy dữ liệu từ api
    showLoader();
    const dataJson = await fetchAPI(api);
    hiddenLoader();
    const APP_DOMAIN = 'https://img.otruyenapi.com/uploads/comics';

    //render DOM-poster
    const dataThumnail = dataJson.data.item.thumb_url;
    const thumb_url = `${APP_DOMAIN}/${dataThumnail}`
    const comicName = dataJson.data.item.name;
    const comicDescription = dataJson.data.item.content;


    const comicTypes = dataJson.data.breadCrumb.map(type => {
        return (
            `<li>${type.name}</li>`
        )
    })
    const comicTypesHTML = comicTypes.join("");
    console.log(comicTypes);


    thumnail.src = thumb_url;
    posterName.innerText = comicName;
    posterDes.innerHTML = comicDescription;
    posterTypes.innerHTML = comicTypesHTML;
    //render DOM-chapters
    const chaptersData = dataJson.data.item.chapters[0].server_data;
    const chaptersDataArray = chaptersData.map(chapter => {
        return (
            `
                <tr chapter-api='${api}=${chapter.chapter_name}'>
                    <th scope="row">${chapter.chapter_name}</th>
                    <td>${chapter.chapter_title || "chưa rõ"}</td>
                </tr>
            `
        )
    })
    chaptersDataHTMLs = chaptersDataArray.join('');
    chaptersBody.innerHTML = chaptersDataHTMLs;

    //event click/choice chapter
    const listChapter = chaptersBody.querySelectorAll('tr');
    listChapter.forEach(chapter => {
        chapter.onclick = function(e) {
            const api = this.getAttribute('chapter-api');
            window.location.href = `reading.html?api=${encodeURIComponent(api)}`
        }
    })
    console.log(listChapter);
    console.log(dataJson);
}
productLoad();