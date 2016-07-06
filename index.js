'use strict';

var vfs = require('vinyl-fs'),
    exec = require('gulp-exec'),
    isWin = /^win/.test(process.platform),
    commandSeparator = isWin ? '&' : ';',
    dependancyInstall = function(path, callback) {
        var options = {
            dir: function(filePath) {
                return filePath.replace('package.json', '');
            }
        };

        var stream = vfs.src([path + '/**/package.json', '!./**/{node_modules,node_modules/**}'])
            .pipe(exec('(cd <%= options.dir(file.path) %> ' + commandSeparator + ' npm install) ' + commandSeparator + ' echo Installed for: <%= file.path %> \n', options))
            .pipe(exec.reporter());

        stream.on('finish', callback || function() {
            console.log("Package installation completed.");
        });
    };

module.exports = dependancyInstall
