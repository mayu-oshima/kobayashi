import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

import ejs from 'gulp-ejs';
import htmlmin from 'gulp-htmlmin';

import gulpSass from 'gulp-sass';
import * as sassCompiler from 'sass';
import cleanCSS from 'gulp-clean-css';

import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';

import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import browserSyncModule from 'browser-sync';

import fs from 'fs';

import replace from 'gulp-replace';

const sass = gulpSass(sassCompiler);
const browserSync = browserSyncModule.create();

let BASE_URL = '/';
let DEST_FILE = 'dist';

// HTML（EJS）コンパイル
function compileHTML() {
  return src(['src/**/*.ejs', '!src/**/_*.ejs', '!src/_components/**/*.ejs'])
    .pipe(plumber())
    .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(replace('__BASE_URL__', BASE_URL))
    .pipe(dest(DEST_FILE))
    .pipe(browserSync.stream());
}

// Sass コンパイル
function compileCSS() {
  return src('src/**/*.scss', { base: 'src' })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(replace('__BASE_URL__', BASE_URL))
    .pipe(dest(`${DEST_FILE}/assets`))  // assets配下に吐き出す
    .pipe(browserSync.stream());
}

// JavaScript 圧縮
function compileJS() {
  return src('src/**/*.js', { base: 'src' })
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(`${DEST_FILE}/assets`))
    .pipe(browserSync.stream());
}

// 画像圧縮
function compileIMG() {
  return src('src/**/*.{png,jpg,jpeg,gif}', { base: 'src/' })
    .pipe(imagemin([
      imageminMozjpeg({ quality: 95 })  // 画質を調整
    ]))
    .pipe(dest(`${DEST_FILE}/assets`));
}

// ファイル監視
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: 'dist',
      directory: true
    }
  });
  watch(['src/**/*.ejs', '!src/**/_*.ejs', '!src/_components/**/*.ejs'], compileHTML);
  watch('src/**/*.scss', compileCSS);
  watch('src/**/*.js', compileJS);
  watch('src/**/*.{png,jpg,jpeg,gif}', compileIMG);
}

// 本番用ビルドタスク
function build(done) {
  BASE_URL = '/kobayashi/';
  DEST_FILE = 'build';

  return parallel(
    compileHTML,
    compileCSS,
    compileJS,
    compileIMG
  )(done);
}


export { compileHTML, compileCSS, compileJS, compileIMG, build };
export default series(
  parallel(compileHTML, compileCSS, compileJS, compileIMG),
  watchFiles
);