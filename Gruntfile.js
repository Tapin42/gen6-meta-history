module.exports = function (grunt) {

    grunt.initConfig({
        globalLinkDownload: {
            rawDir: '<%= globalLink.rawDir %>',
            request: {
                url: 'http://3ds.pokemon-gl.com/frontendApi/gbu/getSeasonPokemonDetail',
                headers: {
                    Referer: 'http://3ds.pokemon-gl.com/battle/oras/'
                },
                initialParams: {
                    languageId: 2,
                    seasonId: 108,
                    battleType: 2,
                    timezone: 'EST',
                    pokemonId: '1-0',
                    displayNumberWaza: 10,
                    displayNumberTokusei: 3,
                    displayNumberSeikaku: 10,
                    displayNumberItem: 10,
                    displayNumberLevel: 10,
                    displayNumberPokemonIn: 10,
                    displayNumberPokemonDown: 10,
                    displayNumberPokemonDownWaza: 10
                }
            }
        },
        globalLink: {
            rawDir: process.cwd() + '/rawData'
        }
    });

    grunt.loadTasks('grunt');

    grunt.registerTask('default', ['globalLinkDownload']);
    grunt.registerTask('all', ['globalLinkDownload']);
};