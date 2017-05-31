var imgTag = "";
var wrongCounter = 0
var playerInitials = ""
var score = 0
var imageC = 1

$(document).ready(function(){

    var form = $('form')
    document.getElementById("init1").focus();
    form.keyup(function() {
        if($('#init1').val().length === 3) {
            start();
        }
    })
    document.addEventListener("keydown", keyDownHandler, false);
    
})

function keyDownHandler(e) {
    var wordArr = imgTag.split('')
    var letterGuessed = false
    wordArr.forEach(function(letter, index) {
        if(letter === e.key) {
            $(`#span-${index}`).text(e.key)
            letterGuessed = true
            wrongCounter = 0

    getImage()
    document.addEventListener("keydown", keyDownHandler, false);


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
        if(letterGuessed === false){
            wrongCounter += 1
            if(wrongCounter > 5) {
                $('#image').addClass('shake-opacity')
                $('#tag-box').addClass('shake-slow')
            } else {
                $('#image').removeClass('shake-slow')
                $('#image').removeClass('shake-opacity')
            }
          if(checkForWinner(wordArr)){
              getImage()
          }
    })
 

    
}
function start() {
    var startTimer = 3
    
    playerInitials = $('#init1').val()
    $("#intro").fadeOut(500,function() {
        document.getElementById("intro").style.visibility = "hidden";
       // clearInterval(startCount);
        
        getScoreboard();
        getImage();
    });
    
}


function startGame() {
    getImage()
}


//vars for timer
var sTime = new Date().getTime();
var countDown = 60000
setInterval(updateTime, 1)
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


function getImage() {
    console.log(imageC)
    $.ajax({
        url: "http://localhost:3000/api/v1/images/1",
        success: function(data) {
            $('#image').html(`<img src=${data.url}>`)
            imgTag = data.tag
            createCharDivs();
        }
    })
    imageC++;
}

function getScoreboard() {
    console.log('score')
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

