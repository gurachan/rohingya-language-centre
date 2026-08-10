 // ==========================================
// Rohingya Language Centre
// Dictionary Admin Panel
// ==========================================

const API = "/api/admin/dictionary";


// ==========================================
// Current Dictionary Word
// ==========================================

let currentWordId = null;


// ==========================================
// Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeTabs();

    initializeGeneralForm();

    initializeMeaningForm();

    updateMeaningWordDisplay();

});


// ==========================================
// Tab System
// ==========================================

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

}


// ==========================================
// Show Tab
// ==========================================

function showTab(buttonId, contentId) {

    const tabs = [
        "generalTab",
        "meaningsTab",
        "relationshipsTab",
        "mediaTab",
        "historyTab"
    ];


    const contents = [
        "generalContent",
        "meaningsContent",
        "relationshipsContent",
        "mediaContent",
        "historyContent"
    ];


    tabs.forEach((id) => {

        const button =
            document.getElementById(id);

        if (button) {
            button.classList.remove("active");
        }

    });


    contents.forEach((id) => {

        const content =
            document.getElementById(id);

        if (content) {
            content.style.display = "none";
        }

    });


    const activeButton =
        document.getElementById(buttonId);

    const activeContent =
        document.getElementById(contentId);


    if (activeButton) {
        activeButton.classList.add("active");
    }


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


// ==========================================
// General Form
// ==========================================

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


// ==========================================
// Save Dictionary Word
// ==========================================



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

},
    if (
    !englishWordElement ||
    !partOfSpeechElement ||
    !categoryElement ||
    !ipaUKElement ||
    !ipaUSElement ||
    !statusElement
)
{

        alert(
            "Dictionary form is incomplete."
        );

        return;

    }


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

    // ==========================================
    // Validation
    // ==========================================

    if (!englishWord) {

        alert(
            "Please enter an English word."
        );

        return;

    }


    if (!partOfSpeech) {

        alert(
            "Please select a part of speech."
        );

        return;

    }


    if (!categoryId) {

        alert(
            "Please select a category."
        );

        return;

    }


    // ==========================================
    // Prepare Data
    // ==========================================

   const dictionaryData = {

    english_word: englishWord,

    part_of_speech: partOfSpeech,

    category_id: Number(categoryId),

    ipa_uk: ipaUK || null,

    ipa_us: ipaUS || null,

    status: status

};


    // ==========================================
    // Send Request
    // ==========================================

    try {

        const response =
            await fetch(
                API + "/add",
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


        // ==========================================
        // Success
        // ==========================================

        if (
            response.ok &&
            result.success
        ) {

            currentWordId =
                Number(result.wordId);


            alert(
                "Dictionary word saved successfully."
            );


            clearGeneralForm();


            updateMeaningWordDisplay();


            return;

        }


        // ==========================================
        // Server Error
        // ==========================================

        alert(
            result.message ||
            "Unable to save dictionary word."
        );


    } catch (error) {

        console.error(
            "Dictionary save error:",
            error
        );


        alert(
            "Cannot connect to the dictionary server."
        );

    }


// ==========================================
// Clear General Form
// ==========================================

function clearGeneralForm() {

    const englishWord =
        document.getElementById("englishWord");

    const partOfSpeech =
        document.getElementById("partOfSpeech");

    const category =
        document.getElementById("category");

    const ipaUK = document
    .getElementById("ipaUK")
    .value
    .trim();

const ipaUS = document
    .getElementById("ipaUS")
    .value
    .trim();
    const status =
        document.getElementById("status");


    if (englishWord) {
        englishWord.value = "";
    }


    if (partOfSpeech) {
        partOfSpeech.value = "";
    }


    if (category) {
        category.value = "";
    }


    if (ipa) {
        ipa.value = "";
    }


    if (status) {
        status.value = "draft";
    }

}


// ==========================================
// Meaning Form
// ==========================================

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


// ==========================================
// Update Current Word Display
// ==========================================

function updateMeaningWordDisplay() {

    const display =
        document.getElementById(
            "meaningWordDisplay"
        );


    if (!display) {
        return;
    }


    const englishWordElement =
        document.getElementById(
            "englishWord"
        );


    if (
        englishWordElement &&
        englishWordElement.value.trim()
    ) {

        display.textContent =
            englishWordElement.value.trim();

        return;

    }


    if (currentWordId) {

        display.textContent =
            "Word ID: " + currentWordId;

        return;

    }


    display.textContent =
        "No word selected";

}


// ==========================================
// Save Meaning
// ==========================================

async function saveMeaning() {

    if (!currentWordId) {

        alert(
            "Please save the dictionary word first."
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


    // ==========================================
    // Validation
    // ==========================================

    if (
        !meaningOrder ||
        meaningOrder < 1
    ) {

        alert(
            "Please enter a valid meaning order."
        );

        return;

    }


    if (!partOfSpeech) {

        alert(
            "Please select a part of speech."
        );

        return;

    }


    if (!englishDefinition) {

        alert(
            "Please enter the English definition."
        );

        return;

    }


    if (!hanifiMeaning) {

        alert(
            "Please enter the Hanifi meaning."
        );

        return;

    }


    // ==========================================
    // Prepare Data
    // ==========================================

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


    // ==========================================
    // Send Request
    // ==========================================

    try {

        const response =
            await fetch(
                API +
                "/" +
                currentWordId +
                "/meanings",
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


        // ==========================================
        // Success
        // ==========================================

        if (
            response.ok &&
            result.success
        ) {

            alert(
                "Dictionary meaning saved successfully."
            );


            clearMeaningForm();


            await loadMeanings(
                currentWordId
            );


            return;

        }


        // ==========================================
        // Server Error
        // ==========================================

        alert(
            result.message ||
            "Unable to save dictionary meaning."
        );


    } catch (error) {

        console.error(
            "Meaning save error:",
            error
        );


        alert(
            "Cannot connect to the dictionary server."
        );

    }

}


// ==========================================
// Clear Meaning Form
// ==========================================

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


// ==========================================
// Load Existing Meanings
// ==========================================

async function loadMeanings(wordId) {

    const list =
        document.getElementById(
            "meaningsList"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        "<h3>Existing Meanings</h3>" +
        "<p>Loading meanings...</p>";


    try {

        const response =
            await fetch(
                API +
                "/words/" +
                wordId +
                "/meanings"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load meanings."
            );

        }


        const result =
            await response.json();


        if (
            !result.success ||
            !Array.isArray(result.data)
        ) {

            list.innerHTML =
                "<h3>Existing Meanings</h3>" +
                "<p>No meanings loaded.</p>";

            return;

        }


        if (result.data.length === 0) {

            list.innerHTML =
                "<h3>Existing Meanings</h3>" +
                "<p>No meanings added yet.</p>";

            return;

        }


        list.innerHTML =
            "<h3>Existing Meanings</h3>";


        result.data.forEach(
            (meaning) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "meaning-item";


                item.innerHTML = `
                    <strong>
                        Meaning ${meaning.meaning_order}
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
                        <strong>Hanifi:</strong>
                        ${escapeHtml(
                            meaning.hanifi_meaning
                        )}
                    </p>
                `;


                list.appendChild(item);

            }
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


// ==========================================
// Escape HTML
// ==========================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
