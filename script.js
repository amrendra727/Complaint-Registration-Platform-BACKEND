document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('complaintForm');
    const alertBox = document.getElementById('alertBox');
    const submitBtn = document.getElementById('submitBtn');
    
    // AI Section elements
    const generateBtn = document.getElementById('generateQuestionBtn');
    const aiContainer = document.getElementById('aiQuestionContainer');
    const aiQuestionText = document.getElementById('aiQuestionText');
    const aiAnswerInput = document.getElementById('aiAnswer');
    const complaintInput = document.getElementById('complaint');

    let currentAiQuestion = "";

    // Generate AI Question
    generateBtn.addEventListener('click', async () => {
        const complaint = complaintInput.value.trim();
        
        if (!complaint) {
            showAlert('error', 'Please describe your complaint first before generating a question.');
            complaintInput.focus();
            return;
        }

        // Set loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="loading"><span>Generating...</span></span>';
        
        aiContainer.classList.remove('hidden');
        aiQuestionText.textContent = "Analyzing complaint and generating question...";
        aiAnswerInput.value = "";

        try {
            const response = await fetch('http://localhost:3000/api/generate-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ complaintText: complaint })
            });

            const data = await response.json();

            if (response.ok) {
                currentAiQuestion = data.question;
                aiQuestionText.textContent = currentAiQuestion;
                aiAnswerInput.focus();
            } else {
                aiQuestionText.textContent = '❌ Error: ' + (data.error || 'Failed to generate question.');
                currentAiQuestion = "";
            }
        } catch (error) {
            console.error('AI Generation Error:', error);
            aiQuestionText.textContent = '❌ Network error. Please check your connection.';
            currentAiQuestion = "";
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>
                <span>Regenerate Question</span>
            `;
        }
    });

    // Check if answer is provided to enable submit button
    aiAnswerInput.addEventListener('input', () => {
        if (aiAnswerInput.value.trim() !== "" && currentAiQuestion !== "") {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });

    // Disable initially until AI is answered
    submitBtn.disabled = true;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide previous alerts
        alertBox.className = 'alert hidden';
        
        if (!currentAiQuestion || !aiAnswerInput.value.trim()) {
            showAlert('error', 'Please generate and answer the AI follow-up question before submitting.');
            return;
        }

        // Form Data
        const formData = {
            name: document.getElementById('name').value.trim(),
            city: document.getElementById('city').value.trim(),
            mobile: document.getElementById('mobile').value.trim(),
            complaint: document.getElementById('complaint').value.trim(),
            ai_question: currentAiQuestion,
            ai_answer: aiAnswerInput.value.trim()
        };

        // Basic validation
        if (!formData.name || !formData.city || !formData.mobile || !formData.complaint) {
            showAlert('error', 'Please fill in all primary fields.');
            return;
        }

        if (!/^\d{10}$/.test(formData.mobile)) {
            showAlert('error', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"><span>Submitting...</span></span>';

        try {
            const response = await fetch('http://localhost:3000/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('success', '✅ Complaint registered successfully!');
            } else {
                showAlert('error', '❌ Error: ' + (data.error || 'Failed to register complaint.'));
            }
        } catch (error) {
            console.error('Submission Error:', error);
            showAlert('error', '❌ Network error. Please check your connection and try again.');
        } finally {
            // Remove loading state
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Complaint</span>';
        }
    });

    function showAlert(type, message) {
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
    }
});
