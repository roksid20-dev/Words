/*
 * WordFlow
 * storage.js
 *
 * Загрузка и сохранение слов
 */

const STORAGE_KEY = "wordflow_words";

/**
 * Загружает слова
 */
function loadWords() {

    try {

        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const words = JSON.parse(raw);

        return upgradeWords(words);

    } catch (error) {

        console.error("Ошибка загрузки:", error);

        return [];

    }

}

/**
 * Сохраняет слова
 */
function saveWords(words) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(words)
        );

        return true;

    } catch (error) {

        console.error("Ошибка сохранения:", error);

        return false;

    }

}

/**
 * Добавляет новое слово
 */
function addWord(words, english, russian) {

    const word = createWord(
        english,
        russian
    );

    words.push(word);

    saveWords(words);

    return word;

}

/**
 * Удаляет слово
 */
function deleteWord(words, id) {

    const index = words.findIndex(
        word => word.id === id
    );

    if (index === -1) {

        return false;

    }

    words.splice(index, 1);

    saveWords(words);

    return true;

}

/**
 * Редактирует слово
 */
function updateWord(
    words,
    id,
    english,
    russian
) {

    const word = words.find(
        word => word.id === id
    );

    if (!word) {

        return false;

    }

    word.english = english.trim();

    word.russian = russian.trim();

    word.updatedAt =
        new Date().toISOString();

    saveWords(words);

    return true;

}

/**
 * Поиск
 */
function searchWords(
    words,
    query
) {

    const text =
        query
        .trim()
        .toLowerCase();

    if (!text) {

        return words;

    }

    return words.filter(word =>

        word.english
            .toLowerCase()
            .includes(text)

        ||

        word.russian
            .toLowerCase()
            .includes(text)

    );

}
