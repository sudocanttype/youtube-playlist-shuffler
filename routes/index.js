var express = require('express');
const path = require('path');
const Store = require('electron-store');

var router = express.Router();
const axios = require('axios');
require('dotenv').config()

const store = new Store()


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'express' });
  res.sendfile(path.join(__dirname,  '..', 'views', 'index.html'));
  
});

router.post('/submitPL', async function (req, res) {
  let inp = (req.body["id"])
  returnValues = await handleSubmit(inp)
  res.send(returnValues)
  //make these persistant
  store.set("prevPL", returnValues)
  store.set("prevPL_ID", inp)
})

router.post('/getLastPL', function (req, res) {
  let returnValues = store.get("prevPL")
  res.send(returnValues)
})

//get and set fn for the persistant storage
router.post('/getLastPLID', function (req, res) {
  let returnValues = store.get("prevPL_ID")
  res.send(returnValues)
})

router.post('/getLastVideoIndex', function (req, res) {
  let returnValues = store.get("prevVidIndex") || "0"
  res.send(returnValues)
})

router.post('/getVideoTime', function (req, res) {
  let returnValues = store.get("lastVideoTime")
  res.send(returnValues)
})

router.post('/setLastVideoIndex', function (req, res) {
  store.set("prevVidIndex", req.body['index'])
})

// router.post('/setVideoTime', function (req, res) {
//     console.log(req.read())
//     req.on('readable', function(){
//     console.log(req.read());
//     });
//   // store.set("lastVideoTime", req.body['t'])
// })

router.post('/reshufflePL', function (req, res) {
  let PL = store.get("prevPL")
  PL = shuffleSongs(PL)
  res.send(PL)
  store.set("prevPL", PL)

})

async function handleSubmit(playlistID) {
  static_vars.plID = playlistID
  let res = await getPLData("")
  store.set("lastPLID", playlistID)
  if (res["nextPageToken"]){
    let temp = shuffleSongs((await getMultiPageVideos(res)))
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
