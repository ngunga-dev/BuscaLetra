const form=document.querySelector('#form')
const searchInput=document.querySelector('#search')
const songsContainer=document.querySelector('#songs-container')
const prevAndNextContainer=document.querySelector('#prev-and-next-container')

const apiUrl=`https://api.lyrics.ovh/`

const getMoreSongs = async url=>{
    const response= await fetch(`https://robwu.nl/cors-anywhere.html${url}`)
    const data= await response.json()
    console.log(data);
    insertSongdIntoPages(data)
}

const insertSongdIntoPages=songsInfos=>{

   /* console.log(songsInfos.data.map(song=>`<li>${song.title}</li>`).join(''))*/
  songsContainer.innerHTML=songsInfos.data.map(song=>`
    <li class="song">
        <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}"  data-song-title="${song.title}">Ver Letra</button>
        <li>
    `).join('')

    if(songsInfos.prev || songsInfos.next){
        prevAndNextContainer.innerHTML=`
         ${songsInfos.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfos.prev}')">Anteriores</button>`: ''}
         ${songsInfos.next ? `<button class="btn" onClick="getMoreSongs('${songsInfos.next}')">Proximas</button>`: ''}
        `
        return
    }
    prevAndNextContainer.innerHTML=''

}

const fetchSongs= async term=>{
    const response= await fetch(`${apiUrl}/suggest/${term}`)
    const data= await response.json()
 
    insertSongdIntoPages(data)
}

form.addEventListener('submit',event=>{
    event.preventDefault();

    const searchTerm=searchInput.value.trim()

    if(!(searchTerm)){
        songsContainer.innerHTML=`<li class="warning-message">
        Por favor, digite um termo valido!</li>`
        return
    }
    fetchSongs(searchTerm)
})

const fetchLyrcs=async(artist,songTitle)=>{
    const response=await fetch(`${apiUrl}/v1/${artist}/${songTitle}`)
    const data=await response.json()
    

    songsContainer.innerHTML=`
    <li class="lyrics-container">
        <h2><strong>${songTitle}</strong> - ${artist}</h2> 
        <p class="lyrics">${data.lyrics}</p>  
    </li>
    `
}

songsContainer.addEventListener('click',event=>{
    const clickdElement=event.target


    if(clickdElement.tagName==='BUTTON'){
        const artist=clickdElement.getAttribute('data-artist')
        const songTitle=clickdElement.getAttribute('data-song-title')

        fetchLyrcs(artist,songTitle)
    }
})


