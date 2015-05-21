
var child_process = require('child_process');
var spawn = child_process.spawn;
var javaHandle = require('./lib/java.js');
var _ = require('./lib/util.js');
var opt = {
    'port': '8090',
    'root': 'D:/node-jsp-server/jsp/test',
    'process': 'java',
    'timeout': 3000
};
function start () {
    startJava(opt);
};
function checkPid(pid, opt, callback) {
    var list, msg = '';
    var isWin = _.isWin();

    if (isWin) {
        list = spawn('tasklist');
    } else {
        list = spawn('ps', ['-A']);
    }

    list.stdout.on('data', function (chunk) {
        msg += chunk.toString('utf-8').toLowerCase();
    });

    list.on('exit', function() {
        var found = false;
        msg.split(/[\r\n]+/).forEach(function(item){
            var reg = new RegExp('\\b'+opt['process']+'(?:js)?\\b', 'i');
            if (reg.test(item)) {
                var iMatch = item.match(/\d+/);
                if (iMatch && iMatch[0] == pid) {
                    found = true;

                }
            }
        });

        callback(found);
    });

    list.on('error', function (e) {
        if (isWin) {
            //fis.log.error('fail to execute `tasklist` command, please add your system path (eg: C:\\Windows\\system32, you should replace `C` with your system disk) in %PATH%');
        } else {
            //fis.log.error('fail to execute `ps` command.');
        }
    });
};
function stop (callback) {  
    var tmp = _.getPidFile();
    var isWin = _.isWin();
    //read option
    //var opt = option();
    if (_.exists(tmp)) {
        var pid = _.fs.readFileSync(tmp, 'utf8').trim();
        checkPid(pid, opt, function(exists) {
            if (exists) {
                if (isWin) {
                    // windows 貌似没有 gracefully 关闭。
                    // 用 process.kill 会遇到进程关不了的情况，没有 exit 事件响应，原因不明！
                    require('child_process').exec('taskkill /PID ' + pid + ' /T /F');
                } else {
                    // try to gracefully kill it.
                    process.kill(pid, 'SIGTERM');
                }
                // checkout it every half second.
                (function(done) {
                    var start = Date.now();
                    var timer = setTimeout(function() {
                        var fn = arguments.callee;

                        checkPid(pid, opt, function(exists) {
                            if (exists) {
                                // 实在关不了，那就野蛮的关了它。
                                if (Date.now() - start > 5000) {
                                    try {
                                        isWin ?
                                            require('child_process').exec('taskkill /PID ' + pid + ' /T /F') :
                                            process.kill(pid, 'SIGKILL');
                                    } catch(e) {

                                    }
                                    clearTimeout(timer);
                                    done();
                                    return;
                                }
                                timer = setTimeout(fn, 500);
                            } else {
                                done();
                            }
                        });
                    }, 20);
                })(function() {
                    process.stdout.write('shutdown '+opt['process']+' process [' + pid + ']\n');
                    _.fs.unlinkSync(tmp);
                    callback && callback();
                })
            } else {
                callback && callback();
            }
        });
    } else {
        if (callback) {
            callback();
        }
    }
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
};

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
var argv = process.argv;
if(argv[2] && (argv[2].toLowerCase() == '-v' || argv[2].toLowerCase() == '-version')) {
    argv[2] = '-V';
}

commander
    .version('0.1.0')
    .option('-start, --start','start server')
    .option('-stop, --stop', 'stop server')
    .option('-restart, --restart', 'restart server')
    .parse(process.argv);

if(commander.start || commander.restart) {
    stop(start);
} else if(commander.stop) {
    stop();
} else {
    argv[2] = '-h';
    commander.parse(process.argv);
}
