package controllers

import (
	"encoding/json"
	"errors"
)

/*
Create Wallet
*/
func (App) CreateWallet(security int, passphrase, network string) string {
	seeds, err := StateM.WalletManager.CreateNewWallet(security, passphrase, network)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create wallet"), err.Error(), 0))
		return string(res)
	} else {
		res, _ := json.Marshal(responseJsonBuilder(nil, seeds, 0))
		return string(res)
	}
}

/*
Import Wallet
*/
func (App) ImportWallet(mnemonic, passphrase, network string) string {
	err := StateM.WalletManager.ImportWallet(mnemonic, passphrase, network)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot import wallet"), err.Error(), 0))
		return string(res)
	} else {
		res, _ := json.Marshal(responseJsonBuilder(nil, "Done", 0))
		return string(res)
	}
}
