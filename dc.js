				dclookupCommand: {
                command: ['dclookup', 'dc'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!partybotcommands.executable(this.rank, chat)) return void (0);
                    partybot {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        partybot {
                            name = msg.substring(cmd.length + 2);
                            var perm = partybotuserUtilities.getPermission(chat.uid);
                            if (perm < 2) return API.sendChat(subChat(partybotchat.dclookuprank, {name: chat.un}));
                        }
                        var user = partybotuserUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return API.sendChat(subChat(partybotchat.invaliduserspecified, {name: chat.un}));
                        var toChat = partybotuserUtilities.dclookup(user.id);
                        API.sendChat(toChat);
                    }
                }
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
                var songsPassed = partybot.room.roomstats.songCount - user.lastDC.songCount;
                var afksRemoved = 0;
                var afkList = partybot.room.afkList;
                for (var i = 0; i < afkList.length; i++) {
                    var timeAfk = afkList[i][1];
                    var posAfk = afkList[i][2];
                    if (dc < timeAfk && posAfk < pos) {
                        afksRemoved++;
                    }
                }
                var newPosition = user.lastDC.position - songsPassed - afksRemoved;
                if (newPosition <= 0) return subChat(partybot.chat.notdisconnected, {name: name});
                var msg = subChat(partybot.chat.valid, {name: partybot.userUtilities.getUser(user).username, time: time, position: newPosition});
                partybot.userUtilities.moveUser(user.id, newPosition, true);
                return msg;
            }
        },