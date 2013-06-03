module.exports = (compound) ->

    Configuration = compound.models.Configuration

    getByApp = (doc) ->
        if doc.application
            emit doc.application, doc

    Configuration.defineRequest "getByApp", getByApp, (err) ->
        if err
            compound.logger.write "Request Configuration#getByApp, cannot be created"
            compound.logger.write err