function removeVietnameseTones(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D'); // Thay thế 'đ' và 'Đ'
    return str;
}

function createSlug(str) {
    str = str.toLowerCase(); // Chuyển thành chữ thường
    str = removeVietnameseTones(str); // Loại bỏ dấu tiếng Việt
    str = str.replace(/[^a-z0-9\s-]/g, ''); // Loại bỏ ký tự không phải chữ cái hoặc số
    str = str.trim().replace(/\s+/g, '-'); // Thay khoảng trắng bằng dấu gạch ngang
    str = str.replace(/-+/g, '-'); // Loại bỏ dấu gạch ngang thừa
    return str;
}
const API_CONFIG = {
    TYPE_URL: 'https://otruyenapi.com/v1/api/the-loai',
    SEARCH_URL: 'https://otruyenapi.com/v1/api/tim-kiem?keyword',
    PRODUCT_URL: 'https://otruyenapi.com/v1/api/truyen-tranh',
    THUMNAIL_URL: 'https://otruyenapi.com/uploads/comics',
    async fetch(api) {
        const dataAPI = await fetch(api);
        const dataConvert = await dataAPI.json();
        return dataConvert;
    },
    getApiUrl() {
        const url = decodeURIComponent(document.URL).split('=');
        const api = url[1];
        return api;
    }
}

const comicSaved = function(data) {
    this.name = data.name;
    this.latestChapter = data.latestChapter || 0;
    this.api = data.api;
}
const APP = {
    name: 'Rury Comics',
    saveStorage(data) {
        let comicsSaved = JSON.parse(localStorage.getItem("comicsSaved"));
        const newComic = new comicSaved(data);
        
        if(comicsSaved) {
            const isCurrent = comicsSaved.findIndex(comic => comic.name === newComic.name);
           
            if(isCurrent != -1) {
                comicsSaved[isCurrent].latestChapter = newComic.latestChapter;
                
                localStorage.setItem("comicsSaved", JSON.stringify(comicsSaved));
            } else {
                comicsSaved.push(newComic);
                
                localStorage.setItem("comicsSaved", JSON.stringify(comicsSaved));
            }
        } else {
            localStorage.setItem("comicsSaved", JSON.stringify([newComic]));
        }
        
    }
}