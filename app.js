// SETUP VARIABLES
let video;
let poseNet;
let pose;
let audio;

// POSENET MECHANIC VARIABLES
let breathStart = false;
let inhaleComplete = false;
let breathCount = 0;

// BUTTON BOOLEANS
let prettyHands = false;
let motivationalQuotes = false;
let soothingMusic = false;
let sereneSetting = false;
let autoBreather = false;
let autoBreatherProf = false;

// BUTTON MECHANIC BOOLEANS
let prettyHandsButOn = false;
let prettyHandsDraw = false;
let motivationalQuotesButOn = false;
let motivationalQuotesDraw = false;
let soothingMusicButOn = false;
let randomSoundId;
let musicPlaying = false;
let sereneSettingButOn = false;
let autoBreatherButOn = false;
let autoBreatherProfMultiplier = 0;
let autoBreatherProfButOn = false;
let autoBreatherUpgrades = 1;
let upgradeCounted = false;
let nominalAutoBreatherProf = 0;

//DATA HANDLING
let particles = [];
let counter = 500;
let quoteData;
let randomQuoteChoice;
let soundData;
let randomSoundChoice;
let trackName = "";
let mp3URL;

window.alert("To play, raise your palms upward as you inhale and lower them down as you exhale. Enjoy!")

window.addEventListener('load', function() {
    console.log("All Loaded!")
    fetch("https://type.fit/api/quotes")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        quoteData = data;
    });
    fetch("https://freesound.org/apiv2/search/text/?query=soothing&token=vdWfnwlKlxbL6YJGxNHDPrxdzPAluoeNg0Kv5ii4")
    .then(response => response.json())
    .then(data2 => {
        // console.log(data2);
        soundData = data2.results;
        console.log(soundData);
    });
});

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO, function() {
        console.log("Capture Loaded!")
    });
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    audio = document.getElementById("soothingMusicAudio");
}

function modelLoaded() {
    console.log("Model Ready!");
}
  
function gotPoses(poses) {
    // console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
}

function draw() {
    image(video, 0, 0);
    // console.log(breathCount);
    document.getElementById("project__breathCount").innerHTML = "Breath Count : " + breathCount;
    if (pose) {
        if (pose.rightWrist.y >= height && pose.leftWrist.y >= height) {
            if (!inhaleComplete) {
                breathStart = true;
            }
            if (inhaleComplete) {
                breathCount++;
                inhaleComplete = false;
            }
        }
        if (breathStart && pose.rightWrist.y <= pose.rightShoulder.y && pose.leftWrist.y <= pose.leftShoulder.y) {
            inhaleComplete = true;
            breathStart = false;
        }
        // for (i = 0; i < pose.keypoints.length; i++) {
        //     let x = pose.keypoints[i].position.x;
        //     let y = pose.keypoints[i].position.y;
        //     ellipse(x, y, 24);
        // }
        if (prettyHandsDraw == true){
            particles.push(new particle(pose.rightWrist.x, pose.rightWrist.y));
            particles.push(new particle(pose.leftWrist.x, pose.leftWrist.y));
            for (i = 0; i < particles.length; i++){
                particles[i].update();
                particles[i].display();
                if (particles[i].die()) {
                    particles.shift();
                }
            }
        }
        // let numParticles = particles.length
        // console.log(numParticles);
        if (counter % 1000 == 0){
            randomQuoteChoice = Math.floor(Math.random() * quoteData.length);
            // console.log(randomQuoteChoice);
        }
        // console.log(counter);
        if (motivationalQuotesDraw == true) {
            let author = quoteData[randomQuoteChoice].author;
            let quote = quoteData[randomQuoteChoice].text;
            if (author) {
                stroke(0);
                strokeWeight(1);
                fill(255);
                textSize(18);
                textAlign(CENTER);
                text(author, pose.nose.x, pose.nose.y - 50);
                text(quote, pose.nose.x, pose.nose.y - 100);
            }
            if (!author) {
                stroke(0);
                strokeWeight(1);
                fill(255);
                textSize(18);
                textAlign(CENTER);
                text(quote, pose.nose.x, pose.nose.y - 100);
            }
        }
    }
    generateButtons();
    buttonMechanics();
    counter++;
}

// GENERATE BUTTONS
function generateButtons() {
    // PRETTY HANDS BUTTON
    if (breathCount >= 5 && !prettyHands){
        let prettyHandsBut = document.createElement('button');
        prettyHandsBut.id = "prettyHandsBut";
        prettyHandsBut.innerHTML = "Pretty Hands";
        document.getElementsByClassName("prettyHands")[0].appendChild(prettyHandsBut);

        let buttonText1 = document.createElement('p');
        buttonText1.className = "buttonText";
        buttonText1.id = "prettyHandsButText";
        buttonText1.innerHTML = "Pretty Hands Mode: OFF";
        document.getElementsByClassName("prettyHands")[0].appendChild(buttonText1);

        prettyHands = true;
    }
    // MOTIVATIONAL QUOTES BUTTON
    if (breathCount >= 10 && !motivationalQuotes){
        let motiveQuoteBut = document.createElement('button');
        motiveQuoteBut.id = "motivationalQuotesBut";
        motiveQuoteBut.innerHTML = "Motivational Quotes";
        document.getElementsByClassName("motivationalQuotes")[0].appendChild(motiveQuoteBut);

        let buttonText2 = document.createElement('p');
        buttonText2.className = "buttonText";
        buttonText2.id = "motivationalQuotesButText";
        buttonText2.innerHTML = "Motivational Quotes Mode: OFF";
        document.getElementsByClassName("motivationalQuotes")[0].appendChild(buttonText2);

        motivationalQuotes = true;
    }
    // SOOTHING MUSIC BUTTON
    if (breathCount >= 15 && !soothingMusic){
        let soothingMusicBut = document.createElement('button');
        soothingMusicBut.id = "soothingMusicBut";
        soothingMusicBut.innerHTML = "Soothing Music";
        document.getElementsByClassName("soothingMusic")[0].appendChild(soothingMusicBut);

        let buttonText3 = document.createElement('p');
        buttonText3.className = "buttonText";
        buttonText3.id = "soothingMusicButText1";
        buttonText3.innerHTML = "Soothing Music Mode: OFF";
        document.getElementsByClassName("soothingMusic")[0].appendChild(buttonText3);

        let buttonText4 = document.createElement('p');
        buttonText4.className = "buttonText";
        buttonText4.id = "soothingMusicButText2";
        buttonText4.innerHTML = "Track Name: ";
        document.getElementsByClassName("soothingMusic")[0].appendChild(buttonText4);

        soothingMusic = true;
    }
    // SERENE SETTING BUTTON
    if (breathCount >= 20 && !sereneSetting){
        let sereneSettingBut = document.createElement('button');
        sereneSettingBut.id = "sereneSettingBut";
        sereneSettingBut.innerHTML = "Serene Setting";
        document.getElementsByClassName("sereneSetting")[0].appendChild(sereneSettingBut);

        let buttonText5 = document.createElement('p');
        buttonText5.className = "buttonText";
        buttonText5.id = "sereneSettingButText";
        buttonText5.innerHTML = "Serene Setting Mode: OFF";
        document.getElementsByClassName("sereneSetting")[0].appendChild(buttonText5);

        sereneSetting = true;
    }
    // AUTO BREATHER BUTTON
    if (breathCount >= 25 && !autoBreather){
        let autoBreatherBut = document.createElement('button');
        autoBreatherBut.id = "autoBreatherBut";
        autoBreatherBut.innerHTML = "Auto Breather";
        document.getElementsByClassName("autoBreather")[0].appendChild(autoBreatherBut);

        let buttonText6 = document.createElement('p');
        buttonText6.className = "buttonText";
        buttonText6.id = "autoBreatherButText";
        buttonText6.innerHTML = "Auto Breather Mode: OFF";
        document.getElementsByClassName("autoBreather")[0].appendChild(buttonText6);

        autoBreather = true;
    }
    // AUTO BREATHER UPGRADE BUTTON
    if (breathCount >= 25 && !autoBreatherProf){
        let autoBreatherProfBut = document.createElement('button');
        autoBreatherProfBut.id = "autoBreatherProfBut";
        autoBreatherProfBut.innerHTML = "Auto Breather Upgrade";
        document.getElementsByClassName("autoBreatherProf")[0].appendChild(autoBreatherProfBut);

        let buttonText7 = document.createElement('p');
        buttonText7.className = "buttonText";
        buttonText7.id = "autoBreatherProfText1";
        buttonText7.innerHTML = "Auto Breather Proficiency: 1";
        document.getElementsByClassName("autoBreatherProf")[0].appendChild(buttonText7);

        let buttonText8 = document.createElement('p');
        buttonText8.className = "buttonText";
        buttonText8.id = "autoBreatherProfText2";
        buttonText8.innerHTML = "Upgrades Available: 0";
        document.getElementsByClassName("autoBreatherProf")[0].appendChild(buttonText8);

        autoBreatherProf = true;
    }
}

// ACTIVATE BUTTON MECHANICS
function buttonMechanics() {
    // PRETTY HANDS BUTTON
    if (prettyHands) {
        let prettyHandsBut = document.getElementById("prettyHandsBut");
        if (prettyHandsButOn == true) {
            document.getElementById("prettyHandsButText").innerHTML = "Pretty Hands Mode: ON";
            // prettyHandsButOn = false;
        }
        if (prettyHandsButOn == false) {
            document.getElementById("prettyHandsButText").innerHTML = "Pretty Hands Mode: OFF";
            // prettyHandsButOn = true;  
        }
        prettyHandsBut.addEventListener('click', function() {
            prettyHandsButOn = !prettyHandsButOn;
            prettyHandsDraw = !prettyHandsDraw;
        });
    }
    // MOTIVATIONAL QUOTES BUTTON
    if (motivationalQuotes) {
        let motivationalQuotesBut = document.getElementById("motivationalQuotesBut");
        if (motivationalQuotesButOn == true) {
            document.getElementById("motivationalQuotesButText").innerHTML = "Motivational Quotes Mode: ON";
        }
        if (motivationalQuotesButOn == false) {
            document.getElementById("motivationalQuotesButText").innerHTML = "Motivational Quotes Mode: OFF";
        }
        motivationalQuotesBut.addEventListener('click', function() {
            motivationalQuotesButOn = !motivationalQuotesButOn;
            motivationalQuotesDraw = !motivationalQuotesDraw;
        });
    }
    // SOOTHING MUSIC BUTTON
    if (soothingMusic) {
        console.log(musicPlaying);
        let soothingMusicBut = document.getElementById("soothingMusicBut");
        if (soothingMusicButOn == true) {
            document.getElementById("soothingMusicButText1").innerHTML = "Soothing Music Mode: ON";
            document.getElementById("soothingMusicButText2").innerHTML = "Track Name: Test Name" + trackName;
            if (!musicPlaying) {
                randomSoundChoice = Math.floor(Math.random() * soundData.length);
                trackName = soundData[randomSoundChoice].name;
                randomSoundId = soundData[randomSoundChoice].id;
                musicPlaying = true;
                fetch("https://freesound.org/apiv2/sounds/" + randomSoundId + "/?token=vdWfnwlKlxbL6YJGxNHDPrxdzPAluoeNg0Kv5ii4")
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    mp3URL = data.previews['preview-hq-mp3'];
                    // console.log(mp3URL);
                    audio.src = mp3URL;
                    // console.log(audio.src);
                    audio.play();
                    audio.loop = true;
                });
            }
        }
        if (soothingMusicButOn == false) {
            document.getElementById("soothingMusicButText1").innerHTML = "Soothing Music Mode: OFF";
            document.getElementById("soothingMusicButText2").innerHTML = "Track Name: ";
            audio.pause();
            musicPlaying = false;
        }
        soothingMusicBut.addEventListener('click', function() {
            soothingMusicButOn = !soothingMusicButOn;
        });        
    }
    // SERENE SETTING BUTTON
    if (sereneSetting) {
        let sereneSettingBut = document.getElementById("sereneSettingBut");
        if (sereneSettingButOn == true) {
            document.getElementById("sereneSettingButText").innerHTML = "Serene Setting Mode: ON";
            document.getElementById("body").style.color = "ivory";
            document.getElementById("body").style.backgroundImage = "url('download.jpg')";
            document.getElementById("body").style.backgroundRepeat = "no-repeat";
            document.getElementById("body").style.backgroundSize = "cover";
        }
        if (sereneSettingButOn == false) {
            document.getElementById("sereneSettingButText").innerHTML = "Serene Setting Mode: OFF";
            document.getElementById("body").style.color = "black";
            document.getElementById("body").style.backgroundImage = "";
            document.getElementById("body").style.backgroundRepeat = "";
            document.getElementById("body").style.backgroundSize = "";
        }
        sereneSettingBut.addEventListener('click', function() {
            sereneSettingButOn = !sereneSettingButOn;
        });
    }
    // AUTO BREATHER BUTTON
    if (autoBreather) {
        let autoBreatherBut = document.getElementById("autoBreatherBut");
        if (autoBreatherButOn == true) {
            document.getElementById("autoBreatherButText").innerHTML = "Auto Breather Mode: ON";
            if (counter % (Math.floor(400/autoBreatherProfMultiplier)) == 0) {
                breathCount += 1;
            }
        }
        if (autoBreatherButOn == false) {
            document.getElementById("autoBreatherButText").innerHTML = "Auto Breather Mode: OFF";
        }
        autoBreatherBut.addEventListener('click', function() {
            autoBreatherButOn = !autoBreatherButOn;
        });
    }
    // AUTO BREATHER UPGRADE BUTTON
    if (autoBreatherProf) {
        let autoBreatherProfBut = document.getElementById("autoBreatherProfBut");
        document.getElementById("autoBreatherProfText1").innerHTML = "Auto Breather Proficiency: " + nominalAutoBreatherProf;
        document.getElementById("autoBreatherProfText2").innerHTML = "Upgrades Available: " + autoBreatherUpgrades;
        upgradeCounted2 = false;
        if (breathCount % 10 == 0 && !upgradeCounted) {
            autoBreatherUpgrades += 1;
            upgradeCounted = true;
        } 
        if (breathCount % 10 != 0) {
            upgradeCounted = false;
        }
        if (autoBreatherUpgrades >= 1) {
            autoBreatherProfBut.addEventListener('click', function() {
                if (!upgradeCounted2) {
                    autoBreatherUpgrades -= 1;
                    autoBreatherProfMultiplier += 2;
                    nominalAutoBreatherProf += 1;
                    upgradeCounted2 = true;
                }
            });
        }
        console.log(counter);
    }
}

class particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 20;
        this.alpha = 255;
    }

    update() {
        this.r += 3;
        this.alpha -= 5;
    }

    die() {
        if (this.alpha <= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    display() {
        ellipseMode(CENTER);
        noFill();
        strokeWeight(3);
        stroke(255, this.alpha);
        ellipse(this.x, this.y, this.r);
    }
}