var http = require('http');
var fs = require('fs');
var file = require('file');
var admzip = require('adm-zip');
var mv = require('mv');
var rmdir = require('rmdir');

function sortFiles(dirs, destinationDir) {
    var breaks = ['-late_', '_'];
    var names = getNames(dirs);
    names.forEach(function (name) {
        var destFolder = destinationDir + name;
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder);
        }
    });
    dirs.forEach(function (dir) {
        var files = walk(dir);
        files.forEach(function (file) {
            var name = getStudentName(file);
            var filename = file.replace(/^.*[\\\/]/, '');
            var dest = destinationDir+name+"\\"+filename;
            mv(file, dest, function (err) {
                //console.log(err);
            });
        });
        rmdir(dir, function (err, dirs, files) {
            //console.log(dirs);
            //console.log(files);
            //console.log("All files removed from " + dir);
        });
    });
    return names;
}

function getStudentName(file) {
    var filename = file.replace(/^.*[\\\/]/, '');
    var name = filename.split('_')[0];
    if (name.indexOf("-late") > -1) {
        var j = name.indexOf('-late');
        name = name.slice(0, j);
    }
    return name;
}

function getNames(dirs) {
    var names = [];
    dirs.forEach(function (dir) {
        var files = walk(dir);
        files.forEach(function (file) {
            var filename = file.replace(/^.*[\\\/]/, '');
            var name = filename.split('_')[0];
            if (name.indexOf("-late") > -1) {
                var j = name.indexOf('-late');
                name = name.slice(0, j);
            }
            names.push(name);
        });
    });
    return names;
}

function unzipSubmissions(sourceDir, destinationDir) {
    var results = [];
    var files = walk(sourceDir);
    //submissions(1)
    files.forEach(function (file) {
        if (file.indexOf("submissions") > -1 && file.indexOf(".zip") > -1) {
            var zip = new admzip(file);
            var filename = file.replace(/^.*[\\\/]/, '')
            filename = filename.slice(0, -4);
            var destFolder = destinationDir + filename;
            //console.log(destFolder);
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder);
            }
            zip.extractAllTo(destFolder+"\\", true);
            results.push(destFolder);
        }
    });
    return results;
}

var walk = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '\\' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file);
    })
    return results;
}

var results = unzipSubmissions("c:\\users\\ncarlson\\Downloads", "c:\\users\\ncarlson\\Downloads\\");
var names = sortFiles(results, "c:\\users\\ncarlson\\Downloads\\");
