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
    addVideoStream(myVideo,stream)

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
    videoGrid.append(video)
}

function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',(userVideoStream)=>{
        addVideoStream(video,userVideoStream)
       
        console.log('hi');
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

// function addVideoStream(video,stream){
//     video.srcObject=stream
//     video.addEventListener('loadedmetadata',()=>{
//         video.play()
//     })
//     videoGrid.append(video)
// }

// function connectToNewUser(userId,stream){
//     const call =myPeer.call(userId,stream)
//     const video=document.createElement('video')
//     console.log('yues')
//     call.on('stream',userVideoStream=>{
        
//         addVideoStream(video,userVideoStream)
//     })
//     call.on('close',()=>{
//         video.remove()
//     })
// }



// })







