'use strict';

var vfs = require('vinyl-fs'),
    exec = require('gulp-exec'),
    tap = require('gulp-tap'),
    isWin = /^win/.test(process.platform),
    commandSeparator = isWin ? '&' : ';',
    basePath = "/",
    init = function (path) {
        basePath = path.endsWith("/") ? path : path + "/";
    },
    install = function (path, callback) {
        var stream, options = {
                dir: function (filePath) {
                    return filePath.replace('package.json', '');
                }
            },
            shared = function (file) {
                var packageJSON = require(file.path),
                    libs = packageJSON.customDependencies;
                if (libs) {
                    for (var lib in libs) {
                        if (libs[lib].toLowerCase() === "local") {
                            vfs.src(basePath + lib + '/**/*').pipe(vfs.dest(file.path.replace('package.json', 'node_modules/' + lib + '/')));
                        }
                    }
                }
            };

        stream = vfs.src([path + '/**/package.json', '!./**/{node_modules,node_modules/**}'])
            .pipe(tap(shared))
            .pipe(exec('(cd <%= options.dir(file.path) %> ' + commandSeparator + ' npm install) ' + commandSeparator + ' echo Installed for: <%= file.path %> \n', options))
            .pipe(exec.reporter());

        stream.on('finish', callback || function () {
            console.log("Package installation completed.");
        });
    };

module.exports = {
    init: init,
    install: install
};
