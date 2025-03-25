const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
//const groupMedia = require('gulp-group-css-media-queries');//обьединяет @media запросы,но нарушаються карты
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

//html
const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file',
}

const plumberHtmlConfig = {
    errorHandler: notify.onError({
        title:'HTML',
        message:'Error <%= error.message %>',
        sound:false,
    }),
};


gulp.task('html', function () {
    return gulp
        .src('./src/*.html')
        .pipe(plumber(plumberHtmlConfig))
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(gulp.dest('./dist/'))
});

const plumberSassConfig = {
    errorHandler: notify.onError({
        title:'Style',
        message:'Error <%= error.message %>',
        sound: false,
    }),
};


//компиляция Scss//+карты
gulp.task('sass', function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(plumber(plumberSassConfig))
        .pipe(sourceMaps.init())
        .pipe(sass())
        //.pipe(groupMedia())// обьединяет media
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))

});

//img//
gulp.task('images', function () {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img/'));
});

//fonts
gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts/'));
});

//сервер
const serverOption = {
    livereload: true,
    open: true
}

gulp.task('server', function () {
    return gulp.src('./dist/')
        .pipe(server(serverOption));
});
//удаления папок из dist
gulp.task('clean', function (done) {
    if (fs.existsSync('./dist')) {
        return gulp.src('./dist/', { read: false })
            .pipe(clean({ force: true }));
    }
    done();
});
//слежка
gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
   
});

//Запуск все задачb
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'images','fonts'),
    gulp.parallel('server', 'watch')
));