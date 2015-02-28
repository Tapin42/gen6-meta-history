var extend = require('jquery-extend');
var request = require('request');

module.exports = function (grunt) {
    
    var allData = {};
    var filesRead = 0;

    function processFile(abspath, rootdir, subdir, fname) {
        var fdata = grunt.file.readJSON(abspath);
        if (!allData[subdir]) {
            grunt.log.ok('Reading from ' + subdir);
            allData[subdir] = {};
        }
        var keyname = fname.split('.')[0];
        allData[subdir][fname] = fdata;
    }

    function compositeData(rawDir, outFile) {
        grunt.file.recurse(rawDir, processFile);
        grunt.log.ok('Writing data to ' + outFile);
        grunt.file.write(outFile, JSON.stringify(allData, null, 2));

        // You are a bad person and should feel bad for writing this, Joe.
        grunt.ALL_DATA = allData;
        
        grunt.log.ok('Done.');
    }

    grunt.registerTask('compositeData', 'Mash all the data into a single dict.  Woo, memory consumption!', function () { 
        compositeData(
            grunt.config([this.name, 'rawDir']), 
            grunt.config([this.name, 'outFile'])
        );
    });
};