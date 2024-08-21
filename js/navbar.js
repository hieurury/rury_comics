
//handler
const navCollection = document.querySelectorAll('.js-nav-collection li.nav-item a');
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
    async typesEventhandler() {
        const listType = document.querySelector('ul.js-drop-menu');
        const dataJson = await API_CONFIG.fetch(API_CONFIG.TYPE_URL);
        const dataTypes = dataJson.data.items;

        const dataTypesArray = dataTypes.map(type => {
            return (
                `<li>
                    <a class="dropdown-item" href="${API_CONFIG.TYPE_URL}/${type.slug}">${type.name}</a>
                </li>`
            )
        })
        console.log(dataTypesArray);
        const dataTypesHTMLs = dataTypesArray.join('');
        listType.innerHTML = dataTypesHTMLs;
    },
    start() {
        this.navbarOptionsEvent();
        this.searchEventHandler();
        this.typesEventhandler();
    }
}
NavbarApp.start();

