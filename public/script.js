const socket=io('/')
const videoGrid=document.querySelector('#video-grid')

console.log(videoGrid)

const myPeer= new Peer(undefined,{
    host:'/',
    port:'3001'
})

const peers={}

const myVideo=document.createElement('video')
myVideo.muted=true

myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    // addVideoStream(myVideo,stream)
    myVideo.srcObject=stream;
    myVideo.addEventListener('loadedmetadata',()=>{
        myVideo.play()
    })
    document.querySelector('#center-div').append(myVideo)

    myPeer.on('call',call=>{
        call.answer(stream)

        const video=document.createElement('video')

        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
        call.on('close', () => {
            video.remove();
            removePeer(call.peer);
        });
    })

    socket.on('user-connected',userId=>{
        setTimeout(() => {
            connectToNewUser(userId, stream);
        }, 1000);
    })
})


function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    // const newDiv = document.createElement('div');
    // newDiv.classList.add('side-div');
    // newDiv.append(video)
    // newDiv.addEventListener('click', replaceCenterDiv);
    // video.addEventListener('click', replaceCenterDiv);
    video.classList.add('side-div')
    video.addEventListener('click', replaceCenterDiv);
    videoGrid.append(video)
    console.log('hi')
}

function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    
    call.on('stream',(userVideoStream)=>{
        if(userVideoStream)
        addVideoStream(video,userVideoStream)
       
        // console.log('hi');
    })
    call.on('close',()=>{
        video.remove();
        removePeer(userId);
    })

    peers[userId]=call
}

function removePeer(userId) {
    if (peers[userId]) {
        peers[userId].close();
        delete peers[userId];
    }
}

socket.on('user-disconnected',userId=>{
    if(peers[userId])
    {
        peers[userId].close()
        console.log(userId);
    }
})

    
    
    function replaceCenterDiv() {
        const centerVideo = document.querySelector('#center-div video');
        if(this.srcObject!=centerVideo.srcObject)
        {
        const tempContent = this.srcObject
        this.srcObject = centerVideo.srcObject;
        centerVideo.srcObject = tempContent;
        
        }
    }

    // function addSideDiv(videoSrc) {
    //     const newDiv = document.createElement('div');
    //     newDiv.classList.add('side-div');

    //     const videoElement = document.createElement('video');
    //     // videoElement.src = videoSrc;
    //     // videoElement.controls = true;

    //     newDiv.appendChild(videoElement);
    //     const para=document.createElement('p')
    //     para.textContent='hi'
    //     newDiv.appendChild(para)
    //     newDiv.addEventListener('click', replaceCenterDiv);
    //     sideDivsContainer.appendChild(newDiv);
    // }

    // const schedulesButton = document.getElementById('schedulesButton');
    // const flashcardsButton = document.getElementById('flashcardsButton');
    // schedulesButton.addEventListener('click', function() {
    //     addSideDiv('video1.mp4'); // Provide the video source here
    // });
    // flashcardsButton.addEventListener('click', function() {
    //     addSideDiv('video2.mp4'); // Provide the video source here
    // });









