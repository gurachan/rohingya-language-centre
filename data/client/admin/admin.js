// ============================================================
// Rohingya Language Centre
// Admin Dictionary JavaScript
// ============================================================

"use strict";

// ============================================================
// API
// ============================================================

const API = "/api/admin/dictionary";

// ============================================================
// Global State
// ============================================================

let currentWordId = null;

// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    initializeAdminDictionary();
});

// ============================================================
// Main Initialization
// ============================================================

function initializeAdminDictionary() {

    initializeTabs();

    initializeGeneralForm();

    initializeMeaningForm();

    loadDictionaryWords();

}

// ============================================================
// TAB MANAGEMENT
// ============================================================

function initializeTabs() {

    const tabButtons = [
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

    tabButtons.forEach((tab) => {

        const button =
            document.getElementById(tab.button);

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {

            showTab(
                tab.button,
                tab.content
            );

        });

    });

    // Show General tab first

    showTab(
        "generalTab",
        "generalContent"
    );

}

// ============================================================
// SHOW TAB
// ============================================================

function showTab(buttonId, contentId) {

    const tabIds = [
        "generalTab",
        "meaningsTab",
        "relationshipsTab",
        "mediaTab",
        "historyTab"
    ];

    const contentIds = [
        "generalContent",
        "meaningsContent",
        "relationshipsContent",
        "mediaContent",
        "historyContent"
    ];

    // Remove active state

    tabIds.forEach((id) => {

        const button =
            document.getElementById(id);

        if (button) {
            button.classList.remove("active");
        }

    });

    // Hide all content

    contentIds.forEach((id) => {

        const content =
            document.getElementById(id);

        if (content) {
            content.style.display = "none";
        }

    });

    // Activate selected button

    const activeButton =
        document.getElementById(buttonId);

    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Show selected content

    const activeContent =
        document.getElementById(contentId);

    if (activeContent) {
        activeContent.style.display = "block";
    }

    // Load meanings when opening meanings tab

    if (
        contentId === "meaningsContent" &&
        currentWordId
    ) {

        updateMeaningWordDisplay();

        loadMeanings(currentWordId);

    }

}

// ============================================================
// GENERAL FORM
// ============================================================

function initializeGeneralForm() {

    const saveButton =
        document.getElementById("saveGeneral");

    if (!saveButton) {
        return;
    }

    saveButton.addEventListener(
        "click",
        saveWord
    );

}

// ============================================================
// SAVE DICTIONARY WORD
// ============================================================

async function saveWord() {

    const englishWordElement =
        document.getElementById("englishWord");

    const partOfSpeechElement =
        document.getElementById("partOfSpeech");

    const categoryElement =
        document.getElementById("category");

    const ipaUKElement =
        document.getElementById("ipaUK");

    const ipaUSElement =
        document.getElementById("ipaUS");

    const statusElement =
        document.getElementById("status");

    // --------------------------------------------------------
    // Check required DOM elements
    // --------------------------------------------------------

    if (
        !englishWordElement ||
        !partOfSpeechElement ||
        !categoryElement ||
        !ipaUKElement ||
        !ipaUSElement ||
        !statusElement
    ) {

        console.error(
            "Dictionary form is missing one or more required elements."
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

    const partOfSpeech =
        partOfSpeechElement.value;

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
            "Please enter an English word."
        );

        englishWordElement.focus();

        return;

    }

    if (!partOfSpeech) {

        alert(
            "Please select a part of speech."
        );

        partOfSpeechElement.focus();

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
    // Prepare request data
    // --------------------------------------------------------

    const dictionaryData = {

        english_word: englishWord,

        part_of_speech: partOfSpeech,

        category_id: Number(categoryId),

        ipa_uk: ipaUK || null,

        ipa_us: ipaUS || null,

        status: status

    };

    console.log(
        "Saving dictionary word:",
        dictionaryData
    );

    // --------------------------------------------------------
    // Send request
    // --------------------------------------------------------

    try {

        const response =
            await fetch(
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
            "Dictionary server response:",
            result
        );

        // ----------------------------------------------------
        // Handle server error
        // ----------------------------------------------------

        if (!response.ok || !result.success) {

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

        // ----------------------------------------------------
        // Try nested word object if necessary
        // ----------------------------------------------------

        if (
            !currentWordId &&
            result.word &&
            result.word.id
        ) {

            currentWordId =
                result.word.id;

        }

        if (
            !currentWordId &&
            result.dictionary &&
            result.dictionary.id
        ) {

            currentWordId =
                result.dictionary.id;

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
        // Refresh dictionary word list
        // ----------------------------------------------------

        await loadDictionaryWords();

        // ----------------------------------------------------
        // Update meaning display
        // ----------------------------------------------------

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

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Failed to load dictionary words."
            );

        }

        renderDictionaryWords(
            result.words || []
        );

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

    /*
     * This function supports several possible containers.
     *
     * If your dictionary.html contains one of these IDs,
     * the list will be rendered automatically.
     */

    const possibleContainers = [
        "dictionaryWords",
        "wordsList",
        "dictionaryList",
        "wordList"
    ];

    let container = null;

    for (
        let i = 0;
        i < possibleContainers.length;
        i++
    ) {

        const element =
            document.getElementById(
                possibleContainers[i]
            );

        if (element) {

            container = element;

            break;

        }

    }

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!Array.isArray(words) || words.length === 0) {

        container.innerHTML =
            "<p>No dictionary words found.</p>";

        return;

    }

    words.forEach((word) => {

        const item =
            document.createElement("div");

        item.className =
            "dictionary-word-item";

        const wordId =
            word.id;

        const englishWord =
            word.english_word || "";

        const partOfSpeech =
            word.part_of_speech || "";

        const ipaUK =
            word.ipa_uk || "";

        const ipaUS =
            word.ipa_us || "";

        item.innerHTML = `

            <div class="dictionary-word-name">
                ${escapeHtml(englishWord)}
            </div>

            <div>
                <strong>Part of Speech:</strong>
                ${escapeHtml(partOfSpeech)}
            </div>

            <div>
                <strong>British IPA:</strong>
                ${escapeHtml(ipaUK || "—")}
            </div>

            <div>
                <strong>American IPA:</strong>
                ${escapeHtml(ipaUS || "—")}
            </div>

        `;

        item.addEventListener(
            "click",
            () => {

                selectDictionaryWord(
                    word
                );

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
    // General form
    // --------------------------------------------------------

    const englishWord =
        document.getElementById("englishWord");

    const partOfSpeech =
        document.getElementById("partOfSpeech");

    const category =
        document.getElementById("category");

    const ipaUK =
        document.getElementById("ipaUK");

    const ipaUS =
        document.getElementById("ipaUS");

    const status =
        document.getElementById("status");

    if (englishWord) {
        englishWord.value =
            word.english_word || "";
    }

    if (partOfSpeech) {
        partOfSpeech.value =
            word.part_of_speech || "";
    }

    if (category) {
        category.value =
            word.category_id || "";
    }

    if (ipaUK) {
        ipaUK.value =
            word.ipa_uk || "";
    }

    if (ipaUS) {
        ipaUS.value =
            word.ipa_us || "";
    }

    if (status) {
        status.value =
            word.status || "draft";
    }

    // --------------------------------------------------------
    // Update meaning word
    // --------------------------------------------------------

    updateMeaningWordDisplay();

    // --------------------------------------------------------
    // Load meanings
    // --------------------------------------------------------

    loadMeanings(currentWordId);

}

// ============================================================
// MEANING FORM
// ============================================================

function initializeMeaningForm() {

    const saveButton =
        document.getElementById("saveMeaning");

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

    const meaningOrder =
        Number(
            meaningOrderElement.value
        );

    const partOfSpeech =
        partOfSpeechElement.value;

    const englishDefinition =
        englishDefinitionElement.value.trim();

    const hanifiMeaning =
        hanifiMeaningElement.value.trim();

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

        examples: []

    };

    console.log(
        "Saving dictionary meaning:",
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
            "Meaning server response:",
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

        const meanings =
            result.meanings || [];

        renderMeanings(
            meanings
        );

    } catch (error) {

        console.error(
            "Load meanings error:",
            error
        );

        list.innerHTML =
            "<h3>Existing Meanings</h3>" +
            "<p>Unable to load meanings.</p>";

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
                Meaning
                ${escapeHtml(
                    meaning.meaning_order
                )}
            </strong>

            <p>
                <strong>
                    Part of Speech:
                </strong>

                ${escapeHtml(
                    meaning.part_of_speech
                )}
            </p>

            <p>
                <strong>
                    English:
                </strong>

                ${escapeHtml(
                    meaning.english_definition
                )}
            </p>

            <p>
                <strong>
                    Hanifi:
                </strong>

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

}

// ============================================================
// UPDATE CURRENT WORD DISPLAY
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

    if (
        englishWord &&
        englishWord.value.trim()
    ) {

        display.textContent =
            englishWord.value.trim();

        return;

    }

    display.textContent =
        "No word selected";

}

// ============================================================
// CLEAR GENERAL FORM
// ============================================================

function clearGeneralForm() {

    const englishWord =
        document.getElementById(
            "englishWord"
        );

    const partOfSpeech =
        document.getElementById(
            "partOfSpeech"
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

    if (partOfSpeech) {
        partOfSpeech.value = "";
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