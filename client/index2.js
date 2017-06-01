//image variables
var imagesArray = [];
var imagePos = 0;
var imageId;
var imageTag;

//player variables
var playerInitials;
var score = 0;
var levelCounter = 1;

//game variables
var wrongCounter = 0
var sTime = new Date().getTime();
var countDown = 60000
var seconds
var timeArray = []
var imageStart;

//jquery variables
var $initialForm = $('#init1')
var $form = $('form')
var $divs = $('.charDiv')


$(document).ready(function(){
    document.getElementById("init1").focus();
    $form.keyup(function(e) {
        e.stopPropagation();
        if($initialForm.val().length === 3) {
            playerInitials = $initialForm.val()
            $("#intro").fadeOut(500,function() {
                document.getElementById("intro").style.visibility = "hidden";
                startGame();
            });
        }
    })
})

function startGame() {
    getImages();
    getScoreboard();
    setInterval(updateTime, 1);
    getImage();
    
}

function getImage() {
    imgPos = Math.floor(Math.random()*imagesArray.length)
    imgObj = imagesArray[imagePos]
    img = new Image();
    img.onload = function () {
        //prevents early misfire of event handling if image isnt loaded
        document.addEventListener("keydown", keyDownHandler, false);
        createCharDivs();
        imgTag = imgObj.tag;
        imageId = imgObj.id;
        img.src = imgObj.url;
        imageStart = new Date().getTime()
    }
    $(img).appendTo('#image');
}

function createCharDivs() {
    var charDivs = ""
    imgTag.split('').forEach(function(letter,index) {
        charDivs += `<span class='charDiv' id='span-${index}'>_</span> `
    })
    $('#tag-box').html(charDivs)
}

function keyDownHandler(e) {
    e.stopPropagation();
    if(guess(e)) {
        resetShakes();
        if(checkForWin()) {
            imagesArray.splice(imgPos,1)
            document.removeEventListener("keydown", keyDownHandler);
            nextRound();
        }
    } else {
        increaseShakes();
    }
}

function guess(e) {
    let correctGuess = false;
    imgTag.split('').forEach(function(letter, index) {
        if(letter === e.key) {
            $(`#span-${index}`).text(e.key)
            wrongCounter = 0  
            correctGuess = true;
        }
    })
    return correctGuess;
}

function resetShakes() {
    $('#image').removeClass('shake-slow')
    $('#image').removeClass('shake-opacity')
}

function increaseShakes() {
    wrongCounter += 1
    if(wrongCounter > 5) {
        $('#image').addClass('shake-opacity')
        $('#tag-box').addClass('shake-slow')
    }    
}

function checkForWin() {
    for(i = 0; i < divs.length; i++) {
        if(divs[i].textContent === "_") {
            return false;
        }
    }
    return true;
}

function nextRound() {
    score++;
    if(imagesArray.length < 1) {
        levelCounter++
        getImages();
        getImage();
    } else {
        determineDuration();
        getImage();
    }
}

function determineDuration(){
  let now = new Date().getTime()
  timeArray.push({[`${imageId}`]: (now - imageStart)})
}

//timer functions
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



//ajax calls
function getScoreboard() {
    $.ajax({
        url: "http://localhost:3000/api/v1/score_board",
        success: function(data) {
            var sboard = ""
            data.forEach(function(score){
                sboard += `${score.initials} | ${score.score} <br>`
            })
            $('#score').html(sboard)
        }
    })
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
