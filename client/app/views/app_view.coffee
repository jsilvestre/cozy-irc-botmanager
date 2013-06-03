BaseView = require '../lib/base_view'
Configuration = require '../models/configuration'

module.exports = class AppView extends BaseView

    el: 'body.application'
    template: require('./templates/home')

    events:
        'click #save-config': 'onSubmit'
        'click #action-bot': 'onActionBot'

    initialize: ->
        @model = new Configuration()
        @listenTo @model, "change", @onConfigChanged

        @isBotRunning = false

    afterRender: ->

        @serverNameField = @$('#serverName')
        @usernameField = @$('#username')
        @nicknameField = @$('#nickname')
        @passwordField = @$('#password')
        @channelField = @$('#channelName')
        @connectionMessage = @$('#connectionMessage')
        @helpMessage = @$('#helpMessage')
        @actionButton = @$('#action-bot')

        @model.fetch()
        @manageSocket()

    manageSocket: ->

        pathToSocketIO = "#{window.location.pathname.substring(1)}socket.io"
        @socket = io.connect window.location.origin,
                resource: pathToSocketIO

        @socket.on 'get-status', (data) =>
            @isBotRunning = data.isRunning

            if @isBotRunning
                @actionButton.html 'Stop'
            else
                @actionButton.html 'Start'

        @socket.emit 'ask-status', {}

    onActionBot: ->
        if @isBotRunning
            @socket.emit 'ask-stop', {}
            @actionButton.html 'Waiting...'
        else
            @socket.emit 'ask-start', {}
            @actionButton.html 'Waiting...'

    onSubmit: ->
        @model.save
            serverName: @serverNameField.val()
            username: @usernameField.val()
            nickname: @nicknameField.val()
            password: @passwordField.val()
            channel: @channelField.val()
            connectionMessage: @connectionMessage.val()
            helpMessage: @helpMessage.val()
            application: 'cozy-irc-botmanager'

    onConfigChanged: ->
        @serverNameField.val @model.get 'serverName'
        @usernameField.val @model.get 'username'
        @nicknameField.val @model.get 'nickname'
        @passwordField.val @model.get 'password'
        @channelField.val @model.get 'channel'
        @connectionMessage.val @model.get 'connectionMessage'
        @helpMessage.val @model.get 'helpMessage'