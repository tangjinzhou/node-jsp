
var exports = module.exports;
var child_process = require('child_process');
var spawn = child_process.spawn;
//console.log(process.argv);
var javaHandle = require('./lib/java.js');

var opt = {
    'port': '8090',
    'root': 'C:/Users/tangjinzhou/AppData/Local/.fis-tmp/www',
    'rewrite': false,
    'process': 'java',
    'timeout': 3000
};
exports.start = function() {
    startJava(opt);
};

exports.stop = function(callback) {
    console.log('stop');
};

function startJava(opt) {
    checkJavaEnable(opt, function(java, opt) {
        if (java) {
            //java
            javaHandle.run(opt);
        }
    })
}

function checkJavaEnable(opt, callback) {
    var javaVersion = false;
    //check java
    process.stdout.write('checking java support : ');
    var java = spawn('java', ['-version']);

    java.stderr.on('data', function(data){
        if(!javaVersion){
            javaVersion = matchVersion(data.toString('utf8'));
            if(javaVersion) {
                process.stdout.write('v' + javaVersion + '\n');
            }
        }
    });

    java.on('error', function(err){
        process.stdout.write('java not support!');
        callback(javaVersion, opt);
    });

    java.on('exit', function() {
        if (!javaVersion) {
            process.stdout.write('java not support!');
        } else {
            opt['process'] = 'java';
        }
        callback(javaVersion, opt);
    });
}

function matchVersion(str) {
    var version = false;
    var reg = /\b\d+(\.\d+){2}/;
    var match = str.match(reg);
    if(match){
        version = match[0];
    }
    return version;
};
var commander = require('commander');

commander
    .option('-start, --start','start server')
    .option('-stop, --stop', 'stop server')
    .parse(process.argv);
if(commander.stop) {
    console.log('hello');
}
if(commander.start) {
    exports.start();
}
