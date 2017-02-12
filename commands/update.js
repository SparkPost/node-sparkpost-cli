const exec = require('child_process').exec;

module.exports = {
  describe: 'Update the SparkPost CLI',
  action: function(callback) {
    let packageName = require('../package.json').name;

    isFromNPM(packageName, function(fromNPM) {
      if (!fromNPM) {
        return callback(new Error('Cannot update CLI via NPM.\nIf you cloned it from github pull the latest version to update.'));
      }
      else {
        update(packageName, callback);
      }
    });
  }
};

function isFromNPM(packageName, callback) {
  exec('npm list -g --depth=0 2>/dev/null', function(err, stdout, stderr) {
    // something went wrong (no npm, no global, idk)
    if (err || stderr) {
      callback(false);
    }
    else {
      let regexForSymLink = new RegExp(`${packageName}@.*->.*`);
      let regexForFromNPM = new RegExp(`${packageName}`);
      // is symlinked with NPM
      if (regexForSymLink.exec(stdout)) {
        callback(false);
      }
      // if its not globally installed with npm
      else if (!regexForFromNPM.exec(stdout)) {
        callback(false);
      }
      // we are good to go to update
      else {
        callback(true);
      }
    }
  });
}

function update(packageName, callback) {
  let currentVersion = require('../package.json').version;
  
  console.log('running');
  exec(`npm update ${packageName} -g`, function(error, stdout, stderr) {
    let newVersion = require('../package.json').version; 
    
    if (newVersion === currentVersion) {
      callback(null, 'CLI is to date.');
    }
    else {
      console.log(null, 'CLI has been updated.');
    }
  });
}