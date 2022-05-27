const gulp      = require('gulp');
const del       = require('del');
const { spawn } = require('child_process');
const eslint    = require('gulp-eslint');
const webserver = require('gulp-webserver');
const path      = require('path');

function clean () {
    return del('lib');
}

function build () {
    return spawn('npx tsc -p ./src/tsconfig.json', { stdio: 'inherit', shell: true });
}

function start () {
    const host = 'localhost';
    const port = '8000';

    const redirectJSMiddleware = (req, res, next) => {
        if (req.url === '/')
            return next();

        if (!path.extname(req.url)) {
            res.writeHead(301, {
                Location: `http://${host}:${port}/${req.url}.js`,
            }).end();
        }
        return next();
    };

    return gulp.src('lib')
        .pipe(webserver({
            host,
            port,
            fallback:   './lib/index.html',
            livereload: true,
            open:       true,
            middleware: redirectJSMiddleware,
        }));
}

function copyPublic () {
    return gulp.src('public/*.*')
        .pipe(gulp.dest('lib/'));
}

function lint (options) {
    return gulp
        .src([
            'src/**/*.js',
            'src/**/*.ts',
            'test/**/*.js',
            'Gulpfile.js',
        ])
        .pipe(eslint(options))
        .pipe(eslint.format())
        .pipe(options?.fix ? gulp.dest(file => file.base) : eslint.failAfterError())
        .pipe(eslint.failAfterError());
}

function lintFix () {
    return lint({ fix: true });
}

exports['fast-build'] = gulp.series(clean, build, copyPublic);
exports.build         = gulp.parallel(gulp.series(clean, build, copyPublic), lint);
exports.lint          = lint;
exports['lint-fix']   = lintFix;
exports.start         = start;
exports.default       = exports.build;
