# 🏟️ Family Feud ! – A Trivia Game in HTML

An interactive trivia game built using vanilla html and JavaScript inspired by the TV show **"Family Feud"**.  
The game is built as a board of survey responses with a set of clues and answers that players must guess.

---

## 🎮 Game Description

- There are up to **2 players or teams**:
    - Team 1
    - Team 2
- The game board shows a blank for each answer in the survey
- Clicking on the answer or pressing the corresponding number key shows the answer
- Each answer has a point value associated with it
- Each round uses a point multiplier that increases with each round
- At the end of each round, the money is awarded to the winning team unsing the point corresponding Award button
- The next round starts when the host clicks the "New Question" button
- The game is over when all the surveys are completed and the winner is determined by wich player/team has the most money 
- The host should print the game board and clues to paper for easy reference during the game before hand

---

## ⌨️ Game Controls

- **T** – Starts the theme music  
- **Shift+T** – Stops the theme music  
- **Number Keys 1-8** – Show the corresponding answer  
- **X** – Indicate the answer given is incorrect  
- **R** – Reset the X count
- Minimal on-screen interaction/clicks — the game is intended to be run quickly by a host

---

##  📸 Screenshots

The Board
![Alt text](/media/board.png?raw=true "The Board")

---

## 🔍 Clue Generation Sources

[Family Feud Survey Databse](https://www.familyfeudinfo.com/sitemap.php")

---

## 🗂️ Project Structure

Surveys are written in the game.js file and loaded when the page loads.  The game board is built dynamically using JavaScript and the game logic is handled by the game.js file.

```txt
css/        # CSS files  (ignore)
fonts/      # font files (ignore)    
images/     # image files (ignore)
sounds/     # sound files (ignore)
js/
├── vendor/            # third party libraries
├── main.js            # maps images in directory stucture 
├── plugins.js         # third party plugins
│
feud.html      # main HTML file (ignore)
game.json      # game surveys **Edit this one**
|

```

---

## 🧾 JSON format (schema)

Your game is described by a single JSON object with a few top-level fields, and a list of surveys.

---

### Top-level shape

```json
{
  "questions": [ /* REQUIRED: list of 4-6 categories */ ],
}
```

### Question object

A **question** represents one survey set of the top answers with their point values.

```json
{
  "SURVEY QUESTION TEXT": [ /* list of top answers */ ]
}
```

### Answer array

An **answer** represents a single survey response with its point value.

```json
["ANSWER TEXT", POINT VALUE]

```

---

## 📦 Installation

1. Desgined to be run in IIS, but can be run in any web server
2. Clone or download the repository
3. Edit the `game.json` file to add or modify your own surveys
4. Open the `feud.html` file in a web browser
5. **Print** the game board and clues to paper for the host
6. Enjoy!