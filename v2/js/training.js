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

let trainingMode = "smart";

let trainingCount = 10;

let trainingCorrect = 0;

let trainingWrong = 0;

let trainingCurrent = 0;


const wordElement =
    document.getElementById(
        "wordElement"
    );


const answerInput =
    document.getElementById(
        "answerInput"
    );
answerInput.addEventListener(
    "keydown",
    function(event){


        if(event.key === "Enter"){

            checkAnswer();

        }


    }
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
    const mode =
    document.querySelector(
        'input[name="trainingMode"]:checked'
    ).value;


const count =
    document.querySelector(
        'input[name="trainingCount"]:checked'
    ).value;


trainingMode = mode;


trainingCount =
    count === "all"
        ? null
        : Number(count);
    console.log(
    "Режим:",
    trainingMode,
    "Количество:",
    trainingCount
);


    trainingActive = true;
    
trainingCorrect = 0;

trainingWrong = 0;

trainingCurrent = 0;



    if(trainingMode === "quick"){


    trainingWords =
        getQuickWords(words);


}
else if(trainingMode === "all"){


    trainingWords =
        getAllWords(words);


}
else{


    trainingWords =
        getSmartWords(words);


}



if(
    trainingCount !== null
){

    trainingWords =
        trainingWords.slice(
            0,
            trainingCount
        );

}
trainingCorrect = 0;

trainingWrong = 0;

trainingCurrent = 0;


updateTrainingProgress();
    

console.log(
    "Слова в тренировке:",
    trainingWords.length
);


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
    console.log(
    "Следующее слово:",
    currentWord
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
    
    currentWord =
    words.find(
        word =>
        word.id === currentWord.id
    );


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
        updateReview(
    currentWord,
    currentDirection === "en-ru"
        ? "enRu"
        : "ruEn",
    true
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
        updateReview(
    currentWord,
    currentDirection === "en-ru"
        ? "enRu"
        : "ruEn",
    false
);


    }



       saveWords(words);


setTimeout(
    ()=>{

        answerInput.value = "";

        nextTrainingWord();

        answerInput.focus();

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

    const key =
        direction === "en-ru"
        ?
        "enRu"
        :
        "ruEn";


    const review =
        word.review[key];


    word.stats[key].correct++;


    if(review.level < 5){

        review.level++;

    }


    const intervals = [
        0,
        1,
        3,
        7,
        14,
        30
    ];


    const days =
        intervals[review.level];


    review.nextReview =
        new Date(
            Date.now()
            +
            days *
            24 *
            60 *
            60 *
            1000
        )
        .toISOString();


    trainingCorrect++;

    trainingCurrent++;

    updateTrainingProgress();

}


/**
 * Ошибка
 */
function markWrong(
    word,
    direction
){


    const key =
        direction === "en-ru"
        ?
        "enRu"
        :
        "ruEn";



    word.stats[key].wrong++;



    if(word.level > 0){

        word.level--;

    }



    word.nextReview =
        new Date()
        .toISOString();

    trainingCorrect++;
    trainingCurrent++;
    updateTrainingProgress();


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

function updateTrainingProgress(){


    document.getElementById(
        "trainingCurrent"
    ).textContent =
        trainingCurrent;



    document.getElementById(
        "trainingTotal"
    ).textContent =
        trainingWords.length;



    document.getElementById(
        "trainingCorrect"
    ).textContent =
        trainingCorrect;



    document.getElementById(
        "trainingWrong"
    ).textContent =
        trainingWrong;



    document.getElementById(
        "trainingLeft"
    ).textContent =
        Math.max(
            trainingWords.length - trainingCurrent,
            0
        );


}
