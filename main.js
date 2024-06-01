const wrapper = document.querySelector('.wrapper')
const inputPart = wrapper.querySelector('.input-part')
const infoTxt = inputPart.querySelector('.info-txt')
const inputField = inputPart.querySelector('input')
const locationBtn = inputPart.querySelector('button')
const wIcon = document.querySelector('.weather-part img')
const arrowback = document.querySelector('header i')
let api;
inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != '') {
        requestApi(inputField.value)
    }
})

locationBtn.onclick = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
        requestApi(inputField.value)
    } else {
        alert('Your browser not support geolocation api')
    }
}
function onSuccess(position) {
    const { latitude, longtitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&units=metric&appid=${apikey}`
    fetchData()
}
function onError(error) {
    infoTxt.innerText = error.message
    infoTxt.classList.add('error')
}
let apikey = 'ce2a81ae654cd432fa05368d967d179a'
function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`
    fetchData()
}
function fetchData() {
    infoTxt.innerText = " Getting weather details ....";
    infoTxt.classList.add('pending')
    fetch(api).then(res => res.json()).then(result => weatherDetails(result))
}
function weatherDetails(info) {
    infoTxt.classList.replace('pending', 'error')
    if (info.cod == '404') {
        wrapper.classList.remove('active')
        infoTxt.innerText = `${inputField.value} isn't a valid city name!`
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            wIcon.src = "./img/Weather Icons/clear.svg"
        } else if (id >= 200 && id <= 232) {
            wIcon.src = './img/Weather Icons/strom.svg'
        } else if (id >= 600 && id <= 622) {
            wIcon.src = './img/Weather Icons/snow.svg'
        } else if (id >= 701 && id <= 781) {
            wIcon.src = './img/Weather Icons/haze.svg'
        } else if (id >= 801 && id <= 804) {
            wIcon.src = './img/Weather Icons/cloud.svg'
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = './img/Weather Icons/rain.svg'
        }

        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp)
        wrapper.querySelector('.weather').innerText = description
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like)
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`

        infoTxt.classList.remove('pending', 'error')
        wrapper.classList.add('active')
        console.log(info);
    }
}

arrowback.onclick = () => {
    wrapper.classList.remove('active')
    inputField.value = ""
    infoTxt.classList.remove('error')
}