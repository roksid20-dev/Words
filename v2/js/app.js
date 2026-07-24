/*
WordFlow
app.js

Главная точка запуска приложения.
*/


console.log(
    "WordFlow запущен"
);


/*
Проверяем,
что основные модули подключены
*/


if(
    typeof loadWords !== "function" ||
    typeof createWord !== "function"
){

    console.error(
        "Ошибка: модули WordFlow не загружены"
    );

}



/*
Первичная инициализация
*/


function initApp(){


    console.log(
        "Слов в базе:",
        words.length
    );


    renderWords();


    updateWordsStats();


}



initApp();

function updateWordsStats(){

    let learned = 0;
    let learning = 0;
    let newWords = 0;


    words.forEach(
        word => {


            const enRu =
                word.review.enRu.level;


            const ruEn =
                word.review.ruEn.level;



            if(
                enRu >= 5 &&
                ruEn >= 5
            ){

                learned++;

            }
            else if(
                enRu > 0 ||
                ruEn > 0
            ){

                learning++;

            }
            else {

                newWords++;

            }


        }
    );



    document
        .getElementById(
            "totalWords"
        )
        .textContent =
            words.length;



    document
        .getElementById(
            "learnedWords"
        )
        .textContent =
            learned;



    document
        .getElementById(
            "learningWords"
        )
        .textContent =
            learning;



    document
        .getElementById(
            "newWords"
        )
        .textContent =
            newWords;


}
