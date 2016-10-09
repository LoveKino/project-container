'use strict';

let gulp = require('gulp');

let argv = require('yargs').argv;

let {
    install, link, cleanLink
} = require('nodedevdeps');

let path = require('path');

let spawnp = require('spawnp');

let del = require('del');

let promisify = require('promisify-node');

let ncp = promisify(require('ncp'));

let depMap = require('./dep');

const publishDir = path.join(__dirname, '../publish');

gulp.task('prepublish', () => {
    let project = depMap[argv.name];
    let publicPath = path.join(publishDir, argv.name);
    return del([publicPath], {
        force: true
    }).then(() => {
        return ncp(project.path, publicPath);
    }).then(() => {
        return install(publicPath).then(() => {
            return spawnp('npm test', null, {
                cwd: publicPath,
                stdio: 'inherit'
            });
        });
    });
});

gulp.task('publish', ['prepublish'], () => {
    return spawnp('npm publish', null, {
        cwd: path.join(publishDir, argv.name),
        stdio: 'inherit'
    });
});

gulp.task('link', () => {
    return link(depMap);
});

gulp.task('cleanLinks', () => {
    return cleanLink(depMap);
});
