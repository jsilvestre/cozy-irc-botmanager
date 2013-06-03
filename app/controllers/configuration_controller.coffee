before ->
    Configuration.getByApp (err, configuration) =>
        if err? or not configuration
            send  msg: "Configuration must be created for this app.", 404
        else
            @config = configuration[0]
            next()
, except: ['create', 'stop']

action 'get', ->
    send @config, 200

action 'create', ->
    Configuration.create req.body, (err, configuration) =>
        if err
            send error: true, msg: "Server error while creating configuration.", 500
        else
            send configuration, 201

action 'update', ->
    @config.updateAttributes body, (err, configuration) =>
        if err?
            send error: true, msg: "Server error while saving configuration", 500
        else
            send configuration, 200