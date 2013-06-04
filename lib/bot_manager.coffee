irc = require 'irc'
events =  require 'events'
module.exports = class BotManager extends events.EventEmitter

    constructor: (@config) ->
        @isRunning = false
        @topic = ""

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

        @client.on 'topic', (channel, topic, nick, message) =>
            @topic = topic
            @emit 'status-changed'

        @client.connect () =>

            # Identification
            @client.say 'NickServ', "identify #{@config.username} #{@config.password}"

            @client.join @config.channel, =>
                @emit 'status-changed'
                @client.say 'ChanServ', "OP #{@config.channel} #{@config.nickname}"
                @client.say @config.channel, @config.connectionMessage

        @client.addListener "message", (from, to, message) =>
            console.log from + " => ##{to}: " + message
            if /^!help/.test message
                if not @config.helpMessage?
                    @config.helpMessage = "No help message configured."
                @client.say from, @config.helpMessage

        @client.addListener "pm", (from, message) =>
            @client.say from, "I am a bot, a robot. I won't be able to help you directly."

        @client.addListener "error", (message) ->
            console.log message

    stop: ->
        if @isRunning
            console.info "Bot is about to stop...."
            @client.disconnect 'Goodbye, see you soon !', =>
                @isRunning = false
                @emit 'status-changed'

    setTopic: (topic) ->
        if @isRunning
            @client.send 'TOPIC', @config.channel, topic

    manageMode: (mode, user) ->
        if @isRunning
            @client.send 'MODE', @config.channel, mode, user

