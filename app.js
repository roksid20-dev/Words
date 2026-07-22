// =========================
// WordFlow v0.2
// Управление словами
// =========================


const wordElement = document.getElementById("word");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("check");
const resultElement = document.getElementById("result");

const importArea = document.getElementById("importWords");
const importButton = document.getElementById("importButton");

const wordsList = document.getElementById("wordsList");
const searchInput = document.getElementById("searchWords");

const editModal = document.getElementById("editModal");

const editEnglish = document.getElementById("editEnglish");

const editRussian = document.getElementById("editRussian");

const saveEditButton = document.getElementById("saveEdit");

const cancelEditButton = document.getElementById("cancelEdit");


let editingIndex = null;


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



// =========================
// Обучение
// =========================


function showWord(){

    if(words.length === 0){

        wordElement.textContent =
            "Нет слов";

        return;

    }


    currentWord =
        words[currentIndex];


    wordElement.textContent =
        currentWord.english;


    answerInput.value = "";

    resultElement.textContent = "";

    answerInput.focus();

}



function checkAnswer(){


    const answer =
        answerInput.value
        .trim()
        .toLowerCase();


    const correct =
        currentWord.russian
        .trim()
        .toLowerCase();



    if(answer === correct){

        resultElement.textContent =
            "✅ Правильно!";


    } else {


        resultElement.textContent =
            "❌ Ответ: " + currentWord.russian;

    }



    setTimeout(()=>{


        currentIndex++;


        if(currentIndex >= words.length){

            currentIndex = 0;

        }


        showWord();


    },1200);


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



        lines.forEach(line=>{


            const parts =
                line.split("-");



            if(parts.length >= 2){


                words.push({

                    english:
                        parts[0].trim(),

                    russian:
                        parts[1].trim()

                });


            }


        });



        saveWords();


        renderWords();


        importArea.value = "";


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

// старт

renderWords();

showWord();
