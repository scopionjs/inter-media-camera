const { desktopCapturer, contextBridge, ipcRenderer, dialog } = require("electron");
const { writeFile } = require("original-fs");

contextBridge.exposeInMainWorld("api",{getSources:async()=>{
let sources=await ipcRenderer.invoke("get-sources")
return sources
},close:()=>{
    ipcRenderer.send("close")
},minimise:()=>{
    ipcRenderer.send("minimise")
},sendBase64:async(base64)=>{
    let buffer = Buffer.from(base64,'base64')
    let path= await ipcRenderer.invoke("open-save-photo")
    let isSaved=await  writeFile(`${path}/${Date.now()}.png`,buffer,()=>{
            return;
        })
    if(isSaved==undefined){
        return true
    }else{
        return false
    }
    
},
    sendBuffer:async(buffer)=>{
      let path= await ipcRenderer.invoke("open-save-video")
        let stream = Buffer.from(buffer)
        writeFile(`${path.filePath}.webm`,stream,()=>{
            console.log("saved")
        })
    }
})
 ipcRenderer.on("api",(e,data)=>{
    console.log(data,data[0].thumbnail.toBitmap())
     
 })