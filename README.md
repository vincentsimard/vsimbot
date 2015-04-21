vsimbot
=======

vsimbot is an [irc](http://en.wikipedia.org/wiki/Internet_Relay_Chat) bot.
Its features are specific to chess.

**Commands**

- **finger / fi / "who is" / "who's" [icc handle]**: prints the title, name, fide std rating and fide profile url of a player if available. *e.g.: who is capilanobridge?*

- **[pgn] / [fen]**: posts the [pgn](http://en.wikipedia.org/wiki/Portable_Game_Notation) or [fen/epd](http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) to [lichess.org](http://lichess.org) and prints the url. The command only supports basic pgn—no variations or comments. The command is also known to not recognize some fen/epd strings. *e.g.: Look at this game! [Event "Kiel"] [Site "Kiel"] [Date "1893.??.??"] [Result "0-1"] [White "Lindemann"] [Black "Echtermeyer"] [ECO "B01"] 1.e4 d5 2.exd5 Qxd5 3.Ke2 Qe4# 0-1*

- **join / part**: joins/parts your channel if the command is issued from the bot's channel

- **eval [fen]**: prints the engine evaluation of the position

- **eco [eco code]**: prints the name and moves of an opening

- **alert [icc handle]**: enables alerts when a player goes online or offline on ICC (command only available to channel owner). use the same command to disable alerts.

*experimental challenge command*

- **challenge on / off**: enables/disables viewer challenges queue (available to channel owner only)

- **challenge [chess.com handle]**: join the queue to challenge the broadcaster to a game. players can only join the queue once and must wait until their name has been removed from the queue to join again.

- **challenge next**: removes the player at the front of the queue and prints the next challenger name (available to channel owner only)

- **challenge queue**: prints the twitch names of players in the queue

- **challenge clear**: removes the player from the queue. Clears the entire challenge queue if issued by the channel owner

- **challenge info**: prints some usage info related to the challenge command
