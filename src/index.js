const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
const {Resend} = require("resend");

dotenv.config();

const app = express();
const port = 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/scrape", async (req, res) => {
  try {
    const urlToScrape = "https://careers.zerodha.com/";
    const response = await axios.get(urlToScrape);
    const $ = cheerio.load(response.data);
    const my5Divs = $("div.result");
    const jobPostings = [];
    const keywordsToCheck = ["developer", "engineer", "SDE"];

    my5Divs.each((index, element) => {
      const h3Content = $(element).find("h3").text();
      if (
        keywordsToCheck.some((keyword) =>
          h3Content.toLowerCase().includes(keyword.toLowerCase())
        )
      ) {
        jobPostings.push(h3Content);
      }
    });

    if (jobPostings.length > 0) {
      await resend.emails.send({
        from: "Zerodha-Job-Tracker <onboarding@resend.dev>",
        to: ["sahilkaling@gmail.com"],
        subject: "Yoo Zerodha has new job openings!",
        text: "Check out the new job openings at Zerodha: https://careers.zerodha.com/",
      });
    }

    res.json({ jobPostings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
