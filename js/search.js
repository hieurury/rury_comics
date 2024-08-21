
const searchApp = {
    async renderElements() {
        const api = API_CONFIG.getApiUrl();
        console.log(api);
        const dataJson = await API_CONFIG.fetch(api);
        console.log(dataJson);
        document.title = `${APP.name} | ${dataJson.data.titlePage}`;
    },
    start() {
        this.renderElements();
    }
}
searchApp.start();