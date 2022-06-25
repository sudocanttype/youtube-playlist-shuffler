// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const axios = require('axios');
require('dotenv').config()


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  //needed to ensure that youtube returns json formattable 
  axios.defaults.headers.common['Accept'] = 'application/json'
  ipcMain.handle('submit_channel', async (event, data) => {
        const response = await handleSubmit(data);
        return response
  })
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

//
// my shit
//
//

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
