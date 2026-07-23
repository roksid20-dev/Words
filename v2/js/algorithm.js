/*
WordFlow
algorithm.js

Логика выбора слов для тренировки
*/


let lastWordId = null;



let lastDirection = null;




/**
 * Выбирает слова для умной тренировки
 */
function getSmartWords(words) {


    const now =
        new Date();



    return [...words]
        .sort(
            (a,b)=>{


                return (
                    calculatePriority(b)
                    -
                    calculatePriority(a)
                );


            }
        );


}





/**
 * Свободная тренировка
 *
 * Все слова,
 * но перемешанные
 */
function getFreeWords(words){


    return [...words]
        .sort(
            ()=>Math.random()-0.5
        );


}





/**
 * Приоритет слова
 */
function calculatePriority(word){


    let priority = 0;



    const now =
        new Date();


    const review =
        new Date(
            word.nextReview
        );



    /*
    Просроченные слова
    */

    if(review <= now){

        priority += 10;

    }



    /*
    Ошибки
    */

    priority +=
        word.stats.enRu.wrong * 5;


    priority +=
        word.stats.ruEn.wrong * 5;



    /*
    Новые слова
    */

    if(word.level === 0){

        priority += 8;

    }



    /*
    Чем ниже уровень,
    тем важнее
    */

    priority +=
        (5 - word.level);



    return priority;


}





/**
 * Выбор направления
 *
 * en-ru
 * ru-en
 */
function chooseDirection(word){


    const enRuMistakes =
        word.stats.enRu.wrong;


    const ruEnMistakes =
        word.stats.ruEn.wrong;



    if(
        enRuMistakes >
        ruEnMistakes
    ){

        return "en-ru";

    }



    if(
        ruEnMistakes >
        enRuMistakes
    ){

        return "ru-en";

    }



    /*
    если одинаково —
    случайно
    */

    return Math.random() < 0.5
        ? "en-ru"
        : "ru-en";


}





/**
 * Берём следующее слово
 */
function getNextWord(words){


    if(words.length === 0){

        return null;

    }



    let available =
        words.filter(
            word =>
            word.id !== lastWordId
        );



    if(available.length === 0){

        available = words;

    }



    /*
    Сортируем по важности
    */

    available.sort(
        (a,b)=>
            calculatePriority(b)
            -
            calculatePriority(a)
    );



    /*
    Берём первые самые важные,
    но добавляем немного случайности
    */

    const topWords =
        available.slice(
            0,
            Math.min(
                3,
                available.length
            )
        );



    const word =
        topWords[
            Math.floor(
                Math.random()
                *
                topWords.length
            )
        ];



    lastWordId =
        word.id;



    return word;


}
