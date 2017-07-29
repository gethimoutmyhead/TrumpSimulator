var gameTimers;     //monitors the setInterval instance to run the game
var gameState;      //0 is game over, 1 is running, 2 is paused
var scoreText;
//var newBill;

popularityScore = 70;
senateSupport = 70;
impeachmentTimer = 10; //measured in seconds, when time reaches zero, the game is over, and player loses
impeachmentTimerMax = 100; 


wallCompletionTimer = 300;  //measured in seconds, when time reaches zero, the game is over, and player wins

durationOf5Years = 300;     //a single term occurs over 5 minutes, or 300 seconds

rateOfImpeachment = 1;
rateOfPopularityChange = 1;
rateOfSenateSupportChange = 1;
wallBuildRate = 1;

nextBillString = "";
billSelection = 0;
billType = 0;       //1 is a right wing bill, -1 is a left wing bill
effectOfBillOnSenate = 10;  //how a bill's passing or rejection affects senate support
effectOfBillOnPopularity = 15;  //how a bill's passing affects popularity with the people

effectOfTweetOnPopularity = 15;
effectOfTweetOnSenate = -10;

fireOrRecuseImpeachmentDelay = 50;

maxPopularity = 100;
maxSenateSupport = 100;


timeForNewsFade = 14 * (durationOf5Years / (5 * 365)) * 1000 // 18 days is the longest it will appear on major outlets
timeForBarChange = 1 * (durationOf5Years / (5 * 365)) * 1000 // 1 day for effects of policy change to hit the news

senatePenaltyPoint = 20;    //if senate support drops below this number, impeachment rate increases
popularityPenaltyPoint = 20;    // if popularity drops below this number, impeachment rate increases
var RightBillsToPass = new Array;
var LeftBillsToPass = new Array;
var namesOfStaff = new Array;
var TweetList = new Array;

RightBillsToPass[0] = "Less healthcare for old people";
RightBillsToPass[1] = "Guns for school children";
RightBillsToPass[2] = "Ban Gays in Education";
RightBillsToPass[3] = "No more burqas";
RightBillsToPass[4] = "ban immigrants from Iran";
RightBillsToPass[5] = "increase tax on condoms";
totalRightBills = 6;

LeftBillsToPass[0] = "Free health for under 16s";
LeftBillsToPass[1] = "Research into gun violence";
LeftBillsToPass[2] = "Outlaw gay conversion therapy";
LeftBillsToPass[3] = "over the counter contraception tablets";
LeftBillsToPass[4] = "accept refugees from Bahrain";
LeftBillsToPass[5] = "reduce university fees";
totalLeftBills = 6;


namesOfStaff[0] = "FBI Director James Comey";
namesOfStaff[1] = "Attorney General Jeff Sessions";
namesOfStaff[2] = "Senator John McCain";
namesOfStaff[3] = "First Lady Melania Trump";
namesOfStaff[4] = "Senator Bernie Sanders";

TweetList[0] = "With the news covfefe";
TweetList[1] = "I am doing a much better job than President Obama could ever do!";
TweetList[2] = "Maybe its time to start investigating Clinton Server";
TweetList[3] = "Mexicans are responsible for gun violence!";
TweetList[4] = "Rumors of Russia Investigation Fake NEWS!";
totalTweetList = 4;

totalStaffNames = 5;

//selectNewBill();
//freshGame();

function preload() {
    game.load.image('table', 'assets/images/ResoluteDesk.jpg');
    game.load.image('firePhone', 'assets/images/whitePhone.png');
    game.load.image('twitterPhone', 'assets/images/iphone.png');
    game.load.image('iMac', 'assets/images/imac.png');
    game.load.image('bill', 'assets/images/newbill.png');
    game.load.image('trumpSig', 'assets/images/trumpsignature.png');
    game.load.image('vetoStamp', 'assets/images/veto.png');
    game.load.image('twitterbubble', 'assets/images/twitterbubble.png');
    
    
}

function create() {
    game.add.sprite(0, 0, 'table');
    
    twitterPhone = game.add.sprite(600,500, 'twitterPhone');
    firePhone = game.add.sprite(30,420,'firePhone');
    imac = game.add.sprite(450,225,'iMac');
    scoreText = game.add.text(470,245, 'score:', { fontSize: '12px', fill: '#FFFFFF' });

    
    firePhone.inputEnabled = true;
    firePhone.events.onInputDown.add(PardonRecuse, this);
    
    twitterPhone.inputEnabled = true;
    twitterPhone.events.onInputDown.add(Tweet, this);
    
    newBill = game.add.sprite(240,250, 'bill');
    
    billLeft = game.add.tween(newBill);
    billLeft.to({ x: -200 }, 1000, 'Linear', false, 0);
    billLeft.onComplete.add(selectNewBill, this);
    
    billUp = game.add.tween(newBill);
    billUp.to({y: 250}, 1000, 'Linear', false, 0);
    
    billText = game.add.text(newBill.x + 30, (newBill.y + 70), nextBillString,{ fontSize: '12px', fill: '#000000', wordWrap: true, wordWrapWidth: 160  } );
    
    trumpSignature = game.add.sprite((newBill.x + 10), (newBill.y + 230), 'trumpSig');
    vetoStamp = game.add.sprite((newBill.x + 100), (newBill.y + 230), 'vetoStamp');
    
    trumpSignature.inputEnabled = true;
    vetoStamp.inputEnabled = true;
    trumpSignature.alpha = 0.5;
    vetoStamp.alpha = 0.5;
    
    trumpSignature.events.onInputDown.add(ApproveBill, this);
    vetoStamp.events.onInputDown.add(Veto, this);
    
    twitterBubble = game.add.sprite(600,450, 'twitterbubble')
    tweetMessage = game.add.text(665, 465, "Covfefe is not a real word. Made it up!", { fontSize: '10px', fill: '#000000', wordWrap: true, wordWrapWidth: 120  } )
    twitterBubble.alpha = 0;
    tweetMessage.alpha = 0;
    
    freshGame();
}

function update() {
    trumpSignature.x = newBill.x + 10;
    trumpSignature.y = newBill.y + 230;
    
    vetoStamp.x = newBill.x + 100;
    vetoStamp.y = newBill.y + 230;
    
    billText.x = newBill.x + 30;
    billText.y = newBill.y + 70;
    
    scoreText.text = "Impeachment " + impeachmentTimer + "\nPopularity Score " + popularityScore + "\nSenate Support " + senateSupport + "\nWall Timer " + wallCompletionTimer;
    billText.text = nextBillString;
    if (impeachmentTimer <= 0){
        scoreText.text = scoreText.text + "\nGame Over. You were impeached!";
        gameOver();

    }

    
    if (wallCompletionTimer <= 0){
        scoreText.text = scoreText.text + "\nThe wall is complete. America is now Great Again!";
        gameOver();

    }
    
    if (trumpSignature.input.pointerOver()){
        trumpSignature.alpha = 1.0;
    }
    else{
        trumpSignature.alpha = 0.5;
    }
    if (vetoStamp.input.pointerOver()){
        vetoStamp.alpha = 1.0;
    }
    else{
        vetoStamp.alpha = 0.5;
    }
    
    if (popularityScore < popularityPenaltyPoint || senateSupport < senatePenaltyPoint){
        rateOfImpeachment = 3;
    }
    else{
        rateOfImpeachment = 1;
    }
    
}


function mainloop(){
    
    impeachmentTimer = valBetweenAlt(impeachmentTimer, 0, impeachmentTimerMax);
    popularityScore = valBetweenAlt(popularityScore, 0, maxPopularity);
    senateSupport = valBetweenAlt(senateSupport, 0, maxSenateSupport);
    /**
    document.getElementById("popularityscore").textContent = popularityScore;
    document.getElementById("senatesupport").textContent = senateSupport;
    document.getElementById("impeachmentscore").textContent = impeachmentTimer;
    document.getElementById("wallscore").textContent = wallCompletionTimer;

    **/
    document.getElementById("currentBill").textContent = nextBillString;
    
    popularityBarLength = popularityScore / maxPopularity * 200 + "px";
    $("#popularityBar").animate({width: popularityBarLength}, timeForBarChange);
    
    senateSupportBarLength = senateSupport / maxSenateSupport * 200 + "px";
    $("#senateSupportBar").animate({width: senateSupportBarLength}, timeForBarChange);
        
    impeachmentBarLength = impeachmentTimer / impeachmentTimerMax * 200 + "px";
    $("#impeachmentBar").animate({width: impeachmentBarLength}, timeForBarChange);
    
        
    wallBarLength = (1 - (wallCompletionTimer / durationOf5Years)) * 600 + "px";
    $("#wallBar").animate({width: wallBarLength}, timeForBarChange);
    
    if (popularityScore < popularityPenaltyPoint || senateSupport < senatePenaltyPoint){
        rateOfImpeachment = 3;
    }
    else{
        rateOfImpeachment = 1;
    }
    

    
    
    if (impeachmentTimer > 0 && wallCompletionTimer > 0){   //game has not ended yet, continue the game
        impeachmentTimer -= rateOfImpeachment;
        wallCompletionTimer -= wallBuildRate;
        
    }
    else{   //one of the end conditions has been reached
        finalMessage = "Game Over Man!";
        
        if (impeachmentTimer <= 0){
            finalMessage += "You were impeached!";
        }
        else if (wallCompletionTimer <= 0){
            finalMessage += "The wall is complete. America is Great Again!"
        }
    
        
        
        
        document.getElementById("message").textContent = finalMessage;
    }

    
}

function Veto(){
    if (gameState == 1){
        popularityScore += effectOfBillOnPopularity * billType;
        senateSupport -= effectOfBillOnSenate * billType;

        billLeft.start();
        //selectNewBill();
    }
    
}
function ApproveBill(){
    if (gameState == 1){
        popularityScore -= effectOfBillOnPopularity * billType;
        senateSupport += effectOfBillOnSenate * billType;

        billLeft.start();
        //selectNewBill();
 
    }
}

function selectNewBill(){
    
    newBill.x = 240;
    newBill.y = 600;
    
    billUp.start();
    newBilltoChoose = Math.random();
    if (newBilltoChoose > 0.5){
        billType = -1;  
        billSelection = randomInteger(totalLeftBills);
        nextBillString = LeftBillsToPass[billSelection];
    }
    else
    {
        billType = 1;
        billSelection = randomInteger(totalRightBills);
        nextBillString = RightBillsToPass[billSelection];
    }
    
    
}

function FireSomeone(){
    if (gameState == 1){
        personSelection = randomInteger(totalStaffNames);
        personToFire = namesOfStaff[personSelection];

        impeachmentTimer += fireOrRecuseImpeachmentDelay;
        fireOrRecuseImpeachmentDelay -= 10;
        popularityScore = Math.floor(popularityScore / 2);
        senateSupport = Math.floor(senateSupport / 2);

        document.getElementById("latestEvent").textContent = "BREAKING NEWS! " + personToFire +  " has been fired!";
        $('#latestEvent').show();
        $('#latestEvent').fadeOut(timeForNewsFade);
    }
}

function PardonRecuse(){
    if (gameState == 1){
        personSelection = randomInteger(totalStaffNames);
        nameOfPersonSelected = namesOfStaff[personSelection];

        PardonOrRecuse = Math.random();
        if (PardonOrRecuse > 0.5){
            pardonOrRecuseDecision = "pardoned!";
        }
        else
        {
            pardonOrRecuseDecision = "recused!";
        }

        impeachmentTimer += fireOrRecuseImpeachmentDelay;
        fireOrRecuseImpeachmentDelay -= 10;
        popularityScore = Math.floor(popularityScore / 2);
        senateSupport = Math.floor(senateSupport / 2);

        document.getElementById("latestEvent").textContent = "BREAKING NEWS! " + nameOfPersonSelected +  " has been " + pardonOrRecuseDecision;
        $('#latestEvent').show();
        $('#latestEvent').fadeOut(timeForNewsFade);
    }
}

function Tweet(){
    if (gameState == 1){
        tweetSelection = randomInteger(totalTweetList);
        tweetMessage.text = TweetList[tweetSelection];

        popularityScore += effectOfTweetOnPopularity;
        senateSupport += effectOfTweetOnSenate;

        effectOfTweetOnPopularity -= 2; //every tweet gradually becomes less effective on popularity until it has a negative effect

        twitterBubble.alpha = 1.0;
        tweetMessage.alpha = 1.0;
        
        bubbleFade = game.add.tween(twitterBubble);
        tweetFade = game.add.tween(tweetMessage);
        
        bubbleFade.to({alpha: 0.0}, 3000);
        tweetFade.to({alpha: 0.0}, 3000);
        bubbleFade.start();
        tweetFade.start();
        
        document.getElementById("latestEvent").textContent = "Latest Tweet: " + tweetMessage.text;
        $('#latestEvent').show();
        $('#latestEvent').fadeOut(timeForNewsFade);
    }
}

function valBetweenAlt(val, min, max) {
    if (val > min) {
        if (val < max) {
            return val;
        } else return max;
    } else return min;
}

function randomInteger(maxVal){
    randomInt = Math.floor(Math.random() * maxVal);
    return (randomInt);
}

function freshGame(){
    
    popularityScore = 70;
    senateSupport = 70;
    impeachmentTimer = 100; //measured in seconds, when time reaches zero, the game is over, and player loses
    impeachmentTimerMax = 100; 


    wallCompletionTimer = 300;  //measured in seconds, when time reaches zero, the game is over, and player wins

    durationOf5Years = 300;     //a single term occurs over 5 minutes, or 300 seconds

    rateOfImpeachment = 1;
    rateOfPopularityChange = 1;
    rateOfSenateSupportChange = 1;
    wallBuildRate = 1;

    nextBillString = "";
    billSelection = 0;
    billType = 0;       //1 is a right wing bill, -1 is a left wing bill
    effectOfBillOnSenate = 10;  //how a bill's passing or rejection affects senate support
    effectOfBillOnPopularity = 15;  //how a bill's passing affects popularity with the people

    effectOfTweetOnPopularity = 15;
    effectOfTweetOnSenate = -10;

    fireOrRecuseImpeachmentDelay = 50;

    maxPopularity = 100;
    maxSenateSupport = 100;


    timeForNewsFade = 14 * (durationOf5Years / (5 * 365)) * 1000 // 18 days is the longest it will appear on major outlets
    timeForBarChange = 1 * (durationOf5Years / (5 * 365)) * 1000 // 1 day for effects of policy change to hit the news

    senatePenaltyPoint = 20;    //if senate support drops below this number, impeachment rate increases
    popularityPenaltyPoint = 20;    // if popularity drops below this number, impeachment rate increases
    
    gameTimers = setInterval(mainVariableCountDown,1000);
    selectNewBill();
    gameState = 1;
}

function mainVariableCountDown(){
    if (gameState == 1){
        impeachmentTimer -= rateOfImpeachment;
        wallCompletionTimer -= wallBuildRate;
        impeachmentTimer = valBetweenAlt(impeachmentTimer, 0, impeachmentTimerMax);
        popularityScore = valBetweenAlt(popularityScore, 0, maxPopularity);
        senateSupport = valBetweenAlt(senateSupport, 0, maxSenateSupport);
    }
}

function gameOver(){
    clearInterval(gameTimers);
    gameState = 0;
}