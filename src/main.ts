import { app, BrowserWindow } from "electron";


let mainWindow: Electron.BrowserWindow | null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true

    });
    mainWindow.loadURL(`http://localhost:8081`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})