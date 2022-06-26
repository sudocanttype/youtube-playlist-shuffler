var express = require('express');
const path = require('path');

var router = express.Router();
const axios = require('axios');
require('dotenv').config()

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'express' });
  res.sendfile(path.join(__dirname,  '..', 'views', 'index.html'));
});

router.post('/submitPL', async function (req, res) {
  let inp = (req.body["id"])
  returnValues = await handleSubmit(inp)
  res.send(returnValues)
})

async function handleSubmit(playlistID) {
  static_vars.plID = playlistID
  let res = await getPLData("")
  if (res["nextPageToken"]){
    let temp = shuffleSongs((await getMultiPageVideos(res)))
    console.log(temp)
    return temp
  } else {
    return shuffleSongs(getSinglePageVideos(res))
  }

}

function getSinglePageVideos(json) {
  let arr = [];
  json["items"].forEach(function(v, i, a){
    let temp_dict = {}
    temp_dict["id"] = v["snippet"]["resourceId"]["videoId"]  
    temp_dict["title"] = v["snippet"]["title"]
    arr.push(temp_dict)
  })
  return arr
}

async function getMultiPageVideos(json) {

  let arr = []
  let temp = json
  while (temp["nextPageToken"]){
    arr = arr.concat(getSinglePageVideos(temp))
    temp = await getPLData("&pageToken="+temp["nextPageToken"])
  }
  return arr
}

async function getPLData(addstring){
  const link = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${static_vars.plID}&key=${process.env['YOUTUBE_API_KEY']}` + addstring

  //wait for this guy to load
  await axios.get(link).then(function (response) {
    //if its not a 2xx response code, throw error
    if (response.status / 100 != 2){
      throw 'Error, ' + response.statusText
    }
    //promote the data out of this function
    static_vars.data = response.data
  })

  return static_vars.data
}

function shuffleSongs(list){
  return list.sort( ()=>Math.random()-0.5 );
}

class static_vars {
  static plID = ""
  static data = "" 
}



module.exports = router;
