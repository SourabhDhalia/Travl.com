$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        } 
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .nav-list li a').click(function(){
        // applying again smooth scroll on nav-list items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle nav-list/navbar script
    $('.nav-list-btn').click(function(){
        $('.navbar .nav-list').toggleClass("active");
        $('.nav-list-btn i').toggleClass("active");
    });
 // typing text animation script
 var typed = new Typed(".typing", {
    strings: ["login", "explore", "Travl"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});
document.getElementById("typ").style.color = "gold";



    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });
});



var height = $('#header').height();

$(window).scroll(function () {
    if ($(this).scrollTop() > height) {
        $('.navbar').addClass('fixed');
        
    }else{
        $('.navbar').removeClass('fixed');
    }
});



let suggestions = [
    "tajMahal",
    "elloraCaves",
    "tsongmoLake",
    "goldenTemple",
    "Hampi",
    "humayunTomb",
    "khajuraho",
    "nandaDevi",
    "padmanabhaswamyTemple",
    "amerFort",
    // "Facebook",
    // "Freelancer",
    // "Facebook Page",
    // "Designer",
    // "Developer",
    // "Web Designer",
    // "Web Developer",
    // "Login Form in HTML & CSS",
    // "How to learn HTML & CSS",
    // "How to learn JavaScript",
    // "How to became Freelancer",
    // "How to became Web Designer",
    // "How to start Gaming Channel",
    // "How to start YouTube Channel",
    // "What does HTML stands for?",
    // "What does CSS stands for?",
];
// getting all required elements
const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;

// if user press any key and release
inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        icon.onclick = ()=>{
//             webLink = "https://travlin.herokuapp.com/" + userData; 
webLink = document.location.origin+"/" + userData;
// webLink = "http://localhost:3000/" + userData;

            linkTag.setAttribute("href", webLink);
            console.log(webLink);
            linkTag.click();
        }
        emptyArray = suggestions.filter((data)=>{
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
            return data = '<li>'+ data +'</li>';
        });
        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    icon.onclick = ()=>{
//         webLink = "https://travlin.herokuapp.com/" + selectData;
webLink =document.location.origin+"/" + selectData;
// webLink ="http://localhost:3000/" + selectData;

        
        linkTag.setAttribute("href", webLink);
        linkTag.click();
    }
    searchWrapper.classList.remove("active");
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}
