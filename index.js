'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed',function(){
  if(process.platform != 'drawin')app.quit();
});

app.on('ready',function(){
  mainWindow = new BrowserWindow({width:1200,height:900});
  mainWindow.loadURL('file://'+ __dirname + '/index.html');
  mainWindow.on('closed',function(){
    mainWindow = null;
  });
});
