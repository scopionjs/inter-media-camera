
// global variables
let stream
let recorder 
let chunks =[]
let isRecording=false
let isPaused =false
let seconds =0
let image=new Image()
//target elements
let video= document.querySelector("video")
let canvas = document.createElement('canvas')
let btn1 =document.querySelector("#stop")
let btn2 =document.querySelector("#start")
let btn3 =document.querySelector("#pause")
let count = document.querySelector(".count")
let dim_layer =document.querySelector("#dim_layer")
let pause_image =document.querySelector(".pause_image")
let capture_btn = document.querySelector(".capture")
// minimize request
document.querySelector(".minimize").onclick = ()=>{
    window.api.minimise()
}
//maximise request
document.querySelector(".close").onclick = ()=>{
    window.api.close()
}
//LOAD VIDEO ON SCREEN OPEN
window.onload=async ()=>{
stream = await navigator.mediaDevices.getUserMedia({audio:true,video:{
    facingMode:"user"
}})
video.srcObject = new MediaStream(stream.getVideoTracks())

video.play()
}
//START RECORDING
let sec=3
btn2.onclick =async(e)=>{
    if(isPaused==false){
let count_down=setInterval(()=>{
if(sec >=0){
    count.textContent = sec
    sec--
}else{
    clearInterval(count_down)
    //e.target.classList.replace("start","recording")
                count.innerHTML=''
                isRecording=true
                btn1.classList.replace("hide","stop")
                btn3.classList.replace("hide","pause")
                dim_layer.classList.replace("hide","dim-layer") 
                recorder=new MediaRecorder(stream,{mimeType:"video/webm;codecs=vp9"})
                recorder.ondataavailable=async(e)=>{
                chunks.push(e.data)
                let blob=new Blob(chunks,{type:"video/webm;codecs=vp9"})
                chunks=[]
                let myBuffer=await blob.arrayBuffer()
                window.api.sendBuffer(myBuffer)
             
            }
            recorder.start()
}
},1000)
    
    }
    }
    // PAUSE AND RESUME
btn3.onclick=async(e)=>{
    //PAUSE
    if(isRecording){
        pause_image.src="./pics/resume.png"
        dim_layer.classList.replace("dim-layer","hide")
isPaused=true
isRecording=false
recorder.pause()
video.pause()

    }else{
       //RESUME
       pause_image.src="./pics/pause.png"
       dim_layer.classList.replace("hide","dim-layer")
isPaused=false
isRecording=true
video.play()
recorder.resume()
    }
}
// STOP RECORDING
btn1.onclick =(e)=>{
    e.target.classList.replace("stop","hide")
    btn1.classList.replace("stop","hide")
    dim_layer.classList.replace("dim-layer","hide") ||  dim_layer.classList.replace("hide","hide")
    btn3.classList.replace("pause","hide")

    isRecording=false
    isPaused=false
    recorder.stop()
    
    }
// SETTING A LOGO IMAGE
image.src ='./icon.ico'
image.width=60
image.height=60
//CAPTURE SCREEN 
capture_btn.onclick=async()=>{
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
    }else{
        video.play()
    }
}
}
console.log(capture_btn)