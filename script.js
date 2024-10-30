document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const translateBtn = document.getElementById('translateBtn');
  const translationResult = document.getElementById('translationResult');
  const translatedText = document.getElementById('translatedText');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorMessage = document.getElementById('errorMessage');

  function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      setTimeout(() => {
          errorMessage.classList.add('hidden');
      }, 5000);
  }

  function showLoading(isLoading) {
      loadingSpinner.classList.toggle('hidden', !isLoading);
      translateBtn.querySelector('span').textContent = isLoading ? 'Translating...' : 'Translate';
      translateBtn.disabled = isLoading;
  }

  async function translateText(text, targetLanguage) {
      // Replace 'your-api-key' with your actual API key when deploying
      const API_KEY = process.env.API_KEY;
      
      const response = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo-instruct",
              prompt: `Translate to ${targetLanguage}: ${text}`,
              max_tokens: 150,
              temperature: 0.3,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0
          })
      });

      if (!response.ok) {
          throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.choices[0].text.trim();
  }

  translateBtn.addEventListener('click', async () => {
      const text = inputText.value.trim();
      const selectedLanguage = document.querySelector('input[name="language"]:checked')?.value;

      errorMessage.classList.add('hidden');

      if (!text) {
          showError('Please enter some text to translate');
          return;
      }
      if (!selectedLanguage) {
          showError('Please select a language');
          return;
      }
      if (text.length > 500) {
          showError('Text must be less than 500 characters');
          return;
      }

      showLoading(true);
      translationResult.classList.add('hidden');

      try {
          const translation = await translateText(text, selectedLanguage);
          translatedText.textContent = translation;
          translationResult.classList.remove('hidden');
      } catch (error) {
          showError('Translation failed. Please try again.');
          console.error('Translation error:', error);
      } finally {
          showLoading(false);
      }
  });

  // Input validation
  inputText.addEventListener('input', () => {
      if (inputText.value.length > 500) {
          showError('Text must be less than 500 characters');
      } else {
          errorMessage.classList.add('hidden');
      }
  });

  // Radio button animations
  const radioLabels = document.querySelectorAll('input[type="radio"]');
  radioLabels.forEach(radio => {
      radio.addEventListener('change', () => {
          radioLabels.forEach(r => {
              r.parentElement.classList.remove('bg-gray-50');
          });
          if (radio.checked) {
              radio.parentElement.classList.add('bg-gray-50');
          }
      });
  });

  // Button hover animation
  translateBtn.addEventListener('mouseover', () => {
      translateBtn.classList.add('scale-105');
      translateBtn.style.transition = 'transform 0.2s ease';
  });

  translateBtn.addEventListener('mouseout', () => {
      translateBtn.classList.remove('scale-105');
  });
});