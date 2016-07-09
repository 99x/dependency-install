'use strict';

var gulp = require('gulp'),
    exec = require('gulp-exec'),
    tap = require('gulp-tap'),
    isWin = /^win/.test(process.platform),
    commandSeparator = isWin ? '&' : ';',
    basePath = "/",
    init = function (path) {
        basePath = path.endsWith("/") ? path : path + "/";
    },
    install = function (paths, callback) {
        var src, stream, options = {
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
                            gulp.src(basePath + lib + '/**/*').pipe(gulp.dest(file.path.replace('package.json', 'node_modules/' + lib + '/')));
                        }
                    }
                }
            };
        src = paths.map(function (path) {
            return (path.endsWith("/") ? path : path + "/") + '**/package.json';
        });
        src.push('!./**/{node_modules,node_modules/**}');

        stream = gulp.src(src)
            .pipe(tap(shared))
            .pipe(exec('(cd <%= options.dir(file.path) %> ' + commandSeparator + ' npm install) ' + commandSeparator + ' echo Installed for: <%= file.path %> \n', options))
            .pipe(exec.reporter());

        stream.on('finish', callback || function () {
            console.log("Package installation completed.");
        });

        return stream;
    };

module.exports = {
    init: init,
    install: install
};
