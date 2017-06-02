$(document).ready(function(){

    $("#searchForm").submit(function(e){
        e.preventDefault()
        let searchString = $("#searchInput")[0].value
        SearchRequest(searchString)
        alert("Enter your initials to start this shit!")
    })
})

let picPostArray = []
var picArray = []
let rawTags = []

function SearchRequest (search){




    var linkUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=815602f3323a376683c5834d951d071a&tags="+search+"&tag_mode=all&sort=interestingness-desc&format=json&nojsoncallback=1"

    $.ajax({
        url: linkUrl,
        success: function(data) {
            try{
                var pics = data.photos.photo
                for (var i = 0; i < 2; i++){
                    picArray.push(pics[i])
                }
                getPicTags(picArray)
            }
            catch(err){
                alert("Demand that your admin fix this feature")
            }

        }
    })
}

function getPicTags(array){
    picArray.forEach(function(pic){

        var realUrl = `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`

        let picUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=815602f3323a376683c5834d951d071a&photo_id="+ pic.id + "&secret=&format=json&nojsoncallback=1"
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
    // debugger
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
     return redTags.splice(0,1)
}
