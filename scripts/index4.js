//MINIMISING AND MAXIMIZING THE SCREEN
document.querySelector(".minimize").onclick = ()=>{
    window.api.minimise()
}
document.querySelector(".close").onclick = ()=>{
    window.api.close()
}
//TARGET ELEMENTS
let video = document.querySelector('video')
let canvas = document.createElement('canvas')
let captureButton = document.querySelector('.btns button')
let capturedImage = document.querySelector('.captured')
//GLOBALIZING VARIABLES
let stream 
let image=new Image()
//DISPLAY FRONT CAMERA WHEN THE WINDOW LOADS
window.onload=async()=>{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:910,height:565},audio:false})
    video.srcObject=stream
    video.play()
}
// SETTING A LOGO IMAGE
image.src ='./icon.ico'
image.width=60
image.height=60
//CAPTURING IMAGE
captureButton.onclick=async()=>{
    video.pause()
    //PLAY CAPTURE SOUND
    let audio = new Audio()
    audio.src='./sounds/capture.mp3'
    audio.play()
// VIDEO TO CANVAS
//capturing after the sound
audio.onended=async()=>{
    canvas.height=screen.height
    canvas.width=screen.width
    let ctx = canvas.getContext('2d')
    ctx.drawImage(video,0,0,screen.width,screen.height)
    ctx.drawImage(image,10,(canvas.height-image.height)-10,image.width,image.height)
    let res=await window.api.sendBase64(canvas.toDataURL().split(',')[1])
    if(res){
        video.play()
        capturedImage.src=canvas.toDataURL()
        capturedImage.classList.replace('captured','captured-visible')
    }else{
        video.play()
    }
}
}