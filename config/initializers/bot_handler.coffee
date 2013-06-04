module.exports = (compound) ->

    BotManager = require '../../lib/bot_manager'
    sio = require 'socket.io'

    compound.io = sio.listen compound.server
    compound.io.set 'log level', 2
    compound.io.set 'transports', ['websocket']

    Configuration = compound.models.Configuration
    Configuration.getByApp (err, configuration) ->
        if err? or not configuration
            console.info "Configuration must be created for this app."
        else
            bot = new BotManager(configuration[0])
            console.info "Bot is ready to be managed."

            sendStatus = ->
                compound.io.sockets.emit 'get-status',
                                    isRunning: bot.isRunning
                                    topic: bot.topic

            bot.on 'status-changed', sendStatus

            compound.io.sockets.on 'connection', (socket) ->
                socket.on 'ask-status', sendStatus

                socket.on 'ask-start', ->
                    bot.start()

                socket.on 'ask-stop', ->
                    bot.stop()

                socket.on 'set-topic', ->
                    bot.setTopic data.topic

                socket.on 'manage-mode', ->
                    bot.manageMode data.mode, data.user