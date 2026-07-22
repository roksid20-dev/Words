// =========================
// WordFlow v0.1
// Основная логика приложения
// =========================


// Элементы страницы

const wordElement = document.getElementById("word");
const answerInput = document.getElementById("answer");
const checkButton = document.getElementById("check");
const resultElement = document.getElementById("result");

const importArea = document.getElementById("importWords");
const importButton = document.getElementById("importButton");


// Получаем слова из памяти браузера

let words = JSON.parse(
    localStorage.getItem("wordflow_words")
) || [];


// Текущее слово

let currentWord = null;


// Индекс

let currentIndex = 0;


// Если слов нет — добавляем примеры

if (words.length === 0) {

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



// Сохраняем слова

function saveWords(){

    localStorage.setItem(
        "wordflow_words",
        JSON.stringify(words)
    );

}



// Показываем слово

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



// Проверяем ответ

function checkAnswer(){

    const userAnswer =
        answerInput.value
        .trim()
        .toLowerCase();


    const correctAnswer =
        currentWord.russian
        .toLowerCase();



    if(userAnswer === correctAnswer){

        resultElement.textContent =
            "✅ Правильно!";


    } else {


        resultElement.textContent =
            "❌ Ответ: " +
            currentWord.russian;

    }



    setTimeout(()=>{


        currentIndex++;


        if(currentIndex >= words.length){

            currentIndex = 0;

        }


        showWord();


    },1200);



}



// Кнопка проверки

checkButton.addEventListener(
    "click",
    checkAnswer
);



// Enter отправляет ответ

answerInput.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            checkAnswer();

        }

    }
);



// Импорт слов

importButton.addEventListener(
    "click",
    function(){


        const text =
            importArea.value.trim();



        if(!text){

            return;

        }



        const lines =
            text.split("\n");



        lines.forEach(line=>{


            const parts =
                line.split("-");



            if(parts.length >= 2){


                words.push({

                    english:
                        parts[0]
                        .trim(),

                    russian:
                        parts[1]
                        .trim()

                });


            }


        });



        saveWords();


        importArea.value = "";


        alert(
            "Слова добавлены!"
        );


    }
);



// Запуск

showWord();
