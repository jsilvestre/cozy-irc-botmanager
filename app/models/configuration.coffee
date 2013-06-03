module.exports = (compound, Configuration) ->

    Configuration.getByApp = (callback) ->
        params =
            key: 'cozy-irc-botmanager'
        Configuration.request "getByApp", params, callback