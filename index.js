const { app, BrowserWindow, Tray, ipcMain ,desktopCapturer , dialog, Notification} = require("electron");
const { writeFile } = require("fs");
const { mkdir } = require("fs/promises");
const path = require("path")
dialog

app.disableHardwareAcceleration()
// GLOBAL VARIABLES
let window 
let tray

//FUNCTION TO CREATE A WINDOW
let createWindow =()=>{
  
  
  window = new BrowserWindow(
    {
      width:900,
      height:600,
      frame:false,
      resizable:false,
      roundedCorners:true,
      webPreferences:{
        preload:path.join(__dirname,"preload.js")
      }
    }
  )
  window.setBackgroundColor("rgb(36, 35, 35)")
  window.loadFile(path.join(__dirname,"index.html"))
  
}

// CLOSE WINDOW
ipcMain.on("close",()=>{
window.close()
})
//MINIMIZE WINDOW
ipcMain.on("minimise",()=>{
  window.minimize()
})
//GET MEDIA SOURCES
ipcMain.handle("get-sources",async()=>{
  let sources = await desktopCapturer.getSources({types:['window','screen']})
  return sources
 
  
})
//OPEN SAVE DIALOG FOR VIDEO
ipcMain.handle("open-save-video",async()=>{
let path=  await dialog.showSaveDialog({buttonLabel:"save video",defaultPath:`video${Date.now()}`})
return path

})
//OPEN SAVE DIALOG FOR PHOTO
ipcMain.handle("open-save-photo",async()=>{
  let path=app.getPath('pictures')
  return path
  })
// LAUNCHING A WINDOW WHEN THE APP IS READY
app.on("ready",()=>{
  createWindow()
  // OPENNING A NEW WINDOW ON MACOS WHEN THE APP IS STILL RUNING BUT NO WINDOWS ARE OPEN
app.on("activate",()=>{
  if(BrowserWindow.fromWebContents().length ==0){
    
    createWindow()
  }
})
})
// QUITING THE APP WHEN ALL WINDOWS ARE CLOSED EXCLUDING MACOS
app.on("window-all-closed",()=>{
  if(process.platform !== "darwin"){
    app.quit()
  }
})
