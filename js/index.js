const container = document.querySelector("body > div"),
searchInput = document.querySelector("input"),
textInfo = document.querySelector("body > div > p"),
resultDiv = document.querySelector("body > div > ul"),
synonymsText = document.querySelector(".synonyms .list"),
cancelIcon = document.querySelector(".fa-close"),
audioIcon = document.querySelector(".word i");
let audio ;

function data(result, word){
    console.log(result)
    textInfo.classList.remove("text-danger")
    if (result.title == `No Definitions Found`){
        textInfo.classList.remove("d-none");
        resultDiv.classList.remove("active");
        textInfo.classList.add('text-danger');
        textInfo.innerHTML=`Can't find the meaning of <b>"${word}"</b>. Please, try to search for another Word <i class="fa fa-exclamation"></i>`;
    }
    else {
        textInfo.classList.add("d-none");
        resultDiv.classList.add("active");

        let definitions = result[0].meanings[3].definitions,
        phonetic = `${result[0].meanings[3].partOfSpeech} <b>${result[0].phonetics[1].text}</b>`,
        synonyms = result[0].meanings[2].synonyms;

        // Let's pass the particular response data to a particular html element
        document.querySelector(".word p").innerText = `${result[0].word}` ;
        
        if (result[0].meanings[3].partOfSpeech == undefined){ 
            document.querySelector(".word").parentElement.style.display = "none";// if there no example exists then it hides
        }else {
            document.querySelector(".word span").innerHTML = `<span class="text-muted small">${phonetic}</span>`;
        }
        
        if (definitions[0] == undefined){ 
            document.querySelector(".meaning").parentElement.style.display = "none";// if there no example exists then it hides
        }else {
            document.querySelector(".meaning span").innerText = definitions[0].definition ;
        }
        
        if (definitions[0].example == undefined){
            document.querySelector(".example").parentElement.style.display = "none";// if there no example exists then it hides
        }else{
            document.querySelector(".example span").innerText = definitions[0].example ;
        }

        audio = new Audio(result[0].phonetics[0].audio);

        if (synonyms[0] == undefined){ // if there no synonyms exists then it hides
            synonymsText.parentElement.style.display = "none";
        }
        else {
            synonymsText.parentElement.style.display = "block";
            synonymsText.innerHTML = "";
            for (let i = 0; i < 5; i++ ){ // only 5 synonyms
                let tag = `<span onclick=search('${synonyms[i]}')>${synonyms[i]}, </span>`
                synonymsText.insertAdjacentHTML("beforeend",tag);
            }
        }
    }
}

// search synonyms function
function search (synonmsWord) {
    searchInput.value = synonmsWord;
    fetchApi(synonmsWord)
}

function fetchApi(word) {
    resultDiv.classList.remove("active");
    textInfo.classList.remove("text-muted")
    textInfo.innerHTML = `searching the meaning of <b>"${word}"</b>`;
    let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    fetch(apiUrl).then(res => res.json()).then(result => data(result, word));
}   

searchInput.addEventListener("keyup" , (e) =>{
    if (e.key == "Enter" && e.target.value){  //if input is empty it won't show in console
        fetchApi(e.target.value);
    }
})

audioIcon.onplay = () => {
    audioIcon.classList.remove("text-muted");
    audioIcon.classList.add("text-danger"); // Change color to red (or another desired color)
};

audioIcon.addEventListener("click", () => {
    if (!audio.paused){
        audio.pause();
        audioIcon.classList.add("text-muted");
        audioIcon.classList.remove("text-danger");
    }
    else{
        audio.play();
        audioIcon.classList.remove("text-muted");
        audioIcon.classList.add("text-danger");
    }
    
    setTimeout(() => {
        audioIcon.classList.add("text-muted");
    }, "2000");
})

cancelIcon.addEventListener("click" , () => {
    searchInput.value = "";
    searchInput.focus();
    resultDiv.classList.remove("active");
    textInfo.classList.add("text-muted")
    textInfo.innerHTML = `Type a word and press enter to get meaning example, pronunciation and synonyms of that typed word.`;
})