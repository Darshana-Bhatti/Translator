const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector('#transfer');
const fromText = document.querySelector('#fromText');
const toText = document.querySelector('#toText');
const icons = document.querySelectorAll("img"); // Make sure icons have the class 'icon-class'

// Populate select tags with country codes
selectTag.forEach((tag, id) => {
    for (const countriesCode in countries) {
        let selected = ""; // Initialize as empty string for each iteration
        if (id == 0 && countriesCode == "en-GB") {
            selected = "selected";
        } else if (id == 1 && countriesCode == "hi-IN") {
            selected = "selected";
        }
        let option = `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Translate button click event
translateBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

    let apiURL = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFrom}|${translateTo}`;
    
    fetch(apiURL)
        .then(res => res.json()) // Fetch response and convert to JSON
        .then(data => {
            toText.value = data.responseData.translatedText; // Set translated text in the 'toText' field
        })
        .catch(error => {
            console.error("Error fetching translation:", error);
        });
});

// Icon click event for copying text or speaking text
icons.forEach(icon => {
    icon.addEventListener("click", (event) => {
        const target = event.currentTarget; // Use currentTarget to reference the correct clicked icon
        
        if (target.classList.contains("copy")) { // Check if the icon has a 'copy' class
            if (target.id === "from") {
                // Copy the 'fromText' content to the clipboard
                navigator.clipboard.writeText(fromText.value)
                    .then(() => console.log('Text copied from the input field.'))
                    .catch(err => console.error('Error copying text:', err));
            } else {
                // Copy the 'toText' content to the clipboard
                navigator.clipboard.writeText(toText.value)
                    .then(() => console.log('Translated text copied to clipboard.'))
                    .catch(err => console.error('Error copying text:', err));
            }
        } else {
            let utterance;
            if (target.id === "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value); // Create speech synthesis for 'fromText'
                utterance.lang = selectTag[0].value; // Set language from the first select tag
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value); // Create speech synthesis for 'toText'
                utterance.lang = selectTag[1].value; // Set language from the second select tag
            }
            speechSynthesis.speak(utterance); // Speak the text
        }
    });
});
