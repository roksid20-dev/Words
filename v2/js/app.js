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


}



initApp();
