// Function to toggle visibility of a field based on a condition
function toggleField(fieldId, show) {
    const field = document.getElementById(fieldId);
    if (field) {
        if (show) {
            field.classList.remove('hidden'); // Show the field
        } else {
            field.classList.add('hidden'); // Hide the field
            // Clear value if the field is hidden
            if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                field.value = '';
            } else if (field.tagName === 'DIV' && field.classList.contains('checkbox-group')) {
                // If it's a checkbox group, uncheck all checkboxes within it
                field.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                // Also hide any associated text input (e.g., "Outros" text field)
                const associatedTextInput = document.getElementById(fieldId.replace('Group', ''));
                if (associatedTextInput) associatedTextInput.classList.add('hidden');
            }
        }
    }
}

// Event listener for "Outros" checkbox in Skin Condition section
document.getElementById('otherSkinConditionCheckbox').addEventListener('change', function() {
    toggleField('otherSkinCondition', this.checked); // Toggle visibility of "otherSkinCondition" input
});

// Event listener for "Outros" checkbox in Micropigmentation Area section
document.getElementById('otherMicropigmentationCheckbox').addEventListener('change', function() {
    toggleField('otherMicropigmentation', this.checked); // Toggle visibility of "otherMicropigmentation" input
});

// Function to preview selected image before upload
function previewImage(event, previewId) {
    const reader = new FileReader(); // Create a new FileReader object
    reader.onload = function(){
        const output = document.getElementById(previewId); // Get the image element for preview
        if (output) {
            output.src = reader.result; // Set the image source to the selected file's data URL
            output.style.display = 'block'; // Make the image visible
        }
    };
    // If a file is selected, read it as a Data URL
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    } else {
        // If no file is selected (e.g., user cancels), hide the preview
        const output = document.getElementById(previewId);
        if (output) {
            output.src = '';
            output.style.display = 'none';
        }
    }
}

// Form submission handler
document.getElementById('beautyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.target); // Create a FormData object from the form
    const data = {}; // Initialize an empty object to store form data

    // Iterate over the form data entries
    for (let [key, value] of formData.entries()) {
        // Special handling for checkboxes that can have multiple values
        if (key.includes('Condition') || key.includes('Area')) {
            if (!data[key]) {
                data[key] = []; // If the key doesn't exist, initialize it as an array
            }
            data[key].push(value); // Add the checkbox value to the array
        } else {
            data[key] = value; // For other fields, just assign the value
        }
    }

    // Handle "Outros" text input for Skin Condition
    if (document.getElementById('otherSkinConditionCheckbox').checked) {
        data['otherSkinCondition'] = document.getElementById('otherSkinCondition').value;
    } else {
        delete data['otherSkinConditionText']; // Remove the text field data if "Outros" is not checked
    }

    // Handle "Outros" text input for Micropigmentation Area
    if (document.getElementById('otherMicropigmentationCheckbox').checked) {
        data['otherMicropigmentation'] = document.getElementById('otherMicropigmentation').value;
    } else {
        delete data['otherMicropigmentationText']; // Remove the text field data if "Outros" is not checked
    }

    // For demonstration purposes, log the collected form data to the console
    console.log("Dados da Ficha da Beleza:", data);

    // Simulate AI identification for face shape and undertone
    // In a real application, this would involve sending the image data to a backend AI service
    // and updating these fields with the actual response from the AI.
    document.getElementById('faceShape').value = 'oval'; // Example value, replace with actual AI result
    document.getElementById('skinUndertone').value = 'neutro'; // Example value, replace with actual AI result

    // Show success message to the user
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show'); // Add 'show' class to make it visible

    // Hide success message and reset form after a delay
    setTimeout(() => {
        successMessage.classList.remove('show'); // Remove 'show' class to hide the message
        event.target.reset(); // Reset all form fields
        // Also hide image previews and conditional fields that were shown
        document.getElementById('facePhotoPreview').style.display = 'none';
        document.getElementById('inspirationPhotoPreview').style.display = 'none';
        toggleField('allergyProduct', false);
        toggleField('micropigmentationAreaGroup', false);
        toggleField('aestheticTreatmentName', false);
        toggleField('inspirationPhotoUploadArea', false);
        toggleField('otherSkinCondition', false);
        toggleField('otherMicropigmentation', false);
    }, 5000); // 5000 milliseconds = 5 seconds
});

// Basic Service Worker registration for PWA capabilities
// This checks if the browser supports Service Workers
if ('serviceWorker' in navigator) {
    // Register the service worker when the window loads
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha no registro do Service Worker:', error);
            });
    });
}
