const gulp = require("gulp");
const plumber = require("gulp-plumber");
const gulpif = require("gulp-if");

//scripts
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");

//styles
const sass = require("gulp-sass"); 
const autopreﬁxer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const minifyCss = require("gulp-clean-css");
const isProduction = process.env.NODE_ENV === "production";
 
//images
const imagemin = require("gulp-imagemin");

// clear
const del = require("del");

//templates
const pug = require('gulp-pug');

//server
const browserSync = require("browser-sync").create();


const PATHS = {
    app: "./app",
    dist: "./dist"
};


gulp.task('clear', ()=>{
    return del(PATHS.dist)
});


gulp.task('templates', ()=>{
    return gulp.src(`${PATHS.app}/pages/*.pug`, /*{ since: gulp.lastRun("templates")}*/)
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(PATHS.dist))

});


gulp.task('styles', ()=>{
   return gulp.src(`${PATHS.app}/common/styles/app.scss`, /*{since: gulp.lastRun("styles")}*/)
   .pipe(plumber())
   .pipe(gulpif(!isProduction, sourcemaps.init()))  
   .pipe(sass())
   .pipe(autopreﬁxer({
      browsers: ['last 2 versions'],
      cascade: false
   }))
   .pipe(gulpif(isProduction, minifyCss()))
   .pipe(gulpif(!isProduction, sourcemaps.write()))
   .pipe(gulp.dest(`${PATHS.dist}/assets/styles`))
 });


 gulp.task('images', ()=>{
   return gulp.src(`${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`, /*{since: gulp.lastRun("images")}*/)
   .pipe(plumber())
   .pipe(gulpif(isProduction, imagemin()))
   .pipe(gulp.dest(`${PATHS.dist}/assets/images`))
 });


 gulp.task('copy', ()=>{
   return gulp
   .src(`${PATHS.app}/common/fonts/**/*`, { since: gulp.lastRun("copy") })
   .pipe(plumber())
   .pipe(gulp.dest(`${PATHS.dist}/assets/fonts`)) 
 });


 gulp.task('server', ()=>{
   browserSync.init({server: PATHS.dist});
   browserSync.watch(PATHS.dist + "/**/*.*").on("change", browserSync.reload);
 });




 gulp.task("scripts", () => {
	return gulp
		.src(`${PATHS.app}/common/scripts/*.js`, { since: gulp.lastRun("scripts") })
		.pipe(plumber())
		.pipe(gulpWebpack(webpackConfig, webpack))
		.pipe(gulp.dest(`${PATHS.dist}/assets/scripts`));
});
gulp.task('watch', ()=>{
   gulp.watch(`${PATHS.app}/**/*.pug`, gulp.series("templates"));
   gulp.watch(`${PATHS.app}/**/*.scss`, gulp.series("styles"));
   gulp.watch(`${PATHS.app}/**/*.js`, gulp.series("scripts"));
   gulp.watch(`${PATHS.app}/common/fonts/**/*`, gulp.series("copy"));
   gulp.watch(`${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`,gulp.series("images")); 
});
gulp.task("default",
   gulp.series(        
      gulp.parallel("templates", "styles", "scripts", "images", "copy"),        
      gulp.parallel("watch", "server")    
   ) 
);

gulp.task(    
   "production",    
   gulp.series(        
      "clear",        
      gulp.parallel("templates", "styles", "scripts", "images", "copy")    
      ) 
);



