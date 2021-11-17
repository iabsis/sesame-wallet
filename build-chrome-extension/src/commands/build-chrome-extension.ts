import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const manifestDetails = {
  name: "Sesame wallet",
  version: "1.0",
  description: "Hold your alephium tokens and manage your cloud mining",
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  browser_action: {
    default_popup: "index.html",
    default_icon: "assets/icon/favicon.png",
  },
  manifest_version: 2,
};

const pluginSpecific = `<style>body,html {width: 450px;height: 600px;}</style>`;

/**
 * Handle process execution promise result based on exec function returns
 * @param error
 * @param stdout
 * @param stderr
 * @param resolve
 * @param reject
 */
const manageProcess = (error: any, stdout: any, stderr: any, resolve: (value: any) => void, reject: (reason?: any) => void) => {
  if (error) {
    reject(error.message);
  } else if (stderr) {
    reject(stderr);
  } else {
    resolve(stdout);
  }
};

/**
 * Display the stdout in real time
 * @param process
 */
const manageProcessStdout = (process: any) => {
  if (process && process.stdout) {
    process.stdout.on("data", function (data: any) {
      console.log(data);
    });
  }
};

/**
 * Build the assets with the ionic command
 * @returns
 */
const buildAssets = () => {
  return new Promise((resolve, reject) => {
    manageProcessStdout(exec("npx ionic build --prod", (error, stdout, stderr) => manageProcess(error, stdout, stderr, resolve, reject)));
  });
};

/**
 * Duplicate build folder to apply chrome relative patches
 * @returns
 */
const copyBuild = () => {
  return new Promise((resolve, reject) => {
    manageProcessStdout(exec("cp -r build chrome-build", (error, stdout, stderr) => manageProcess(error, stdout, stderr, resolve, reject)));
  });
};

/**
 * Create the manifest.json file in the build folder
 * @param manifestDetails
 */
const writeManifest = (manifestDetails: any) => {
  writeFileSync("chrome-build/manifest.json", JSON.stringify(manifestDetails, null, 2));
};

/**
 * Add the window size in the index.html file
 */
const updateIndexHtml = () => {
  let fileContent: string = String(readFileSync("chrome-build/index.html"));
  fileContent = fileContent.replace("</head>", pluginSpecific + "</head>");
  writeFileSync("chrome-build/index.html", fileContent);
};

/**
 * Execute command
 */
export const handler = async (): Promise<any> => {
  try {
    process.chdir("../");
    await buildAssets();
    await copyBuild();
    await writeManifest(manifestDetails);
    await updateIndexHtml();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
};
