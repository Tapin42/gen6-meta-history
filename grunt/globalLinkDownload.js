var extend = require('jquery-extend');
var request = require('request');

module.exports = function (grunt) {
    
    function downloadOnePokemon(requestParams, cb) {
        var outFile = requestParams.outFile();
        grunt.log.ok('Downloading to ' + outFile);
        
        request.post({
            url: requestParams.url,
            method: 'POST',
            headers: requestParams.headers,
            form: requestParams.params
        }, function (err, res, body) {
            if (!err) {
                grunt.file.write(outFile, body);
                var json = JSON.parse(body);
                cb(true, json.nextPokemonId);
            } else {
                grunt.fail.warn('Error retrieving data from Global Link: ' + err);
                cb(false, '1-0');
            }
        });
    }

    function downloadAllPokemon(rawDir, requestParams, cb) {
        requestParams.params = requestParams.initialParams;
        requestParams.outFile = function () {
            return rawDir + '/' + requestParams.params.pokemonId + '.json'
        };

        function keepGoing (res, nextId) {
            if (nextId === '1-0') {
                cb(res);
            } else {
                requestParams.params.pokemonId = nextId;
                downloadOnePokemon(requestParams, keepGoing);
            }            
        }

        downloadOnePokemon(requestParams, keepGoing);
    }

    grunt.registerTask('globalLinkDownload', 'Download the Global Link data', function () {
        var done = this.async();
        downloadAllPokemon(
            grunt.config([this.name, 'rawDir']) + '/' + grunt.template.today('yyyy-mm-dd'), 
            grunt.config([this.name, 'request']), 
            function (res) {
                done(res);
            }
        );
    });

};