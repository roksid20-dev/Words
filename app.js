// =========================
// WordFlow v0.2
// Управление словами
// =========================

let trainingStarted = false;


let trainingWords = [];

let currentDirection = "en-ru";


const wordElement = document.getElementById("word");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("check");
const difficultyButtons =
    document.getElementById("difficultyButtons");


const hardButton =
    document.getElementById("hard");


const normalButton =
    document.getElementById("normal");


const easyButton =
    document.getElementById("easy");
const resultElement = document.getElementById("result");

const importArea = document.getElementById("importWords");
const importButton = document.getElementById("importButton");

const wordsList = document.getElementById("wordsList");
const searchInput = document.getElementById("searchWords");
const wordCount =
    document.getElementById("wordCount");
const reviewCount =
    document.getElementById("reviewCount");


const newCount =
    document.getElementById("newCount");

const editModal = document.getElementById("editModal");

const editEnglish = document.getElementById("editEnglish");

const editRussian = document.getElementById("editRussian");

const saveEditButton = document.getElementById("saveEdit");

const cancelEditButton = document.getElementById("cancelEdit");

const smartMode =
    document.getElementById("smartMode");


const freeMode =
    document.getElementById("freeMode");
const startTrainingButton =
document.getElementById(
    "startTraining"
);


const stopTrainingButton =
document.getElementById(
    "stopTraining"
);


let editingIndex = null;
let trainingMode =
    "smart";


// Получаем слова

let words = JSON.parse(
    localStorage.getItem("wordflow_words")
) || [];

// Добавляем новые параметры старым словам

words = words.map(word => {

    return {

        ...word,

        level:
            word.level ?? 0,

        nextReview:
            word.nextReview ??
            new Date().toISOString(),

        correctAnswers:
            word.correctAnswers ?? 0,

        mistakes:
            word.mistakes ?? 0

    };

});


saveWords();

// текущее слово

let currentWord = null;

let currentIndex = 0;



// Если база пустая

if(words.length === 0){

    words = [
        {
            english: "abandon",
            russian: "покидать"
        },

        {
            english: "approach",
            russian: "подход"
        },

        {
            english: "yield",
            russian: "уступать"
        }
    ];


    saveWords();

}



// сохранение

function saveWords(){

    localStorage.setItem(
        "wordflow_words",
        JSON.stringify(words)
    );

}

function updateStats(){

    if(wordCount){

        wordCount.textContent =
            words.length;

    }

}

function updateTodayStats(){


    const todayWords =
        getTodayWords(words);



    if(reviewCount){

        reviewCount.textContent =
            todayWords.length;

    }



    if(newCount){

        newCount.textContent =
            words.filter(
                word =>
                word.level === 0
            ).length;

    }


}

// =========================
// Обучение
// =========================

function chooseDirection(word){


    let chance;


    if(word.level <= 1){

        chance = 0.2;

    }
    else if(word.level <= 3){

        chance = 0.5;

    }
    else {

        chance = 0.7;

    }



    if(Math.random() < chance){

        return "ru-en";

    }
    else {

        return "en-ru";

    }

}
function showWord(){


    if(!trainingStarted){

        return;

    }


    if(trainingWords.length === 0){


        wordElement.textContent =
            "Нет слов для тренировки";


        return;

    }



    currentWord =
        trainingWords[
            currentIndex %
            trainingWords.length
        ];
    currentDirection =
    chooseDirection(currentWord);



    if(currentDirection === "en-ru"){


    wordElement.textContent =
        currentWord.english;


}
else {


    wordElement.textContent =
        currentWord.russian;


}



    answerInput.value =
        "";



    resultElement.textContent =
        "";


    answerInput.focus();


}


function checkAnswer(){


    const answer =
    answerInput.value
    .trim()
    .toLowerCase();



let correct;



if(currentDirection === "en-ru"){


    correct =
        currentWord.russian
        .trim()
        .toLowerCase();


}
else {


    correct =
        currentWord.english
        .trim()
        .toLowerCase();


}



    if(answer === correct){


        resultElement.textContent =
            "✅ Правильно!";


        markCorrect(currentWord);

        saveWords();


    } else {


        resultElement.textContent =
            "❌ Ответ: " + currentWord.russian;


        markWrong(currentWord);

        saveWords();


    }


    difficultyButtons.style.display =
        "block";


}
// =========================
// Список слов
// =========================


function renderWords(filter = ""){


    wordsList.innerHTML = "";



    words
    .filter(word => {


        const text =
            (
                word.english +
                " " +
                word.russian
            )
            .toLowerCase();


        return text.includes(
            filter.toLowerCase()
        );


    })
    .forEach((word,index)=>{


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "word-item";



        item.innerHTML = `

        <div class="word-info">

            <strong>
            ${word.english}
            </strong>

            <span>
            ${word.russian}
            </span>

        </div>


        <div class="word-actions">

            <button
            class="edit-btn"
            onclick="editWord(${index})">
            ✏️
            </button>


            <button
            class="delete-btn"
            onclick="deleteWord(${index})">
            🗑
            </button>

        </div>

        `;


        wordsList.appendChild(item);


    });


}



// удалить слово

function deleteWord(index){


    const confirmDelete =
        confirm(
            "Удалить это слово?"
        );


    if(confirmDelete){


        words.splice(index,1);


        saveWords();

        renderWords();


    }

}



// изменить слово

function editWord(index){


    const word = words[index];


    editingIndex = index;


    editEnglish.value =
        word.english;


    editRussian.value =
        word.russian;



    editModal.style.display =
        "flex";

}


// =========================
// Импорт
// =========================


importButton.addEventListener(
    "click",
    ()=>{


        const text =
            importArea.value.trim();



        if(!text) return;



        const lines =
            text.split("\n");



        let added = 0;

        let skipped = 0;



        lines.forEach(line=>{


            line = line.trim();



            if(!line){
                return;
            }



            let parts;



            if(line.includes("-")){


                parts =
                    line.split("-");


            } 
            else if(line.includes(";")){


                parts =
                    line.split(";");


            }
            else {


                parts =
                    line.split(/\s+/);

            }



            if(parts.length < 2){

                return;

            }



            const english =
                parts[0]
                .trim();



            const russian =
                parts
                .slice(1)
                .join(" ")
                .trim();



            const exists =
                words.some(
                    word =>
                    word.english
                    .toLowerCase()
                    ===
                    english
                    .toLowerCase()
                );



            if(exists){


                skipped++;


            }
            else {


                words.push({

                    english,

                    russian,

                    level:0,

                    nextReview:
                    new Date()
                    .toISOString(),

                    correctAnswers:0,

                    mistakes:0

                });



                added++;


            }



        });



        saveWords();

        renderWords();

        updateStats();



        importArea.value = "";



        alert(

            "Добавлено: "
            + added
            +
            "\nПропущено дублей: "
            + skipped

        );


    }
);




// =========================
// События
// =========================


checkButton.addEventListener(
    "click",
    checkAnswer
);



answerInput.addEventListener(
    "keydown",
    e=>{

        if(e.key==="Enter"){

            checkAnswer();

        }

    }
);



searchInput.addEventListener(
    "input",
    ()=>{

        renderWords(
            searchInput.value
        );

    }
);



saveEditButton.addEventListener(
    "click",
    ()=>{


        if(editingIndex === null){
            return;
        }


        words[editingIndex].english =
            editEnglish.value.trim();


        words[editingIndex].russian =
            editRussian.value.trim();



        saveWords();

        renderWords();


        editModal.style.display =
            "none";


        editingIndex = null;


    }
);



cancelEditButton.addEventListener(
    "click",
    ()=>{


        editModal.style.display =
            "none";


        editingIndex = null;


    }
);
    function nextWord(){


    difficultyButtons.style.display =
        "none";


    currentIndex++;


    const todayWords =
        getTodayWords(words);



    if(currentIndex >= todayWords.length){

        currentIndex = 0;

    }


    showWord();


}
    hardButton.addEventListener(
    "click",
    ()=>{


        markWrong(currentWord);

        saveWords();

        nextWord();


    }
);



normalButton.addEventListener(
    "click",
    ()=>{


        markCorrect(currentWord);

        saveWords();

        nextWord();


    }
);



easyButton.addEventListener(
    "click",
    ()=>{


        currentWord.level += 2;


        if(currentWord.level > 5){

            currentWord.level = 5;

        }


        markCorrect(currentWord);


        saveWords();

        nextWord();


    }
);

smartMode.addEventListener(
    "change",
    ()=>{

        if(smartMode.checked){

            trainingMode =
                "smart";

        }


        if(trainingStarted){

            stopTraining();

        }

    }
);



freeMode.addEventListener(
    "change",
    ()=>{

        if(freeMode.checked){

            trainingMode =
                "free";

        }


        if(trainingStarted){

            stopTraining();

        }

    }
);
function startTraining(){


    trainingStarted = true;


    if(trainingMode === "smart"){


        trainingWords =
            getTodayWords(words);


    }
    else {


        trainingWords =
            getFreeWords(words);
        console.log(
    "Слов для тренировки:",
    trainingWords.length
);


    }


    currentIndex = 0;


    startTrainingButton.style.display =
        "none";


    stopTrainingButton.style.display =
        "block";


    showWord();


}



function stopTraining(){


    trainingStarted = false;


    trainingWords = [];


    currentIndex = 0;



    stopTrainingButton.style.display =
        "none";


    startTrainingButton.style.display =
        "block";



    difficultyButtons.style.display =
        "none";



    wordElement.textContent =
        "Тренировка завершена 🎉";


    answerInput.value =
        "";


    resultElement.textContent =
        "";

}

startTrainingButton.addEventListener(
    "click",
    startTraining
);


stopTrainingButton.addEventListener(
    "click",
    stopTraining
);
// старт

renderWords();

showWord();

updateStats();

updateTodayStats();
