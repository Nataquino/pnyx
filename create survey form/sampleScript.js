document.addEventListener('DOMContentLoaded', () => {
    let questionCounter = 0;

    document.getElementById('addQuestionBtn').addEventListener('click', () => {
        questionCounter++;
        const questionContainer = document.getElementById('questionContainer');
        const newQuestion = document.createElement('div');
        newQuestion.classList.add('question');
        newQuestion.innerHTML = `
            <label for="question${questionCounter}">Question:</label>
            <input type="text" name="questions[${questionCounter}][text]" id="question${questionCounter}" required>
            <label for="type${questionCounter}">Type:</label>
            <select name="questions[${questionCounter}][type]" id="type${questionCounter}" onchange="updateQuestionType(this)">
                <option>Select Question Type</option>
                <option value="paragraph">Paragraph</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
                <option value="dropdown">Dropdown</option>
                <option value="file_upload">File Upload</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
            </select>
            <div class="options" id="options${questionCounter}"></div>
            <button type="button" class="removeBtn" onclick="removeQuestion(this)">Remove Question</button>
        `;
        questionContainer.appendChild(newQuestion);
    });

    // Add event listener for dynamically added "Add Option" button
    document.addEventListener('click', function(event) {
        if (event.target && event.target.className === 'addOptionBtn') {
            const optionsDiv = event.target.previousElementSibling;
            const questionNumber = event.target.getAttribute('data-question-number'); // Get question number
            const questionType = event.target.getAttribute('data-question-type'); // Get question type
            const newOption = document.createElement('div');
            if (questionType === 'multiple_choice') {
                newOption.innerHTML = `
                    <input type="radio" name="questions[${questionNumber}][options][]" required>
                    <input type="text" placeholder="Option">
                `;
            } else if (questionType === 'checkbox') {
                newOption.innerHTML = `
                    <input type="checkbox" name="questions[${questionNumber}][options][]" required>
                    <input type="text" placeholder="Option">
                `;
            }
            optionsDiv.appendChild(newOption);
        }
    });
});



    // du ma buang nako guro dri pa lang paano nalang ang iban nga part

function removeQuestion(button) {
    const question = button.parentElement;
    question.remove();
    questionCounter--;
}

function updateQuestionType(selectElement, questionNumber) {
    const questionDiv = selectElement.parentElement;
    const optionsDiv = questionDiv.querySelector('.options');
    optionsDiv.innerHTML = ''; // Clear previous options
    switch (selectElement.value) {
        case 'multiple_choice':
            optionsDiv.innerHTML = `
                <div>
                    <input type="radio" name="questions[${questionNumber}][options][]" required>
                    <input type="text" placeholder="Option">
                </div>
                <!-- Added 'data-question-number' and 'data-question-type' attributes to 'Add Option' button -->
                <button type="button" class="addOptionBtn" data-question-number="${questionNumber}" data-question-type="multiple_choice">Add Option</button>
            `;
            break;
        case 'checkbox':
            optionsDiv.innerHTML = `
                <div>
                    <input type="checkbox" name="questions[${questionNumber}][options][]" required>
                    <input type="text" placeholder="Option">
                </div>
                <!-- Added 'data-question-number' and 'data-question-type' attributes to 'Add Option' button -->
                <button type="button" class="addOptionBtn" data-question-number="${questionNumber}" data-question-type="checkbox">Add Option</button>
            `;
            break;
        case 'dropdown':
            optionsDiv.innerHTML = `
                <label for="options${questionNumber}">Options (comma-separated):</label>
                <input type="text" name="questions[${questionNumber}][options]" id="options${questionNumber}" required>
            `;
            break;
        case 'file_upload':
            optionsDiv.innerHTML = `
                <label for="file${questionNumber}">Upload File:</label>
                <input type="file" name="questions[${questionNumber}][file]" id="file${questionNumber}">
            `;
            break;
        case 'date':
            optionsDiv.innerHTML = `
                <label for="date${questionNumber}">Select Date:</label>
                <input type="date" name="questions[${questionNumber}][date]" id="date${questionNumber}">
            `;
            break;
        case 'time':
            optionsDiv.innerHTML = `
                <label for="time${questionNumber}">Select Time:</label>
                <input type="time" name="questions[${questionNumber}][time]" id="time${questionNumber}">
            `;
            break;
        default:
            optionsDiv.innerHTML = `
                <textarea name="paragraph" id="paragraph" disabled></textarea>
            `;
            break;
    }
}