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



    /*
    Чем ниже уровень,
    тем чаще повторяем
    */

    priority +=
        (5 - word.level);



    /*
    Ошибки увеличивают важность
    */

    priority +=
        word.stats.enRu.wrong +
        word.stats.ruEn.wrong;



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



    const weighted = [];



    available.forEach(word => {


        let weight = 1;



        weight +=
            (5 - word.level);



        weight +=
            word.stats.enRu.wrong +
            word.stats.ruEn.wrong;



        if(word.level >= 5){

            weight = 1;

        }



        for(
            let i = 0;
            i < weight;
            i++
        ){

            weighted.push(word);

        }


    });



    const word =
        weighted[
            Math.floor(
                Math.random()
                *
                weighted.length
            )
        ];



    lastWordId =
        word.id;



    return word;


}
