const gulp = require('gulp'),
fs = require('fs'),
path = require('path'),
ftp = require('gulp-ftp'),
bs = require('browser-sync').create();

let loadJsonSync = function(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

const config = {
    watchPath: [
        './**/*.html',
        './**/*.css',
        './**/*.js'
    ],
    ftp: {
        server: './.ftpconfig.json'
    }
}

let upload = function (localPath, remotePath) {
    const setting_file = loadJsonSync(config.ftp.server);
    if (remotePath) {
        setting_file.remotePath += remotePath;
    }

    console.log('File upload...');
    return gulp.src(localPath).pipe(ftp(setting_file));
}

gulp.task('watch', function () {
    gulp.watch(config.watchPath, function (e) {
        let localPath = e.path;
        let remotePath = path.relative('./', path.dirname(e.path)).replace(/\\/g, '/') + '/';
        upload(localPath, remotePath);
    });
});

gulp.task('default', function () {
    gulp.start(['watch']);
});