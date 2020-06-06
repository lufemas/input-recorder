'use strict'

// const $ = document;
// class InputRecorder{
//     constructor(){
//         const $inputRec =  $.createElement('div')

//         $inputRec.className = `input-recorder`
//         $inputRec.style.backgroundColor = "#222"
//         $inputRec.style.backgroundColor = "#222"

//         return $inputRec;
//     }
// }

'use strict'


const $ = document;
const $recordBtn = $.getElementById('record-btn')
const $stopBtn = $.getElementById('stop-btn')
const $fakeCursor = $.getElementById('fake-cursor')
const $editorText = $.getElementById('editor-text')
const $console = $.getElementById('console')



// const originalLog = console.log;

// console.log = (args) => {
//     $console.innerText +=  args.toString() + '\n'
//     originalLog(args)
// }


let isDemo = false
let mouseRecord = []
let keyRecord = []
let isRecording = false
let isPlaying = false
let initDeltatime = 0

window.addEventListener('mousemove', (e)=> {
    if(isRecording){
        mouseRecord.push({x: e.clientX, y: e.clientY, timeStart: e.timeStamp - initDeltatime })
    }    
})

window.addEventListener('keydown', (e)=> {
    $editorText.focus()
    if(isRecording){
        $editorText.removeAttribute('readonly')

        keyRecord.push({key: e.key, timeStart: e.timeStamp - initDeltatime })
    } else if(isPlaying){
        $editorText.setAttribute('readonly', true)
    }else{
        $editorText.focus()
        $editorText.removeAttribute('readonly')
    }   
})



window.onbeforeunload = ()=>{
    $editorText.value = ''
}

$editorText.addEventListener('keydown', (e)=>{
    if(isPlaying){

        let key = e.key

        if(key.length > 1){

            if( key == 'Backspace'){

                $editorText.value = $editorText.value.substring(0, $editorText.value.length - 1);
            
            }else if( key == 'Enter'){
                
                key = '\n';
                $editorText.value += key
            }

        }else{

            $editorText.value += key
        
        }
        $outputHTML.innerHTML = $editorText.value
    }
})


$recordBtn.addEventListener('click', (e) => {
    if(!isPlaying){
            initDeltatime = e.timeStamp
            toogleRecord()
    }
})


$player.addEventListener('play', (e) => {

    if(!isPlaying){
        isRecording ? toogleRecord() : null
        isPlaying = true

        $.body.style.cursor = 'none'
        $recordBtn.style.cursor = 'none'

        // $playBtn.innerHTML = `PLAYING`
        // $playBtn.className = 'playing'
    
        $editorText.value = ''
        $outputHTML.innerHTML = $editorText.value
        playMouse(0)
        playKeyboard(0)
        if(isDebugging){

            console.log(mouseRecord)
            console.log(keyRecord)
            console.log('\n\n\n')
            console.log(JSON.stringify(mouseRecord))
            console.log(JSON.stringify(keyRecord))
            downloadBlob(new Blob([JSON.stringify(mouseRecord)], {type: 'text/json'}), 'mouseRecord.json')
            downloadBlob(new Blob([JSON.stringify(keyRecord)], {type: 'text/json'}) , 'keyRecord.json')
        }
    }
   
})

function toogleRecord(){
    isRecording = !isRecording;
    
    if(isRecording){
        startRecording()
        mouseRecord.splice(0, mouseRecord.length)
        $recordBtn.className ="fas fa-square stop-btn "
        // $stopBtn.style.display = 'inline-block'
    }else{
        stopRecording()
        $recordBtn.className ="fas fa-circle record-btn "     
    }
}

function playMouse(ind, deltaTime = 0){
    if(ind < mouseRecord.length){
        setTimeout(()=>{
            $fakeCursor.style.transform = `translate(${mouseRecord[ind].x}px,${mouseRecord[ind].y}px)`;
            playMouse(ind+1, mouseRecord[ind].timeStart)
        },mouseRecord[ind].timeStart - deltaTime)
    }else{
        isPlaying = false;
        $.body.style.cursor = 'default'
        $recordBtn.style.cursor = 'pointer'

        // $playBtn.innerHTML = `PLAY`
        // $playBtn.className = 'play'
        $fakeCursor.style.transform = `translate(-50px,-50px)`;
    }
}


function playKeyboard(ind, deltaTime = 0){
    if(ind < keyRecord.length){
        setTimeout(()=>{
            $editorText.dispatchEvent(new KeyboardEvent('keydown',{'key':keyRecord[ind].key}));
            playKeyboard(ind+1, keyRecord[ind].timeStart)
        },keyRecord[ind].timeStart - deltaTime)
    }else{
        isPlaying = false;
        $.body.style.cursor = 'default'
        $recordBtn.style.cursor = 'pointer'

        // $playBtn.innerHTML = `PLAY`
        // $playBtn.className = 'play'
        $fakeCursor.style.transform = `translate(-50px,-50px)`;
    }
}





///// --------------------- OUTPUT --------------------
const $outputHTML = $.getElementById('outputHTML')

$editorText.addEventListener('input', (e)=>{
    $outputHTML.innerHTML = $editorText.value
})

/// -------------- PLAY DEMO ----------------

const $playDemo = $.getElementById('demo')

$playDemo.addEventListener('click', (e)=>{
    console.log('PLaying Demo')
    mouseRecord = demoMouseRecord
    keyRecord = demoKeyRecord
    $player.src = './data/demo.ogg'
    $player.play()
})