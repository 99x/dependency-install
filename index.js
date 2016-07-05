'use strict';
var vfs = require('vinyl-fs'),
    exec = require('gulp-exec');

var isWin = /^win/.test(process.platform),
    commandSeparator = isWin ? '&' : ';';

var dependancyInstall = function(path) {
    var options = {
        dir: function(filePath) {
            return filePath.replace('package.json', '');
        }
    };

    vfs.src([ path + '/**/package.json', '!./**/{node_modules,node_modules/**}'])
        .pipe(exec('(cd <%= options.dir(file.path) %> ' + commandSeparator + ' npm install) ' + commandSeparator
            + ' echo Installed for: <%= file.path %> \n', options))
        .pipe(exec.reporter());
};
module.exports = dependancyInstall
