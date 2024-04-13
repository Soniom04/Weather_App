const user_tab = document.querySelector('[data-userWeather]')
const search_tab = document.querySelector('[data-searchWeather]')
const userContainer = document.querySelector('.weather_container')
const accessContainer = document.querySelector('.grant_locn_container')
const form_container = document.querySelector('[data-searchForm]')
const loadingScreen = document.querySelector('.loading-container')
const userInfoContainer = document.querySelector('.user-info-container')
const errorContainer = document.querySelector('[data-errorContainer]')

let currentTab = user_tab
const API_key = "74af6b4829775126dc289784901a1cbd";
currentTab.classList.add('curr_tab')
getfromSessionStorage()

function switchTabs(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove('curr_tab')
        currentTab = clickedTab
        currentTab.classList.add('curr_tab')
        if(!form_container.classList.contains('active') && currentTab === search_tab){
            userInfoContainer.classList.remove('active')
            accessContainer.classList.remove('active')
            form_container.classList.add('active')
        }
        else{
            form_container.classList.remove('active')
            userInfoContainer.classList.remove('active')
            errorContainer.classList.remove('active')
            // maintaining local storage for co-rodinates in sotrage to show local weather
            getfromSessionStorage();
        }
    }
    
}

// function for checking user co-ordinates
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if(!localCoordinates){
        accessContainer.classList.add('active')
    }
    else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {latitude,longitude} = coordinates
    accessContainer.classList.add('active')
    loadingScreen.classList.add('active')
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`)
        const data = await response.json()
        loadingScreen.classList.remove('active')
        userInfoContainer.classList.add('active')
        renderWeatherInfo(data)
    }
    catch(err){
        loadingScreen.classList.add('active')
        console.log('Error Occured',err)
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector('[data-cityName]')
    const countryIcon = document.querySelector('[data-countryIcon]')
    const weatherDesc = document.querySelector('[data-weatherDesc]')
    const weatherIcon = document.querySelector('[data-weatherIcon]')
    const temp = document.querySelector('[data-temp]')
    const windSpeed = document.querySelector('[data-windSpeed]')
    const humidity = document.querySelector('[data-humidity]')
    const clouds = document.querySelector('[data-clouds]')

    cityName.textContent = weatherInfo?.name
    countryIcon.src = `https://flagsapi.com/${(weatherInfo?.sys?.country)}/flat/64.png`
    weatherDesc.textContent = weatherInfo?.weather?.[0]?.description
    weatherIcon.src = `https://openweathermap.org/img/wn/${(weatherInfo?.weather?.[0]?.icon)}@2x.png`
    if(weatherInfo?.main?.temp > 250){
        temp.textContent = (weatherInfo?.main?.temp-273.00).toFixed(2) + ' °C'
    }
    else{
        temp.textContent = weatherInfo?.main?.temp + ' °C'
    }
    windSpeed.textContent = weatherInfo?.wind?.speed + 'm/s'
    humidity.textContent = weatherInfo?.main?.humidity + '%'
    clouds.textContent = weatherInfo?.clouds?.all + '%'
}   

user_tab.addEventListener("click",()=>{
    switchTabs(user_tab)
})

search_tab.addEventListener("click",()=>{
    switchTabs(search_tab)
})

const grantAccess = document.querySelector('[data-grantAccess]')
grantAccess.addEventListener('click',getLocation())

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPostion)
    }
    else{
        console.log('Geolocation not supported by the browser')
    }
}

function showPostion(position){
    let userCoordinates = {
         latitude : position.coords.latitude,
         longitude : position.coords.longitude
    }
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates))
    fetchUserWeatherInfo(userCoordinates)
}

const searchInput = document.querySelector('[data-searchInput]')
form_container.addEventListener('submit',(e)=>{
    e.preventDefault()
    let cityName = searchInput.value
    if(cityName === ""){
        return
    }
    else{
        fetchSearchWeatherInfo(cityName)
    }
})

async function fetchSearchWeatherInfo(cityName){
    errorContainer.classList.remove('active')
    userInfoContainer.classList.remove('active')
    loadingScreen.classList.add('active')

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`)
        const data = await response.json()
        if(data?.cod === '404'){
            console.log('')
            loadingScreen.classList.remove('active')
            errorContainer.classList.add('active')
        }
        else{
            loadingScreen.classList.remove('active')
            userInfoContainer.classList.add('active')
            renderWeatherInfo(data)
        }
    }
    catch(err){
        console.log('Error Occured',err)
    }
}

// async function fetchWeatherByCity(){
//     console.log('abc')
//     let city = 'goa';
    
//     try{
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`)
//         const data = await response.json();
//         renderWeatherDetails(data)
//         console.log('Weather data: Temp ->' ,data?.main?.temp.toFixed(2));
//     }
//     catch(err){
//         console.log("Error Found",err)
//     }
// }  

// async function fetchWeatherByLatLon(){
//     let latitude = 33.44
//     let longitude = 94.04
//     try{
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`)
//         const data = await response.json()
//         renderWeatherDetails(data)
//         console.log('Weather data: Temp ->' ,data?.main?.temp.toFixed(2));
//     }
//     catch(err){
//         console.log("Error Found",err)
//     }
// }



