/**
 * This file is part of Shoop Wintergear Demo.
 *
 * Copyright (c) 2012-2015, Shoop Ltd. All rights reserved.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gulp = require("gulp");
var less = require("gulp-less");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
var minifyCSS = require('gulp-minify-css');

var STATIC_SRC = "wintergear_theme/static_src/";
var STATIC_DST = "wintergear_theme/static/";

gulp.task("less", function() {
    return gulp.src([
        STATIC_SRC + "css/vendor/owl.carousel.min.css",
        STATIC_SRC + "less/style.less"
    ])
        .pipe(plumber({}))
        .pipe(sourcemaps.init())
        .pipe(less().on('error', function (err) {
            console.log(err.message);
            this.emit("end");
        }))
        .pipe(concat("style.css"))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(
            sourcemaps.write(".", {
                includeContent: false,
                sourceRoot: "/static_src/less"
            }))
        .pipe(gulp.dest(STATIC_DST + "css"));
});

gulp.task("less:watch", ["less"], function() {
    gulp.watch([STATIC_SRC + "less/**/*.less"], ["less"]);
});


gulp.task("js", function() {
    return gulp.src([
        "bower_components/jquery/dist/jquery.js",
        "bower_components/bootstrap/dist/js/bootstrap.js",
        STATIC_SRC + "js/vendor/bootstrap-select.min.js",
        STATIC_SRC + "js/vendor/jquery.easing.1.3.min.js",
        STATIC_SRC + "js/vendor/owl.carousel.min.js",
        STATIC_SRC + "js/vendor/jquery.touchSwipe.min.js",
        STATIC_SRC + "js/vendor/image-lightbox.js",
        STATIC_SRC + "js/custom/custom.js",
        STATIC_SRC + "js/custom/checkout.js",
    ])
        .pipe(plumber({}))
        .pipe(sourcemaps.init())
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(STATIC_DST + "js"));
});


gulp.task("js:watch", ["js"], function() {
    gulp.watch([STATIC_SRC + "js/**/*.js"], ["js"]);
});

gulp.task("watch", ["js:watch", "less:watch"], function() {});

gulp.task("default", ["js", "less"]);
