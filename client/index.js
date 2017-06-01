var imgTag = "";
var wrongCounter = 0
var imageStart;
var imageId;
var timeArray = []

$(document).ready(function(){

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
            }
                $('#image').addClass('shake-slow')
        } else {
            $('#image').removeClass('shake-slow')
            $('#image').removeClass('shake-opacity')
        }

        if(checkForWinner(wordArr)){
            getImage()
        }
    }


    // $('form').submit(function(e) {
    //     e.preventDefault()
    //     if($('#guess').val() === imgTag) {
    //         alert('you win, Eric!')
    //     } else {
    //         alert('you lose, Tina!')
    //     }
    // })
})
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

    $.ajax({
        url: "http://localhost:3000/api/v1/images/1",
        success: function(data) {
            imageStart = new Date().getTime()
            imageId = data.id
            console.log(imageId)
            $('#image').html(`<img src=${data.url}>`)
            imgTag = data.tag
            createCharDivs();
        }
    })
}

function createCharDivs() {
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



function determineDuration(){
  let now = new Date().getTime()
  timeArray.push({[`${imageId}`]: (now - imageStart)})

}

function writeToDurationTable(){
  //
  $.ajax({
      url: "http://localhost:3000/api/v1/durations",
      method: "POST",
      data: {timeArray},
      success: function(data) {
        console.log(data)
      }
  })
}

// function showScores(){
//   // add event listener to document for after game
//   // write out scoreboard here
//
//
// }
