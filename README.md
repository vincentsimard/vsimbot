vsimbot
=======

vsimbot is an [irc](http://en.wikipedia.org/wiki/Internet_Relay_Chat) bot.
Its features are specific to chess.

**Commands**

- **finger / fi / "who is" / "who's" [icc handle]**: prints the title, name, fide std rating and fide profile url of a player if available. *e.g.: who is capilanobridge?*

- **[pgn] / [fen]**: posts the [pgn](http://en.wikipedia.org/wiki/Portable_Game_Notation) or [fen/epd](http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) to [chesspastebin.com](http://chesspastebin.com/) and prints the url. The command only supports basic pgn—no variations or comments. The command is also known to not recognize some fen/epd strings. *e.g.: Look at this game! [Event "Kiel"] [Site "Kiel"] [Date "1893.??.??"] [Result "0-1"] [White "Lindemann"] [Black "Echtermeyer"] [ECO "B01"] 1.e4 d5 2.exd5 Qxd5 3.Ke2 Qe4# 0-1*

- **join / part**: joins/parts your channel if the command is issued from this channel

- **eval [fen]** (experimental): prints the engine evaluation of the position

- **eco [eco code]**: prints the name and moves of an opening

- **watch [icc handle]**: enables alerts when a player goes online or offline on ICC (command only available to channel owner). use the same command to disable alerts.