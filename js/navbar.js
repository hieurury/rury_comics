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

//handler
const navCollection = document.querySelectorAll('.js-nav-collection li.nav-item a');
//Phần tìm kiếm truyện
const API_CONFIG = {
    SEARCH_URL: 'https://otruyenapi.com/v1/api/tim-kiem?keyword',
    PRODUCT_URL: 'https://otruyenapi.com/v1/api/truyen-tranh',
    THUMNAIL_URL: 'https://otruyenapi.com/uploads/comics',
    async fetch(api) {
        const dataAPI = await fetch(api);
        const dataConvert = await dataAPI.json();
        return dataConvert;
    }
}
const NavbarApp = {
    timeOutId: null,
    navClearActive() {
        navCollection.forEach(item => {
            if(item.classList.contains('active')) {
                item.classList.remove('active');
            }
        })
    },
    navbarOptionsEvent() {
        navCollection.forEach((item) => {
            item.onclick = function(e) {
                NavbarApp.navClearActive();
                e.target.classList.add('active');
            }
        })
    },
    searchEventHandler() {
        const searchData = document.querySelector('.search-wrapper input');
        const searchResult = document.querySelector('ul.search-result');


        searchData.addEventListener('keyup', function() {
 
            if(this.value == '') {
                searchResult.classList.add('d-none');
                return;
            }

            if(NavbarApp.timeOutId) {
                clearTimeout(NavbarApp.timeOutId);
            }

            const searchSlug = createSlug(this.value);
            //tạo một id time out
            NavbarApp.timeOutId = setTimeout( async function() {
                //lấy dữ liệu từ api
                const searchUrl =  `${API_CONFIG.SEARCH_URL}=${searchSlug}`;
                const searchDataJson = await API_CONFIG.fetch(searchUrl);
                console.log(searchDataJson);
                const searchComics = searchDataJson.data.items;

                //sẵn sàng chuyển đổi qua hmtl
                let searchComicsHTMLs;
                //logic render
                if(searchComics.length > 0) {
                    const searchComicsArray = searchComics.map(comic => {
                        return (
                            `<li>
                                <a href="product.html?api=${API_CONFIG.PRODUCT_URL}/${comic.slug}">
                                <div class"result-img-wrapper">
                                    <img src="${API_CONFIG.THUMNAIL_URL}/${comic.thumb_url}" alt="">
                                </div>
                                <div class="search-result-content">
                                    <div class="result-title">${comic.name}</div>
                                    <span>${comic.chaptersLatest[0].chapter_name} chương</span>
                                </div>
                                </a>
                            </li>
                            `
                        )
                    })
                    searchComicsHTMLs = searchComicsArray.join('');
                } else {
                    searchComicsHTMLs = `<li>
                                            <div class="result-title">Không có kết quả phù hợp</div>
                                        </li>`
                }
                searchResult.innerHTML = searchComicsHTMLs;
                searchResult.classList.remove('d-none');    
            }, 1000)
        })
    },
    start() {
        this.navbarOptionsEvent();
        this.searchEventHandler();
    }
}
NavbarApp.start();

