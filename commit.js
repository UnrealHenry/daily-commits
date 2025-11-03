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

// Fetch random fact from API Ninjas
function fetchFact() {
  return new Promise((resolve, reject) => {
    https.get('https://uselessfacts.jsph.pl/random.json?language=en', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const fact = JSON.parse(data);
          resolve(fact);
        } catch (error) {
          reject(error);
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
      const quote = await fetchQuote();
      content = `### ${dateString} at ${timeString}\n\n**Quote of the Day:**\n> "${quote.content}"\n>\n> — *${quote.author}*\n\n---\n\n`;
    } else {
      console.log('Fetching random fact...');
      const fact = await fetchFact();
      content = `### ${dateString} at ${timeString}\n\n**Fact of the Day:**\n${fact.text}\n\n---\n\n`;
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
