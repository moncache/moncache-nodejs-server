var IO = require('fs');

var logsDirectory = './logs';

if (!IO.existsSync(logsDirectory)) {
  IO.mkdirSync(logsDirectory);
}

var intel = require('intel');
intel.basicConfig({
  file: logsDirectory + '/moncache.server.log',
  format: '[%(date)s] %(levelname)s [%(name)s]: %(message)s',
  level: intel.TRACE
});

intel.info('----------------------------------------------------------------------------------------------------');
intel.info('|');
intel.info('|');
intel.info('|                                                 ', new Date());
intel.info('|');
intel.info('|');
intel.info('----------------------------------------------------------------------------------------------------');

module.exports = function(name) {
  return intel.getLogger(name);
};

