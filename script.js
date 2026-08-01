 // ===========================================
// Rohingya Language Centre
// Dictionary Engine v2.0
// ===========================================

// ===========================================
// Global Variables
// ===========================================

let dictionary = []
;


// ===========================================
// Load Dictionary
// ===========================================

async function loadDictionary() {

    try {

        const response = await fetch("data/dictionary.json");

        dictionary = await response.json();

        console.log(`${dictionary.length} words loaded.`);

    } catch (error) {

        console.error("Error loading dictionary:", error);

    }

}


// ===========================================
// Display Word
// ===========================================

function displayWord(word) {

    const result = document.getElementById("result");

    result.innerHTML = `

    <div class="dictionary-card">

        <h2>${word.english}</h2>

        <p>
            🔊 <strong>English Audio</strong>
            ${word.englishAudio ? `<audio controls src="${word.englishAudio}"></audio>` : "Coming Soon"}
        </p>

        <p><strong>IPA:</strong> ${word.ipa || "-"}</p>

        <p><strong>Part of Speech:</strong> ${word.partOfSpeech || "-"}</p>

        <hr>

        <h3>Hanifi Rohingya Meanings</h3>

        <ul>
            ${(word.rohingya || [])
                .map(item => `<li>${item}</li>`)
                .join("")}
        </ul>

        <p>
            🔊 <strong>Rohingya Audio</strong>
            ${word.rohingyaAudio ? `<audio controls src="${word.rohingyaAudio}"></audio>` : "Coming Soon"}
        </p>

        <hr>

        <h3>Examples</h3>

        ${
            word.examples && word.examples.length
            ?

            word.examples.map(example => `

                <div class="example-box">

                    <p><strong>English:</strong><br>${example.english}</p>

                    <p><strong>Hanifi Rohingya:</strong><br>${example.rohingya}</p>

                </div>

            `).join("")

            :

            "<p>No examples yet.</p>"
        }

        <hr>

        <p><strong>Synonyms:</strong>
            ${(word.synonyms || []).join(", ") || "-"}
        </p>

        <p><strong>Antonyms:</strong>
            ${(word.antonyms || []).join(", ") || "-"}
        </p>

        <p><strong>Related Words:</strong>
            ${(word.relatedWords || []).join(", ") || "-"}
        </p>

        <p><strong>Derived Words:</strong>
            ${(word.derivedWords || []).join(", ") || "-"}
        </p>

        <p><strong>Word Forms:</strong>
            ${(word.wordForms || []).join(", ") || "-"}
        </p>

        <hr>

        ${
            word.image
            ?
            `<img src="${word.image}" alt="${word.english}" style="max-width:250px;">`
            :
            ""
        }

    </div>

    `;

}

// ===========================================
// Search Word
// ===========================================

function searchWord() {

    const input = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    if (!input) {

        document.getElementById("result").innerHTML =
            "<p>Please enter a word.</p>";

        return;

    }

    const word = dictionary.find(item =>

        item.english.toLowerCase() === input ||

        (item.rohingya || []).some(r =>
            r.toLowerCase() === input
        )

    );

    if (word) {

        displayWord(word);

    } else {

        document.getElementById("result").innerHTML =

        "<h3>No matching word found.</h3>";

    }

}


// ===========================================
// Start Website
// ===========================================

window.onload = function () {

    loadDictionary();

};
// ===============================
// Language Toggle
// ===============================

let currentLanguage = "english";

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("languageToggle");

    if (!button) return;

    button.addEventListener("click", () => {

        if (currentLanguage === "english") {

            currentLanguage = "rohingya";
            button.innerHTML = "🌐 Rohingya";

        } else {

            currentLanguage = "english";
            button.innerHTML = "🌐 English";

        }

    });

});