//image variables
var imagesArray = [];
var imagePos = 0;
var imageId;
var imageTag;
var img

//player variables
var playerInitials;
var score = 0;
var levelCounter = 1;

//game variables
var wrongCounter = 0
var sTime = new Date().getTime();
var countDown = 60000
var gameCountdown
var seconds
var finishRound = false
var timeArray = []
var imageStart;
var sboard = ""
var end = false


//jquery variables
var $initialForm = $('#init1')
var $form = $('form')
var $divs = $('.charDiv')


$(document).ready(function(){
    document.getElementById("init1").focus();
    var started = false
    $form.keyup(function(e) {
        e.stopPropagation();
        if($initialForm.val().length === 3) {
            playerInitials = $initialForm.val()
            $("#intro").fadeOut(500,function() {
                document.getElementById("intro").style.visibility = "hidden";
            });
            if(!started) {
                getScoreboard();
                getImages();


                started = true;
            }
        }
    })
})

function startLevel() {
    end = false;
    getImage();
    if(score === 0) {
        gameCountdown = setInterval(updateTime, 1);
    }
    
}

function getImage() {
    if(imagesArray.length < 1) {
        console.log('getImage fired early')
        return true
    }
    // imgPos = Math.floor(Math.random()*imagesArray.length)
    imgObj = imagesArray[0]
    console.log(imgObj)
    img = document.createElement("IMG");
    document.addEventListener("keydown", keyDownHandler, false);
    imgTag = imgObj.tag;
    createCharDivs();

    imageId = imgObj.id;
    img.src = imgObj.url;
    img.className = "image";
    imageStart = new Date().getTime();
    
    // document.getElementById('midTV').style.backgroundImage = "url('images/old-television_sm.png')"
    setTimeout(document.getElementById('imageDiv').appendChild(img),4000);
    

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
            imagesArray.splice(imagesArray.indexOf(imgObj),1)
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
    $('.image').removeClass('shake-constant')
    $('#tag-box').removeClass('shake-constant')
}

function increaseShakes() {
    wrongCounter += 1
    if (wrongCounter < 3) {
    
    } else if (wrongCounter < 6) {
                $('.image').addClass('shake-constant')
        $('#tag-box').addClass('shake-constant')
        $('.image').addClass('shake-little')
        $('#tag-box').addClass('shake-little')
    } else if (wrongCounter < 8) {
                $('.image').removeClass('shake-little')
        $('#tag-box').removeClass('shake-little')
        $('.image').addClass('shake-slow')
        $('#tag-box').addClass('shake-slow')
    } else if (wrongCounter < 11) {
                $('.image').removeClass('shake-slow')
        $('#tag-box').removeClass('shake-slow')
        $('.image').addClass('shake-opacity')
        $('#tag-box').addClass('shake-opacity')
        
    }  else if (wrongCounter > 20) {        
        $('.image').removeClass('shake-opacity')
        $('#tag-box').removeClass('shake-opacity')
        $('.image').addClass('shake-crazy')
        $('#tag-box').addClass('shake-crazy')
    }
}

function checkForWin() {
    let $div = $('.charDiv')
    for(i = 0; i < $div.length; i++) {
        if($div[i].textContent === "_") {
            return false;
        }
    }
    return true;
}

function nextRound() {
    finishRound = true
    document.getElementById('imageDiv').removeChild(img);
    score++;
    console.log("score: "+ score+" - level: "+ levelCounter)
    determineDuration();
    if(imagesArray.length < 1) {
        levelCounter++
        getImages();
    } else {
        getImage();
    }
}

function endGame() {
    end = true;
    //clear events and intervals
    clearInterval(gameCountdown);
    document.removeEventListener("keydown", keyDownHandler);

    submitScore()
    writeToDurationTable()
    $('#playerStats').html(`<h1 class='text-uppercase'>${playerInitials} ${score}</h1>`)
    $('#init1').val("");
    document.getElementById("intro").style.visibility = "visible";
    $("#intro").fadeIn(5000,function() {


        document.getElementById("init1").focus();
    });
    //should submit scoreboard ajax update with player initials
    //should display
}
function determineDuration(){
  let now = new Date().getTime()
  timeArray.push({[`${imageId}`]: (now - imageStart)})
}

//timer functions
function updateTime(){
        var cTime = new Date().getTime();
        var diff = cTime - sTime;
        // if(finishRound) {
        //     console.log('finishround')
        //     diff += 5000;
        //     finishRound = false;
        // }
        seconds = countDown - Math.floor(diff);
        var strSec = seconds.toString().slice(0,2)
        var strMil = seconds.toString().slice(2,6)

        $("#seconds").text(strSec)
        $("#milli").text(strMil)
        timerBarShrink()
        if(strSec < 0) {
            endGame();
        }


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

            var sboard = "<h3>SCORES</h3><table><tr><th>PLAYER   </th><th>SCORE</th></tr>"
            data.forEach(function(score){
                sboard += `<tr> <td class="text-uppercase">${score.initials} </td>  <td> ${score.score}</td></tr>`
            })
            sboard += "</table>"
            console.log(sboard)

            if(!end) {
                $('#score').html(sboard)
            } else {
                $('#mainScore').html(sboard)
            }

        }
    })
}

function getImages() {
    if (score != 0) {
        $('#tvText').html("Please Stand By...")
    }
    $.ajax({
        url: `http://localhost:3000/api/v1/images/${levelCounter}`,
        success: function(data) {
            data.forEach(function(image) {
                imagesArray.push(image)
            })
            console.log(imagesArray)
            setTimeout(startLevel,3000)
        }
    })
}

function writeToDurationTable(){
  $.ajax({
      url: "http://localhost:3000/api/v1/durations",
      method: "POST",
      data: {timeArray},
      success: function(data) {
        console.log('durations submitted')
      }
  })
}

function submitScore(){
  $.ajax({
      url: "http://localhost:3000/api/v1/score_board",
      method: "POST",
      data: {[`${playerInitials}`]:score},
      success: function(data) {
        getScoreboard();
      }
  })
}
// function showScores(){
//   // add event listener to document for after game
//   // write out scoreboard here
//
//
// }
