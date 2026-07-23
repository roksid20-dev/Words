console.log("training.js загружен");

/*
WordFlow
training.js

Логика тренировки
*/


let trainingActive = false;

let trainingWords = [];

let currentWord = null;

let currentDirection = null;





const wordElement =
    document.getElementById(
        "wordElement"
    );


const answerInput =
    document.getElementById(
        "answerInput"
    );


const checkButton =
    document.getElementById(
        "checkButton"
    );


const resultElement =
    document.getElementById(
        "resultElement"
    );



/**
 * Начать тренировку
 */
function startTraining(){


    trainingActive = true;


    resetTrainingMemory();


    trainingWords =
        getSmartWords(words);



    nextTrainingWord();

}





/**
 * Следующее слово
 */
function nextTrainingWord(){


    if(!trainingActive){

        return;

    }



    currentWord =
        getNextWord(
            trainingWords
        );



    if(!currentWord){

        wordElement.textContent =
            "Нет слов";

        return;

    }



    currentDirection =
        chooseDirection(
            currentWord
        );



    if(
        currentDirection === "en-ru"
    ){

        wordElement.textContent =
            currentWord.english;

    }
    else {


        wordElement.textContent =
            currentWord.russian;

    }



    answerInput.value = "";

    resultElement.textContent = "";

    answerInput.focus();


}





/**
 * Проверка ответа
 */
function checkAnswer(){


    if(!currentWord){

        return;

    }



    const answer =
        answerInput.value
        .trim()
        .toLowerCase();



    const correct =

        currentDirection === "en-ru"

        ?

        currentWord.russian

        :

        currentWord.english;



    if(
        answer ===
        correct.toLowerCase()
    ){


        resultElement.textContent =
            "✅ Правильно";


        markCorrect(
            currentWord,
            currentDirection
        );


    }
    else {


        resultElement.textContent =
            "❌ " +
            correct;


        markWrong(
            currentWord,
            currentDirection
        );


    }



        saveWords(words);
    setTimeout(
    ()=>{
        nextTrainingWord();
    },
    1000
);


    setTimeout(
        ()=>{

            nextTrainingWord();

        },
        1000
    );


}





/**
 * Правильный ответ
 */
function markCorrect(
    word,
    direction
){


    word.stats[direction].correct++;


    if(word.level < 5){

        word.level++;

    }



    word.nextReview =
        new Date(
            Date.now()
            +
            24*60*60*1000
        )
        .toISOString();



}




/**
 * Ошибка
 */
function markWrong(
    word,
    direction
){


    word.stats[direction].wrong++;


    if(word.level > 0){

        word.level--;

    }



    word.nextReview =
        new Date()
        .toISOString();


}





/**
 * Завершить тренировку
 */
function stopTraining(){


    trainingActive = false;


    currentWord = null;


    wordElement.textContent =
        "";


    resultElement.textContent =
        "";


}

document
    .getElementById(
        "startTrainingButton"
    )
    .addEventListener(
        "click",
        startTraining
    );


checkButton.addEventListener(
    "click",
    checkAnswer
);
