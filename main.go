package main

import (
	"github.com/leaanthony/mewn"
	log "github.com/sirupsen/logrus"
	"github.com/wailsapp/wails"
	"wid/backend/controllers"
	"wid/backend/database"
)

func basic() string {
	return "World!"
}

func InitDB() {
	if err := database.Init(DatabaseURI, DatabaseName); err != nil {
		log.Errorf("cannot create database. Error %v", err)
		return
	}
	log.Infof("create database ok! Database Name: %v; Database URI: %v", DatabaseName, DatabaseURI)
	if err := controllers.LoadState(); err != nil {
		log.Warnf("Load State error: %v", err)
	}
}

func main() {

	js := mewn.String("./frontend/dist/my-app/main.js")
	css := mewn.String("./frontend/dist/my-app/styles.css")

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1024,
		Height: 768,
		Title:  "Incognito Desktop Wallet",
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})

	InitDB()

	app.Bind(&controllers.WalletCtrl{})
	app.Bind(&controllers.AccountCtrl{})
	app.Bind(&controllers.AddressBookCtrl{})
	app.Bind(&controllers.MinerCtrl{})
	app.Bind(&controllers.NetworkCtrl{})
	app.Bind(&controllers.PdeCtrl{})
	app.Bind(&controllers.TransactionsCtrl{})

	app.Run()
}
