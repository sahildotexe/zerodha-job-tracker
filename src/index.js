const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
    try {
      const urlToScrape = "https://careers.zerodha.com/"; 
      const response = await axios.get(urlToScrape);
      const $ = cheerio.load(response.data);
      const my5Divs = $('div.result');
      const jobPostings = [];
      const keywordsToCheck = ["developer", "engineer", "SDE"];

      my5Divs.each((index, element) => {
        const h3Content = $(element).find('h3').text(); 
        if (keywordsToCheck.some(keyword => h3Content.toLowerCase().includes(keyword.toLowerCase()))) {
            jobPostings.push(h3Content);
        }
      });
      
      res.json({ jobPostings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
