window.addEventListener('load', opcity)
window.addEventListener('transitionend', blue)

function opcity(){
    document.querySelector('body').style.opacity = '100%';
    document.querySelector('body').style.transition = '3s';
}
function blue() {
    document.querySelector('.item-1').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-2').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-4').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-6').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-7').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-8').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-9').style.boxShadow =  '0px 0px 40px 1px rgba(11, 237, 216, 1)';
    document.querySelector('.item-1').style.transition = '10s';
    document.querySelector('.item-2').style.transition = '10s';
    document.querySelector('.item-4').style.transition = '10s';
    document.querySelector('.item-6').style.transition = '10s';
    document.querySelector('.item-7').style.transition = '10s';
    document.querySelector('.item-8').style.transition = '10s';
    document.querySelector('.item-9').style.transition = '10s';
}

function red() {
    document.querySelector('.item-1').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-2').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-4').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-6').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-7').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-8').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-9').style.boxShadow =  '0px 0px 40px 1px rgb(226, 65, 65)';
    document.querySelector('.item-1').style.transition = '10s';
    document.querySelector('.item-2').style.transition = '10s';
    document.querySelector('.item-4').style.transition = '10s';
    document.querySelector('.item-6').style.transition = '10s';
    document.querySelector('.item-7').style.transition = '10s';
    document.querySelector('.item-8').style.transition = '10s';
    document.querySelector('.item-9').style.transition = '10s';
}

setTimeout(() => {console.log("red"), red()}, 5000)

// Animation program image.
let modal = document.getElementById("myModal");
let img = document.getElementById("myImg");
let modalImg = document.getElementById("img01");
let captionText = document.getElementById("caption");
let span = document.getElementsByClassName("close")[0];
img.addEventListener("click", imageModal);

function imageModal(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}

let backdropClickHandler = () => {
    modal.style.display = "none";
}

span.addEventListener("click", backdropClickHandler);
modal.addEventListener("click", backdropClickHandler);