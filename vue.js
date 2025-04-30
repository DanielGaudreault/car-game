<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Car Avoidance Game</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: Arial, sans-serif;
        }
        #game {
            position: relative;
            width: 100vw;
            height: 100vh;
            background-color: #333;
        }
        .road {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #222;
            overflow: hidden;
        }
        .c3-stripe {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: repeating-linear-gradient(
                90deg,
                transparent,
                transparent 50px,
                yellow 50px,
                yellow 100px
            );
            background-size: 200px 100%;
        }
        #car {
            position: absolute;
            width: 50px;
            height: 80px;
            background-color: red;
            z-index: 10;
            transition: top 0.3s ease-out;
        }
        .duba {
            position: absolute;
            width: 40px;
            height: 60px;
            background-color: blue;
            right: 0;
            z-index: 5;
        }
        .controls {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            z-index: 20;
        }
        button {
            padding: 10px 20px;
            margin: 0 5px;
            font-size: 16px;
            cursor: pointer;
        }
        .game-over {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 30;
            display: none;
        }
        .kaza {
            animation: crash 0.5s ease-in-out;
        }
        @keyframes crash {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            50% { transform: rotate(15deg); }
            75% { transform: rotate(-15deg); }
        }
        .yukari {
            transform: translateY(-5px);
        }
        .asagi {
            transform: translateY(5px);
        }
        .elfreni {
            transform: translateY(-10px);
        }
    </style>
</head>
<body>
    <div id="game">
        <div class="road">
            <div class="c3-stripe"></div>
            <div id="car"></div>
            <div class="duba"></div>
        </div>
        <div class="controls">
            <button @click="yukariKayma">Up (↑)</button>
            <button @click="asagiKayma">Down (↓)</button>
            <button @click="elfren">Boost (Space)</button>
            <button @click="tekrar" v-if="oyunBittimi">Restart</button>
        </div>
        <div class="game-over" v-if="oyunBittimi">
            <h2>Game Over!</h2>
            <button @click="tekrar">Play Again</button>
        </div>
    </div>

    <script>
        var vueApp = new Vue({
            el: "#game",
            data: {
                startTime: 0,
                startTimeDuba: 0,
                carTop: 55,
                carLeft: 40,
                dubaTop: [50, 0, 30, 40, 100, 140, 110, 5, 9, 70, 69, 31, 250, 248],
                dubaOto: null,
                yukariAsagiKaymaHizi: 300,
                yukariAsagiKaymaDerecesi: 30,
                yolHizi: 3,
                dubaHizi: 3,
                oyunBittimi: true,
                dubaRight: null,
                kaydir: null,
                dubaKaydir: null,
                score: 0,
                highScore: localStorage.getItem('highScore') || 0
            },
            methods: {
                yolKaydir() {
                    let vw = $(window).width(),
                        car = $("#car"),
                        carw = car.width(),
                        dubaw = $(".duba").width(),
                        ths = this;

                    this.kaydir = setInterval(() => {
                        ths.startTime -= ths.yolHizi;
                        $(".c3-stripe").css("background-position", ths.startTime + "px");
                        this.dubaRight = parseInt($(".duba").css("right"));

                        if (this.dubaRight > vw - carw - 100) {
                            this.carpismaControl();
                        }

                        this.score++;
                    }, 16);
                },

                carpismaControl() {
                    let dubaTopOffset = $(".duba").position().top,
                        carTopOffset = $("#car").position().top,
                        dubaBottomOffset = dubaTopOffset + $(".duba").height(),
                        carBottomOffset = carTopOffset + $("#car").height();

                    // Check if car and obstacle overlap vertically
                    if ((carBottomOffset > dubaTopOffset) && (carTopOffset < dubaBottomOffset)) {
                        // Check if they also overlap horizontally
                        if (this.dubaRight < this.carLeft + $("#car").width()) {
                            this.oyunDurdur();
                        } else {
                            this.dubaOtoKonum();
                        }
                    } else {
                        this.dubaOtoKonum();
                    }
                },

                oyunDurdur() {
                    clearInterval(this.kaydir);
                    clearInterval(this.dubaKaydir);
                    $("#car").addClass("kaza");
                    this.oyunBittimi = true;
                    
                    // Update high score
                    if (this.score > this.highScore) {
                        this.highScore = this.score;
                        localStorage.setItem('highScore', this.highScore);
                    }
                },

                dubaOtoKonum() {
                    this.dubaOto = Math.floor(Math.random() * this.dubaTop.length);
                    let ths = this;

                    this.startTimeDuba = 0;
                    this.dubaHizi = Math.min(this.dubaHizi + 0.2, 20);
                    this.yolHizi = Math.min(this.yolHizi + 0.2, 20);

                    $(".duba").css({
                        "right": ths.startTimeDuba + "px",
                        "top": ths.dubaTop[this.dubaOto] + "px"
                    });
                },

                dubalar() {
                    this.dubaOto = Math.floor(Math.random() * this.dubaTop.length);
                    let ths = this;

                    this.dubaKaydir = setInterval(() => {
                        ths.startTimeDuba += ths.dubaHizi;
                        $(".duba").css("right", ths.startTimeDuba + "px");
                    }, 16);
                },

                arabaPosition() {
                    this.carTop = Math.max(-20, Math.min(this.carTop, 250));
                    $("#car").stop().animate({
                        "top": this.carTop + "px"
                    }, this.yukariAsagiKaymaHizi);
                },

                yukariKayma() {
                    if (this.oyunBittimi) return;
                    this.carTop -= this.yukariAsagiKaymaDerecesi;
                    this.arabaPosition();
                    $("#car").addClass("yukari");
                    setTimeout(() => $("#car").removeClass("yukari"), 300);
                },

                asagiKayma() {
                    if (this.oyunBittimi) return;
                    this.carTop += this.yukariAsagiKaymaDerecesi;
                    this.arabaPosition();
                    $("#car").addClass("asagi");
                    setTimeout(() => $("#car").removeClass("asagi"), 300);
                },

                elfren() {
                    if (this.oyunBittimi) return;
                    this.carTop -= this.yukariAsagiKaymaDerecesi * 2;
                    this.arabaPosition();
                    $("#car").addClass("elfreni");
                    setTimeout(() => $("#car").removeClass("elfreni"), 300);
                },

                tekrar() {
                    clearInterval(this.kaydir);
                    clearInterval(this.dubaKaydir);
                    
                    this.startTime = 0;
                    this.startTimeDuba = 0;
                    this.dubaHizi = 3;
                    this.yolHizi = 3;
                    this.oyunBittimi = false;
                    this.score = 0;
                    
                    $("#car").removeClass("kaza");
                    $(".duba").css({
                        "right": "0px",
                        "top": this.dubaTop[Math.floor(Math.random() * this.dubaTop.length)] + "px"
                    });
                    
                    this.yolKaydir();
                    this.dubalar();
                    this.arabaPosition();
                }
            },
            mounted() {
                let ths = this;
                $(document).on('keydown', function(e) {
                    switch (e.keyCode) {
                        case 38: // Up arrow
                            ths.yukariKayma();
                            break;
                        case 40: // Down arrow
                            ths.asagiKayma();
                            break;
                        case 32: // Space
                            ths.elfren();
                            break;
                        case 82: // R key
                            if (ths.oyunBittimi) ths.tekrar();
                            break;
                    }
                });

                this.arabaPosition();
            }
        });
    </script>
</body>
</html>
