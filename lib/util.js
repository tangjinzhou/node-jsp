var _ = module.exports;
    fs = require('fs'),
    pth = require('path'),
    IS_WIN = process.platform.indexOf('win') === 0,
    _exists = fs.existsSync || pth.existsSync;


_.escapeShellArg = function(cmd){
    return '"' + cmd + '"';
};
_.isWin = function(){
    return IS_WIN;
};
_.open = function(path, callback) {
    var child_process = require('child_process');
    //fis.log.notice('browse ' + path.yellow.bold + '\n');
    var cmd = _.escapeShellArg(path);
    if(_.isWin){
        cmd = 'start "" ' + cmd;
    } else {
        if(process.env['XDG_SESSION_COOKIE']){
            cmd = 'xdg-open ' + cmd;
        } else if(process.env['GNOME_DESKTOP_SESSION_ID']){
            cmd = 'gnome-open ' + cmd;
        } else {
            cmd = 'open ' + cmd;
        }
    }
    child_process.exec(cmd, callback);
};
_.map = function(obj, callback, merge){
    var index = 0;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            if(merge){
                callback[key] = obj[key];
            } else if(callback(key, obj[key], index++)) {
                break;
            }
        }
    }
};
_.getPidFile = function() {
    return __dirname + '/pid';
};
_.mkdir = function(path, mode){
    if (typeof mode === 'undefined') {
        //511 === 0777
        mode = 511 & (~process.umask());
    }
    if(_exists(path)) return;
    path.split('/').reduce(function(prev, next) {
        if(prev && !_exists(prev)) {
            fs.mkdirSync(prev, mode);
        }
        return prev + '/' + next;
    });
    if(!_exists(path)) {
        fs.mkdirSync(path, mode);
    }
};
_.write = function(path, data, charset, append){
    if(!_exists(path)){
        _.mkdir(__dirname);
    }
    if(append) {
        fs.appendFileSync(path, data, null);
    } else {
        fs.writeFileSync(path, data, null);
    }
};
_.exists = _exists;
_.fs = fs;