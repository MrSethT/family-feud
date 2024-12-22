var app = {
  version: 1,
  currentQ: 0,
  xCount: 0,
  jsonFile: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/40041/FF3.json",
  board: $(
    "<div class='gameBoard'>" +
    "<!--- Scores --->" +
    "<div class='score' id='boardScore'>0</div>" +
    "<div class='score' id='team1' >0</div>" +
    "<div class='score' id='team2' >0</div>" +
    "<!--- Question --->" +
    "<div class='questionHolder'>" +
    "<span class='question'></span>" +
    "</div>" +
    "<!--- Answers --->" +
    "<div class='colHolder'>" +
    "<div class='col1'></div>" +
    "<div class='col2'></div>" +
    "</div>" +
    "<!--- Buttons --->" +
    "<div class='btnHolder'>" +
    "<div id='awardTeam1' data-team='1' class='button'>Award Team 1</div>" +
    "<div id='newQuestion' class='button'>New Question</div>" +
    "<div id='awardTeam2' data-team='2'class='button'>Award Team 2</div>" +
    "</div>" +
    "<!--- XXX --->" +
    "<div class='XXX'>" +
    "<span class='X1 blinking'>❌</span>" +
    "<span class='X2 blinking'>❌</span>" +
    "<span class='X3 blinking'>❌</span>" +
    "</div >" +
    "</div>" +
    "<div class='print'>" +
    "</div>"
  ),
  // Utility functions
  shuffle: function (array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  jsonLoaded: function (data) {
    console.clear();
    app.allData = data;
    app.questions = Object.keys(data);
    //app.shuffle(app.questions)
    app.makeQuestion(app.currentQ);
    $("body").append(app.board);
    app.makePrint();

  },
  makePrint: function () {
    app.questions.forEach(question => {
      var insert = "";
      insert += `<p>${question}</p><ol>`;

      app.allData[question].forEach(qAnswr => {
        insert += `<li>${qAnswr[0]}</li>`;
      });

      insert += `</ol>`;
      $(".print").append(insert);
    });
  },
  // Action functions
  makeQuestion: function (qNum) {
    var qText = app.questions[qNum];
    var qAnswr = app.allData[qText];

    var aCount = qAnswr.length;
    aCount = aCount < 8 ? 8 : aCount;
    aCount = aCount % 2 != 0 ? aCount + 1 : aCount;

    app.board.find(".blinking").hide();
    app.xCount = 0;

    var boardScore = app.board.find("#boardScore");
    var question = app.board.find(".question");
    var col1 = app.board.find(".col1");
    var col2 = app.board.find(".col2");

    boardScore.html(0);
    question.html(qText.replace(/&x22;/gi, '"'));
    col1.empty();
    col2.empty();

    for (var i = 0; i < aCount; i++) {
      var aLI;
      if (qAnswr[i]) {
        aLI = $(
          "<div class='cardHolder cardHolder" +
          (i + 1) +
          "'>" +
          "<div class='card'>" +
          "<div class='front'>" +
          "<span class='DBG'>" +
          (i + 1) +
          "</span>" +
          "</div>" +
          "<div class='back DBG'>" +
          "<span>" +
          qAnswr[i][0] +
          "</span>" +
          "<b class='LBG' data-value='"+(qAnswr[i][1] * qNum)+"'>" +
          (qAnswr[i][1]) +
          "</b>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>");
      }
      var parentDiv = i < aCount / 2 ? col1 : col2;
      $(aLI).appendTo(parentDiv);
    }

    var cardHolders = app.board.find(".cardHolder");
    var cards = app.board.find(".card");
    var backs = app.board.find(".back");
    var cardSides = app.board.find(".card>div");

    TweenLite.set(cardHolders, { perspective: 800 });
    TweenLite.set(cards, { transformStyle: "preserve-3d" });
    TweenLite.set(backs, { rotationX: 180 });
    TweenLite.set(cardSides, { backfaceVisibility: "hidden" });

    cards.data("flipped", false);

    function showCard() {
      if (app.ding.paused) {
        app.ding.play();
      } else {
        app.ding.currentTime = 0;
      }
      var card = $(".card", this);
      var flipped = $(card).data("flipped");
      var cardRotate = flipped ? 0 : -180;
      TweenLite.to(card, 1, { rotationX: cardRotate, ease: Back.easeOut });
      flipped = !flipped;
      $(card).data("flipped", flipped);
      app.getBoardScore();
    }
    cardHolders.on("click", showCard);
  },
  getBoardScore: function () {
    var cards = app.board.find(".card");
    var boardScore = app.board.find("#boardScore");
    var currentScore = { var: boardScore.html() };
    var score = 0;
    function tallyScore() {
      if ($(this).data("flipped")) {
        var value = $(this)
          .find("b")
          .data("value");
        score += parseInt(value);
      }
    }
    $.each(cards, tallyScore);
    TweenMax.to(currentScore, 1, {
      var: score,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut
    });
  },
  awardPoints: function (num) {
    var num = $(this).attr("data-team");
    var boardScore = app.board.find("#boardScore");
    var currentScore = { var: parseInt(boardScore.html()) };
    var team = app.board.find("#team" + num);
    var teamScore = { var: parseInt(team.html()) };
    var teamScoreUpdated = teamScore.var + currentScore.var;
    TweenMax.to(teamScore, 1, {
      var: teamScoreUpdated,
      onUpdate: function () {
        team.html(Math.round(teamScore.var));
      },
      ease: Power3.easeOut
    });

    TweenMax.to(currentScore, 1, {
      var: 0,
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut
    });
  },
  changeQuestion: function () {
    app.currentQ++;
    app.makeQuestion(app.currentQ);
  },
  buzz: new Audio(
    "sounds/buzz.mp3"
  ),
  ding: new Audio(
    "sounds/ding.mp3"
  ),
  theme: new Audio(
    "sounds/theme.mp3"
  ),

  keypress: function (e) {
    console.log(e.which);
    if (e.which === 88 || e.which === 120) {
      //x
      for (var i = 1; i <= 3; i++) {
        app.board.find(".X" + i).hide();
      }

      if (e.key === "x") {
        app.xCount++;
        for (var i = 1; i <= app.xCount; i++) {
          app.board.find(".X" + i).show();
        }
      } else {
        app.board.find(".X1").show();
      }
      app.board.find(".XXX").show();
      app.buzz.play();
      setTimeout(function () {
        app.board.find(".XXX").hide();
      }, 3000);
    } else if (e.which >= 49 && e.which <= 56) {
      //1-8
      app.board.find(".cardHolder" + (e.which - 48).toString()).click();
    } else if (e.which === 116) {
      //t
      app.theme.play();
    } else if (e.which === 84) {
      //T
      app.theme.pause();
    }
    else if (e.which === 114) {
      //r
      app.xCount = 0;
    }
  },
  // Inital function
  init: function () {
    app.board.find("#newQuestion").on("click", app.changeQuestion);
    app.board.find("#awardTeam1").on("click", app.awardPoints);
    app.board.find("#awardTeam2").on("click", app.awardPoints);
    $(document).on("keypress", $.proxy(app.keypress, this));

    var cachebuster = Math.round(new Date().getTime() / 1000);
    fetch("game.json?" + cachebuster)
      .then((resp) => resp.json())
      .then(function (data) {
        app.questions = data.questions;
        app.jsonLoaded(app.questions);

      });

  },
  // run this code on fued site to copy+format a question
  magic: function(){
    '       "' +  document.getElementsByClassName('content')[0].firstElementChild.innerHTML + '" : [' +  Array.from(  document.getElementsByClassName('answers')[0].getElementsByTagName('tr')).map(element=> '["' + element.getElementsByTagName('th')[0].innerText + '", ' + element.getElementsByTagName('td')[1].innerText + ']').join(',') + '     ';
  }

};
app.init();
//http://www.qwizx.com/gssfx/usa/ff.htm
