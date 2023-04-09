/// <reference types="../@types/jquery" />

const mainData = document.querySelector(".there")

let sideWidth = $('.leftSide').innerWidth()
$('#sideBar').css({left:-sideWidth})


$('.leftSide li').click(function(){
  $(this).addClass("active")
  $(this).siblings().removeClass("active")
  })

getData()

  async function getData() {
    $('#sideBar').addClass('d-none')
    $('.loading').removeClass('d-none')
    const apiResponse = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    const api = await apiResponse.json();
    displayData(api.meals);
    $('.loading').addClass('d-none')

  }

  function displayData(data) {
    let box = ``;
    for (let i = 0; i < data.length; i++) {
      box += `
      <div class="col-md-3">
      <div onclick="mealDetails('${data[i].idMeal}')" class="img position-relative overflow-hidden">
      
        <img class= "w-100 rounded-4"  src=${data[i].strMealThumb}  alt="">
        <div class="word p-3 position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center rounded-4 ">
          <h3 class="text-dark">${data[i].strMeal}</h3>
        </div>
      </div>
    </div>
      `;
    }
    mainData.innerHTML = box;
    $('#sideBar').removeClass('d-none')
  }

async function mealDetails(id){
    $('.img').click(()=>{
      $('#main').addClass('d-none')
      $('#card').addClass('d-block')
      
    })
    $('.loading').removeClass('d-none')

    const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let response = await apiResponse.json();
    displayMealData(response.meals[0])
    $('.loading').addClass('d-none')

  }


function displayMealData(data){
  
let tag =data.strTags?.split(",")
if (!tag) {
  tag = []
}
  let tags=``
  for(let i =0 ; i<tag.length ; i++){
    tags += `<li class="alert alert-danger m-2 p-1">${tag[i]}</li> `
  }

let recipes = ``
for (let i =1 ; i<=20 ; i++ ){
if (data[`strIngredient${i}`]){
  recipes+=`<li class="alert alert-info m-2 p-1">${data[`strMeasure${i}`]} ${data[`strIngredient${i}`]}</li>`
}
}

  let cartons =`
    <div class="col-md-4">
    <div class="imgs">
      <img class= "w-100  rounded-4"  src="${data.strMealThumb}" alt="">
      <p class="fw-bold text-center mt-2 h2">${data.strMeal}</p>
    </div>
  </div>
  <div class="col-md-8">
    <h2>Instructions : <span class="backPage" onclick="back()">home</span> -</h2>
  <p>${data.strInstructions}</p>
    <p class="fw-bold h3">Area : ${data.strArea}</p>
    <p class="fw-bold h3">Category : ${data.strCategory}</p>
    <p class="fw-bold h3">Recipes :- </p>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
    ${recipes}
    </ul>
    <p class="fw-bold h3">Tags :- </p>


    <ul class="list-unstyled d-flex g-3 flex-wrap">
    ${tags}
    </ul>
    <a href=${data.strSource} class="btn btn-success me-1 fw-bold" target="_blank">Source</a>
    <a href=${data.strYoutube} class="btn btn-danger fw-bold" target="_blank">Youtube</a>

  </div>
    `
    mainData.innerHTML = cartons
}

function back() {
  $('#search').addClass("d-none")
  $('.leftSide li').filter('.active').removeClass("active")
  getData()
}


$(".here").click(()=>{
  if($('#sideBar').css("left") == "0px"){
    $('#sideBar').animate({left:-sideWidth},800)
    $('.leftSide li').animate({top:200},500)
    $(".here").removeClass("fa-xmark");
    $(".here").addClass("fa-bars");
  }else{
    $('#sideBar').animate({left:0},800)
    $('.leftSide li').animate({top:0},800)
    $(".here").addClass("fa-xmark");
    $(".here").removeClass("fa-bars");
  }
})





async function searchByName(name){
  mainData.innerHTML=''
  const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
  const response = await apiResponse.json();
  displayData(response.meals)
}


async function searchByChar(char){
  mainData.innerHTML=''

const apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)
const response = await apiResponse.json();
displayData(response.meals)

}


function searchCom(){
$('#search').removeClass("d-none")
mainData.innerHTML =""
}




function categoryData(){
  mainData.innerHTML =""
  $('#search').addClass("d-none")
  categoryCards()
  }


async function categoryCards(){
  $('.loading').removeClass('d-none')

  const api = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  const response = await api.json()
  displayCategoryData(response.categories)
  $('.loading').addClass('d-none')

}


function displayCategoryData(data) {
  
  let box = ``;
  for (let i = 0; i < data.length; i++) {
    let description = data[i].strCategoryDescription.split(" ").slice(0,20).join(" ")
    box += `
    <div class="col-md-3">
    <div onclick="categoryMealDetails('${data[i].strCategory}')" class="img position-relative overflow-hidden">
    
      <img class= "w-100 rounded-4"  src=${data[i].strCategoryThumb}  alt="">
      <div class="word p-3 position-absolute top-0 bottom-0 start-0 end-0 text-center rounded-4 ">
        <h3 class="text-dark">${data[i].strCategory}</h3>
        <p class="mt-2 text-dark">${description}</p>
      </div>
    </div>
  </div>
    `;
  }
  mainData.innerHTML = box;
}

async function categoryMealDetails(mealName){
  $('.loading').removeClass('d-none')
  const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealName}`)
  const response = await api.json()
  displayData(response.meals)
  $('.loading').addClass('d-none')

}

function areaCom(){
  $('#search').addClass("d-none")
  mainData.innerHTML =""
  areaDetails()
  }

async function areaDetails(){
  $('.loading').removeClass('d-none')
  const api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  const response = await api.json()
  displayAreaData(response.meals)
  $('.loading').addClass('d-none')

}

function displayAreaData(country) {
let box =``
for(let i = 0 ; i <country.length; i++){
box +=`
<div class="col-md-3">
  <div class="cart text-center" onclick="areaMealDetails('${country[i].strArea}')">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3 >${country[i].strArea}</h3>
  </div>
</div>
`
}
mainData.innerHTML = box
}

async function areaMealDetails(mealDetails){
  $('.loading').removeClass('d-none')

  const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${mealDetails}`)
  const response = await api.json()
  displayData(response.meals)
  $('.loading').addClass('d-none')

}


function ingredientsCom(){
  $('#search').addClass("d-none")
  mainData.innerHTML =""
  ingredientsDetails()
  }

async function ingredientsDetails() {
  $('.loading').removeClass('d-none')

  const api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  const response = await api.json()
  displayIngredientsData(response.meals.slice(0,20))
  $('.loading').addClass('d-none')

  }

  function displayIngredientsData(meal) {
    let box =``
    for(let i = 0 ; i < meal.length; i++){
      let description = meal[i].strDescription.split(" ").slice(0,12).join(" ")
    box +=`
    <div class="col-md-3">
      <div onclick="ingredientsMealDetails('${meal[i].strIngredient}')" class="sub text-center text-white">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${meal[i].strIngredient}</h3>
        <p>${description}</p>
      </div>
    </div>
    `
    }
    mainData.innerHTML = box
    }

    async function ingredientsMealDetails(mealDetails){
      $('.loading').removeClass('d-none')

      const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealDetails}`)
      const response = await api.json()
      displayData(response.meals)
      $('.loading').addClass('d-none')

    }


    function ContactCom() {
      $('#search').addClass("d-none")
      mainData.innerHTML =""
      displayContactCom()
    }

    function displayContactCom(){
      mainData.innerHTML =`
      <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
          <div class="row g-4">
              <div class="col-md-6">
                  <input id="nameInput" onkeyup="nameValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                  <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Special characters and numbers not allowed 
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="emailInput" onkeyup="emailValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                  <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Email not valid exemple55@yahoo.com
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="phoneInput" onkeyup="phoneValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                  <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid Phone Number
                  </div>
              </div>
              <div class="col-md-6">
                  <input id="ageInput" onkeyup="ageValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                  <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid age (20-70)
                  </div>
              </div>
              <div class="col-md-6">
                  <input  id="passwordInput" onkeyup="passValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                  <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid password *Minimum eight characters, start one capital char and one number:*
                  </div>
              </div>
              <div class="col-md-6">
                  <input  id="repasswordInput" onkeyup="repassValidation()" type="password" class="form-control " placeholder="Repassword">
                  <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                      Enter valid repassword 
                  </div>
              </div>
          </div>
          <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
      </div>
    </div> 
    `;
    }


    function nameValidation(){
      let input =document.getElementById("nameInput")
      const regex = /^[a-z ]+$/ig
      if(regex.test(input.value)){
        $(input).addClass("is-valid")
        $(input).removeClass("is-invalid")
        $("#nameAlert").addClass("d-none")
      }else{
        $(input).addClass("is-invalid")
        $(input).removeClass("is-valid")
        $("#nameAlert").removeClass("d-none")
      }
    }

    function emailValidation(){
      let input =document.getElementById("emailInput")
      const regex = /^\w.{0,20}@[a-z]{0,7}\.\w{2,5}$/ig
      if(regex.test(input.value)){
        $(input).addClass("is-valid")
        $(input).removeClass("is-invalid")
        $("#emailAlert").addClass("d-none")
      }else{
        $(input).addClass("is-invalid")
        $(input).removeClass("is-valid")
        $("#emailAlert").removeClass("d-none")
      }
    }

    function phoneValidation() {
      let input =document.getElementById("phoneInput")
      const regex = /^(\+2)?(010|012|015|011)[0-9]{8}$/ig
      if(regex.test(input.value)){
        $(input).addClass("is-valid")
        $(input).removeClass("is-invalid")
        $("#phoneAlert").addClass("d-none")
      }else{
        $(input).addClass("is-invalid")
        $(input).removeClass("is-valid")
        $("#phoneAlert").removeClass("d-none")
      }
    }

    function ageValidation() {
      let input =document.getElementById("ageInput")
      const regex = /^([2-6][0-9]|70)$/ig
      if(regex.test(input.value)){
        $(input).addClass("is-valid")
        $(input).removeClass("is-invalid")
        $("#ageAlert").addClass("d-none")
      }else{
        $(input).addClass("is-invalid")
        $(input).removeClass("is-valid")
        $("#ageAlert").removeClass("d-none")
      }
    }


    function passValidation() {
      let input = document.getElementById("passwordInput")
      const regex = /^([A-Z])(\d)+[0-9a-z]{6,}$/ig
      if(regex.test(input.value)){
        $(input).addClass("is-valid")
        $(input).removeClass("is-invalid")
        $("#passwordAlert").addClass("d-none")
      }else{
        $(input).addClass("is-invalid")
        $(input).removeClass("is-valid")
        $("#passwordAlert").removeClass("d-none")
      }
    }

    function repassValidation() {
      let input = document.getElementById("passwordInput")
      let secinput = document.getElementById("repasswordInput")
      if(input.value == secinput.value){
        $(input).addClass("is-valid")
        $(input).removeClass("is-invalid")
        $("#repasswordAlert").addClass("d-none")
      }else{
        $(input).addClass("is-invalid")
        $(input).removeClass("is-valid")
        $("#repasswordAlert").removeClass("d-none")
      }
    }

    function checkValidation(){
      if(nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passValidation() && repassValidation()){
        $('#submitBtn').removeAttr('disabled')
      }
    }

    checkValidation()