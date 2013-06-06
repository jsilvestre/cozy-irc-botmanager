module.exports = (compound) ->

    BotManager = require '../../lib/bot_manager'
    initializer = require('cozy-realtime-adapter')
    realtime = initializer compound, []
    Configuration = compound.models.Configuration

    class BotHandler
        constructor: (@realtime) ->

        initialize: ->
            @bot = null

            # Configuration is retrieved and IRC client created
            @handle () =>
                # Socket events are attached once at initialization
                compound.io.sockets.on 'connection', (socket) =>

                    # Status is initially sent to clients
                    @sendStatus()
                    socket.on 'ask-status', => @sendStatus()
                    socket.on 'ask-start', => @bot.start()
                    socket.on 'ask-stop', => @bot.stop()
                    socket.on 'set-topic', (data) => @bot.setTopic data.topic
                    socket.on 'manage-mode', (data) =>
                        @bot.manageMode data.mode, data.user

            # When the configuration is updated, we stop the bot
            # and recreate the object
            @realtime.on 'configuration.update', (event, id) =>
                @bot.stop => @handle()

        # Retrieve configuration and initialize the bot manager object
        handle: (callback) ->
            Configuration.getByApp (err, configuration) =>
                if err? or not configuration
                    console.info "Configuration must be created for this app."
                else
                    @bot = new BotManager(configuration[0])
                    console.info "Bot is ready to be managed."
                    @bot.on 'status-changed', => @sendStatus()

                    callback() if callback?

        # Helper to send the current status to clients
        sendStatus: ->
            if @bot?
                compound.io.sockets.emit 'get-status',
                                isRunning: @bot.isRunning
                                topic: @bot.topic

    new BotHandler(realtime).initialize()
