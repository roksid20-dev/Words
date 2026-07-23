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



const englishInput =
    document.getElementById(
        "englishInput"
    );


const russianInput =
    document.getElementById(
        "russianInput"
    );


const addWordButton =
    document.getElementById(
        "addWordButton"
    );


const wordsList =
    document.getElementById(
        "wordsList"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );



let editingId = null;




/**
 * Отображение слов
 */
function renderWords(list = words) {


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
function addOrUpdateWord(){


    const english =
        englishInput.value.trim();


    const russian =
        russianInput.value.trim();



    if(!english || !russian){

        alert(
            "Введите слово и перевод"
        );

        return;

    }



    if(editingId){


        updateWord(
            words,
            editingId,
            english,
            russian
        );


        editingId = null;



        addWordButton.textContent =
            "Добавить";


    }
    else {


    const duplicate =
        words.some(word =>
            word.english.toLowerCase() === english.toLowerCase()
            &&
            word.russian.toLowerCase() === russian.toLowerCase()
        );


    if(duplicate){

        alert(
            "Такое слово уже есть"
        );

        return;

    }


console.log(
    "После добавления:",
    words
);
    addWord(
        words,
        english,
        russian
    );


}


        addWord(
            words,
            english,
            russian
        );


    }



    englishInput.value = "";

    russianInput.value = "";


    renderWords();







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



    englishInput.value =
        word.english;


    russianInput.value =
        word.russian;



    editingId = id;



    addWordButton.textContent =
        "Сохранить";


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





addWordButton.addEventListener(
    "click",
    addOrUpdateWord
);



searchInput.addEventListener(
    "input",
    search
);




renderWords();
