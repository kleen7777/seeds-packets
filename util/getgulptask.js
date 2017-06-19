import gulp from 'gulp';
import theo from 'theo';
import rename from 'gulp-rename';
import insert from 'gulp-insert';

import versions from '../util/versions';

/**
 * 
 * @param {*String} pkg The name of the package
 * @param {*String} transform The registered Theo transform to use
 * @param {*String} format The registered Theo format to use
 * @param {*Object} opts Manipulate the path and the filename
 */
function getGulpTask(pkg, transform, format, opts = {}) {
  opts = {
    appendVersion: opts.appendVersion || false,
    dest: opts.dest || `packages/${pkg}/dist`,
    filename: opts.filename || pkg,
    prependFile: opts.prependFile || '',
    appendFile: opts.appendFile || ''
  };
  return function() {
    return gulp.src(`packages/${pkg}/tokens.yml`)
      .pipe(theo.plugins.transform(transform))
      .pipe(theo.plugins.format(format))
      .pipe(rename({
        dirname: '',
        basename: opts.filename,
        suffix: opts.appendVersion ? '.' + versions[pkg] : ''
      }))
      .pipe(insert.prepend(opts.prependFile ? opts.prependFile + '\n\n' : ''))
      .pipe(insert.append(opts.appendFile ? '\n\n' + opts.appendFile : ''))
      .pipe(gulp.dest(opts.dest));
  }
}

export default getGulpTask;