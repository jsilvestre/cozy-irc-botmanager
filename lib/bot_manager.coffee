irc = require 'irc'
events =  require 'events'
module.exports = class BotManager extends events.EventEmitter

    constructor: (@config) ->
        @isRunning = false

        nickname = @config.nickname
        server = @config.serverName
        opts =
            userName: @config.username
            autoConnect: false

        @client = new irc.Client server, nickname, opts

    start: ->

        return false if @isRunning
        @isRunning = true

        console.info "Bot is about to start..."

        @client.connect () =>

            # Identification
            @client.say 'NickServ', "identify #{@config.username} #{@config.password}"

            @client.join @config.channel, =>
                @emit 'connected'
                @client.say 'ChanServ', "OP #{@config.channel} #{@config.nickname}"
                @client.say @config.channel, @config.connectionMessage

        @client.addListener "message##{@config.channel}", (from, message) ->
            console.log from + ' => #yourchannel: ' + message

        @client.addListener "pm", (from, message) =>
            @client.say from, "I am a bot, I won't be able to help you directly."

        @client.addListener "error", (message) ->
            console.log message

    stop: ->
        if @isRunning
            console.info "Bot is about to stop...."
            @client.disconnect 'See you soon !', =>
                @isRunning = false
                @emit 'disconnected'