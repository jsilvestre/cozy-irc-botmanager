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

            bot.on 'connected', ->
                compound.io.sockets.emit 'get-status',
                                    isRunning: bot.isRunning
            bot.on 'disconnected', ->
                console.log "disconnected"
                compound.io.sockets.emit 'get-status',
                                    isRunning: bot.isRunning

            compound.io.sockets.on 'connection', (socket) ->
                socket.on 'ask-status', (data) ->
                    compound.io.sockets.emit 'get-status',
                                    isRunning: bot.isRunning

                socket.on 'ask-start', (data) ->
                    bot.start()

                socket.on 'ask-stop', (data) ->
                    bot.stop()