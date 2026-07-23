/*
 * WordFlow
 * model.js
 *
 * Единая модель данных приложения.
 */

// Текущая версия структуры данных
const DATA_VERSION = 1;

/**
 * Создает новый объект статистики
 */
function createStats() {
    return {
        enRu: {
            correct: 0,
            wrong: 0
        },
        ruEn: {
            correct: 0,
            wrong: 0
        }
    };
}

/**
 * Генерирует уникальный ID
 */
function generateId() {
    return (
        "w_" +
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8)
    );
}

/**
 * Создает новое слово
 */
function createWord(english, russian) {

    const now = new Date().toISOString();

    return {

        id: generateId(),

        english: english.trim(),

        russian: russian.trim(),

        createdAt: now,

        updatedAt: now,

review:{

    enRu:{

        level:0,

        interval:0,

        ease:2.5,

        repetitions:0,

        nextReview:now

    },

    ruEn:{

        level:0,

        interval:0,

        ease:2.5,

        repetitions:0,

        nextReview:now

    }

},

        stats: createStats()

    };

}
/**
 * Проверяет, соответствует ли объект новой модели
 */
function isValidWord(word) {

    return (
        word &&
        typeof word === "object" &&
        typeof word.english === "string" &&
        typeof word.russian === "string"
    );

}

/**
 * Преобразует старые слова в новый формат
 */
function upgradeWord(word) {

    const now = new Date().toISOString();

    return {

        id: word.id || generateId(),

        english: word.english || "",

        russian: word.russian || "",

        createdAt: word.createdAt || now,

        updatedAt: now,

        level: word.level ?? 0,

        nextReview: word.nextReview || now,

        stats: {

            enRu: {

                correct:
                    word.stats?.enRu?.correct ??
                    word.memory?.enRu?.correct ??
                    0,

                wrong:
                    word.stats?.enRu?.wrong ??
                    word.memory?.enRu?.wrong ??
                    0

            },

            ruEn: {

                correct:
                    word.stats?.ruEn?.correct ??
                    word.memory?.ruEn?.correct ??
                    0,

                wrong:
                    word.stats?.ruEn?.wrong ??
                    word.memory?.ruEn?.wrong ??
                    0

            }

        }

    };

}

/**
 * Обновляет массив слов
 */
function upgradeWords(words) {

    return words
        .filter(isValidWord)
        .map(upgradeWord);

}
