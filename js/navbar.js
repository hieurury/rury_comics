// const navCollection = document.querySelectorAll('.js-nav-collection li.nav-item a');
// function clearActive() {
//     navCollection.forEach(item => {
//         if(item.classList.contains('active')) {
//             item.classList.remove('active');
//         }
//     })
// }
// navCollection.forEach((item) => {
//     item.onclick = function(e) {
//         clearActive();
//         e.target.classList.add('active');
//     }
// })

// Or Jquery
const navCollection = $('.js-nav-collection li.nav-item a').not('li ul.me-drop-menu a');
function clearActive() {
    navCollection.each(function() {
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
    })
}
navCollection.on('click', function(e) {
    clearActive();
    $(this).addClass('active');
    console.log("hehe");
})

