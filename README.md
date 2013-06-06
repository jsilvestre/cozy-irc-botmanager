# Description

Cozy IRC BotManager manages a simple IRC Bot from your Cozy. Dead simple!

You can also use it directly from any NodeJS server by simply changing the driver of the ORM we use: JugglingDB.
In config/database.json just change 'cozy-adapter' with a JugglingDB driver suited to your database.

See https://github.com/1602/jugglingdb for all the drivers available!
Since Cozy provides authentification it is not handled by the application. You will have you handle it by yourself if you use the bot manager without Cozy.

# Run

Clone this repository, install dependencies and run server (it requires Node.js and Coffee-script)

    git clone git://github.com/jsilvestre/cozy-irc-botmanager.git
    cd cozy-irc-botmanager
    npm install
    coffee server

# About Cozy

This app is suited to be deployed on the Cozy platform. Cozy is the personal
server for everyone. It allows you to install your every day web applications
easily on your server, a single place you control. This means you can manage
efficiently your data while protecting your privacy without technical skills.

More informations and hosting services on:
http://cozycloud.cc
