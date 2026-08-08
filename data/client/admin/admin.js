 // ==========================================
// Rohingya Language Centre
// Dictionary Admin Panel
// ==========================================

const API = "http://localhost:5000/api/admin";


// ==========================================
// Initialize
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const saveButton = document.getElementById("saveGeneral");

    if (saveButton) {
        saveButton.addEventListener("click", saveWord);
    }

});


// ==========================================
// Save Dictionary Word
// ==========================================

async function saveWord() {

    const englishWord = document
        .getElementById("englishWord")
        .value
        .trim();

    const partOfSpeech = document
        .getElementById("partOfSpeech")
        .value;

    const categoryId = document
        .getElementById("category")
        .value;

    const status = document
        .getElementById("status")
        .value;


    // ==========================================
    // Validation
    // ==========================================

    if (!englishWord) {
        alert("Please enter an English word.");
        return;
    }

    if (!partOfSpeech) {
        alert("Please select a part of speech.");
        return;
    }

    if (!categoryId) {
        alert("Please select a category.");
        return;
    }


    // ==========================================
    // Send to Server
    // ==========================================

    try {

        const response = await fetch(
            API + "/dictionary/add",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    english_word: englishWord,

                    part_of_speech: partOfSpeech,

                    category_id: Number(categoryId),

                    status: status

                })
            }
        );


        const result = await response.json();

        console.log("Server response:", result);


        // ==========================================
        // Result
        // ==========================================

        if (result.success) {

            alert("Dictionary word saved successfully.");

            // Clear form

            document.getElementById("englishWord").value = "";

            document.getElementById("partOfSpeech").value = "";

            document.getElementById("category").value = "";

            document.getElementById("status").value = "draft";

        } else {

            alert(
                result.message ||
                "Unable to save dictionary word."
            );

        }

    } catch (error) {

        console.error("Save error:", error);

        alert(
            "Cannot connect to the dictionary server."
        );

    }

}