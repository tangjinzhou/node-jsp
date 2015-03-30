var _ = module.exports;

_.escapeShellArg = function(cmd){
    return '"' + cmd + '"';
};
_.open = function(path, callback) {
    var child_process = require('child_process');
    //fis.log.notice('browse ' + path.yellow.bold + '\n');
    var cmd = _.escapeShellArg(path);
    if(process.platform.indexOf('win') === 0){
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