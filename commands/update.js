const exec = require('child_process').exec;
const chalk = require('chalk');

module.exports = {
  describe: 'Update the SparkPost CLI',
  action: function(callback) {
    let packageName = require('../package.json').name;

    console.log('Checking for updates...');
    isFromNPM(packageName, function(err, fromNPM) {
      if (err) {
        return callback(err);
      }
      else {
        return update(packageName, callback);
      }
    });
  }
};

function isFromNPM(packageName, callback) {
  exec('npm list -g --depth=0 2>/dev/null', function(err, stdout, stderr) {
    // something went wrong (no npm, no global, idk)
    if (!stdout) {
      callback(stderr || err, false);
    }
    else {
      let regexForSymLink = new RegExp(`${packageName}@.*->.*`);
      let regexForFromNPM = new RegExp(`${packageName}`);
      // is symlinked with NPM
      if (regexForSymLink.exec(stdout)) {
        callback(new Error('CLI symlinked from local repository. To update, pull the latest version from github or redownload the repository.', false));
      }
      // if its not globally installed with npm
      else if (!regexForFromNPM.exec(stdout)) {
        callback(new Error(`CLI is not installed globally. If you installed it locally run ${chalk.yellow(`npm update ${packageName}`)}.`, false));
      }
      // we are good to go to update
      else {
        callback(null, true);
      }
    }
  });
}

function update(packageName, callback) {
  let currentVersion = require('../package.json').version;
  
  exec(`npm update ${packageName} -g`, function(error, stdout, stderr) {
    let newVersion = require('../package.json').version; 
    
    if (newVersion === currentVersion) {
      callback(null, 'CLI is to date.');
    }
    else {
      console.log(null, 'CLI updated.');
    }
  });
}