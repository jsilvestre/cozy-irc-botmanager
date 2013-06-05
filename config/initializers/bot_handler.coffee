module.exports = (compound) ->

    Configuration = compound.models.Configuration
    Configuration.getByApp (err, configuration) ->
        if err? or not configuration
            console.info "Configuration must be created for this app."
        else

            initializer = require('cozy-realtime-adapter')
            realtime = initializer compound, []

            BotManager = require '../../lib/bot_manager'
            bot = new BotManager(configuration[0])
            console.info "Bot is ready to be managed."

            sendStatus = ->
                console.info "status sent"
                compound.io.sockets.emit 'get-status',
                                    isRunning: bot.isRunning
                                    topic: bot.topic

            bot.on 'status-changed', sendStatus

            compound.io.sockets.on 'connection', (socket) ->
                sendStatus()
                socket.on 'ask-status', sendStatus

                socket.on 'ask-start', ->
                    bot.start()

                socket.on 'ask-stop', ->
                    bot.stop()

                socket.on 'set-topic', (data) ->
                    bot.setTopic data.topic

                socket.on 'manage-mode', (data) ->
                    console.log data
                    bot.manageMode data.mode, data.user

            realtime.on 'configuration.update', (event, id) ->
                Configuration.getByApp (err, configuration) ->
                    if not err? and (bot? and bot.isRunning)
                        bot.stop ->
                            bot = new BotManager(configuration[0])
                            bot.on 'status-changed', sendStatus