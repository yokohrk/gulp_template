var $, gulp, pngquant;
gulp = require('gulp');
pngquant = require('imagemin-pngquant');
$ = require('gulp-load-plugins')();

//
//    gulp-connect【1】Gulp plugin to run a webserver (with LiveReload)
//    gulp-file-include【2】HTMLインクルード
//    gulp-autoprefixer【3】autoprefixer追加
//    gulp-cssmin【4】CSS圧縮
//    gulp-uglify【5】JavaScript圧縮
//    gulp-imagemin【6】img圧縮
//    gulp-htmlmin【7】HTML圧縮
//    gulp-sourcemaps 【8】sourcemap作成
//    gulp.spritesmith【9】sprite画像

//    gulp
//    gulp-sass Sassコンパイル
//    gulp-notify エラーを通知
//    gulp-load-plugins パッケージを読み込み
//    gulp-plumber エラーが出たときにgulpを終了させない
//    gulp-rename
//    imagemin-pngquant png圧縮

//gulp-connect【1】Gulp plugin to run a webserver (with LiveReload)
var connect = require('gulp-connect');
gulp.task('connect', done => {
  connect.server({
    root: 'dist',
    livereload: true
  });
  done();
});

//gulp-file-include【2】HTMLインクルード
gulp.task('html', function () {
  return gulp.src(['./src/template/**/*.html', '!./src/template/_**/*.html']).pipe($.plumber({
    errorHandler: $.notify.onError('<%= error.message %>')
  })).pipe($.fileInclude({
    prefix: '@@',
    basepath: './src/template/_include/'
  })).pipe(gulp.dest('./dist/'))
  .pipe(connect.reload());;
});

//gulp-autoprefixer【3】autoprefixer追加
var autoprefixer = require("gulp-autoprefixer");
gulp.task("auto", done => {
  gulp.src("./src/css/**/*scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("./dist/css"));
    done();
});

//gulp-cssmin【4】css圧縮
var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

gulp.task('cssmin', done => {
  gulp.src('./dist/**/*.css')
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
    done();
});

//gulp-uglify【5】JavaScript圧縮
var uglify = require("gulp-uglify");

gulp.task("js", done => {
  gulp.src(["./src/js/**/*.js", "!./src/js/vendor/*.js"])
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
  gulp.src(["./src/js/vendor/*.js"])
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(gulp.dest("./dist/js/vendor"));
    done();
});

//gulp-imagemin【6】img圧縮
gulp.task('image', done => {
  return gulp.src('./src/img/**/*').pipe($.imagemin({
    progressive: true,
    interlaced: true,
    use: [pngquant()]
  })).pipe(gulp.dest('./dist/img/'));
  done();
});

//gulp-htmlmin【7】HTML圧縮

var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');

gulp.task('minify', function () {
  return gulp.src('./src/_template/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist/'))
});

//gulp-sourcemaps 【8】sourcemap作成
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', done => {
  return gulp.src('./src/css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'));
    done();
});

//gulp.spritesmith【9】sprite画像
//http://blog.e-riverstyle.com/2014/02/gulpspritesmithcss-spritegulp.html
// Android 4.2〜対応とするため SPのspriteは無し

//var gulp = require('gulp');
//var spritesmith = require('gulp.spritesmith');
//
//gulp.task('sprite', function () {
//  var spriteData = gulp.src('./src/img/sprite/*.png') //スプライトにする画像達
//    .pipe(spritesmith({
//      imgName: 'sprite.png', //スプライトの画像
//      cssName: '_sprite.scss', //生成されるscss
//      imgPath: '../img/sprite.png', //生成されるscssに記載されるパス
//      cssFormat: 'scss', //フォーマット
//      cssVarMap: function (sprite) {
//        sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
//      }
//    }));
//  spriteData.img.pipe(gulp.dest('./dist/img/')); //imgNameで指定したスプライト画像の保存先
//  spriteData.css.pipe(gulp.dest('./src/css/')); //cssNameで指定したcssの保存先
//});
//
//gulp.task('default', function () {
//  gulp.run('sprite');
//});

gulp.task('watch', done => {
  gulp.watch('./src/template/**/*.html', gulp.task('html'));
  gulp.watch('./src/img/**/*', gulp.task('image'));
  gulp.watch('./src/css/**/*.scss', gulp.task('sass'));
  gulp.watch('./src/css/**/*.scss', gulp.task('auto'));
  gulp.watch(["./src/js/**/*.js", "!./dist/js/**/*.js"], gulp.task('js'));
  done();
});

gulp.task('default', gulp.series( gulp.parallel('html', 'auto', 'image', 'connect', 'js', 'watch')));
// gulp.task('default', done => {
//     gulp.series( gulp.parallel('html', 'auto', 'image', 'connect', 'js', 'watch'));
//     done();
// });


//vinyl-ftp 【10】FTP upload
// const gulp = require('gulp');
const ftp = require('vinyl-ftp');

gulp.task('ftp', () => {
  const ftpConfig = {
    host: 'ftp19.gmoserver.jp',
    user: 'sd1037820@gmoserver.jp',
    pass: 'P44$rqnH',
  }

  const connect = ftp.create(ftpConfig);

  const ftpUploadFiles = './dist/**/*';

  const remoteDistDir = 'kando-teller.jp';

  return gulp.src(ftpUploadFiles)
    .pipe(connect.dest(remoteDistDir));
})
