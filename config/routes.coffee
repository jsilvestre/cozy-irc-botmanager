exports.routes = (map) ->
    map.get 'configuration', 'configuration#get'
    map.post 'configuration', 'configuration#create'
    map.put 'configuration/:id', 'configuration#update'
