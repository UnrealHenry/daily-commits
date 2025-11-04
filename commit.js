const https = require('https');
const fs = require('fs');
const path = require('path');

const QUOTES_FILE = 'daily-content.md';

// Fetch random quote from Quotable API
function fetchQuote() {
  return new Promise((resolve, reject) => {
    https.get('https://api.quotable.io/random', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const quote = JSON.parse(data);
          resolve(quote);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Fallback facts in case API fails
const fallbackFacts = [
  "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible.",
  "A day on Venus is longer than its year. Venus takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
  "Octopuses have three hearts and blue blood.",
  "Bananas are berries, but strawberries aren't.",
  "The shortest war in history lasted 38 minutes between Britain and Zanzibar in 1896.",
  "A group of flamingos is called a 'flamboyance'.",
  "The unicorn is the national animal of Scotland.",
  "Sharks existed before trees. Sharks have been around for about 400 million years, while trees evolved around 350 million years ago.",
  "The dot over the letter 'i' is called a tittle.",
  "Wombat poop is cube-shaped."
];

// Fetch random fact from Numbers API
function fetchFact() {
  return new Promise((resolve, reject) => {
    https.get('http://numbersapi.com/random/trivia', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Numbers API returns plain text, not JSON
        if (data && data.length > 0) {
          resolve({ text: data.trim() });
        } else {
          reject(new Error('Empty response'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function addDailyContent() {
  try {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Randomly choose between quote and fact
    const useQuote = Math.random() > 0.5;
    let content = '';

    if (useQuote) {
      console.log('Fetching random quote...');
      try {
        const quote = await fetchQuote();
        content = `### ${dateString} at ${timeString}\n\n**Quote of the Day:**\n> "${quote.content}"\n>\n> — *${quote.author}*\n\n---\n\n`;
      } catch (error) {
        console.log('Quote API failed, using fallback fact...');
        const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        content = `### ${dateString} at ${timeString}\n\n**Fact of the Day:**\n${randomFact}\n\n---\n\n`;
      }
    } else {
      console.log('Fetching random fact...');
      try {
        const fact = await fetchFact();
        content = `### ${dateString} at ${timeString}\n\n**Fact of the Day:**\n${fact.text}\n\n---\n\n`;
      } catch (error) {
        console.log('Fact API failed, using fallback fact...');
        const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        content = `### ${dateString} at ${timeString}\n\n**Fact of the Day:**\n${randomFact}\n\n---\n\n`;
      }
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(QUOTES_FILE)) {
      fs.writeFileSync(QUOTES_FILE, `# Daily Quotes & Facts\n\nAutomatically generated daily content.\n\n---\n\n`);
    }

    // Read existing content
    const existingContent = fs.readFileSync(QUOTES_FILE, 'utf8');

    // Insert new content after the header
    const headerEnd = existingContent.indexOf('---\n\n') + 5;
    const newContent = existingContent.slice(0, headerEnd) + content + existingContent.slice(headerEnd);

    // Write updated content
    fs.writeFileSync(QUOTES_FILE, newContent);

    console.log('✓ Daily content added successfully!');
    console.log(`  Date: ${dateString}`);
    console.log(`  Type: ${useQuote ? 'Quote' : 'Fact'}`);

  } catch (error) {
    console.error('Error adding daily content:', error.message);
    process.exit(1);
  }
}

// Run the script
addDailyContent();
