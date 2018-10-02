# Mongoose-News-Scrape: All the News That's Fit to Scrape

[Deployed project link](https://mysterious-depths-77108.herokuapp.com)

## Technologies Used

    * Node.js
    * NPM Packages:
        * express
        * express-handlebars
        * mongoose
        * body-parser
        * cheerio
        * request

## Instructions

  Whenever a user visits the site, the app scrape stories from a news outlet of New York Times and display them for the user. Each scraped article should be saved to the application database. At a minimum, the app scrapes and displays the following information for each article:

 * Headline - the title of the article
 * Summary - a short summary of the article
 * Author - author who wrote the article
 * URL - the url to the original article
 * Photo - a photo posted in the article

 Users can also leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles. Users can also delete comments left on articles. All stored comments are visible to every user.

Users can also save articles displayed and revisit them later under "Saved" tab. Users can also delete saved articles. All saved articles are visible to every user.
