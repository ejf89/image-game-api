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
