// ============================================================
// Rohingya Language Centre
// Dictionary Admin JavaScript
// ============================================================

"use strict";

// ============================================================
// API
// ============================================================

const API = "/api/admin/dictionary";

// ============================================================
// GLOBAL STATE
// ============================================================

let currentWordId = null;

// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initializeAdminDictionary();
});

// ============================================================
// INITIALIZATION
// ============================================================

function initializeAdminDictionary() {
    initializeTabs();
    initializeGeneralForm();
    initializeMeaningForm();
    initializeSearch();

    loadDictionaryWords();
}

// ============================================================
// TAB MANAGEMENT
// ============================================================

function initializeTabs() {
    const tabs = [
        {
            button: "generalTab",
            content: "generalContent"
        },
        {
            button: "meaningsTab",
            content: "meaningsContent"
        },
        {
            button: "relationshipsTab",
            content: "relationshipsContent"
        },
        {
            button: "mediaTab",
            content: "mediaContent"
        },
        {
            button: "historyTab",
            content: "historyContent"
        }
    ];

    tabs.forEach((tab) => {
        const button = document.getElementById(tab.button);

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            showTab(tab.button, tab.content);
        });
    });

    showTab("generalTab", "generalContent");
}

// ============================================================
// SHOW TAB
// ============================================================

function showTab(buttonId, contentId) {
    const tabButtons = [
        "generalTab",
        "meaningsTab",
        "relationshipsTab",
        "mediaTab",
        "historyTab"
    ];

    const tabContents = [
        "generalContent",
        "meaningsContent",
        "relationshipsContent",
        "mediaContent",
        "historyContent"
    ];

    tabButtons.forEach((id) => {
        const button = document.getElementById(id);

        if (button) {
            button.classList.remove("active");
        }
    });

    tabContents.forEach((id) => {
        const content = document.getElementById(id);

        if (content) {
            content.style.display = "none";
        }
    });

    const activeButton = document.getElementById(buttonId);

    if (activeButton) {
        activeButton.classList.add("active");
    }

    const activeContent = document.getElementById(contentId);

    if (activeContent) {
        activeContent.style.display = "block";
    }

    if (contentId === "meaningsContent") {
        updateMeaningWordDisplay();

        if (currentWordId) {
            loadMeanings(currentWordId);
        }
    }
}

// ============================================================
// GENERAL FORM
//
// General information contains:
//
// English word
// Rohingya Hanifi word
// Category
// British IPA
// American IPA
// Status
//
// Part of speech does NOT belong here.
// ============================================================

function initializeGeneralForm() {
    const saveButton = document.getElementById("saveGeneral");

    if (!saveButton) {
        return;
    }

    saveButton.addEventListener("click", saveWord);
}

// ============================================================
// SAVE DICTIONARY WORD
// ============================================================

async function saveWord() {
    const englishWordElement =
        document.getElementById("englishWord");

    const hanifiWordElement =
        document.getElementById("hanifiWord");

    const categoryElement =
        document.getElementById("category");

    const ipaUKElement =
        document.getElementById("ipaUK");

    const ipaUSElement =
        document.getElementById("ipaUS");

    const statusElement =
        document.getElementById("status");

    // --------------------------------------------------------
    // Required elements
    // --------------------------------------------------------

    if (
        !englishWordElement ||
        !categoryElement ||
        !ipaUKElement ||
        !ipaUSElement ||
        !statusElement
    ) {
        console.error(
            "Dictionary form is missing required elements."
        );

        alert(
            "Dictionary form is incomplete."
        );

        return;
    }

    // --------------------------------------------------------
    // Read values
    // --------------------------------------------------------

    const englishWord =
        englishWordElement.value.trim();

    const hanifiWord =
        hanifiWordElement
            ? hanifiWordElement.value.trim()
            : "";

    const categoryId =
        categoryElement.value;

    const ipaUK =
        ipaUKElement.value.trim();

    const ipaUS =
        ipaUSElement.value.trim();

    const status =
        statusElement.value;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (!englishWord) {
        alert(
            "Please enter the English word."
        );

        englishWordElement.focus();

        return;
    }

    if (!categoryId) {
        alert(
            "Please select a category."
        );

        categoryElement.focus();

        return;
    }

    if (!status) {
        alert(
            "Please select a status."
        );

        statusElement.focus();

        return;
    }

    // --------------------------------------------------------
    // Prepare data
    // --------------------------------------------------------

    const dictionaryData = {
        english_word: englishWord,

        hanifi_word: hanifiWord || null,

        category_id:
            Number(categoryId),

        ipa_uk:
            ipaUK || null,

        ipa_us:
            ipaUS || null,

        status
    };

    console.log(
        "Saving dictionary word:",
        dictionaryData
    );

    // --------------------------------------------------------
    // Send request
    // --------------------------------------------------------

    try {
        const response = await fetch(
            `${API}/add`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        dictionaryData
                    )
            }
        );

        const result =
            await response.json();

        console.log(
            "Dictionary response:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to save dictionary word."
            );
        }

        // ----------------------------------------------------
        // Save current word ID
        // ----------------------------------------------------

        currentWordId =
            result.wordId ||
            result.word_id ||
            result.dictionaryId ||
            result.dictionary_id ||
            result.id ||
            null;

        if (
            !currentWordId &&
            result.word &&
            result.word.id
        ) {
            currentWordId =
                result.word.id;
        }

        // ----------------------------------------------------
        // Success
        // ----------------------------------------------------

        alert(
            "Dictionary word saved successfully."
        );

        console.log(
            "Current Word ID:",
            currentWordId
        );

        // ----------------------------------------------------
        // Refresh word list
        // ----------------------------------------------------

        await loadDictionaryWords();

        updateMeaningWordDisplay();

    } catch (error) {
        console.error(
            "Save dictionary word error:",
            error
        );

        alert(
            error.message ||
            "Unable to save dictionary word."
        );
    }
}

// ============================================================
// LOAD DICTIONARY WORDS
// ============================================================

async function loadDictionaryWords() {
    try {
        const response =
            await fetch(
                `${API}/words`
            );

        const result =
            await response.json();

        console.log(
            "Dictionary words response:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to load dictionary words."
            );
        }

        const words =
            result.data ||
            result.words ||
            [];

        renderDictionaryWords(words);

    } catch (error) {
        console.error(
            "Load dictionary words error:",
            error
        );

        renderDictionaryWords([]);
    }
}

// ============================================================
// RENDER DICTIONARY WORDS
// ============================================================

function renderDictionaryWords(words) {
    const possibleContainers = [
        "dictionaryWords",
        "wordsList",
        "dictionaryList",
        "wordList"
    ];

    let container = null;

    for (const id of possibleContainers) {
        const element =
            document.getElementById(id);

        if (element) {
            container = element;
            break;
        }
    }

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        !Array.isArray(words) ||
        words.length === 0
    ) {
        container.innerHTML =
            "<p>No dictionary words found.</p>";

        return;
    }

    words.forEach((word) => {
        const item =
            document.createElement("div");

        item.className =
            "dictionary-word-item";

        item.dataset.wordId =
            word.id;

        const englishWord =
            word.english_word || "";

        const hanifiWord =
            word.hanifi_word ||
            word.rohingya_hanifi ||
            "";

        const ipaUK =
            word.ipa_uk || "";

        const ipaUS =
            word.ipa_us || "";

        const status =
            word.status || "";

        item.innerHTML = `
            <div class="dictionary-word-name">
                ${escapeHtml(englishWord)}
            </div>

            <div class="dictionary-word-hanifi">
                ${escapeHtml(
                    hanifiWord || "—"
                )}
            </div>

            <div>
                <strong>British IPA:</strong>
                ${escapeHtml(
                    ipaUK || "—"
                )}
            </div>

            <div>
                <strong>American IPA:</strong>
                ${escapeHtml(
                    ipaUS || "—"
                )}
            </div>

            <div>
                <strong>Status:</strong>
                ${escapeHtml(
                    status || "—"
                )}
            </div>
        `;

        item.addEventListener(
            "click",
            () => {
                selectDictionaryWord(word);
            }
        );

        container.appendChild(item);
    });
}

// ============================================================
// SELECT DICTIONARY WORD
// ============================================================

function selectDictionaryWord(word) {
    if (!word || !word.id) {
        return;
    }

    currentWordId =
        word.id;

    console.log(
        "Selected dictionary word:",
        word
    );

    // --------------------------------------------------------
    // English
    // --------------------------------------------------------

    const englishWord =
        document.getElementById(
            "englishWord"
        );

    if (englishWord) {
        englishWord.value =
            word.english_word || "";
    }

    // --------------------------------------------------------
    // Rohingya Hanifi
    // --------------------------------------------------------

    const hanifiWord =
        document.getElementById(
            "hanifiWord"
        );

    if (hanifiWord) {
        hanifiWord.value =
            word.hanifi_word ||
            word.rohingya_hanifi ||
            "";
    }

    // --------------------------------------------------------
    // Category
    // --------------------------------------------------------

    const category =
        document.getElementById(
            "category"
        );

    if (category) {
        category.value =
            word.category_id || "";
    }

    // --------------------------------------------------------
    // IPA
    // --------------------------------------------------------

    const ipaUK =
        document.getElementById(
            "ipaUK"
        );

    const ipaUS =
        document.getElementById(
            "ipaUS"
        );

    if (ipaUK) {
        ipaUK.value =
            word.ipa_uk || "";
    }

    if (ipaUS) {
        ipaUS.value =
            word.ipa_us || "";
    }

    // --------------------------------------------------------
    // Status
    // --------------------------------------------------------

    const status =
        document.getElementById(
            "status"
        );

    if (status) {
        status.value =
            word.status || "draft";
    }

    // --------------------------------------------------------
    // Meanings
    // --------------------------------------------------------

    updateMeaningWordDisplay();

    loadMeanings(
        currentWordId
    );
}

// ============================================================
// MEANING FORM
//
// Part of speech belongs HERE.
// ============================================================

function initializeMeaningForm() {
    const saveButton =
        document.getElementById(
            "saveMeaning"
        );

    if (!saveButton) {
        return;
    }

    saveButton.addEventListener(
        "click",
        saveMeaning
    );
}

// ============================================================
// SAVE MEANING
// ============================================================

async function saveMeaning() {
    if (!currentWordId) {
        alert(
            "Please select or create a dictionary word first."
        );

        return;
    }

    const meaningOrderElement =
        document.getElementById(
            "meaningOrder"
        );

    const partOfSpeechElement =
        document.getElementById(
            "meaningPartOfSpeech"
        );

    const englishDefinitionElement =
        document.getElementById(
            "englishDefinition"
        );

    const hanifiMeaningElement =
        document.getElementById(
            "hanifiMeaning"
        );

    const englishExampleElement =
        document.getElementById(
            "englishExample"
        );

    const hanifiExampleElement =
        document.getElementById(
            "hanifiExample"
        );

    if (
        !meaningOrderElement ||
        !partOfSpeechElement ||
        !englishDefinitionElement ||
        !hanifiMeaningElement
    ) {
        alert(
            "Meaning form is incomplete."
        );

        return;
    }

    // --------------------------------------------------------
    // Read values
    // --------------------------------------------------------

    const meaningOrder =
        Number(
            meaningOrderElement.value
        );

    const partOfSpeech =
        partOfSpeechElement.value;

    const englishDefinition =
        englishDefinitionElement
            .value
            .trim();

    const hanifiMeaning =
        hanifiMeaningElement
            .value
            .trim();

    const englishExample =
        englishExampleElement
            ? englishExampleElement.value.trim()
            : "";

    const hanifiExample =
        hanifiExampleElement
            ? hanifiExampleElement.value.trim()
            : "";

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------

    if (
        !meaningOrder ||
        meaningOrder < 1
    ) {
        alert(
            "Please enter a valid meaning order."
        );

        meaningOrderElement.focus();

        return;
    }

    if (!partOfSpeech) {
        alert(
            "Please select the meaning part of speech."
        );

        partOfSpeechElement.focus();

        return;
    }

    if (!englishDefinition) {
        alert(
            "Please enter the English definition."
        );

        englishDefinitionElement.focus();

        return;
    }

    if (!hanifiMeaning) {
        alert(
            "Please enter the Hanifi meaning."
        );

        hanifiMeaningElement.focus();

        return;
    }

    // --------------------------------------------------------
    // Examples
    // --------------------------------------------------------

    const examples = [];

    if (
        englishExample ||
        hanifiExample
    ) {
        examples.push({
            english_example:
                englishExample,

            hanifi_example:
                hanifiExample
        });
    }

    // --------------------------------------------------------
    // Prepare data
    // --------------------------------------------------------

    const meaningData = {
        meaning_order:
            meaningOrder,

        part_of_speech:
            partOfSpeech,

        english_definition:
            englishDefinition,

        hanifi_meaning:
            hanifiMeaning,

        examples
    };

    console.log(
        "Saving meaning:",
        meaningData
    );

    // --------------------------------------------------------
    // Send request
    // --------------------------------------------------------

    try {
        const response =
            await fetch(
                `${API}/${currentWordId}/meanings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            meaningData
                        )
                }
            );

        const result =
            await response.json();

        console.log(
            "Meaning response:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to save dictionary meaning."
            );
        }

        alert(
            "Dictionary meaning saved successfully."
        );

        clearMeaningForm();

        await loadMeanings(
            currentWordId
        );

    } catch (error) {
        console.error(
            "Save meaning error:",
            error
        );

        alert(
            error.message ||
            "Unable to save dictionary meaning."
        );
    }
}

// ============================================================
// LOAD MEANINGS
// ============================================================

async function loadMeanings(wordId) {
    const list =
        document.getElementById(
            "meaningsList"
        );

    if (!list) {
        return;
    }

    if (!wordId) {
        list.innerHTML =
            "<p>No word selected.</p>";

        return;
    }

    list.innerHTML =
        "<p>Loading meanings...</p>";

    try {
        const response =
            await fetch(
                `${API}/${wordId}/meanings`
            );

        const result =
            await response.json();

        console.log(
            "Meanings response:",
            result
        );

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to load meanings."
            );
        }

        renderMeanings(
            result.meanings || []
        );

    } catch (error) {
        console.error(
            "Load meanings error:",
            error
        );

        list.innerHTML = `
            <h3>Existing Meanings</h3>
            <p>Unable to load meanings.</p>
        `;
    }
}

// ============================================================
// RENDER MEANINGS
// ============================================================

function renderMeanings(meanings) {
    const list =
        document.getElementById(
            "meaningsList"
        );

    if (!list) {
        return;
    }

    list.innerHTML =
        "<h3>Existing Meanings</h3>";

    if (
        !Array.isArray(meanings) ||
        meanings.length === 0
    ) {
        list.innerHTML +=
            "<p>No meanings added yet.</p>";

        return;
    }

    meanings.forEach((meaning) => {
        const item =
            document.createElement("div");

        item.className =
            "meaning-item";

        item.innerHTML = `
            <strong>
                Meaning ${escapeHtml(
                    meaning.meaning_order
                )}
            </strong>

            <p>
                <strong>Part of Speech:</strong>
                ${escapeHtml(
                    meaning.part_of_speech
                )}
            </p>

            <p>
                <strong>English:</strong>
                ${escapeHtml(
                    meaning.english_definition
                )}
            </p>

            <p>
                <strong>Rohingya Hanifi:</strong>
                ${escapeHtml(
                    meaning.hanifi_meaning
                )}
            </p>
        `;

        list.appendChild(item);
    });
}

// ============================================================
// CLEAR MEANING FORM
// ============================================================

function clearMeaningForm() {
    const meaningOrder =
        document.getElementById(
            "meaningOrder"
        );

    const partOfSpeech =
        document.getElementById(
            "meaningPartOfSpeech"
        );

    const englishDefinition =
        document.getElementById(
            "englishDefinition"
        );

    const hanifiMeaning =
        document.getElementById(
            "hanifiMeaning"
        );

    const englishExample =
        document.getElementById(
            "englishExample"
        );

    const hanifiExample =
        document.getElementById(
            "hanifiExample"
        );

    if (meaningOrder) {
        meaningOrder.value = "1";
    }

    if (partOfSpeech) {
        partOfSpeech.value = "";
    }

    if (englishDefinition) {
        englishDefinition.value = "";
    }

    if (hanifiMeaning) {
        hanifiMeaning.value = "";
    }

    if (englishExample) {
        englishExample.value = "";
    }

    if (hanifiExample) {
        hanifiExample.value = "";
    }
}

// ============================================================
// CURRENT WORD DISPLAY
// ============================================================

function updateMeaningWordDisplay() {
    const display =
        document.getElementById(
            "meaningWordDisplay"
        );

    if (!display) {
        return;
    }

    const englishWord =
        document.getElementById(
            "englishWord"
        );

    const hanifiWord =
        document.getElementById(
            "hanifiWord"
        );

    const english =
        englishWord
            ? englishWord.value.trim()
            : "";

    const hanifi =
        hanifiWord
            ? hanifiWord.value.trim()
            : "";

    if (english && hanifi) {
        display.textContent =
            `${english} — ${hanifi}`;

        return;
    }

    if (english) {
        display.textContent =
            english;

        return;
    }

    if (hanifi) {
        display.textContent =
            hanifi;

        return;
    }

    display.textContent =
        "No word selected";
}

// ============================================================
// SEARCH
//
// Search design:
// 1. English
// 2. Rohingya Hanifi
//
// Latin/Roman is NOT used.
// ============================================================

function initializeSearch() {
    const searchButton =
        document.getElementById(
            "searchDictionary"
        );

    const searchInput =
        document.getElementById(
            "dictionarySearch"
        );

    const searchType =
        document.getElementById(
            "dictionarySearchType"
        );

    if (!searchButton || !searchInput) {
        return;
    }

    searchButton.addEventListener(
        "click",
        () => {
            searchDictionary(
                searchInput.value,
                searchType
                    ? searchType.value
                    : "english"
            );
        }
    );

    searchInput.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Enter"
            ) {
                event.preventDefault();

                searchDictionary(
                    searchInput.value,
                    searchType
                        ? searchType.value
                        : "english"
                );
            }
        }
    );
}

// ============================================================
// SEARCH DICTIONARY
// ============================================================

function searchDictionary(
    value,
    type
) {
    const query =
        String(value || "").trim();

    if (!query) {
        loadDictionaryWords();
        return;
    }

    const searchType =
        type === "hanifi"
            ? "hanifi"
            : "english";

    console.log(
        "Dictionary search:",
        {
            query,
            type: searchType
        }
    );

    /*
     * Search API will be connected here.
     *
     * Expected future endpoints:
     *
     * /api/admin/dictionary/search?english=...
     *
     * /api/admin/dictionary/search?hanifi=...
     *
     * For now, perform local filtering
     * using the currently loaded dictionary.
     */

    searchDictionaryLocally(
        query,
        searchType
    );
}

// ============================================================
// LOCAL SEARCH
// ============================================================

async function searchDictionaryLocally(
    query,
    searchType
) {
    try {
        const response =
            await fetch(
                `${API}/words`
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Failed to load dictionary."
            );
        }

        const words =
            result.data ||
            result.words ||
            [];

        const normalizedQuery =
            query.toLowerCase();

        const filtered =
            words.filter((word) => {
                if (
                    searchType ===
                    "hanifi"
                ) {
                    const hanifi =
                        word.hanifi_word ||
                        word.rohingya_hanifi ||
                        "";

                    return hanifi
                        .toLowerCase()
                        .includes(
                            normalizedQuery
                        );
                }

                const english =
                    word.english_word ||
                    "";

                return english
                    .toLowerCase()
                    .includes(
                        normalizedQuery
                    );
            });

        renderDictionaryWords(
            filtered
        );

    } catch (error) {
        console.error(
            "Dictionary search error:",
            error
        );

        renderDictionaryWords([]);
    }
}

// ============================================================
// CLEAR GENERAL FORM
// ============================================================

function clearGeneralForm() {
    const englishWord =
        document.getElementById(
            "englishWord"
        );

    const hanifiWord =
        document.getElementById(
            "hanifiWord"
        );

    const category =
        document.getElementById(
            "category"
        );

    const ipaUK =
        document.getElementById(
            "ipaUK"
        );

    const ipaUS =
        document.getElementById(
            "ipaUS"
        );

    const status =
        document.getElementById(
            "status"
        );

    if (englishWord) {
        englishWord.value = "";
    }

    if (hanifiWord) {
        hanifiWord.value = "";
    }

    if (category) {
        category.value = "";
    }

    if (ipaUK) {
        ipaUK.value = "";
    }

    if (ipaUS) {
        ipaUS.value = "";
    }

    if (status) {
        status.value = "draft";
    }

    currentWordId = null;

    clearMeaningForm();

    updateMeaningWordDisplay();
}

// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}