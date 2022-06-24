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
  console.log("PLy6N_9yB8Qwy6LL0J7zLUyW8XNX-BPeDl")
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

async function handleSubmit(playlistID) {
  const link = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistID}&key=${process.env['YOUTUBE_API_KEY']}`
  axios.get(link).then(function (response) {
    if (response.status != 200){
      return response.statusText
    }
    let res = response.data
    if (res["nextPageToken"]){

    } else {
      console.log( getSinglePageVideos(res))
    }

  })
}

function getSinglePageVideos(json) {
  let arr = [];
  json["items"].forEach(function(v, i, a){
    arr.push(v["contentDetails"]["videoId"])
  })
  return arr
}

function getMultiPageVideos(json) {
  let arr = [];
  json["items"].forEach(function(v, i, a){
    arr.push(v["contentDetails"]["videoId"])
  })
  return arr
}

