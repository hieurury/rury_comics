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
    console.log(dataJson);
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

    //các nút điều hướng
    const chapterFirstBtn = document.querySelector('.control-box .chapter-first');
    const chapterLatestBtn = document.querySelector('.control-box .chapter-latest');

    const dataStorage = JSON.parse(localStorage.getItem('comicsSaved'));
    const currentComicSaved = dataStorage.find(comic => comic.name === comicName);
    const apiRedirect = `reading.html?api=${api}`
    const firstChapter = chaptersData[0].chapter_name;
    if(currentComicSaved) {
        chapterLatestBtn.href = `${apiRedirect}=${currentComicSaved.latestChapter}`;
    } else {
        chapterLatestBtn.href = `${apiRedirect}=${firstChapter}`;
    }
    chapterFirstBtn.href = `${apiRedirect}=${firstChapter}`



    console.log(chapterFirstBtn, chapterLatestBtn);
    console.log(dataJson);
}
productLoad();