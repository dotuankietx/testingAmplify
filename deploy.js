import SftpUpload from "sftp-upload";
import fs from "fs";

let host = fs.readFileSync("./sftp.json", "utf8");
host = JSON.parse(host);
var options = {
    host: host.host,
    username: host.username,
    password: host.password,
    path: host.path,
    remoteDir: host.remoteDir,
    dryRun: false,
  },
  sftp = new SftpUpload(options);

sftp
  .on("error", function (err) {
    throw err;
  })
  .on("uploading", function (progress) {
    console.log("Uploading", progress.file);
    console.log(progress.percent + "% completed");
  })
  .on("completed", function () {
    console.log("Upload Completed");
  })
  .upload();
