const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

// Load IPC modules
require("./ipc/exams")(ipcMain, db);
require("./ipc/subjects")(ipcMain, db);
require("./ipc/questions")(ipcMain, db);
require("./ipc/session")(ipcMain, db);
require("./ipc/answers")(ipcMain, db);
require("./ipc/candidates")(ipcMain, db);
require("./ipc/reports")(ipcMain, db);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const dev = process.env.NODE_ENV === "development";
  dev
    ? mainWindow.loadURL("http://localhost:3000")
    : mainWindow.loadFile(path.join(__dirname, "out/index.html"));

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
