var fs           = require('fs')
var _            = require('lodash')
var gulp         = require('gulp');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var nodeResolve  = require('resolve');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var filter       = require('gulp-filter');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require('gulp-notify');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var webserver    = require('gulp-webserver')
var wrap         = require('gulp-wrap')
var jshint       = require('gulp-jshint');
var declare      = require('gulp-declare')
var browserify   = require('browserify');
var jstify       = require('jstify')
var reload       = browserSync.reload;

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: {
      baseDir: "./deploy/"
    }
  });
  gulp.watch("./src/*.html", ['html']);
  gulp.watch("./src/scss/**", ['sass']);
  gulp.watch("./src/images/**/*", ['images']);
  gulp.watch("./src/fonts/**/*", ['fonts']);
  gulp.watch(["./src/js/**", "./src/templates/**"], ['scripts']);
  gulp.watch(["./deploy/img/*","./deploy/*.html","./deploy/js/*.js"]).on('change', reload);
});

gulp.task('html', function() {
  return gulp.src([
    './src/index.html'
  ])
  .pipe(concat('index.html'))
  .pipe(gulp.dest('./deploy/')).on('change', reload);
});

/*
  Script phase is divided by 3 parts
  1. Vendors are compiled first, the output is a vendor.js full compatible with CommonJS
  2. Templates are compiled next, the output is a templates.js file with "pre-compiled" templates
  3. Javascript files at src/js are compiled last as app.js file.

  
*/


/*
  1. Vendors
  Vendors are managed by npm dependencies compatible with CommonJS.
  Vendors will compile only once by server or deploy tasks, so don't need to watch this.
*/
gulp.task('vendors', function() {
  var b = browserify()

  var vendorsList = getNPMPackageIds();

  vendorsList.forEach(function(id){
    b.require(nodeResolve.sync(id), {expose: id})
  })

  b.transform({
    global: true
  }, 'uglifyify')

  var stream = b.bundle()
    .pipe(source('vendors.js'))
    .pipe(gulp.dest('./deploy/js'))

  return stream
});

/*
  2. Templates
  Templates will compile each time some template was changed.
  Don't forget to compile those templates before publish to production,
  this will improve the performance A LOT!
*/

gulp.task('templates', function(){
  var tplDir = __dirname + '/src/templates'
  var paths = getResolvedTemplateFiles(tplDir)
  var b = browserify(paths)

  return b.transform('jstify', {
      engine: 'lodash'
    })
    .external('lodash')
    .bundle()
    .pipe(fs.createWriteStream('./deploy/js/templates.js')).on('change', reload);
})


/*
  3. Application script
  Finally this task will compile whole project and will ignore
  CommonJS modules and templates imports.
*/

gulp.task('scripts', function() {
  var tplDir = __dirname + '/src/templates'
  var externals = getNPMPackageIds()
  
  var b = browserify()

  b.external(externals)

  // Unlock this feature to minify and uglify main.js toghether with templates.js
  // b.transform({
  //   global: true
  // }, 'uglifyify')
  
  return b.add('./src/js/main.js')
    .transform('jstify', {
      engine:'lodash'
    })    
    .bundle(function(err, app) {
      fs.writeFile('./deploy/js/main.js', app);
    });
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./src/scss/*.scss")
    .pipe(plumber({errorHandler: notify.onError("Erro no ARQUIVO <%= error.fileName.split('/').pop() %> LINHA <%= error.lineNumber %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({browsers: '> 5%'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./deploy/css/'))
    .pipe(filter('**/*.css'))
    .pipe(browserSync.stream());
});

gulp.task('deploy', function() {
  hbsfy.configure({
    extensions: ['.hsb']
  })

  return gulp.src([
      './src/js/main.js',
  ])
  .pipe(browserify({
    transforms: [ hbsfy ]
  }))
  .pipe(rename('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./deploy/js/'))
});

gulp.task('images', function() {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./deploy/img'))
})

gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./deploy/fonts'))
})

gulp.task('default', ['vendors', 'images', 'fonts', 'serve']);

/* ----------------------------
   Utils
   ---------------------------- */

function getNPMPackageIds() {
  // read package.json and get dependencies' package ids
  var packageManifest = {};
  try {
    packageManifest = require('./package.json');
  } catch (e) {
  // does not have a package.json manifest
  }
  return _.keys(packageManifest.dependencies) || [];
}

function getResolvedTemplateFiles (dir) {
  var files = fs.readdirSync(dir);
  var result = [];

  for (var i in files) {
    var path = dir + '/' + files[i]
    var stat = fs.statSync(path)

    if (stat.isDirectory()) {
      result = result.concat( getResolvedTemplateFiles(path) )
    }
    else {
      if( path.indexOf('.tpl') > -1 )
        result[ result.length ] = path
    }
  }

  return result;
}