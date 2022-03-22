const fse = require("fs-extra");
const path = require("path");

const serverLocation = "C:/Users/the_best/Desktop/Another Cool Vanilla (1.18.1)";
const backupLocaton = path.join("D:/servers", path.basename(serverLocation) + " - backup");

class ServerBackup {
    getCount() {
        return parseInt(fse.readFileSync(path.join(serverLocation, "ms.timecheck")).toString());
    }

    changeCount(n) {
        fse.writeFileSync(path.join(serverLocation, "ms.timecheck"), (this.getCount() + n).toString());
    }

    restartCount() {
        fse.writeFileSync(path.join(serverLocation, "ms.timecheck"), "0");
    }

    start() {
        if (this.getCount() > 10800000) {
            console.warn("Backup will be created.");
            this.restartCount();
            console.log("Removing old files...");
            fse.removeSync(backupLocaton);
            console.log("Creating server backup...");
            fse.copySync(serverLocation, backupLocaton);
            console.log("All done!");
        }
    }
}

new ServerBackup().start();

module.exports = new ServerBackup();