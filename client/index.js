var imgTag = "";
var img
var wrongCounter = 0
var imagesArray = []

var playerInitials = ""
var score = 0

var imageStart;
var imageId;
var timeArray = []
var form = $('form')
var levelCounter = 1;

$(document).ready(function(){

    document.getElementById("init1").focus();
    form.keyup(function(e) {
        
        e.stopPropagation();
        if($('#init1').val().length === 3) {
            start();
        }
    })
    
})



    function keyDownHandler(e) {
        var wordArr = imgTag.split('')
        var letterGuessed = false
        wordArr.forEach(function(letter, index) {
            if(letter === e.key) {
                $(`#span-${index}`).text(e.key)
                letterGuessed = true
                wrongCounter = 0
                
            }
        })

        if(letterGuessed === false) {
            wrongCounter += 1
            if(wrongCounter > 5) {
                $('#image').addClass('shake-opacity')
                $('#tag-box').addClass('shake-slow')
            } else {
                $('#image').removeClass('shake-slow')
                $('#image').removeClass('shake-opacity')
            }          
        }   

        if(checkForWinner(wordArr)){
            console.log('checked')
            getImage()
        }
    }

function start() {
    
    var startTimer = 3
    
    playerInitials = $('#init1').val()
    $("#intro").fadeOut(500,function() {
        document.getElementById("intro").style.visibility = "hidden";
        getScoreboard();
        getImages();
        setInterval(updateTime, 1);
        getImage();
    });
    
    document.addEventListener("keydown", keyDownHandler, false);
}


function startGame() {
    getImage()
}


//vars for timer
var sTime = new Date().getTime();
var countDown = 60000

var seconds

function updateTime(){
    var cTime = new Date().getTime();
    var diff = cTime - sTime;
    seconds = countDown - Math.floor(diff);
    var strSec = seconds.toString().slice(0,2)
    var strMil = seconds.toString().slice(2,6)

    $("#seconds").text(strSec)
    $("#milli").text(strMil)
    timerBarShrink()
}

function timerBarShrink(){
    var percent = seconds/countDown * 100
    var curHeight = $('.timerBar').height()

     $('.timerBar').css('height', (300 * (percent * 0.01) + 'px'));
}


function getImages() {
    $.ajax({
        url: `http://localhost:3000/api/v1/images/${levelCounter}`,
        success: function(data) {
            data.forEach(function(image) {
                imagesArray.push(image)
            })
            
        }
    })
    
}

function getImage() {
    imageStart = new Date().getTime()
    img = imagesArray[Math.floor(Math.random()*imagesArray.length)]
    
    $('#image').html(`<img src=${img.url}>`)
    imgTag = img.tag
    imageId = img.id
    console.log("id "+img.id+" tag "+img.tag)
    createCharDivs();
}

function getScoreboard() {
    
    $.ajax({
        url: "http://localhost:3000//api/v1/score_board",
        success: function(data) {
            var sboard = ""
            data.forEach(function(score){
                sboard += `${score.initials} | ${score.score} <br>`
            })
            $('#score').html(sboard)
        }
    })
}

function createCharDivs() {
    console.log('divs')
    var charDivs = ""
    imgTag.split('').forEach(function(letter,index) {
        charDivs += `<span class='charDiv' id='span-${index}'>_</span> `
    })

    $('#tag-box').html(charDivs)
}

function checkForWinner(wordArr) {
    var divs = $('.charDiv')
    for(i = 0; i < divs.length; i++) {
        if(divs[i].textContent === "_") {
            return false
        }
    }
    determineDuration();
    return true
}


function endGame() {
    //display intials and score
    console.log(playerInitials+" | "+score)
    //ajax post for scoreboard
    $.ajax({
        url: "http://localhost:3000//api/v1/score_board",
        method: "post",
        data: {playerInitials: score},
        success: function(data) {
            console.log('score submitted')
        }
    })
    //ajax post for durations
    //reset to overlay div
}

function determineDuration(){
  let now = new Date().getTime()
  timeArray.push({[`${imageId}`]: (now - imageStart)})
}

function writeToDurationTable(){
  $.ajax({
      url: "http://localhost:3000/api/v1/durations",
      method: "POST",
      data: {timeArray},
      success: function(data) {
        console.log(data)
      }
  })
}

