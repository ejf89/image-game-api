$(document).ready(function(){

    SearchRequest("dolphin")
    // getPicTags(picArray)
})

let picPostArray = []
var picArray = []
let rawTags = []

function SearchRequest (search){

    var linkUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=04eb22e333553d6354fe9ad8344ae2bf&tags=" +search+"&tag_mode=all&format=json&nojsoncallback=1"
    $.ajax({
        url: linkUrl,
        success: function(data) {
            var pics = data.photos.photo
            for (var i = 0; i < 3; i++){
                picArray.push(pics[i])
            }
            getPicTags(picArray)
        }
    })
}

function getPicTags(array){
    picArray.forEach(function(pic){

        var realUrl = `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`

        let picUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=4d015b439f3e6b80cc9e5a0c49f248b9&photo_id="+ pic.id + "&secret=&format=json&nojsoncallback=1"
        $.ajax({
            url: picUrl,
            async: false,
            success: function (picData){
                // console.log(realUrl)
                let doneTags = stripTags(picData)
                doneTags.forEach(function(tag){
                    picPostArray.push({[`${realUrl}`]: tag})

                })
            }
        })
    })
    postToApi(picPostArray)
}

function postToApi(array){

    $.ajax({
        url: "http://localhost:3000/api/v1/images",
        method: 'POST',
        data: {array},
        success: function(){
            console.log("we did!")
        }
    })
}

function stripTags(array){
    // var english = /^[A-Za-z0-9]*$/;
    let tags = array.photo.tags.tag.map(function (x){
        return x.raw
    })
    let redTags = tags.filter(function (tag){
        var turnCheck = true
        var i = tag.length - 1
        if ( 2 < i < 9){
            for (var z = i; z > 0; z--){
                var english = /^[A-Za-z]*$/;
                if (!english.test(tag[z])){
                    turnCheck = false
                }
            }
            if (turnCheck === true){
                    return tag
            }
        }
    })
     return redTags.splice(0,3)
}
