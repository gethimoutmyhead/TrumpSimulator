popularityScore = 50;
senateSupport = 50;
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

selectNewBill();

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
    popularityScore += effectOfBillOnPopularity * billType;
    senateSupport -= effectOfBillOnSenate * billType;
    
    selectNewBill();
    
}
function ApproveBill(){
    popularityScore -= effectOfBillOnPopularity * billType;
    senateSupport += effectOfBillOnSenate * billType;
    
    selectNewBill();
    
}

function selectNewBill(){
    newBill = Math.random();
    if (newBill > 0.5){
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

function PardonRecuse(){
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

function Tweet(){
    tweetSelection = randomInteger(totalTweetList);
    tweetMessage = TweetList[tweetSelection];
    
    popularityScore += effectOfTweetOnPopularity;
    senateSupport += effectOfTweetOnSenate;
    
    effectOfTweetOnPopularity -= 2; //every tweet gradually becomes less effective on popularity until it has a negative effect
    
    document.getElementById("latestEvent").textContent = "Latest Tweet: " + tweetMessage;
    $('#latestEvent').show();
    $('#latestEvent').fadeOut(timeForNewsFade);
    
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