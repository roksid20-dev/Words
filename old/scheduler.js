// =============================
// WordFlow Scheduler v0.3
// Алгоритм повторений
// =============================



const DAILY_LIMIT = 30;



// Получаем сегодняшнюю дату
function today(){

    return new Date()
        .toISOString()
        .split("T")[0];

}




// Проверяем, пора ли повторять слово

function isDue(word){


    const currentDate =
        today();


    const reviewDate =
        word.nextReview
        ?.split("T")[0];



    return (
        !reviewDate ||
        reviewDate <= currentDate
    );

}





// Получаем слова на сегодня

function getTodayWords(words){


    const dueWords =
        words.filter(
            word =>
            isDue(word)
        );



    return dueWords
        .slice(
            0,
            DAILY_LIMIT
        );

}





// Интервалы

function getInterval(level){


    const intervals = [

        0,

        1,

        3,

        7,

        14,

        30

    ];


    return (
        intervals[level]
        ??
        30
    );

}





// Успешный ответ

function markCorrect(word){


    word.correctAnswers++;


    if(word.level < 5){

        word.level++;

    }


    const days =
        getInterval(
            word.level
        );


    const date =
        new Date();


    date.setDate(
        date.getDate()
        +
        days
    );


    word.nextReview =
        date.toISOString();

}





// Ошибка

function markWrong(word){


    word.mistakes++;


    word.level = 0;


    const date =
        new Date();


    date.setDate(
        date.getDate()
        +
        1
    );


    word.nextReview =
        date.toISOString();

}


// =============================
// Свободная тренировка
// =============================


function getFreeWords(words){


    return [...words].sort(
        (a,b)=>{


            const scoreA =
                getDifficultyScore(a);


            const scoreB =
                getDifficultyScore(b);



            return scoreB - scoreA;


        }
    );

}




function getDifficultyScore(word){


    let score = 0;



    // ошибки важнее всего

    score +=
        word.mistakes * 5;



    // низкий уровень = сложнее

    score +=
        (5 - word.level);



    // давно не повторяли

    if(word.nextReview){


        const review =
            new Date(
                word.nextReview
            );


        const now =
            new Date();



        const days =
            Math.floor(
                (
                    now - review
                )
                /
                86400000
            );



        if(days > 0){

            score += days;

        }


    }



    return score;


}
