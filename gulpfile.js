var $, gulp, pngquant, connect;
gulp = require('gulp');
connect = require('gulp-connect');
pngquant = require('imagemin-pngquant');
$ = require('gulp-load-plugins')();


//    gulp-connect【1】LiveReload環境構築
//    gulp-file-include【2】HTMLインクルード
//    gulp-autoprefixer【3】autoprefixer追加
//    gulp-cssmin【4】CSS圧縮
//    gulp-uglify【5】JavaScript圧縮
//    gulp-imagemin【6】img圧縮
//    gulp-htmlmin【7】HTML圧縮
//    gulp-sourcemaps 【8】sourcemap作成
//    gulp.spritesmith【9】sprite画像
//    gulp.sftp【10】gulpでFTPアップロード

//    gulp
//    gulp-sass Sassコンパイル
//    gulp-notify エラーを通知
//    gulp-load-plugins パッケージを読み込み
//    gulp-plumber エラーが出たときにgulpを終了させない
//    gulp-rename
//    imagemin-pngquant png圧縮


//gulp-connect【1】LiveReload環境構築
const server = (cb) => {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 3000
  });
  cb();
};
// var connect = require('gulp-connect');

// gulp.task('connect', function() {
//   return connect.server({
//     root: 'dist',
//     livereload: true
//   });
// });

//gulp-file-include【2】HTMLインクルード
gulp.task('html', function () {
  return gulp.src(['./src/template/**/*.html', '!./src/template/_**/*.html']).pipe($.plumber({
    errorHandler: $.notify.onError('<%= error.message %>')
  })).pipe($.fileInclude({
    prefix: '@@',
    basepath: './src/template/_include/'
  })).pipe(gulp.dest('./dist/'))
  .pipe(connect.reload());
});

//gulp-autoprefixer【3】autoprefixer追加
var autoprefixer = require("gulp-autoprefixer");
gulp.task("auto", function () {
  return gulp.src("./src/css/**/*scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("./dist/css"));
});

//gulp-cssmin【4】css圧縮
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

gulp.task('cssmin', function () {
  return gulp.src('./dist/**/*.css')
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

//gulp-uglify【5】JavaScript圧縮
var uglify = require("gulp-uglify");

gulp.task("js", function () {
  return gulp.src(["./src/js/**/*.js", "!./src/js/vendor/*.js"])
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
  gulp.src(["./src/js/vendor/*.js"])
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(gulp.dest("./dist/js/vendor"));
});

//gulp-imagemin【6】img圧縮
gulp.task('image', function () {
  return gulp.src('./src/img/**/*').pipe($.imagemin({
    progressive: true,
    interlaced: true,
    use: [pngquant()]
  })).pipe(gulp.dest('./dist/img/'));
  done();
});

//gulp-htmlmin【7】HTML圧縮
var htmlmin = require('gulp-htmlmin');

gulp.task('minify', function () {
  return gulp.src('./src/_template/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./dist/'))
});

//gulp-sourcemaps 【8】sourcemap作成
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  return gulp.src('./src/css/**/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css/'));
});

//gulp.spritesmith【9】sprite画像
//http://blog.e-riverstyle.com/2014/02/gulpspritesmithcss-spritegulp.html
// Android 4.2〜対応とするため SPのspriteは無し

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


// gulp.task('watch', function () {
//   gulp.watch('./src/template/**/*.html', gulp.task('html'));
//   gulp.watch('./src/img/**/*', gulp.task('image'));
//   gulp.watch('./src/css/**/*.scss', gulp.task('sass'));
//   gulp.watch('./src/css/**/*.scss', gulp.task('auto'));
//   gulp.watch(["./src/js/**/*.js", "!./dist/js/**/*.js"], gulp.task('js'));
// });
const watchHTML = (cb) => {
  gulp.watch('./src/template/**/*.html', gulp.task('html'));
  gulp.watch('./src/img/**/*', gulp.task('image'));
  gulp.watch('./src/css/**/*.scss', gulp.task('sass'));
  gulp.watch('./src/css/**/*.scss', gulp.task('auto'));
  gulp.watch(["./src/js/**/*.js", "!./dist/js/**/*.js"], gulp.task('js'));
  cb();
};

gulp.task('default', gulp.series( gulp.parallel(server, 'html', 'auto', 'image', 'js', watchHTML)));


//gulp.sftp【10】gulpでFTPアップロード
var sftp = require('gulp-sftp');

gulp.task('upload', function () {
    return gulp.src([
        './dist/**' // アップロードしたいファイルを指定
    ])
        .pipe(sftp({
            // FTP情報を入力
            host: "",
            user: "",
            pass: "",
            remotePath: "" // リモート側のパス　（デフォルトは "/"）
        })
    );
});