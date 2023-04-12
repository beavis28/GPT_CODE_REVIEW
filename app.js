document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = document.getElementById('prompt').value;
  const fileInput = document.getElementById('file-input');
  const responseElement = document.getElementById('response');

  if (prompt || fileInput.files.length > 0) {
    let combinedText = prompt;

    if (fileInput.files.length > 0) {
      try {
        const fileContent = await readFile(fileInput.files[0]);
        combinedText += fileContent;
      } catch (error) {
        responseElement.innerText = 'Error reading file: ' + error.message;
        return;
      }
    }

    try {
      const result = await callChatGPT(combinedText);
      responseElement.innerText = result;
    } catch (error) {
      responseElement.innerText = 'Error: ' + error.message;
    }
  } else {
    responseElement.innerText = 'Paste your code or upload a file.';
  }
});

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      resolve(event.target.result);
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.readAsText(file);
  });
}

async function callChatGPT(prompt) {
  const apiKey = 'apply your own API KEY';
  const url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

  const data = {
    prompt: `please code review of the below code. \n\n ${prompt}\n\n`,
    max_tokens: 3000, // Increase this value to allow for longer responses
    n: 1,
    stop: null,
    temperature: 0.8,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const responseData = await response.json();
  const result = responseData.choices && responseData.choices[0] && responseData.choices[0].text;
  return result || 'No response generated.';
}
