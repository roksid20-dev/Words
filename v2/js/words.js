/*
WordFlow
words.js

Работа со списком слов:
- добавление
- отображение
- удаление
- редактирование
- поиск
*/


let words = loadWords();


const wordsList =
    document.getElementById(
        "wordsList"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );

const bulkInput =
    document.getElementById(
        "bulkInput"
    );

const bulkAddButton =
    document.getElementById(
        "bulkAddButton"
    );

const editWordSection =
    document.getElementById(
        "editWordSection"
    );


const editEnglishInput =
    document.getElementById(
        "editEnglishInput"
    );


const editRussianInput =
    document.getElementById(
        "editRussianInput"
    );


const saveEditButton =
    document.getElementById(
        "saveEditButton"
    );


const cancelEditButton =
    document.getElementById(
        "cancelEditButton"
    );

const toggleWordsButton =
    document.getElementById(
        "toggleWordsButton"
    );

let wordsHidden = false;
let editingId = null;




/**
 * Отображение слов
 */
function renderWords(list = words) {

    console.log(
    "renderWords вызван",
    list.length
);


    wordsList.innerHTML = "";


    if(list.length === 0){


        wordsList.innerHTML =
            `
            <div class="empty">
            Пока нет слов
            </div>
            `;


        return;

    }



    list.forEach(word => {


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "word-card";



        card.innerHTML =
            `

            <div class="word-text">

                <div class="english">
                    ${word.english}
                </div>

                <div class="russian">
                    ${word.russian}
                </div>

            </div>


            <div class="word-actions">

                <button onclick="editWord('${word.id}')">
                    ✏️
                </button>


                <button onclick="removeWord('${word.id}')">
                    🗑️
                </button>

            </div>

            `;



        wordsList.appendChild(card);


    });


}




/**
 * Добавление / сохранение изменений
 */

function addBulkWords(){

    const text =
        bulkInput.value.trim();

    if(!text){

        alert(
            "Введите список слов"
        );

        return;

    }

    const lines =
        text.split("\n");

    let added = 0;
    let skipped = 0;

    lines.forEach(line => {

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
        else if(line.includes(":")){

            parts =
                line.split(":");

        }

        else if(line.includes("\t")){

    parts =
        line.split("\t");
            
        }

        
        else{

            parts =
                line.split(/\s+/);

            if(parts.length >= 2){

                parts = [
                    parts[0],
                    parts.slice(1).join(" ")
                ];

            }

        }

        if(parts.length < 2){

            skipped++;

            return;

        }

        const english =
            parts[0].trim();

        const russian =
            parts.slice(1)
                 .join(" ")
                 .trim();

        const duplicate =
            words.some(word =>
                word.english.toLowerCase() === english.toLowerCase()
                &&
                word.russian.toLowerCase() === russian.toLowerCase()
            );

        if(duplicate){

            skipped++;

            return;

        }

        addWord(
            words,
            english,
            russian
        );

        added++;

    });

    bulkInput.value = "";

    renderWords();

    alert(
        `Добавлено: ${added}\nПропущено: ${skipped}`
    );

}




/**
 * Удаление слова
 */
function removeWord(id){


    deleteWord(
        words,
        id
    );


    renderWords();


}





/**
 * Редактирование слова
 */
function editWord(id){


    const word =
        words.find(
            w => w.id === id
        );


    if(!word){

        return;

    }


    editingId = id;


    editEnglishInput.value =
        word.english;


    editRussianInput.value =
        word.russian;


    editWordSection.style.display =
        "block";


}


function saveEditedWord(){


    if(!editingId){

        return;

    }


    const word =
        words.find(
            w => w.id === editingId
        );


    if(!word){

        return;

    }


    const english =
        editEnglishInput.value.trim();


    const russian =
        editRussianInput.value.trim();



    if(!english || !russian){

        alert(
            "Введите слово и перевод"
        );

        return;

    }



    word.english =
        english;


    word.russian =
        russian;



    saveWords(words);


    renderWords();


    editWordSection.style.display =
        "none";


    editingId = null;


}


/**
 * Поиск
 */
function search(){

    const result =
        searchWords(
            words,
            searchInput.value
        );

    renderWords(result);

}







bulkAddButton.addEventListener(
    "click",
    addBulkWords
);

saveEditButton.addEventListener(
    "click",
    saveEditedWord
);


cancelEditButton.addEventListener(
    "click",
    ()=>{

        editWordSection.style.display =
            "none";


        editingId = null;

    }
);

searchInput.addEventListener(
    "input",
    search
);

toggleWordsButton.addEventListener(
    "click",
    ()=>{


        wordsHidden =
            !wordsHidden;


        if(wordsHidden){


            wordsList.style.display =
                "none";


            toggleWordsButton.textContent =
                "Показать";


        }
        else{


            wordsList.style.display =
                "block";


            toggleWordsButton.textContent =
                "Скрыть";


        }


    }
);

bulkInput.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Enter"
            &&
            !event.shiftKey
        ){

            event.preventDefault();

            addBulkWords();

        }

    }
);



renderWords();
