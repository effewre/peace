/**
 *Copyright 2015 partybot
 *Modifications (including forks) of the code to fit personal needs are allowed only for personal use and should refer back to the original source.
 *This software is not for profit, any extension, or unauthorised person providing this software is not authorised to be in a position of any monetary gain from this use of this software. Any and all money gained under the use of the software (which includes donations) must be passed on to the original author.
 */


(function () {

    /*window.onerror = function() {
        var room = JSON.parse(localStorage.getItem("partybotRoom"));
        window.location = 'https://plug.dj/latvianpaartyroom';
    };*/

    API.getWaitListPosition = function(id){
        if(typeof id === 'undefined' || id === null){
            id = API.getUser().id;
        }
        var wl = API.getWaitList();
        for(var i = 0; i < wl.length; i++){
            if(wl[i].id === id){
                return i;
            }
        }
        return -1;
    };

   		var kill = function () {
        clearInterval(partybot.room.autodisableInterval);
        clearInterval(partybot.room.afkInterval);
        partybot.status = false;
    };

    var storeToStorage = function () {
        localStorage.setItem("partybot.settings", JSON.stringify(partybot.settings));
        localStorage.setItem("partybotRoom", JSON.stringify(partybot.room));
        var partybotStorageInfo = {
            time: Date.now(),
            stored: true,
            version: partybot.version
        };
        localStorage.setItem("partybotStorageInfo", JSON.stringify(partybotStorageInfo));

    };

    var subChat = function (chat, obj) {
        if (typeof chat === "undefined") {
            API.chatLog("There is a chat text missing.");
            console.log("There is a chat text missing.");
            return "Dziesmai nebija pieejams video, tādēļ tiek skipota!";

            // TODO: Get missing chat messages from source.
        }
        var lit = '%%';
        for (var prop in obj) {
            chat = chat.replace(lit + prop.toUpperCase() + lit, obj[prop]);
        }
        return chat;
    };

    var loadChat = function (cb) {
        if (!cb) cb = function () {
        };
        $.get("https://rawgit.com/effewre/peace/master/langIndex.json", function (json) {
             var link = partybot.chatLink;
            if (json !== null && typeof json !== "undefined") {
                langIndex = json;
                link = langIndex[partybot.settings.language.toLowerCase()];
                if (partybot.settings.chatLink !== partybot.chatLink) {
                    link = partybot.settings.chatLink;
                }
                else {
                    if (typeof link === "undefined") {
                        link = partybot.chatLink;
                    }
                }
                $.get(link, function (json) {
                    if (json !== null && typeof json !== "undefined") {
                        if (typeof json === "string") json = JSON.parse(json);
                        partybot.chat = json;
                        cb();
                    }
                });
            }
            else {
                $.get(partybot.chatLink, function (json) {
                    if (json !== null && typeof json !== "undefined") {
                        if (typeof json === "string") json = JSON.parse(json);
                        partybot.chat = json;
                        cb();
                    }
                });
            }
        });
    };

    var retrieveSettings = function () {
        var settings = JSON.parse(localStorage.getItem("partybot.settings"));
        if (settings !== null) {
            for (var prop in settings) {
                partybot.settings[prop] = settings[prop];
            }
        }
    };

     var retrieveFromStorage = function () {
        var info = localStorage.getItem("partybotStorageInfo");
        if (info === null) API.chatLog(partybot.chat.nodatafound);
        else {
            var settings = JSON.parse(localStorage.getItem("partybot.settings"));
            var room = JSON.parse(localStorage.getItem("partybotRoom"));
            var elapsed = Date.now() - JSON.parse(info).time;
            if ((elapsed < 1 * 60 * 60 * 1000)) {
                API.chatLog(partybot.chat.retrievingdata);
                for (var prop in settings) {
                    partybot.settings[prop] = settings[prop];
                }
                partybot.room.users = room.users;
                partybot.room.afkList = room.afkList;
                partybot.room.historyList = room.historyList;
                partybot.room.mutedUsers = room.mutedUsers;
                partybot.room.autoskip = room.autoskip;
                partybot.room.roomstats = room.roomstats;
                partybot.room.messages = room.messages;
                partybot.room.queue = room.queue;
                partybot.room.newBlacklisted = room.newBlacklisted;
                API.chatLog(partybot.chat.datarestored);
            }
        }
    var json_sett = null;
        var roominfo = document.getElementById("room-settings");
        info = roominfo.textContent;
        var ref_bot = "@partybot=";
        var ind_ref = info.indexOf(ref_bot);
        if (ind_ref > 0) {
            var link = info.substring(ind_ref + ref_bot.length, info.length);
            var ind_space = null;
            if (link.indexOf(" ") < link.indexOf("\n")) ind_space = link.indexOf(" ");
            else ind_space = link.indexOf("\n");
            link = link.substring(0, ind_space);
            $.get(link, function (json) {
                if (json !== null && typeof json !== "undefined") {
                    json_sett = JSON.parse(json);
                    for (var prop in json_sett) {
                        partybot.settings[prop] = json_sett[prop];
                    }
                }
            });
        }

    };

	String.prototype.splitBetween = function (a, b) {
        var self = this;
        self = this.split(a);
        for (var i = 0; i < self.length; i++) {
            self[i] = self[i].split(b);
        }
        var arr = [];
        for (var i = 0; i < self.length; i++) {
            if (Array.isArray(self[i])) {
                for (var j = 0; j < self[i].length; j++) {
                    arr.push(self[i][j]);
                }
            }
            else arr.push(self[i]);
        }
        return arr;
    };
	
	String.prototype.startsWith = function(str) {
    return this.substring(0, str.length) === str;
    };


		function linkFixer(msg) {
        var parts = msg.splitBetween('<a href="', '<\/a>');
        for (var i = 1; i < parts.length; i = i + 2) {
            var link = parts[i].split('"')[0];
            parts[i] = link;
        }
        var m = '';
        for (var i = 0; i < parts.length; i++) {
            m += parts[i];
        }
        return m;
    };

	function decodeEntities(s) {
        var str, temp = document.createElement('p');
        temp.innerHTML = s;
        str = temp.textContent || temp.innerText;
        temp = null;
        return str;
    };

    var botCreator = " GrizZZ^ (skype: edzhiits11) un imperiālists :beer: (skype: durant16)";
    var botCreatorIDs = [];

    var partybot = {
        version: "2.1 BETA",
        status: false,
        name: "PartyBot",
        loggedInID: null,
        scriptLink: "https://rawgit.com/effewre/peace/master/partybot.js",
        cmdLink: "https://lvpr.co/forum/topic/16-partybot-komandas/",
        chatLink: "https://rawgit.com/effewre/peace/master/lv.json",
        chat: null,
        loadChat: loadChat,
        retrieveSettings: retrieveSettings,
        retrieveFromStorage: retrieveFromStorage,
        settings: {
            botName: "PartyBot",
            language: "latvian",
            chatLink: "https://rawgit.com/effewre/peace/master/lv.json",
			startupCap: 1,
            startupVolume: 0,
            startupEmoji: false,
            maximumAfk: 60,
			smartSkip: false,
            cmdDeletion: true,
            afkRemoval: false,
            maximumDc: 60,
            bouncerPlus: false,
            blacklistEnabled: true,
            lockdownEnabled: false,
            lockGuard: true,
            maximumLocktime: 10,
            cycleGuard: true,
            maximumCycletime: 10,
            voteSkip: true,
            voteSkipLimit: 10,
			historySkip: true,
            timeGuard: true,
            maximumSongLength: 7,
			bingolength: 100,
            autodisable: false,
            commandCooldown: 30,
            usercommandsEnabled: true,
			skipPosition: 3,
            skipReasons: [
                ["theme", "This song does not fit the room theme. "],
                ["op", "This song is on the OP list. "],
                ["history", "Šī dziesma atrodas atskaņoto dziesmu vēturē. "],
                ["mix", "You played a mix, which is against the rules. "],
                ["sound", "The song you played had bad sound quality or no sound. "],
                ["nsfw", "The song you contained was NSFW (image or sound). "],
                ["unavailable", "Šī dziesma dažiem lietotājiem nebija pieejama. "]
            ],
			  ballze: [
			"Tu labi zini, ka gribi dzirdēt atbildi?",
			"Nedusmini mani!",
			"Nezinu, tikai nekod!",
            "Tas ir mans un Katas mazais noslēpums.",
            "Eu breksi, tu man to jautā?",
            "Neko nezinu un negribu zināt. (nedzirdu/neredzu)",
            "Mājās par to parunāsim.",
            "Ja pateiksi, ka mīli mani, tad atbildēšu.",  
            "Ko tu pīpē?",
            "Jā, nav šaubu.",
            "Nevaru pateikt taisnību, jo tas varētu sabojāt manu reputāciju.",
            "Tikai vājuma brīžos.",
            "Jautā Anetei, viņa zina labāk!",
            "Citi saka, ka jā.",
            "Tikai ne šeit.",
            "To es tev pateikšu, ja tu man uzsauksi kādu labu dzērienu (40%+).",
            "Tikai pa svētkiem.",
            "Kā tu uzminēji!",
            "Atbilde tikai par pieklājīgu samaksu.",
            "Naktī zem segas. ",
            "Protams, citādi taču dzīve nebūtu interesanta.",
            "Netraucē mani, es guļu.",
            "Pipsis ir profesionālis šajā jomā",
            "Fanāts uz šo jautājumu var atbildēt jebkurā diennakts laikā!",
            "Skew Beats par to runā nepārtraukti.",
            "imperiālists cenšas to noskaidrot",
            "Tikai zem grādiem.",
            "Es nevaru iedomāties savu dzīvi bez tā.",
            "Gan jau, ka Tu pats zini atbildi.",
            "Haha, ļoti asprātīgi! Pat mans kaķis smejas.",
            "GrizZZ^ pa sotaku to atbildēs...",
            "Tiešām, bet es zinu, ka tu zodz saldumus.",
            "Beidziet man uzdot tos jautājumus, ļaujiet vienreiz atvilkt elpu!",
            "Mamma Tev nav mācījusi manieres?",
            "Tu pats saprati, ko uzrakstīji?",
            "Andris Bērziņš uz šo atbildētu : Čali, pa galvu vajag, ja, ilgi neesi sists tikai ja?",
			"Tu neuzvelc mani, ja?",
			"Par to vēl zinātnieki strīdas",
			"imperiālists nebūtu priecīgs šo dzirdot",
			"Kāpēc gan Tev šo nepajautāt GrizZZ^?",
			"Pipsis būtu kategoriski PAR",
			"Labāk nebūtu prasījis",
			"Atbildi atradīsi paskatoties spogulī",
			"Jā, tāpat kā Skew Beats",
			"Cilvēks tekstā virs manis par to ir informēts",
			"Par atbildi gaidu aukstu aliņu no Tevis",
			"Tu par sevi runā?",
			"Jā, un Anete arī tajā ir iesaistīta",
			"Nē, es tam neticu",
			"Jā, tā nu tas tiešām ir",
			"Kauns nemaz nav ko tādu uzdot?",
			"Es nedomāju, ka to vajadzēja teikt skaļi",
			"Jā, kopā ar Fanātu",
			"Par to mēs aprunāsimies bez lieciniekiem."
            ],
			ratesong:[
			":fatality:",
			":smoke:",
			":cage:",
			":sax:",
			":gandalf:",
			":hiding:",
			":weed:",
			":haha:",
			":god:",
			":watislove:",
			":bestcry:",
			":vibe:",
			":molester:",
			":kim:",
			":hitler:",
			":dilmapalm:",
			":freestep:",
			":okne:",
			":okay:",
			":gay:"
			],
            afkpositionCheck: null,
            afkRankCheck: "ambassador",
            motdEnabled: false,
            motdInterval: 1,
            motd: null,
            filterChat: true,
            etaRestriction: false,
            welcome: true,
            opLink: null,
            rulesLink: "https://lvpr.co/forum/topic/3-noteikumi-plugdj/",
			blackLIst: "https://lvpr.co/forum/topic/14-blacklist-info/",
            themeLink: null,
            fbLink: null,
            youtubeLink: null,
            website: "https://lvpr.co/forum/",
            intervalMessages: null,
			messageInterval: 25,
            songstats: false,
            commandLiteral: "!",
            blacklists: {
                NSFW: "https://rawgit.com/effewre/peace/master/blacklist.json",
                OP: ""
            }
        },
        room: {
			name: null,
            chatMessages: [],
            users: [],
            afkList: [],
            mutedUsers: [],
            bannedUsers: [],
            skippable: true,
            usercommand: true,
            allcommand: true,
            afkInterval: null,
            autoskip: false,
            autoskipTimer: null,
            autodisableInterval: null,
            autodisableFunc: function () {
                if (partybot.status && partybot.settings.autodisable) {
                    API.sendChat('!afkdisable');
                    API.sendChat('!joindisable');
                }
            },
            queueing: 0,
            queueable: true,
            currentDJID: null,
            historyList: [],
            cycleTimer: setTimeout(function () {
            }, 1),
            roomstats: {
                accountName: null,
                totalWoots: 0,
                totalCurates: 0,
                totalMehs: 0,
                launchTime: null,
                songCount: 0,
                chatmessages: 0
            },
            messages: {
                from: [],
                to: [],
                message: []
            },
            queue: {
                id: [],
                position: []
            },
            blacklists: {
			NSFW: "https://rawgit.com/effewre/peace/master/blacklist.json"
            },
            newBlacklisted: [],
            newBlacklistedSongFunction: null,
            roulette: {
                rouletteStatus: false,
                participants: [],
                countdown: null,
                startRoulette: function () {
                   partybot.room.roulette.rouletteStatus = true;
                    partybot.room.roulette.countdown = setTimeout(function () {
                        partybot.room.roulette.endRoulette();
                    }, 60 * 1000);
                    API.sendChat(partybot.chat.isopen);
                },
                endRoulette: function () {
                    partybot.room.roulette.rouletteStatus = false;
					var ind = undefined;
                    ind = Math.floor((Math.random() * partybot.room.roulette.participants.length)+ 0);
					var winner = undefined;
                    winner = partybot.room.roulette.participants[ind];
                    partybot.room.roulette.participants = [];
                    var pos = 1;
					var user = undefined;
                    user = partybot.userUtilities.lookupUser(winner);
					var name = undefined;
                    name = user.username;
                    API.sendChat(subChat(partybot.chat.winnerpicked, {name: name, position: pos}));
                    setTimeout(function (winner, pos) {
                        partybot.userUtilities.moveUser(winner, pos, false);
                    }, 1 * 1000, winner, pos);
                }
            }
        },
       User: function (id, name) {
            this.id = id;
            this.username = name;
            this.jointime = Date.now();
            this.lastActivity = Date.now();
            this.votes = {
                woot: 0,
                meh: 0,
                curate: 0
            };
            this.lastEta = null;
            this.afkWarningCount = 0;
            this.afkCountdown = null;
            this.inRoom = true;
            this.isMuted = false;
            this.lastDC = {
                time: null,
                position: null,
                songCount: 0
            };
            this.lastKnownPosition = null;
        },
        userUtilities: {
            getJointime: function (user) {
                return user.jointime;
            },
            getUser: function (user) {
                return API.getUser(user.id);
            },
            updatePosition: function (user, newPos) {
                user.lastKnownPosition = newPos;
            },
            updateDC: function (user) {
                user.lastDC.time = Date.now();
                user.lastDC.position = user.lastKnownPosition;
                user.lastDC.songCount = partybot.room.roomstats.songCount;
            },
            setLastActivity: function (user) {
                user.lastActivity = Date.now();
                user.afkWarningCount = 0;
                clearTimeout(user.afkCountdown);
            },
            getLastActivity: function (user) {
                return user.lastActivity;
            },
            getWarningCount: function (user) {
                return user.afkWarningCount;
            },
            setWarningCount: function (user, value) {
                user.afkWarningCount = value;
            },
            lookupUser: function (id) {
                for (var i = 0; i < partybot.room.users.length; i++) {
                    if (partybot.room.users[i].id === id) {
                        return partybot.room.users[i];
                    }
                }
                return false;
            },
            lookupUserName: function (name) {
                for (var i = 0; i < partybot.room.users.length; i++) {
                    var match = partybot.room.users[i].username.trim() == name.trim();
                    if (match) {
                        return partybot.room.users[i];
                    }
                }
                return false;
            },
            voteRatio: function (id) {
                var user = partybot.userUtilities.lookupUser(id);
                var votes = user.votes;
                if (votes.meh === 0) votes.ratio = 1;
                else votes.ratio = (votes.woot / votes.meh).toFixed(2);
                return votes;

            },
            getPermission: function (obj) { //1 requests
                var u;
                if (typeof obj === "object") u = obj;
                else u = API.getUser(obj);
                for (var i = 0; i < botCreatorIDs.length; i++) {
                    if (botCreatorIDs[i].indexOf(u.id) > -1) return 10;
                }
                if (u.gRole < 2) return u.role;
                else {
                    switch (u.gRole) {
                        case 2:
                            return 7;
                        case 3:
                            return 8;
                        case 4:
                            return 9;
                        case 5:
                            return 10;
                    }
                }
                return 0;
            },
           moveUser: function (id, pos, priority) {
                var user = partybot.userUtilities.lookupUser(id);
                var wlist = API.getWaitList();
                if (API.getWaitListPosition(id) === -1) {
                    if (wlist.length < 50) {
                        API.moderateAddDJ(id);
                        if (pos !== 0) setTimeout(function (id, pos) {
                            API.moderateMoveDJ(id, pos);
                        }, 1250, id, pos);
                    }
                    else {
                        var alreadyQueued = -1;
                        for (var i = 0; i < partybot.room.queue.id.length; i++) {
                            if (partybot.room.queue.id[i] === id) alreadyQueued = i;
                        }
                        if (alreadyQueued !== -1) {
                            partybot.room.queue.position[alreadyQueued] = pos;
                            return API.sendChat(subChat(partybot.chat.alreadyadding, {position: partybot.room.queue.position[alreadyQueued]}));
                        }
                        partybot.roomUtilities.booth.lockBooth();
                        if (priority) {
                            partybot.room.queue.id.unshift(id);
                            partybot.room.queue.position.unshift(pos);
                        }
                        else {
                            partybot.room.queue.id.push(id);
                            partybot.room.queue.position.push(pos);
                        }
                        var name = user.username;
                        return API.sendChat(subChat(partybot.chat.adding, {name: name, position: partybot.room.queue.position.length}));
                    }
                }
                else API.moderateMoveDJ(id, pos);
            },
            dclookup: function (id) {
                var user = partybot.userUtilities.lookupUser(id);
                if (typeof user === 'boolean') return partybot.chat.usernotfound;
                var name = user.username;
                if (user.lastDC.time === null) return subChat(partybot.chat.notdisconnected, {name: name});
                var dc = user.lastDC.time;
                var pos = user.lastDC.position;
                if (pos === null) return partybot.chat.noposition;
                var timeDc = Date.now() - dc;
                var validDC = false;
                if (partybot.settings.maximumDc * 60 * 1000 > timeDc) {
                    validDC = true;
                }
                var time = partybot.roomUtilities.msToStr(timeDc);
                if (!validDC) return (subChat(partybot.chat.toolongago, {name: partybot.userUtilities.getUser(user).username, time: time}));
                var afksRemoved = 0;
                var afkList = partybot.room.afkList;
                for (var i = 0; i < afkList.length; i++) {
                    var timeAfk = afkList[i][1];
                    var posAfk = afkList[i][2];
                    if (dc < timeAfk && posAfk < pos) {
                        afksRemoved++;
                    }
                }
                var newPosition = user.lastDC.position - afksRemoved;
                if (newPosition <= 0) return subChat(partybot.chat.notdisconnectedd, {name: partybot.userUtilities.getUser(user).username, time: time});
				var msg = subChat(partybot.chat.valid, {name: partybot.userUtilities.getUser(user).username, time: time, position: newPosition});
                partybot.userUtilities.moveUser(user.id, newPosition, true);
                return msg;
            }
        },

        roomUtilities: {
            rankToNumber: function (rankString) {
                var rankInt = null;
                switch (rankString) {
                    case "admin":
                        rankInt = 10;
                        break;
                    case "ambassador":
                        rankInt = 7;
                        break;
                    case "host":
                        rankInt = 5;
                        break;
                    case "cohost":
                        rankInt = 4;
                        break;
                    case "manager":
                        rankInt = 3;
                        break;
                    case "bouncer":
                        rankInt = 2;
                        break;
                    case "residentdj":
                        rankInt = 1;
                        break;
                    case "user":
                        rankInt = 0;
                        break;
                }
                return rankInt;
            },
             msToStr: function (msTime) {
                var ms, msg, timeAway;
                msg = '';
                timeAway = {
                    'days': 0,
                    'hours': 0,
                    'minutes': 0,
                    'seconds': 0
                };
                ms = {
                    'day': 24 * 60 * 60 * 1000,
                    'hour': 60 * 60 * 1000,
                    'minute': 60 * 1000,
                    'second': 1000
                };
                if (msTime > ms.day) {
                    timeAway.days = Math.floor(msTime / ms.day);
                    msTime = msTime % ms.day;
                }
                if (msTime > ms.hour) {
                    timeAway.hours = Math.floor(msTime / ms.hour);
                    msTime = msTime % ms.hour;
                }
                if (msTime > ms.minute) {
                    timeAway.minutes = Math.floor(msTime / ms.minute);
                    msTime = msTime % ms.minute;
                }
                if (msTime > ms.second) {
                    timeAway.seconds = Math.floor(msTime / ms.second);
                }
                if (timeAway.days !== 0) {
                    msg += timeAway.days.toString() + 'd';
                }
                if (timeAway.hours !== 0) {
                    msg += timeAway.hours.toString() + 'h';
                }
                if (timeAway.minutes !== 0) {
                    msg += timeAway.minutes.toString() + 'm';
                }
                if (timeAway.minutes < 1 && timeAway.hours < 1 && timeAway.days < 1) {
                    msg += timeAway.seconds.toString() + 's';
                }
                if (msg !== '') {
                    return msg;
                } else {
                    return false;
                }
            },
            booth: {
                lockTimer: setTimeout(function () {
                }, 1000),
                locked: false,
                lockBooth: function () {
                    API.moderateLockWaitList(!partybot.roomUtilities.booth.locked);
                    partybot.roomUtilities.booth.locked = false;
                    if (partybot.settings.lockGuard) {
                        partybot.roomUtilities.booth.lockTimer = setTimeout(function () {
                            API.moderateLockWaitList(partybot.roomUtilities.booth.locked);
                        }, partybot.settings.maximumLocktime * 60 * 1000);
                    }
                },
                unlockBooth: function () {
                    API.moderateLockWaitList(partybot.roomUtilities.booth.locked);
                    clearTimeout(partybot.roomUtilities.booth.lockTimer);
                }
            },
            afkCheck: function () {
                if (!partybot.status || !partybot.settings.afkRemoval) return void (0);
                var rank = partybot.roomUtilities.rankToNumber(partybot.settings.afkRankCheck);
                var djlist = API.getWaitList();
                var lastPos = Math.min(djlist.length, partybot.settings.afkpositionCheck);
                if (lastPos - 1 > djlist.length) return void (0);
                for (var i = 0; i < lastPos; i++) {
                    if (typeof djlist[i] !== 'undefined') {
                        var id = djlist[i].id;
                        var user = partybot.userUtilities.lookupUser(id);
                        if (typeof user !== 'boolean') {
                            var plugUser = partybot.userUtilities.getUser(user);
                            if (rank !== null && partybot.userUtilities.getPermission(plugUser) <= rank) {
                                var name = plugUser.username;
                                var lastActive = partybot.userUtilities.getLastActivity(user);
                                var inactivity = Date.now() - lastActive;
                                var time = partybot.roomUtilities.msToStr(inactivity);
                                var warncount = user.afkWarningCount;
                                if (inactivity > partybot.settings.maximumAfk * 60 * 1000) {
                                    if (warncount === 0) {
                                        API.sendChat(subChat(partybot.chat.warning1, {name: name, time: time}));
                                        user.afkWarningCount = 3;
                                        user.afkCountdown = setTimeout(function (userToChange) {
                                            userToChange.afkWarningCount = 1;
                                        }, 90 * 1000, user);
                                    }
                                    else if (warncount === 1) {
                                        API.sendChat(subChat(partybot.chat.warning2, {name: name}));
                                        user.afkWarningCount = 3;
                                        user.afkCountdown = setTimeout(function (userToChange) {
                                            userToChange.afkWarningCount = 2;
                                        }, 30 * 1000, user);
                                    }
                                    else if (warncount === 2) {
                                        var pos = API.getWaitListPosition(id);
                                        if (pos !== -1) {
                                            pos++;
                                            partybot.room.afkList.push([id, Date.now(), pos]);
                                            user.lastDC = {

                                                time: null,
                                                position: null,
                                                songCount: 0
                                            };
                                            API.moderateRemoveDJ(id);
                                            API.sendChat(subChat(partybot.chat.afkremove, {name: name, time: time, position: pos, maximumafk: partybot.settings.maximumAfk}));
                                        }
                                        user.afkWarningCount = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            },
			smartSkip: function (reason) {
                var dj = API.getDJ();
                var id = dj.id;
                var waitlistlength = API.getWaitList().length;
                var locked = false;
                partybot.room.queueable = false;

                if (waitlistlength == 50) {
                    partybot.roomUtilities.booth.lockBooth();
                    locked = true;
                }
                setTimeout(function (id) {
                    API.moderateForceSkip();
                    setTimeout(function () {
                        if (typeof reason !== 'undefined') {
                            API.sendChat(reason);
                        }
                    }, 500);
                    partybot.room.skippable = false;
                    setTimeout(function () {
                        partybot.room.skippable = true
                    }, 5 * 1000);
                    setTimeout(function (id) {
                        partybot.userUtilities.moveUser(id, partybot.settings.skipPosition, false);
                        partybot.room.queueable = true;
                        if (locked) {
                            setTimeout(function () {
                                partybot.roomUtilities.booth.unlockBooth();
                            }, 1000);
                        }
                    }, 1500, id);
                }, 1000, id);
            },
           changeDJCycle: function () {
                $.getJSON('/_/rooms/state', function(data) {
                    if (data.data[0].booth.shouldCycle) { // checks "" "shouldCycle": true "" if its true
                        API.moderateDJCycle(false); // Disables the DJ Cycle
                        clearTimeout(partybot.room.cycleTimer); // Clear the cycleguard timer
                    } else { // If cycle is already disable; enable it
                        if (partybot.settings.cycleGuard) { // Is cycle guard on?
                        API.moderateDJCycle(true); // Enables DJ cycle
                        partybot.room.cycleTimer = setTimeout(function () {  // Start timer
                            API.moderateDJCycle(false); // Disable cycle
                        }, partybot.settings.maximumCycletime * 60 * 1000); // The time
                        } else { // So cycleguard is not on?
                         API.moderateDJCycle(true); // Enables DJ cycle
                        }
                    };
                });
            },
            intervalMessage: function () {
                var interval;
                if (partybot.settings.motdEnabled) interval = partybot.settings.motdInterval;
                else interval = partybot.settings.messageInterval;
                if ((partybot.room.roomstats.songCount % interval) === 0 && partybot.status) {
                    var msg;
                    if (partybot.settings.motdEnabled) {
                        msg = partybot.settings.motd;
                    }
                    else {
                        if (partybot.settings.intervalMessages.length === 0) return void (0);
                        var messageNumber = partybot.room.roomstats.songCount % partybot.settings.intervalMessages.length;
                        msg = partybot.settings.intervalMessages[messageNumber];
                    }
                    API.sendChat('/me '+msg);
                }
            },
            updateBlacklists: function () {
                for (var bl in partybot.settings.blacklists) {
                    partybot.room.blacklists[bl] = [];
                    if (typeof partybot.settings.blacklists[bl] === 'function') {
                        partybot.room.blacklists[bl] = partybot.settings.blacklists();
                    }
                    else if (typeof partybot.settings.blacklists[bl] === 'string') {
                        if (partybot.settings.blacklists[bl] === '') {
                            continue;
                        }
                        try {
                            (function (l) {
                                $.get(partybot.settings.blacklists[l], function (data) {
                                    if (typeof data === 'string') {
                                        data = JSON.parse(data);
                                    }
                                    var list = [];
                                    for (var prop in data) {
                                        if (typeof data[prop].mid !== 'undefined') {
                                            list.push(data[prop].mid);
                                        }
                                    }
                                    partybot.room.blacklists[l] = list;
                                })
                            })(bl);
                        }
                        catch (e) {
                            API.chatLog('Error setting' + bl + 'blacklist.');
                            console.log('Error setting' + bl + 'blacklist.');
                            console.log(e);
                        }
                    }
                }
            },
            logNewBlacklistedSongs: function () {
                if (typeof console.table !== 'undefined') {
                    console.table(partybot.room.newBlacklisted);
                }
                else {
                    console.log(partybot.room.newBlacklisted);
                }
            },
            exportNewBlacklistedSongs: function () {
                var list = {};
                for (var i = 0; i < partybot.room.newBlacklisted.length; i++) {
                    var track = partybot.room.newBlacklisted[i];
                    list[track.list] = [];
                    list[track.list].push({
                        title: track.title,
                        author: track.author,
                        mid: track.mid
                    });
                }
                return list;
            }
        },
        eventChat: function (chat) {
            chat.message = linkFixer(chat.message);
            chat.message = decodeEntities(chat.message);
            chat.message = chat.message.trim();

            partybot.room.chatMessages.push([chat.cid, chat.message, chat.sub, chat.timestamp, chat.type, chat.uid, chat.un]);

            for (var i = 0; i < partybot.room.users.length; i++) {
                if (partybot.room.users[i].id === chat.uid) {
                    partybot.userUtilities.setLastActivity(partybot.room.users[i]);
                    if (partybot.room.users[i].username !== chat.un) {
                        partybot.room.users[i].username = chat.un;
                    }
                }
            }
            if (partybot.chatUtilities.chatFilter(chat)) return void (0);
            if (!partybot.chatUtilities.commandCheck(chat))
                partybot.chatUtilities.action(chat);
        },
       eventUserjoin: function (user) {
            var known = false;
            var index = null;
            for (var i = 0; i < partybot.room.users.length; i++) {
                if (partybot.room.users[i].id === user.id) {
                    known = true;
                    index = i;
                }
            }
            var greet = true;
            var welcomeback = null;
            if (known) {
                partybot.room.users[index].inRoom = true;
                var u = partybot.userUtilities.lookupUser(user.id);
                var jt = u.jointime;
                var t = Date.now() - jt;
                if (t < 10 * 1000) greet = false;
                else welcomeback = true;
            }
            else {
                partybot.room.users.push(new partybot.User(user.id, user.username));
                welcomeback = false;
            }
            for (var j = 0; j < partybot.room.users.length; j++) {
                if (partybot.userUtilities.getUser(partybot.room.users[j]).id === user.id) {
                    partybot.userUtilities.setLastActivity(partybot.room.users[j]);
                    partybot.room.users[j].jointime = Date.now();
                }

            }
            if (partybot.settings.welcome && greet) {
                welcomeback ?
                    setTimeout(function (user) {
                        API.sendChat(subChat(partybot.chat.welcomeback, {name: user.username}));
                    }, 1 * 1000, user)
                    :
                    setTimeout(function (user) {
                        API.sendChat(subChat(partybot.chat.welcome, {name: user.username}));
                    }, 1 * 1000, user);
            }
        },
        eventUserleave: function (user) {
            var lastDJ = API.getHistory()[0].user.id;
            for (var i = 0; i < partybot.room.users.length; i++) {
                if (partybot.room.users[i].id === user.id) {
                    partybot.userUtilities.updateDC(partybot.room.users[i]);
                    partybot.room.users[i].inRoom = false;
                    if (lastDJ == user.id){
                        var user = partybot.userUtilities.lookupUser(partybot.room.users[i].id);
                        partybot.userUtilities.updatePosition(user, 0);
                        user.lastDC.time = null;
                        user.lastDC.position = user.lastKnownPosition;
                    }
                }
            }
        },
       eventVoteupdate: function (obj) {
            for (var i = 0; i < partybot.room.users.length; i++) {
                if (partybot.room.users[i].id === obj.user.id) {
                    if (obj.vote === 1) {
                        partybot.room.users[i].votes.woot++;
                    }
                    else {
                        partybot.room.users[i].votes.meh++;
                    }
                }
            }

            var mehs = API.getScore().negative;
            var woots = API.getScore().positive;
            var dj = API.getDJ();
            var timeLeft = API.getTimeRemaining();
            var timeElapsed = API.getTimeElapsed();
			
           if (partybot.settings.voteSkip) {
                if ((mehs - woots) >= (partybot.settings.voteSkipLimit)) {
                    API.sendChat(subChat(partybot.chat.voteskipexceededlimit, {name: dj.username, limit: partybot.settings.voteSkipLimit}));
                    if (partybot.settings.smartSkip && timeLeft > timeElapsed){
                        partybot.roomUtilities.smartSkip();
                    }
                    else {
                        API.moderateForceSkip();
                    }
                }
            }

        },
        eventCurateupdate: function (obj) {
            for (var i = 0; i < partybot.room.users.length; i++) {
                if (partybot.room.users[i].id === obj.user.id) {
                    partybot.room.users[i].votes.curate++;
                }
            }
        },
        eventDjadvance: function (obj) {
            if (partybot.settings.autowoot) {
                $("#woot").click(); // autowoot
            }
			var user = partybot.userUtilities.lookupUser(obj.dj.id)
            for(var i = 0; i < partybot.room.users.length; i++){
                if(partybot.room.users[i].id === user.id){
                    partybot.room.users[i].lastDC = {
                        time: null,
                        position: null,
                        songCount: 0
                    };
                }
            }

            
			var lastplay = obj.lastPlay;
            if (typeof lastplay === 'undefined') return;
            if (partybot.settings.songstats) {
                if (typeof partybot.chat.songstatistics === "undefined") {
                    API.sendChat("/me " + lastplay.media.author + " - " + lastplay.media.title + ": " + lastplay.score.positive + "W/" + lastplay.score.grabs + "G/" + lastplay.score.negative + "M.")
                }
                else {
                    API.sendChat(subChat(partybot.chat.songstatistics, {artist: lastplay.media.author, title: lastplay.media.title, woots: lastplay.score.positive, grabs: lastplay.score.grabs, mehs: lastplay.score.negative}))
                }
            }
            partybot.room.roomstats.totalWoots += lastplay.score.positive;
            partybot.room.roomstats.totalMehs += lastplay.score.negative;
            partybot.room.roomstats.totalCurates += lastplay.score.grabs;
            partybot.room.roomstats.songCount++;
            partybot.roomUtilities.intervalMessage();
            partybot.room.currentDJID = obj.dj.id;

            
			var blacklistSkip = setTimeout(function () {
            var mid = obj.media.format + ':' + obj.media.cid;
            for (var bl in partybot.room.blacklists) {
                if (partybot.settings.blacklistEnabled) {
                    if (partybot.room.blacklists[bl].indexOf(mid) > -1) {
                        API.sendChat(subChat(partybot.chat.isblacklisted, {blacklist: bl}));
                        return API.moderateForceSkip();
                    }
                }
			}
            }, 2000);
            
			var newMedia = obj.media;
            var timeLimitSkip = setTimeout(function () {
                if (partybot.settings.timeGuard && newMedia.duration > partybot.settings.maximumSongLength * 60 && !partybot.room.roomevent) {
                    var name = obj.dj.username;
                    API.sendChat(subChat(partybot.chat.timelimit, {name: name, maxlength: partybot.settings.maximumSongLength}));
                    if (partybot.settings.smartSkip){
                        return partybot.roomUtilities.smartSkip();
                    }
                    else {
                        return API.moderateForceSkip();
                    }
                }
            }, 2000);
            var format = obj.media.format;
            var cid = obj.media.cid;
            var naSkip = setTimeout(function () {
                if (format == 1){
                    $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + cid + '&key=AIzaSyDcfWu9cGaDnTjPKhg_dy9mUh6H7i4ePZ0&part=snippet&callback=?', function (track){
                        if (typeof(track.items[0]) === 'undefined'){
                            var name = obj.dj.username;
                            API.sendChat(subChat(partybot.chat.notavailable, {name: name}));
                            if (partybot.settings.smartSkip){
                                return partybot.roomUtilities.smartSkip();
                            }
                            else {
                                return API.moderateForceSkip();
                            }
                        }
                    });
                }
                else {
                    var checkSong = SC.get('/tracks/' + cid, function (track){
                        if (typeof track.title === 'undefined'){
                            var name = obj.dj.username;
                            API.sendChat(subChat(partybot.chat.notavailable, {name: name}));
                            if (partybot.settings.smartSkip){
                                return partybot.roomUtilities.smartSkip();
                            }
                            else {
                                return API.moderateForceSkip();
                            }
                        }
                    });
                }
            }, 2000);
            
			clearTimeout(historySkip);
            if (partybot.settings.historySkip) {
                var alreadyPlayed = false;
                var apihistory = API.getHistory();
                var name = obj.dj.username;
                var historySkip = setTimeout(function () {
                    for (var i = 0; i < apihistory.length; i++) {
                        if (apihistory[i].media.cid === obj.media.cid) {
							alreadyPlayed = true;
                            API.sendChat(subChat(partybot.chat.songknown, {name: name}));
                            if (partybot.settings.smartSkip){
                                return partybot.roomUtilities.smartSkip();
                            }
                            else {
                                return API.moderateForceSkip();
                            }
                        }
                    }
                     if (!alreadyPlayed) {
                        partybot.room.historyList.push([obj.media.cid, +new Date()]);
                    }
                }, 2000);
            }
            if (user.ownSong) {
                API.sendChat(subChat(partybot.chat.permissionownsong, {name: user.username}));
                user.ownSong = false;
            }
             clearTimeout(partybot.room.autoskipTimer);
            if (partybot.settings.autoskip) {
                var remaining = obj.media.duration * 1000;
                var startcid = API.getMedia().cid;
                partybot.room.autoskipTimer = setTimeout(function() {
                    var endcid = API.getMedia().cid;
                    if (startcid === endcid) {
                        API.sendChat('Dziesma uzkārās, skipojam...');
                        API.moderateForceSkip();
                    }
                }, remaining + 5000);
            }
            storeToStorage();
            //sendToSocket();
        },
		eventWaitlistupdate: function (users) {
            if (users.length < 50) {
                if (partybot.room.queue.id.length > 0 && partybot.room.queueable) {
                    partybot.room.queueable = false;
                    setTimeout(function () {
                        partybot.room.queueable = true;
                    }, 500);
                    partybot.room.queueing++;
                    var id, pos;
                    setTimeout(
                        function () {
                            id = partybot.room.queue.id.splice(0, 1)[0];
                            pos = partybot.room.queue.position.splice(0, 1)[0];
                            API.moderateAddDJ(id, pos);
                            setTimeout(
                                function (id, pos) {
                                    API.moderateMoveDJ(id, pos);
                                    partybot.room.queueing--;
                                    if (partybot.room.queue.id.length === 0) setTimeout(function () {
                                        partybot.roomUtilities.booth.unlockBooth();
                                    }, 1000);
                                }, 1000, id, pos);
                        }, 1000 + partybot.room.queueing * 2500);
                }
            }
            for (var i = 0; i < users.length; i++) {
                var user = partybot.userUtilities.lookupUser(users[i].id);
                partybot.userUtilities.updatePosition(user, API.getWaitListPosition(users[i].id) + 1);
            }
        },
         chatcleaner: function (chat) {
            if (!partybot.settings.filterChat) return false;
            if (partybot.userUtilities.getPermission(chat.uid) >= 0) return false;
            var msg = chat.message;
            var containsLetters = false;
            for (var i = 0; i < msg.length; i++) {
                ch = msg.charAt(i);
                if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === ':' || ch === '^') containsLetters = true;
            }
            if (msg === '') {
                return true;
            }
            if (!containsLetters && (msg.length === 3 || msg.length > 5)) return true;
            msg = msg.replace(/[ ,;.:\/=~+%^*\-\\"'&@#]/g, '');
            var capitals = 0;
            var ch;
            for (var i = 0; i < msg.length; i++) {
                ch = msg.charAt(i);
                if (ch >= 'A' && ch <= 'Z') capitals++;
            }
           return false;
        },
         chatUtilities: {
            chatFilter: function (chat) {
                var msg = chat.message;
                var perm = partybot.userUtilities.getPermission(chat.uid);
                var user = partybot.userUtilities.lookupUser(chat.uid);
                var isMuted = false;
                for (var i = 0; i < partybot.room.mutedUsers.length; i++) {
                    if (partybot.room.mutedUsers[i] === chat.uid) isMuted = true;
                }
                if (isMuted) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                if (partybot.settings.lockdownEnabled) {
                    if (perm === 0) {
                        API.moderateDeleteChat(chat.cid);
                        return true;
                    }
                }
                if (partybot.chatcleaner(chat)) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                if (partybot.settings.cmdDeletion && msg.startsWith(partybot.settings.commandLiteral)) {
                    API.moderateDeleteChat(chat.cid);
                }
                 var plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                 if (plugRoomLinkPatt.exec(msg)) {
					 if (perm === 0) {
                    API.sendChat(subChat(partybot.chat.roomadvertising, {name: chat.un}));
                        API.moderateDeleteChat(chat.cid);
                        return true;
					 }
					}
				for (var j = 0; j < partybot.chatUtilities.spam.length; j++) {
				if (msg === partybot.chatUtilities.spam[j]) {
					API.moderateDeleteChat(chat.cid);
					API.sendChat(subChat(partybot.chat.spam, {name: chat.un}));
                    return true;
				}
				}
				for (var j = 0; j < partybot.chatUtilities.randomtext.length; j++) {
				if (msg === partybot.chatUtilities.randomtext[j]) {
					API.moderateDeleteChat(chat.cid);
					API.sendChat(subChat(partybot.chat.spam, {name: chat.un}));
                    return true;
				}
				}
				if (msg === 'skip') {
				API.sendChat(subChat(partybot.chat.askskip, {name: chat.un}));
				API.moderateDeleteChat(chat.cid);
                return false;
				}
                if (msg.indexOf('http://adf.ly/') > -1) {
                    API.moderateDeleteChat(chat.cid);
                    API.sendChat(subChat(partybot.chat.adfly, {name: chat.un}));
                    return true;
                }
				if (msg.indexOf('plug.dj/') > -1) {
                    API.moderateDeleteChat(chat.cid);
                    API.sendChat(subChat(partybot.chat.roomadvertising, {name: chat.un}));
                    return true;
                }
                if (msg.indexOf('autojoin was not enabled') > 0 || msg.indexOf('AFK message was not enabled') > 0 || msg.indexOf('!afkdisable') > 0 || msg.indexOf('!joindisable') > 0 || msg.indexOf('autojoin disabled') > 0 || msg.indexOf('AFK message disabled') > 0) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
               var rlJoinChat = partybot.chat.roulettejoin;
                var rlLeaveChat = partybot.chat.rouletteleave;

                var joinedroulette = rlJoinChat.split('%%NAME%%');
                if (joinedroulette[1].length > joinedroulette[0].length) joinedroulette = joinedroulette[1];
                else joinedroulette = joinedroulette[0];

                var leftroulette = rlLeaveChat.split('%%NAME%%');
                if (leftroulette[1].length > leftroulette[0].length) leftroulette = leftroulette[1];
                else leftroulette = leftroulette[0];

                if ((msg.indexOf(joinedroulette) > -1 || msg.indexOf(leftroulette) > -1) && chat.uid === partybot.loggedInID) {
                    setTimeout(function (id) {
                        API.moderateDeleteChat(id);
                    }, 5 * 1000, chat.cid);
                    return true;
                }
                return false;
            },
            commandCheck: function (chat) {
                var cmd;
                if (chat.message.charAt(0) === partybot.settings.commandLiteral) {
                    var space = chat.message.indexOf(' ');
                    if (space === -1) {
                        cmd = chat.message;
                    }
                    else cmd = chat.message.substring(0, space);
                }
                else return false;
                var userPerm = partybot.userUtilities.getPermission(chat.uid);
                //console.log("name: " + chat.un + ", perm: " + userPerm);
                if (chat.message !== partybot.settings.commandLiteral + 'join' && chat.message !== partybot.settings.commandLiteral + "leave") {
                    if (userPerm === 0 && !partybot.room.usercommand) return void (0);
                    if (!partybot.room.allcommand) return void (0);
                }
                if (chat.message === partybot.settings.commandLiteral + 'eta' && partybot.settings.etaRestriction) {
                    if (userPerm < 2) {
                        var u = partybot.userUtilities.lookupUser(chat.uid);
                        if (u.lastEta !== null && (Date.now() - u.lastEta) < 1 * 60 * 60 * 1000) {
                            API.moderateDeleteChat(chat.cid);
                            return void (0);
                        }
                        else u.lastEta = Date.now();
                    }
                }
                var executed = false;

                for (var comm in partybot.commands) {
                    var cmdCall = partybot.commands[comm].command;
                    if (!Array.isArray(cmdCall)) {
                        cmdCall = [cmdCall]
                    }
                    for (var i = 0; i < cmdCall.length; i++) {
                        if (partybot.settings.commandLiteral + cmdCall[i] === cmd) {
                            partybot.commands[comm].functionality(chat, partybot.settings.commandLiteral + cmdCall[i]);
                            executed = true;
                            break;
                        }
                    }
                }

                if (executed && userPerm === 0) {
                    partybot.room.usercommand = false;
                    setTimeout(function () {
                        partybot.room.usercommand = true;
                    }, partybot.settings.commandCooldown * 1000);
                }
                if (executed) {
                    /*if (partybot.settings.cmdDeletion) {
                        API.moderateDeleteChat(chat.cid);
                    }*/

                    //partybot.room.allcommand = false;
                    //setTimeout(function () {
                        partybot.room.allcommand = true;
                    //}, 5 * 1000);
                }
                return executed;
            },
             action: function (chat) {
                var user = partybot.userUtilities.lookupUser(chat.uid);
                if (chat.type === 'message') {
                    for (var j = 0; j < partybot.room.users.length; j++) {
                        if (partybot.userUtilities.getUser(partybot.room.users[j]).id === chat.uid) {
                            partybot.userUtilities.setLastActivity(partybot.room.users[j]);
                        }

                    }
                }
                partybot.room.roomstats.chatmessages++;
            },
            spam: [
                'ble', 'bļe', 'loh', 'lox', 'bļed', 'bled', 'nahuj', 'suka', 
                'hitler',  'huehue', 'hue', 'huehuehue',
            ],
			randomtext: [
					'mauka','pimpis','lohs','pizģets','bļeģ','šmara','kuce',
					'idiots','pidars','pisies','daunis','huiņa','fuck'+'off',
					'fuck'
			],
            curses: [
                'nigger', 'faggot', 'nigga', 'niqqa', 'motherfucker'
            ]
        },
        connectAPI: function () {
            this.proxy = {
                eventChat: $.proxy(this.eventChat, this),
                eventUserskip: $.proxy(this.eventUserskip, this),
                eventUserjoin: $.proxy(this.eventUserjoin, this),
                eventUserleave: $.proxy(this.eventUserleave, this),
                //eventFriendjoin: $.proxy(this.eventFriendjoin, this),
                eventVoteupdate: $.proxy(this.eventVoteupdate, this),
                eventCurateupdate: $.proxy(this.eventCurateupdate, this),
                eventRoomscoreupdate: $.proxy(this.eventRoomscoreupdate, this),
                eventDjadvance: $.proxy(this.eventDjadvance, this),
                //eventDjupdate: $.proxy(this.eventDjupdate, this),
                eventWaitlistupdate: $.proxy(this.eventWaitlistupdate, this),
                eventVoteskip: $.proxy(this.eventVoteskip, this),
                eventModskip: $.proxy(this.eventModskip, this),
                eventChatcommand: $.proxy(this.eventChatcommand, this),
                eventHistoryupdate: $.proxy(this.eventHistoryupdate, this),

            };
            API.on(API.CHAT, this.proxy.eventChat);
            API.on(API.USER_SKIP, this.proxy.eventUserskip);
            API.on(API.USER_JOIN, this.proxy.eventUserjoin);
            API.on(API.USER_LEAVE, this.proxy.eventUserleave);
            API.on(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
            API.on(API.GRAB_UPDATE, this.proxy.eventCurateupdate);
            API.on(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
            API.on(API.ADVANCE, this.proxy.eventDjadvance);
            API.on(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
            API.on(API.MOD_SKIP, this.proxy.eventModskip);
            API.on(API.CHAT_COMMAND, this.proxy.eventChatcommand);
            API.on(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        disconnectAPI: function () {
            API.off(API.CHAT, this.proxy.eventChat);
            API.off(API.USER_SKIP, this.proxy.eventUserskip);
            API.off(API.USER_JOIN, this.proxy.eventUserjoin);
            API.off(API.USER_LEAVE, this.proxy.eventUserleave);
            API.off(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
            API.off(API.CURATE_UPDATE, this.proxy.eventCurateupdate);
            API.off(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
            API.off(API.ADVANCE, this.proxy.eventDjadvance);
            API.off(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
            API.off(API.MOD_SKIP, this.proxy.eventModskip);
            API.off(API.CHAT_COMMAND, this.proxy.eventChatcommand);
            API.off(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        startup: function () {
            Function.prototype.toString = function () {
                return 'Function.'
            };
            var u = API.getUser();
            if (partybot.userUtilities.getPermission(u) < 2) return API.chatLog(partybot.chat.greyuser);
            if (partybot.userUtilities.getPermission(u) === 2) API.chatLog(partybot.chat.bouncer);
            partybot.connectAPI();
            API.moderateDeleteChat = function (cid) {
                $.ajax({
                    url: "https://plug.dj/_/chat/" + cid,
                    type: "DELETE"
                })
            };

            partybot.room.name = window.location.pathname;
            var Check;

            console.log(partybot.room.name);

            var detect = function(){
                if(partybot.room.name != window.location.pathname){
                    console.log("Killing bot after room change.");
                    storeToStorage();
                    partybot.disconnectAPI();
                    setTimeout(function () {
                        kill();
                    }, 1000);
                    if (partybot.settings.roomLock){
                        window.location = partybot.room.name;
                    }
                    else {
                        clearInterval(Check);
                    }
                }
            };

            Check = setInterval(function(){ detect() }, 2000);

            retrieveSettings();
            retrieveFromStorage();
            window.bot = partybot;
            partybot.roomUtilities.updateBlacklists();
            setInterval(partybot.roomUtilities.updateBlacklists, 60 * 60 * 1000);
            partybot.getNewBlacklistedSongs = partybot.roomUtilities.exportNewBlacklistedSongs;
            partybot.logNewBlacklistedSongs = partybot.roomUtilities.logNewBlacklistedSongs;
            if (partybot.room.roomstats.launchTime === null) {
                partybot.room.roomstats.launchTime = Date.now();
            }

            for (var j = 0; j < partybot.room.users.length; j++) {
                partybot.room.users[j].inRoom = false;
            }
            var userlist = API.getUsers();
            for (var i = 0; i < userlist.length; i++) {
                var known = false;
                var ind = null;
                for (var j = 0; j < partybot.room.users.length; j++) {
                    if (partybot.room.users[j].id === userlist[i].id) {
                        known = true;
                        ind = j;
                    }
                }
                if (known) {
                    partybot.room.users[ind].inRoom = true;
                }
                else {
                    partybot.room.users.push(new partybot.User(userlist[i].id, userlist[i].username));
                    ind = partybot.room.users.length - 1;
                }
                var wlIndex = API.getWaitListPosition(partybot.room.users[ind].id) + 1;
                partybot.userUtilities.updatePosition(partybot.room.users[ind], wlIndex);
            }
            partybot.room.afkInterval = setInterval(function () {
                partybot.roomUtilities.afkCheck()
            }, 10 * 1000);
            partybot.room.autodisableInterval = setInterval(function () {
                partybot.room.autodisableFunc();
            }, 60 * 60 * 1000);
            partybot.loggedInID = API.getUser().id;
            partybot.status = true;
            API.sendChat('/cap ' + partybot.settings.startupCap);
            API.setVolume(partybot.settings.startupVolume);
            if (partybot.settings.autowoot) {
                $("#woot").click();
            }
            if (partybot.settings.startupEmoji) {
                var emojibuttonoff = $(".icon-emoji-off");
                if (emojibuttonoff.length > 0) {
                    emojibuttonoff[0].click();
                }
                API.chatLog(':smile: Emojis enabled.');
            }
            else {
                var emojibuttonon = $(".icon-emoji-on");
                if (emojibuttonon.length > 0) {
                    emojibuttonon[0].click();
                }
                API.chatLog('Emojis disabled.');
            }
            API.chatLog('Avatars capped at ' + partybot.settings.startupCap);
            API.chatLog('Volume set to ' + partybot.settings.startupVolume);
            //socket();
            loadChat(API.sendChat(subChat(partybot.chat.online, {botname: partybot.settings.botName, version: partybot.version})));
        },
       commands: {
            executable: function (minRank, chat) {
                var id = chat.uid;
                var perm = partybot.userUtilities.getPermission(id);
                var minPerm;
                switch (minRank) {
                    case 'admin':
                        minPerm = 10;
                        break;
                    case 'ambassador':
                        minPerm = 7;
                        break;
                    case 'host':
                        minPerm = 5;
                        break;
                    case 'cohost':
                        minPerm = 4;
                        break;
                    case 'manager':
                        minPerm = 3;
                        break;
                    case 'mod':
                        if (partybot.settings.bouncerPlus) {
                            minPerm = 2;
                        }
                        else {
                            minPerm = 3;
                        }
                        break;
                    case 'bouncer':
                        minPerm = 2;
                        break;
                    case 'residentdj':
                        minPerm = 1;
                        break;
                    case 'user':
                        minPerm = 0;
                        break;
					case 'suncis':
					API.getUser(25880164)
						minPerm = 2;
						break;
                    default:
                        API.chatLog('error assigning minimum permission');
                }
                return perm >= minPerm;

            },
            /**
             command: {
                        command: 'cmd',
                        rank: 'user/bouncer/mod/manager',
                        type: 'startsWith/exact',
                        functionality: function(chat, cmd){
                                if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                                if( !partybot.commands.executable(this.rank, chat) ) return void (0);
                                partybot{
                                
                                }
                        }
                },
             **/

          	activeCommand: {
                command: 'active',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var now = Date.now();
                        var chatters = 0;
                        var time;

                        var launchT = partybot.room.roomstats.launchTime;
                        var durationOnline = Date.now() - launchT;
                        var since = durationOnline / 1000;

                        if (msg.length === cmd.length) time = since;
                        else {
                            time = msg.substring(cmd.length + 1);
                            if (isNaN(time)) return API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));
                        }
                        for (var i = 0; i < partybot.room.users.length; i++) {
                            userTime = partybot.userUtilities.getLastActivity(partybot.room.users[i]);
                            if ((now - userTime) <= (time * 60 * 1000)) {
                                chatters++;
                            }
                        }
                        API.sendChat(subChat(partybot.chat.activeusersintime, {name: chat.un, amount: chatters, time: time}));
                    }
                }
            },

				addCommand: {
                command: 'add',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substr(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (msg.length > cmd.length + 2) {
                            if (typeof user !== 'undefined') {
                                if (partybot.room.roomevent) {
                                    partybot.room.eventArtists.push(user.id);
                                }
                                API.moderateAddDJ(user.id);
                            } else API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        }
                    }
                }
            },
				
				afklimitCommand: {
                command: 'afklimit',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nolimitspecified, {name: chat.un}));
                        var limit = msg.substring(cmd.length + 1);
                        if (!isNaN(limit)) {
                            partybot.settings.maximumAfk = parseInt(limit, 10);
                            API.sendChat(subChat(partybot.chat.maximumafktimeset, {name: chat.un, time: partybot.settings.maximumAfk}));
                        }
                        else API.sendChat(subChat(partybot.chat.invalidlimitspecified, {name: chat.un}));
                    }
                }
            },

				afkremovalCommand: {
                command: 'afkremoval',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.afkRemoval) {
                            partybot.settings.afkRemoval = !partybot.settings.afkRemoval;
                            clearInterval(partybot.room.afkInterval);
                            API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.afkremoval}));
                        }
                        else {
                            partybot.settings.afkRemoval = !partybot.settings.afkRemoval;
                            partybot.room.afkInterval = setInterval(function () {
                                partybot.roomUtilities.afkCheck()
                            }, 2 * 1000);
                            API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.afkremoval}));
                        }
                    }
                }
            },

               afkresetCommand: {
                command: 'afkreset',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        partybot.userUtilities.setLastActivity(user);
                        API.sendChat(subChat(partybot.chat.afkstatusreset, {name: chat.un, username: name}));
                    }
                }
            },

            	afktimeCommand: {
                command: 'afktime',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var lastActive = partybot.userUtilities.getLastActivity(user);
                        var inactivity = Date.now() - lastActive;
                        var time = partybot.roomUtilities.msToStr(inactivity);

                        var launchT = partybot.room.roomstats.launchTime;
                        var durationOnline = Date.now() - launchT;

                        if (inactivity == durationOnline){
                            API.sendChat(subChat(partybot.chat.inactivelonger, {botname: partybot.settings.botName, name: chat.un, username: name}));
                        } else {
                        API.sendChat(subChat(partybot.chat.inactivefor, {name: chat.un, username: name, time: time}));
                        }
                    }
                }
            },

				autoskipCommand: {
                command: 'autoskip',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.autoskip) {
                            partybot.settings.autoskip = !partybot.settings.autoskip;
                            clearTimeout(partybot.room.autoskipTimer);
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.autoskip}));
                        }
                        else {
                            partybot.settings.autoskip = !partybot.settings.autoskip;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.autoskip}));
                        }
                    }
                }
            },

          		autowootCommand: {
                command: 'autowoot',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(partybot.chat.autowoot);
                    }
                }
            },

				banCommand: {
                command: 'ban',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substr(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var permFrom = partybot.userUtilities.getPermission(chat.uid);
                        var permUser = partybot.userUtilities.getPermission(user.id);
                        if (permUser >= permFrom) return void(0);
                        API.moderateBanUser(user.id, 1, API.BAN.DAY);
                    }
                }
            },

              blacklistCommand: {
                command: ['blacklist', 'bl'],
                rank: 'cohost',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nolistspecified, {name: chat.un}));
                        var list = msg.substr(cmd.length + 1);
                        if (typeof partybot.room.blacklists[list] === 'undefined') return API.sendChat(subChat(partybot.chat.invalidlistspecified, {name: chat.un}));
                        else {
                            var media = API.getMedia();
                            var timeLeft = API.getTimeRemaining();
                            var timeElapsed = API.getTimeElapsed();
                            var track = {
                                list: list,
                                author: media.author,
                                title: media.title,
                                mid: media.format + ':' + media.cid
                            };
                            partybot.room.newBlacklisted.push(track);
                            partybot.room.blacklists[list].push(media.format + ':' + media.cid);
                            API.sendChat(subChat(partybot.chat.newblacklisted, {name: chat.un, blacklist: list, author: media.author, title: media.title, mid: media.format + ':' + media.cid}));
                            if (partybot.settings.smartSkip && timeLeft > timeElapsed){
                                partybot.roomUtilities.smartSkip();
                            }
                            else {
                                API.moderateForceSkip();
                            }
                            if (typeof partybot.room.newBlacklistedSongFunction === 'function') {
                                partybot.room.newBlacklistedSongFunction(track);
                            }
                        }
                    }
                }
            },

				blinfoCommand: {
                command: 'blinfo',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.blackLIst === "string")
                            return API.sendChat(subChat(partybot.chat.blinfo, {link: partybot.settings.blackLIst}));             }
                }
            },

				clearchatCommand: {
                command: 'clearchat',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var currentchat = $('#chat-messages').children();
                        for (var i = 0; i < currentchat.length; i++) {
                            API.moderateDeleteChat(currentchat[i].getAttribute("data-cid"));
                        }
                        return API.sendChat(subChat(partybot.chat.chatcleared, {name: chat.un}));
                    }
                }
            },

				commandsCommand: {
                command: 'commands',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(subChat(partybot.chat.commandslink, {botname: partybot.settings.botName, link: partybot.cmdLink}));
                    }
                }
            },


				cookieCommand: {
                command: 'cookie',
                rank: 'residentdj',
                type: 'startsWith',
                cookies: ['Še rij, tik neaizrijies ar :cookie: :cookie: :cookie:',
                    'jūsu kontā ieskaitīja cepumu. Lūdzu blenžat savā USB portā, lai saņemtu balvu.',
					'Tagad esi man parādā :cookie: !',
					'Tikai neaizraujies ar :cookie: :cookie: :cookie:'
                ],
                getCookie: function () {
                    var c = Math.floor(Math.random() * this.cookies.length);
                    return this.cookies[c];
                },
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;

                        var space = msg.indexOf(' ');
                        if (space === -1) {
                           return API.sendChat(subChat(partybot.chat.eatcookie, {namefrom: chat.un}));   
                        }
                        else {
                            var name = msg.substring(space + 2);
                            var user = partybot.userUtilities.lookupUserName(name);
                            if (user === false || !user.inRoom) {
                                return API.sendChat(subChat(partybot.chat.nousercookie, {name: name}));
                            }
                            else if (user.username === chat.un) {
                                return API.sendChat(subChat(partybot.chat.selfcookie, {name: name}));
                            }
                            else {
                                return API.sendChat(subChat(partybot.chat.cookie, {nameto: user.username, namefrom: chat.un, cookie: this.getCookie()}));
                            }
                        }
                    }
                }
            },
			            
			bumbierisCommand: {
                command: 'bumbieris',
                rank: 'residentdj',
                type: 'startsWith',
                pears: ['Gribi :pear: ? Nedabūsi! :D',
                    ':pear: ir spēks!',
					'Tagad esi man parādā :pear: !'
                ],
                getpear: function () {
                    var c = Math.floor(Math.random() * this.pears.length);
                    return this.pears[c];
                },
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;

                        var space = msg.indexOf(' ');
                        if (space === -1) {
                            return API.sendChat(subChat(partybot.chat.eatpear, {namefrom: chat.un}));
                        }
                        else {
                            var name = msg.substring(space + 2);
                            var user = partybot.userUtilities.lookupUserName(name);
                            if (user === false || !user.inRoom) {
                                return API.sendChat(subChat(partybot.hat.nouserpear, {name: name}));
                            }
                            else if (user.username === chat.un) {
                                return API.sendChat(subChat(partybot.chat.selfpear, {name: name}));
                            }
                            else {
                                return API.sendChat(subChat(partybot.chat.pear, {nameto: user.username, namefrom: chat.un, pear: this.getpear()}));
                            }
                        }
                    }
                }
            },

            cycleCommand: {
                command: 'cycle',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        partybot.roomUtilities.changeDJCycle();
                    }
                }
            },

            cycleguardCommand: {
                command: 'cycleguard',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.cycleGuard) {
                            partybot.settings.cycleGuard = !partybot.settings.cycleGuard;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.cycleguard}));
                        }
                        else {
                            partybot.settings.cycleGuard = !partybot.settings.cycleGuard;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.cycleguard}));
                        }

                    }
                }
            },

            cycletimerCommand: {
                command: 'cycletimer',
                rank: 'cohost',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var cycleTime = msg.substring(cmd.length + 1);
                        if (!isNaN(cycleTime) && cycleTime !== "") {
                            partybot.settings.maximumCycletime = cycleTime;
                            return API.sendChat(subChat(partybot.chat.cycleguardtime, {name: chat.un, time: partybot.settings.maximumCycletime}));
                        }
                        else return API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));

                    }
                }
            },

				voteskipCommand: {
                command: 'voteskip',
                rank: 'cohost',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length <= cmd.length + 1) return API.sendChat(subChat(partybot.chat.voteskiplimit, {name: chat.un, limit: partybot.settings.voteSkipLimit}));
                        var argument = msg.substring(cmd.length + 1);
                        if (!partybot.settings.voteSkip) partybot.settings.voteSkip = !partybot.settings.voteSkip;
                        if (isNaN(argument)) {
                            API.sendChat(subChat(partybot.chat.voteskipinvalidlimit, {name: chat.un}));
                        }
                        else {
                            partybot.settings.voteSkipLimit = argument;
                            API.sendChat(subChat(partybot.chat.voteskipsetlimit, {name: chat.un, limit: partybot.settings.voteSkipLimit}));
                        }
                    }
                }
            },

                togglevoteskipCommand: {
                command: 'togglevoteskip',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.voteSkip) {
                            partybot.settings.voteSkip = !partybot.settings.voteSkip;
                            API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.voteskip}));
                        }
                        else {
                            partybot.settings.voteSkip = !partybot.settings.voteSkip;
                            API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.voteskip}));
                        }
                    }
                }
            },

            dclookupCommand: {
                command: ['dclookup', 'dc'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substring(cmd.length + 2);
                            var perm = partybot.userUtilities.getPermission(chat.uid);
                            if (perm < 2) return API.sendChat(subChat(partybot.chat.dclookuprank, {name: chat.un}));
                        }
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var toChat = partybot.userUtilities.dclookup(user.id);
                        API.sendChat(toChat);
                    }
                }
            },

            deletechatCommand: {
                command: 'deletechat',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else{
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var chats = $('.from');
                        for (var i = 0; i < chats.length; i++) {
                            var n = chats[i].textContent;
                            if (name.trim() === n.trim()) {
                                var cid = $(chats[i]).parent()[0].getAttribute('data-cid');
                                API.moderateDeleteChat(cid);
                            }
                        }
                        API.sendChat(subChat(partybot.chat.deletechat, {name: chat.un, username: name}));
                    }
                }
            },

            emojiCommand: {
                command: 'emoji',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var link = 'http://www.emoji-cheat-sheet.com/';
                        API.sendChat(subChat(partybot.chat.emojilist, {link: link}));
                    }
                }
            },

            etaCommand: {
                command: 'eta',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var perm = partybot.userUtilities.getPermission(chat.uid);
                        var msg = chat.message;
                        var name;
                        if (msg.length > cmd.length) {
                            if (perm < 2) return void (0);
                            name = msg.substring(cmd.length + 2);
                        } else name = chat.un;
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var pos = API.getWaitListPosition(user.id);
                        if (pos < 0) return API.sendChat(subChat(partybot.chat.notinwaitlist, {name: name}));
                        var timeRemaining = API.getTimeRemaining();
                        var estimateMS = ((pos + 1) * 4 * 60 + timeRemaining) * 1000;
                        var estimateString = partybot.roomUtilities.msToStr(estimateMS);
                        API.sendChat(subChat(partybot.chat.eta, {name: name, time: estimateString}));
                    }
                }
            },

            fbCommand: {
                command: 'fb',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.fbLink === "string")
                            API.sendChat(subChat(partybot.chat.facebook, {link: partybot.settings.fbLink}));
                    }
                }
            },

            filterCommand: {
                command: 'filter',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.filterChat) {
                            partybot.settings.filterChat = !partybot.settings.filterChat;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.chatfilter}));
                        }
                        else {
                            partybot.settings.filterChat = !partybot.settings.filterChat;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.chatfilter}));
                        }
                    }
                }
            },
			
			    ghostbusterCommand: {
                command: 'ghostbuster',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substr(cmd.length + 2);
                        }
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (user === false || !user.inRoom) {
                            return API.sendChat(subChat(partybot.chat.ghosting, {name1: chat.un, name2: name}));
                        }
                        else API.sendChat(subChat(partybot.chat.notghosting, {name1: chat.un, name2: name}));
                    }
                }
            },
            helpCommand: {
                command: 'help',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var link = "http://i.imgur.com/ZeRR07N.png";
                        API.sendChat(subChat(partybot.chat.starterhelp, {link: link}));
                    }
                }
            },
			historyskipCommand: {
                command: 'historyskip',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.historySkip) {
                            partybot.settings.historySkip = !partybot.settings.historySkip;
                            API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.historyskip}));
                        }
                        else {
                            partybot.settings.historySkip = !partybot.settings.historySkip;
                            API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.historyskip}));
                        }
                    }
                }
            },
				
				joinCommand: {
                command: 'join',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
						var dj = API.getDJ().id;
                        if (partybot.room.roulette.rouletteStatus && partybot.room.roulette.participants.indexOf(chat.uid) < 0 && dj !== chat.uid ) {
                            partybot.room.roulette.participants.push(chat.uid);
                            API.sendChat(subChat(partybot.chat.roulettejoin, {name: chat.un}));
                        }
					if (dj === chat.uid)
					{
					API.sendChat(subChat(partybot.chat.roulettejoin1, {name: chat.un}));	
					}
                    }
                }
            },

            jointimeCommand: {
                command: 'jointime',
                rank: 'residentdj',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var join = partybot.userUtilities.getJointime(user);
                        var time = Date.now() - join;
                        var timeString = partybot.roomUtilities.msToStr(time);
                        API.sendChat(subChat(partybot.chat.jointime, {namefrom: chat.un, username: name, time: timeString}));
                    }
                }
            },

            kickCommand: {
                command: 'kick',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var lastSpace = msg.lastIndexOf(' ');
                        var time;
                        var name;
                        if (lastSpace === msg.indexOf(' ')) {
                            time = 0.25;
                            name = msg.substring(cmd.length + 2);
                        }
                        else {
                            time = msg.substring(lastSpace + 1);
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }

                        var user = partybot.userUtilities.lookupUserName(name);
                        var from = chat.un;
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));

                        var permFrom = partybot.userUtilities.getPermission(chat.uid);
                        var permTokick = partybot.userUtilities.getPermission(user.id);

                        if (permFrom <= permTokick)
                            return API.sendChat(subChat(partybot.chat.kickrank, {name: chat.un}));

                        if (!isNaN(time)) {
                            API.sendChat(subChat(partybot.chat.kick, {name: chat.un, username: name, time: time}));
                            if (time > 24 * 60 * 60) API.moderateBanUser(user.id, 1, API.BAN.PERMA);
                            else API.moderateBanUser(user.id, 1, API.BAN.DAY);
                            setTimeout(function (id, name) {
                                API.moderateUnbanUser(id);
                                console.log('Unbanned @' + name + '. (' + id + ')');
                            }, time * 60 * 1000, user.id, name);
                        }
                        else API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

				killCommand: {
                command: 'kaboom',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        storeToStorage();
                        API.sendChat(partybot.chat.kill);
                        partybotdisconnectAPI();
                        setTimeout(function () {
                            kill();
                        }, 1000);
                    }
                }
            },

            leaveCommand: {
                command: 'leave',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var ind = partybot.room.roulette.participants.indexOf(chat.uid);
                        if (ind > -1) {
                            partybotroom.roulette.participants.splice(ind, 1);
                            API.sendChat(subChat(partybot.chat.rouletteleave, {name: chat.un}));
                        }
                    }
                }
            },

            linkCommand: {
                command: 'link',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var media = API.getMedia();
                        var from = chat.un;
                        var user = partybot.userUtilities.lookupUser(chat.uid);
                        var perm = partybot.userUtilities.getPermission(chat.uid);
                        var dj = API.getDJ().id;
                        var isDj = false;
                        if (dj === chat.uid) isDj = true;
                        if (perm >= 1 || isDj) {
                            if (media.format === 1) {
                                var linkToSong = "https://www.youtube.com/watch?v=" + media.cid;
                                API.sendChat(subChat(partybot.chat.songlink, {name: from, link: linkToSong}));
                            }
                            if (media.format === 2) {
                                SC.get('/tracks/' + media.cid, function (sound) {
                                    API.sendChat(subChat(partybot.chat.songlink, {name: from, link: sound.permalink_url}));
                                });
                            }
                        }
                    }
                }
            },

            lockCommand: {
                command: 'lock',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        partybot.roomUtilities.booth.lockBooth();
                    }
                }
            },

            lockdownCommand: {
                command: 'lockdown',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var temp = partybot.settings.lockdownEnabled;
                        partybot.settings.lockdownEnabled = !temp;
                        if (partybot.settings.lockdownEnabled) {
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.lockdown}));
                        }
                        else return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.lockdown}));
                    }
                }
            },

            lockguardCommand: {
                command: 'lockguard',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.lockGuard) {
                            partybot.settings.lockGuard = !partybot.settings.lockGuard;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.lockdown}));
                        }
                        else {
                            partybot.settings.lockGuard = !partybot.settings.lockGuard;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.lockguard}));
                        }
                    }
                }
            },

            lockskipCommand: {
                command: 'lockskip',
                rank: 'cohost',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybotroom.skippable) {
                            var dj = API.getDJ();
                            var id = dj.id;
                            var name = dj.username;
                            var msgSend = '@' + name + ': ';
                            partybotroom.queueable = false;

                            if (chat.message.length === cmd.length) {
                                API.sendChat(subChat(partybot.chat.usedlockskip, {name: chat.un}));
                                partybot.roomUtilities.booth.lockBooth();
                                setTimeout(function (id) {
                                    API.moderateForceSkip();
                                    partybotroom.skippable = false;
                                    setTimeout(function () {
                                        partybotroom.skippable = true
                                    }, 5 * 1000);
                                    setTimeout(function (id) {
                                        partybot.userUtilities.moveUser(id, partybot.settings.lockskipPosition, false);
                                        partybotroom.queueable = true;
                                        setTimeout(function () {
                                            partybot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1500, id);
                                }, 1000, id);
                                return void (0);
                            }
                            var validReason = false;
                            var msg = chat.message;
                            var reason = msg.substring(cmd.length + 1);
                            for (var i = 0; i < partybot.settings.lockskipReasons.length; i++) {
                                var r = partybot.settings.lockskipReasons[i][0];
                                if (reason.indexOf(r) !== -1) {
                                    validReason = true;
                                    msgSend += partybot.settings.lockskipReasons[i][1];
                                }
                            }
                            if (validReason) {
                                API.sendChat(subChat(partybot.chat.usedlockskip, {name: chat.un}));
                                partybot.roomUtilities.booth.lockBooth();
                                setTimeout(function (id) {
                                    API.moderateForceSkip();
                                    partybotroom.skippable = false;
                                    API.sendChat(msgSend);
                                    setTimeout(function () {
                                        partybotroom.skippable = true
                                    }, 5 * 1000);
                                    setTimeout(function (id) {
                                        partybot.userUtilities.moveUser(id, partybot.settings.lockskipPosition, false);
                                        partybotroom.queueable = true;
                                        setTimeout(function () {
                                            partybot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1500, id);
                                }, 1000, id);
                                return void (0);
                            }
                        }
                    }
                }
            },

            lockskipposCommand: {
                command: 'lockskippos',
                rank: 'cohost',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else{
                        var msg = chat.message;
                        var pos = msg.substring(cmd.length + 1);
                        if (!isNaN(pos)) {
                            partybot.settings.lockskipPosition = pos;
                            return API.sendChat(subChat(partybot.chat.lockskippos, {name: chat.un, position: partybot.settings.lockskipPosition}));
                        }
                        else return API.sendChat(subChat(partybot.chat.invalidpositionspecified, {name: chat.un}));
                    }
                }
            },

            locktimerCommand: {
                command: 'locktimer',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var lockTime = msg.substring(cmd.length + 1);
                        if (!isNaN(lockTime) && lockTime !== "") {
                            partybot.settings.maximumLocktime = lockTime;
                            return API.sendChat(subChat(partybot.chat.lockguardtime, {name: chat.un, time: partybot.settings.maximumLocktime}));
                        }
                        else return API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            maxlengthCommand: {
                command: 'maxlength',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var maxTime = msg.substring(cmd.length + 1);
                        if (!isNaN(maxTime)) {
                            partybot.settings.maximumSongLength = maxTime;
                            return API.sendChat(subChat(partybot.chat.maxlengthtime, {name: chat.un, time: partybot.settings.maximumSongLength}));
                        }
                        else return API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            motdCommand: {
                command: 'motd',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length <= cmd.length + 1) return API.sendChat( + partybot.settings.motd);
                        var argument = msg.substring(cmd.length + 1);
                        if (!partybot.settings.motdEnabled) partybot.settings.motdEnabled = !partybot.settings.motdEnabled;
                        if (isNaN(argument)) {
                            partybot.settings.motd = argument;
                            API.sendChat(subChat(partybot.chat.motdset, {msg: partybot.settings.motd}));
                        }
                        else {
                            partybot.settings.motdInterval = argument;
                            API.sendChat(subChat(partybot.chat.motdintervalset, {interval: partybot.settings.motdInterval}));
                        }
                    }
                }
            },

            moveCommand: {
                command: 'move',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var firstSpace = msg.indexOf(' ');
                        var lastSpace = msg.lastIndexOf(' ');
                        var pos;
                        var name;
                        if (isNaN(parseInt(msg.substring(lastSpace + 1)))) {
                            pos = 1;
                            name = msg.substring(cmd.length + 2);
                        }
                        else {
                            pos = parseInt(msg.substring(lastSpace + 1));
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
						if (!isNaN(pos)) {
                            API.sendChat(subChat(partybot.chat.move, {name: chat.un}));
                            partybot.userUtilities.moveUser(user.id, pos, false);
                        } else return API.sendChat(subChat(partybot.chat.invalidpositionspecified, {name: chat.un}));
                    }
                }
            },

                muteCommand: {
                command: 'mute',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var lastSpace = msg.lastIndexOf(' ');
                        var time = null;
                        var name;
                        if (lastSpace === msg.indexOf(' ')) {
                            name = msg.substring(cmd.length + 2);
                            time = 45;
                        } else {
                            time = msg.substring(lastSpace + 1);
                            if (isNaN(time) || time == '' || time == null || typeof time == 'undefined'){
                                return API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));
                            }
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }
                        var from = chat.un;
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var permFrom = partybot.userUtilities.getPermission(chat.uid);
                        var permUser = partybot.userUtilities.getPermission(user.id);
                        if (permUser == 0) {
                            if (time > 45) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                                API.sendChat(subChat(partybot.chat.mutedmaxtime, {name: chat.un, time: '45'}));
                            }
                            else if (time === 45) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                                API.sendChat(subChat(partybot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                            }
                            else if (time > 30) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                                API.sendChat(subChat(partybot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                            }
                            else if (time > 15) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.MEDIUM);
                                API.sendChat(subChat(partybot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                            }
                            else {
                                API.moderateMuteUser(user.id, 1, API.MUTE.SHORT);
                                API.sendChat(subChat(partybot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                            }
                        }
                        else API.sendChat(subChat(partybot.chat.muterank, {name: chat.un}));
                    }
                }
            },

            opCommand: {
                command: 'op',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.opLink === "string")
                            return API.sendChat(subChat(partybot.chat.oplist, {link: partybot.settings.opLink}));
                    }
                }
            },

            alusCommand: {
                command: 'alus',
                rank: 'residentdj',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(partybot.chat.alus)
                    }
                }
            },

            
            reloadCommand: {
                command: 'reload',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat(partybot.chat.reload);
                        storeToStorage();
                        partybotdisconnectAPI();
                        kill();
                        setTimeout(function () {
                            $.getScript(partybotscriptLink);
                        }, 2000);
                    }
                }
            },

				removeCommand: {
                command: 'remove',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length > cmd.length + 2) {
                            var name = msg.substr(cmd.length + 2);
                            var user = partybot.userUtilities.lookupUserName(name);
                            if (typeof user !== 'boolean') {
                                user.lastDC = {
                                    time: null,
                                    position: null,
                                    songCount: 0
                                };
                                if (API.getDJ().id === user.id) {
                                    API.moderateForceSkip();
                                    setTimeout(function () {
                                        API.moderateRemoveDJ(user.id);
                                    }, 1 * 1000, user);
                                }
                                else API.moderateRemoveDJ(user.id);
                            } else API.sendChat(subChat(partybot.chat.removenotinwl, {name: chat.un, username: name}));
                        } else API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                    }
                }
            },
				restrictetaCommand: {
                command: 'restricteta',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.etaRestriction) {
                            partybot.settings.etaRestriction = !partybot.settings.etaRestriction;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.etarestriction}));
                        }
                        else {
                            partybot.settings.etaRestriction = !partybot.settings.etaRestriction;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.etarestriction}));
                        }
                    }
                }
            },

            rouletteCommand: {
                command: 'roulette',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (!partybot.room.roulette.rouletteStatus) {
                            partybot.room.roulette.startRoulette();
                        }
                    }
                }
            },

				rulesCommand: {
                command: 'rules',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.rulesLink === "string")
                            return API.sendChat(subChat(partybot.chat.roomrules, {link: partybot.settings.rulesLink}));
                    }
                }
            },

            	sessionstatsCommand: {
                command: 'sessionstats',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var from = chat.un;
                        var woots = partybot.room.roomstats.totalWoots;
                        var mehs = partybot.room.roomstats.totalMehs;
                        var grabs = partybot.room.roomstats.totalCurates;
                        API.sendChat(subChat(partybot.chat.sessionstats, {name: from, woots: woots, mehs: mehs, grabs: grabs}));
                    }
                }
            },

				skipCommand: {
                command: ['skip'],
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.room.skippable) {

                            var timeLeft = API.getTimeRemaining();
                            var timeElapsed = API.getTimeElapsed();
                            var dj = API.getDJ();
                            var name = dj.username;
                            var msgSend = '@' + name + ', ';

                            if (chat.message.length === cmd.length) {
                                API.sendChat(subChat(partybot.chat.usedskip, {name: chat.un}));
                                if (partybot.settings.smartSkip && timeLeft > timeElapsed){
                                    partybot.roomUtilities.smartSkip();
                                }
                                else {
                                    API.moderateForceSkip();
                                }
                            }
                            var validReason = false;
                            var msg = chat.message;
                            var reason = msg.substring(cmd.length + 1);
                            for (var i = 0; i < partybot.settings.skipReasons.length; i++) {
                                var r = partybot.settings.skipReasons[i][0];
                                if (reason.indexOf(r) !== -1) {
                                    validReason = true;
                                    msgSend += partybot.settings.skipReasons[i][1];
                                }
                            }
                            if (validReason) {
                                API.sendChat(subChat(partybot.chat.usedskip, {name: chat.un}));
                                if (partybot.settings.smartSkip && timeLeft > timeElapsed){
                                    partybot.roomUtilities.smartSkip(msgSend);
                                }
                                else {
                                    API.moderateForceSkip();
                                    setTimeout(function () {
                                        API.sendChat(msgSend);
                                    }, 500);
                                }
                            }
                        }
                    }
                }
            },
			
			songstatsCommand: {
                command: 'songstats',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.songstats) {
                            partybot.settings.songstats = !partybot.settings.songstats;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.songstats}));
                        }
                        else {
                            partybot.settings.songstats = !partybot.settings.songstats;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.songstats}));
                        }
                    }
                }
            },

            sourceCommand: {
                command: 'source',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.sendChat('/me Mani saimnieki ir ' + botCreator + '.');
                    }
                }
            },

            statusCommand: {
                command: 'status',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var from = chat.un;
                        var msg = '/me [@' + from + '] ';

                        msg += partybot.chat.afkremoval + ': ';
                        if (partybot.settings.afkRemoval) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
                        msg += partybot.chat.afksremoved + ": " + partybot.room.afkList.length + '. ';
                        msg += partybot.chat.afklimit + ': ' + partybot.settings.maximumAfk + '. ';

                        msg += 'Bouncer+: ';
                        if (partybot.settings.bouncerPlus) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
												
                        msg += partybot.chat.blacklist + ': ';
                        if (partybot.settings.blacklistEnabled) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += partybot.chat.lockguard + ': ';
                        if (partybot.settings.lockGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += partybot.chat.cycleguard + ': ';
                        if (partybot.settings.cycleGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += partybot.chat.timeguard + ': ';
                        if (partybot.settings.timeGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += partybot.chat.chatfilter + ': ';
                        if (partybot.settings.filterChat) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
						
						msg += partybot.chat.historyskip + ': ';
                        if (partybot.settings.historySkip) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
                        
						msg += partybot.chat.voteskip + ': ';
                        if (partybot.settings.voteskip) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        var launchT = partybotroom.roomstats.launchTime;
                        var durationOnline = Date.now() - launchT;
                        var since = partybot.roomUtilities.msToStr(durationOnline);
                        msg += subChat(partybot.chat.activefor, {time: since});

                        return API.sendChat(msg);
                    }
                }
            },

            swapCommand: {
                command: 'swap',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var firstSpace = msg.indexOf(' ');
                        var lastSpace = msg.lastIndexOf(' ');
                        var name1 = msg.substring(cmd.length + 2, lastSpace);
                        var name2 = msg.substring(lastSpace + 2);
                        var user1 = partybot.userUtilities.lookupUserName(name1);
                        var user2 = partybot.userUtilities.lookupUserName(name2);
                        if (typeof user1 === 'boolean' || typeof user2 === 'boolean') return API.sendChat(subChat(partybot.chat.swapinvalid, {name: chat.un}));
                        if (user1.id === partybot.loggedInID || user2.id === partybot.loggedInID) return API.sendChat(subChat(partybot.chat.addbottowaitlist, {name: chat.un}));
                        var p1 = API.getWaitListPosition(user1.id) + 1;
                        var p2 = API.getWaitListPosition(user2.id) + 1;
                        if (p1 < 0 || p2 < 0) return API.sendChat(subChat(partybot.chat.swapwlonly, {name: chat.un}));
                        API.sendChat(subChat(partybot.chat.swapping, {'name1': name1, 'name2': name2}));
                        if (p1 < p2) {
                            partybot.userUtilities.moveUser(user2.id, p1, false);
                            setTimeout(function (user1, p2) {
                                partybot.userUtilities.moveUser(user1.id, p2, false);
                            }, 2000, user1, p2);
                        }
                        else {
                            partybot.userUtilities.moveUser(user1.id, p2, false);
                            setTimeout(function (user2, p1) {
                                partybot.userUtilities.moveUser(user2.id, p1, false);
                            }, 2000, user2, p1);
                        }
                    }
                }
            },

            themeCommand: {
                command: 'theme',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.themeLink === "string")
                            API.sendChat(subChat(partybot.chat.genres, {link: partybot.settings.themeLink}));
                    }
                }
            },

            timeguardCommand: {
                command: 'timeguard',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.timeGuard) {
                            partybot.settings.timeGuard = !partybot.settings.timeGuard;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.timeguard}));
                        }
                        else {
                            partybot.settings.timeGuard = !partybot.settings.timeGuard;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.timeguard}));
                        }

                    }
                }
            },

            toggleblCommand: {
                command: 'togglebl',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var temp = partybot.settings.blacklistEnabled;
                        partybot.settings.blacklistEnabled = !temp;
                        if (partybot.settings.blacklistEnabled) {
                          return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.blacklist}));
                        }
                        else return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.blacklist}));
                    }
                }
            },
						
            togglemotdCommand: {
                command: 'togglemotd',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.motdEnabled) {
                            partybot.settings.motdEnabled = !partybot.settings.motdEnabled;
                            API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.motd}));
                        }
                        else {
                            partybot.settings.motdEnabled = !partybot.settings.motdEnabled;
                            API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.motd}));
                        }
                    }
                }
            },

            unbanCommand: {
                command: 'unban',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        $(".icon-population").click();
                        $(".icon-ban").click();
                        setTimeout(function (chat) {
                            var msg = chat.message;
                            if (msg.length === cmd.length) return API.sendChat();
                            var name = msg.substring(cmd.length + 2);
                            var bannedUsers = API.getBannedUsers();
                            var found = false;
                            var bannedUser = null;
                            for (var i = 0; i < bannedUsers.length; i++) {
                                var user = bannedUsers[i];
                                if (user.username === name) {
                                    bannedUser = user;
                                    found = true;
                                }
                            }
                            if (!found) {
                                $(".icon-chat").click();
                                return API.sendChat(subChat(partybot.chat.notbanned, {name: chat.un}));
                            }
                            API.moderateUnbanUser(bannedUser.id);
                            console.log("Unbanned " + name);
                            setTimeout(function () {
                                $(".icon-chat").click();
                            }, 1000);
                        }, 1000, chat);
                    }
                }
            },

            unlockCommand: {
                command: 'unlock',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        partybot.roomUtilities.booth.unlockBooth();
                    }
                }
            },


            unmuteCommand: {
                command: 'unmute',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        $.getJSON('/_/mutes', function (json){
                            var msg = chat.message;
                            if (msg.length === cmd.length) return;
                            var name = msg.substring(cmd.length+2);
                            var arg = msg.substring(cmd.length+1);
                            var mutedUsers = json.data;
                            var found = false;
                            var mutedUser = null;
                            var permFrom = partybot.userUtilities.getPermission(chat.uid);
                            if (msg.indexOf('@') === -1 && arg === 'all'){
                                if (permFrom > 2){
                                    for (var i = 0; i < mutedUsers.length; i++){
                                        API.moderateUnmuteUser(mutedUsers[i].id);
                                    }
                                    API.sendChat(subChat(partybot.chat.unmutedeveryone, {name: chat.un}));
                                } else API.sendChat(subChat(partybot.chat.unmuteeveryonerank, {name: chat.un}));
                            } else {
                                for (var i = 0; i < mutedUsers.length; i++){
                                    var user = mutedUsers[i];
                                    if (user.username === name){
                                        mutedUser = user;
                                        found = true;
                                    }
                                }
                                if (!found) return API.sendChat(subChat(partybot.chat.notbanned, {name: chat.un}));
                                API.moderateUnmuteUser(mutedUser.id);
                                console.log('Unmuted:', name);
                            }
                        });
                    }
                }
            },

            usercmdcdCommand: {
                command: 'usercmdcd',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var cd = msg.substring(cmd.length + 1);
                        if (!isNaN(cd)) {
                            partybot.settings.commandCooldown = cd;
                            return API.sendChat(subChat(partybot.chat.commandscd, {name: chat.un, time: partybot.settings.commandCooldown}));
                        }
                        else return API.sendChat(subChat(partybot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            usercommandsCommand: {
                command: 'usercommands',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.usercommandsEnabled) {
                            API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.usercommands}));
                            partybot.settings.usercommandsEnabled = !partybot.settings.usercommandsEnabled;
                        }
                        else {
                            API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.usercommands}));
                            partybot.settings.usercommandsEnabled = !partybot.settings.usercommandsEnabled;
                        }
                    }
                }
            },

            voteratioCommand: {
                command: 'voteratio',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return API.sendChat(subChat(partybot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = partybot.userUtilities.lookupUserName(name);
                        if (user === false) return API.sendChat(subChat(partybot.chat.invaliduserspecified, {name: chat.un}));
                        var vratio = user.votes;
                        var ratio = vratio.woot / vratio.meh;
                        API.sendChat(subChat(partybot.chat.voteratio, {name: chat.un, username: name, woot: vratio.woot, mehs: vratio.meh, ratio: ratio.toFixed(2)}));
                    }
                }
            },

            welcomeCommand: {
                command: 'welcome',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (partybot.settings.welcome) {
                            partybot.settings.welcome = !partybot.settings.welcome;
                            return API.sendChat(subChat(partybot.chat.toggleoff, {name: chat.un, 'function': partybot.chat.welcomemsg}));
                        }
                        else {
                            partybot.settings.welcome = !partybot.settings.welcome;
                            return API.sendChat(subChat(partybot.chat.toggleon, {name: chat.un, 'function': partybot.chat.welcomemsg}));
                        }
                    }
                }
            },

            websiteCommand: {
                command: 'website',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.website === "string")
                            API.sendChat(subChat(partybot.chat.website, {link: partybot.settings.website}));
                    }
                }
            },
			   ballCommand: {
                command: ['ask', 'jautā'],
                rank: 'residentdj',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                            var crowd = API.getUsers();
                            var msg = chat.message;
                            var argument = msg.substring(cmd.length + 1);
                            var randomUser = Math.floor(Math.random() * crowd.length);
                            var randomBall = Math.floor(Math.random() * partybot.settings.ballze.length);
                            var randomSentence = Math.floor(Math.random() * 1);
                            API.sendChat(subChat(partybot.chat.ballze, {name: chat.un, question: argument, response: partybot.settings.ballze[randomBall]}));
                     }
                }
            },
			
			rollCommand: {
                command: ['roll', 'skaitlis'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                            var randomRoll = Math.floor(Math.random() * partybot.settings.bingolength);
                            API.sendChat(subChat(partybot.chat.roll, {name: chat.un, rollnumber: randomRoll}));
                     }
                }
            },
			 bingolengthCommand: {
                command: 'bingolength',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var maxTime = msg.substring(cmd.length + 1);
                        if (!isNaN(maxTime)) {
                            partybot.settings.bingolength = maxTime;
                            return API.sendChat(subChat(partybot.chat.maxbingolength, {name: chat.un, rolllength: partybot.settings.bingolength}));
                        }
                        else return API.sendChat(subChat(partybot.chat.invalidbingo, {name: chat.un}));
                    }
                }
            },
			gifCommand: {
                command: ['gif', 'giphy'],
                rank: 'residentdj',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length !== cmd.length) {
                            function get_id(api_key, fixedtag, func)
                            {
                                $.getJSON(
                                    "https://tv.giphy.com/v1/gifs/random?", 
                                    { 
                                        "format": "json",
                                        "api_key": api_key,
                                        "rating": rating,
                                        "tag": fixedtag
                                    },
                                    function(response)
                                    {
                                        func(response.data.id);
                                    }
                                    )
                            }
                            var api_key = "dc6zaTOxFJmzC"; // public beta key
                            var rating = "pg-13"; // PG 13 gifs
                            var tag = msg.substr(cmd.length + 1);
                            var fixedtag = tag.replace(/ /g,"+");
                            var commatag = tag.replace(/ /g,", ");
                            get_id(api_key, tag, function(id) {
                                if (typeof id !== 'undefined') {
                                    API.sendChat(subChat(partybot.chat.validgiftags, {name: chat.un, id: id, tags: commatag}));
                                } else {
                                    API.sendChat(subChat(partybot.chat.invalidgiftags, {name: chat.un, tags: commatag}));
                                }
                            });
                        }
                        else {
                            function get_random_id(api_key, func)
                            {
                                $.getJSON(
                                    "https://api.giphy.com/v1/gifs/random?", 
                                    { 
                                        "format": "json",
                                        "api_key": api_key,
                                        "rating": rating
                                    },
                                    function(response)
                                    {
                                        func(response.data.id);
                                    }
                                    )
                            }
                            var api_key = "dc6zaTOxFJmzC"; // public beta key
                            var rating = "pg-13"; // PG 13 gifs
                            get_random_id(api_key, function(id) {
                                if (typeof id !== 'undefined') {
                                    API.sendChat(subChat(partybot.chat.validgifrandom, {name: chat.un, id: id}));
                                } else {
                                    API.sendChat(subChat(partybot.chat.invalidgifrandom, {name: chat.un}));
                                }
                            });
                        }
                    }
                }
            },
			songrateCommand: {
                command: ['ratesong'],
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                            var randomgif = Math.floor(Math.random() * partybot.settings.ratesong.length);
                            API.sendChat(subChat(partybot.chat.ratesong, {name: chat.un, response: partybot.settings.ratesong[randomgif]}));
                     }
                }
            },
			infoCommand: {
                command: 'info',
                rank: 'residentdj',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substr(cmd.length + 2);
                        }
                        users = API.getUsers();
                        var len = users.length;
                        for (var i = 0; i < len; ++i){
                            if (users[i].username == name){
                                var id = users[i].id;
                                var avatar = API.getUser(id).avatarID;
                                var level = API.getUser(id).level;
                                var rawjoined = API.getUser(id).joined;
                                var joined = rawjoined.substr(0, 10);
                                var rawlang = API.getUser(id).language;
                                if (rawlang == "en"){
                                    var language = "English";
                                } else if (rawlang == "bg"){
                                    var language = "Bulgarian";
                                } else if (rawlang == "cs"){
                                    var language = "Czech";
                                } else if (rawlang == "fi"){
                                    var language = "Finnish"
                                } else if (rawlang == "fr"){
                                    var language = "French"
                                } else if (rawlang == "pt"){
                                    var language = "Portuguese"
                                } else if (rawlang == "zh"){
                                    var language = "Chinese"
                                } else if (rawlang == "sk"){
                                    var language = "Slovak"
                                } else if (rawlang == "nl"){
                                    var language = "Dutch"
                                } else if (rawlang == "ms"){
                                    var language = "Malay"
                                }
                                var rawstatus = API.getUser(id).status;
                                if (rawstatus == "0"){
                                    var status = "Pieejams";
                                } else if (rawstatus == "1"){
                                    var status = "Izgājis";
                                } else if (rawstatus == "2"){
                                    var status = "Strādā";
                                } else if (rawstatus == "3"){
                                    var status = "Spēlē"
                                }
                                var rawrank = API.getUser(id).role;
                                if (rawrank == "0"){
                                    var rank = "User";
                                } else if (rawrank == "1"){
                                    var rank = "Resident DJ";
                                } else if (rawrank == "2"){
                                    var rank = "Bouncer";
                                } else if (rawrank == "3"){
                                    var rank = "Manager"
                                } else if (rawrank == "4"){
                                    var rank = "Co-Host"
                                } else if (rawrank == "5"){
                                    var rank = "Host"
                                } else if (rawrank == "7"){
                                    var rank = "Brand Ambassador"
                                } else if (rawrank == "10"){
                                    var rank = "Admin"
                                }
                                var slug = API.getUser(id).slug;
                                if (typeof slug !== 'undefined') {
                                    var profile = ", Profile: http://plug.dj/@/" + slug;
                                } else {
                                    var profile = "";
                                }

                                API.sendChat(subChat(partybot.chat.whois, {name1: chat.un, name2: name, id: id, avatar: avatar, profile: profile, language: language, level: level, status: status, joined: joined, rank: rank}));
                            }
                        }
                    }
                }
            },

            youtubeCommand: {
                command: 'youtube',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof partybot.settings.youtubeLink === "string")
                            API.sendChat(subChat(partybot.chat.youtube, {name: chat.un, link: partybot.settings.youtubeLink}));
                    }
                }
            }
        }
    };


    loadChat(partybot.startup);
}).call(this);
