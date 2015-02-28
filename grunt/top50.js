var extend = require('jquery-extend');

module.exports = function (grunt) {
    
    function getFormeName(info) {
        if (info.name === 'Rotom') {
            switch (info.typeName2) {
                case 'Ghost':
                    return 'Rotom';
                case 'Grass':
                    return 'Rotom-C';
                case 'Ice':
                    return 'Rotom-F';
                case 'Fire':
                    return 'Rotom-H';
                case 'Flying':
                    return 'Rotom-S';
                case 'Water':
                    return 'Rotom-W';
            }
        } else if (info.name === 'Landorus' ||
                   info.name === 'Tornadus' ||
                   info.name === 'Thundurus') {
            if (info.formNo === '1') {
                return info.name + '-T';
            }
        } else if (info.name === 'Pumpkaboo' ||
                   info.name === 'Gourgeist') {
            switch (info.formNo) {
                case '0':
                    return info.name + '-Average';
                case '1':
                    return info.name + '-Small';
                case '2':
                    return info.name + '-Large';
                case '3':
                    return info.name + '-Super';

            }
        }
        return info.name;
    }

    function top50(data, outFile) {
        var dates = Object.keys(data).sort();
        var ranksByDate = [];
        var ranksByPokemon = {};

        function processDate(rawDateData, dateIdx) {
            var dateDict = extend({}, rawDateData);
            var dateAry = [];

            for (var k in dateDict) {
                if (dateDict.hasOwnProperty(k)) {
                    dateAry.push(dateDict[k]);
                }
            }

            dateAry = dateAry.filter(function (a) { 
                if (a.rankingPokemonInfo) {
                    return a.rankingPokemonInfo.ranking > 0 && a.rankingPokemonInfo.ranking <= 50;
                }
                return false;
            }).sort(function (a, b) {
                return a.rankingPokemonInfo.ranking - b.rankingPokemonInfo.ranking;
            }).map(function (a) { 
                return getFormeName(a.rankingPokemonInfo);
            });

            // Two ways to look at this data:
            // A) Per day, per Pokemon (on Jan 1, the top 50 were these)
            // B) Per Pokemon, per day (Landorus was 1, 1, 2, 1 on Jan 1 through 4)
            // Let's store 'em both.'

            // A) Per day, per Pokemon
            ranksByDate.push(dateAry);

            // B) Per Pokemon, per day
            for (var i=0; i<dateAry.length; i++) {
                var pokemon = dateAry[i];

                if (!ranksByPokemon[pokemon]) {
                    ranksByPokemon[pokemon] = [];
                }
                ranksByPokemon[pokemon][dateIdx] = i+1;
            }
        }

        for (var i=0; i<dates.length; i++) {
            processDate(data[dates[i]], i);
        }

        grunt.log.ok('Check your work: Landorus-T is ' + JSON.stringify(ranksByPokemon['Landorus-T']));

        grunt.file.write(outFile, JSON.stringify({
            dates: dates,
            ranksByDate: ranksByDate,
            ranksByPokemon: ranksByPokemon
        }, null, 2));
    };

    grunt.registerTask('top50', 'Figure out the top 50 history', function () {

        if (!grunt.ALL_DATA) {
            grunt.ALL_DATA = require(grunt.config([this.name, 'allData']));
        }
        top50(grunt.ALL_DATA, grunt.config([this.name, 'outFile']));
    });
}