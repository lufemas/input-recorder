'use strict'

const $ = document;
const $recordBtn = $.getElementById('record-btn')
const $playBtn = $.getElementById('play-btn')
const $fakeCursor = $.getElementById('fake-cursor')

let mouseRecord = []
let isRecording = false
let isPlaying = false
let initDeltatime = 0

window.addEventListener('mousemove', (e)=> {
    if(isRecording){
        mouseRecord.push({x: e.clientX, y: e.clientY, timeStart: e.timeStamp - initDeltatime })
    }    
})


$recordBtn.addEventListener('click', (e) => {
    if(!isPlaying){
        initDeltatime = e.timeStamp
        toogleRecord()
    }
})


$playBtn.addEventListener('click', (e) => {

    if(!isPlaying){
        isRecording ? toogleRecord() : null
        isPlaying = true

        $.body.style.cursor = 'none'
        $recordBtn.style.cursor = 'none'

        $playBtn.innerHTML = `PLAYING`
        $playBtn.className = 'playing'
    
    
        play(0)
        console.log(mouseRecord)
    }
   
})

function toogleRecord(){
    isRecording = !isRecording;
    
    if(isRecording){
        mouseRecord.splice(0, mouseRecord.length)
        $recordBtn.innerHTML = `STOP`
        $recordBtn.className = 'stop'
    }else{
        

        $recordBtn.innerHTML = `RECORD`
        $recordBtn.className = 'record'        
    }
}

function play(ind, deltaTime = 0){
    if(ind < mouseRecord.length){
        setTimeout(()=>{
            $fakeCursor.style.transform = `translate(${mouseRecord[ind].x}px,${mouseRecord[ind].y}px)`;
            play(ind+1, mouseRecord[ind].timeStart)
        },mouseRecord[ind].timeStart - deltaTime)
    }else{
        isPlaying = false;
        $.body.style.cursor = 'default'
        $recordBtn.style.cursor = 'pointer'

        $playBtn.innerHTML = `PLAY`
        $playBtn.className = 'play'
        $fakeCursor.style.transform = `translate(-50px,-50px)`;
    }
}