package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	log "github.com/sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"math"
	"wid/backend/database"
	"wid/backend/lib/common"
	"wid/backend/models"
)

type AccountParam struct {
	Name       string `json:"name"`
	Passphrase string `json:"passphrase"`
	TokenID    string `json:"tokenid"`
	Limit      int    `json:"limit"`
	PrivateKey string `json:"privatekey"`
	PublicKey  string `json:"publickey"`
}

/*
import Account
- account name
- private key
- passphrase
*/
func (AccountCtrl) ImportAccount(accountName, privateKey, passphrase string) string {
	err := StateM.AccountManage.ImportAccount(accountName, privateKey, passphrase)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot import account"), err.Error(), 0))
		return string(res)
	}
	err = JobSyncAccountFromRemote(privateKey)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot sync from import account"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, infoJsonBuilder(StateM.AccountManage.Account, "", 0, 0 ,0), 0))
	return string(res)
}

/*
Add Account
- account name
- passphrase
*/
func (AccountCtrl) AddAccount(accountName, passphrase string) string {
	privateKeyStr, err := StateM.AccountManage.AddAccount(accountName, passphrase)
	if err != nil {
		log.Warnf("cannot add account. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New(fmt.Sprintf("cannot add account. Error %v", err)), "", 0))
		return string(res)
	}
	err = JobSyncAccountFromRemote(privateKeyStr)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot sync from add account"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, "done", 0))
	return string(res)
}

/*
- publickey
- passphrase
*/
func (AccountCtrl) SyncAccount(publicKey, passphrase string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}
	err := StateM.AccountManage.SyncAccount(publicKey, passphrase)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot sync account"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, infoJsonBuilder(StateM.AccountManage.Account, "", 0, 0 ,0), 0))
	return string(res)
}

/*
Switch Account
- account name
- passphrase
*/
func (AccountCtrl) SwitchAccount(name, passphrase string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}
	privateKeyStr, err := StateM.AccountManage.SwitchAccount(name, passphrase)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot switch account"), err.Error(), 0))
		return string(res)
	}

	err = JobSyncAccountFromRemote(privateKeyStr)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot sync from add account"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, infoJsonBuilder(StateM.AccountManage.Account, "", 0, 0 ,0), 0))
	return string(res)
}

/*
Sync All Account
- passphrase
*/
func (AccountCtrl) SyncAllAccounts(passphrase string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	var listAccounts []*models.Account
	if err := database.Accounts.Find(bson.M{"wallet": StateM.WalletManager.WalletID}).All(&listAccounts); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get all accounts info"), err.Error(), 0))
		return string(res)
	}

	listErrors := StateM.AccountManage.SyncAllAccounts(listAccounts, passphrase)
	if len(listErrors) >0  {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot sync all account"), listErrors, 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, "done", 0))
	return string(res)
}

/*
List Account
*/
func (AccountCtrl) ListAccount() string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	var listAccounts []models.Account
	if err := database.Accounts.Find(bson.M{"wallet": StateM.WalletManager.WalletID}).All(&listAccounts); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get all accounts"), err.Error(), 0))
		return string(res)
	}

	listTotalPRV := make([]float64, 0)
	listTotalUSDT := make([]float64, 0)
	listTotalBTC := make([]float64, 0)
	for _, acc := range listAccounts {
		mapBalance, err := StateM.AccountManage.GetBalance(acc.PublicKey,"")
		if err != nil {
			res, _ := json.Marshal(responseJsonBuilder(errors.New(fmt.Sprintf("cannot get balance for account %v", acc.PublicKey)), err.Error(), 0))
			return string(res)
		}

		totalPRV, _ := getTotalValueInPRV(mapBalance)
		listTotalPRV = append(listTotalPRV, float64(totalPRV) / math.Pow10(9))
		totalUSDT, _, _ := getExchangeRate(common.PRVID, common.USDTID, totalPRV, 0, true)
		listTotalUSDT = append(listTotalUSDT, float64(totalUSDT) / math.Pow10(6))
		totalBTC, _, _ := getExchangeRate(common.PRVID, common.BTCID, totalPRV, 0, true)
		listTotalBTC = append(listTotalBTC, float64(totalBTC) / math.Pow10(9))
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, accountJsonBuilder(listAccounts, listTotalPRV, listTotalUSDT, listTotalBTC), 0))
	return string(res)
}

/*
Balance Account
- token id
*/
func (AccountCtrl) GetBalance(tokenID string) string {
	if flag, err := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, err))
		return string(res)
	}
	mapBalance := make(map[string]uint64)
	var err error
	if len(tokenID) == 0 {
		mapBalance, err = StateM.AccountManage.GetBalance("","")
	} else {
		mapBalance, err = StateM.AccountManage.GetBalance("", tokenID)
	}

	if err != nil {
		log.Errorf("cannot retrieve balance account. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot retrieve balance"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, balanceJsonBuilder(mapBalance), 0))
	return string(res)
}

/*
List unspent coins
- tokenid
*/
func (AccountCtrl) ListUnspent(tokenID string) string {
	if flag, err := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, err))
		return string(res)
	}

	listUnspentCoins, err := StateM.AccountManage.GetUnspentOutputCoin(tokenID)
	if err != nil {
		log.Errorf("cannot retrieve unspent coins from account. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot retrieve unspent coins from account"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, coinDetailJsonBuilder(listUnspentCoins), 0))
	return string(res)
}

/*
Account info
- passphrase
- publicjey
*/
func (AccountCtrl) GetInfo(publicKey, passphrase string) string {
	if flag, err := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, err))
		return string(res)
	}

	account := new(models.Account)
	if publicKey != "" {
		if err := database.Accounts.Find(bson.M{"publickey": publicKey}).One(&account); err != nil {
			res, _ := json.Marshal(responseJsonBuilder(errors.New(fmt.Sprintf("cannot get info for account %v", publicKey)), err.Error(), 0))
			return string(res)
		}
	} else {
		account = StateM.AccountManage.Account
	}

	mapBalance, err := StateM.AccountManage.GetBalance(account.PublicKey,"")
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New(fmt.Sprintf("cannot get balance for account %v", StateM.AccountManage.Account.PublicKey)), err.Error(), 0))
		return string(res)
	}

	totalPRV, _ := getTotalValueInPRV(mapBalance)
	totalPRVView := float64(totalPRV) / math.Pow10(9)

	totalUSDT, _, _ := getExchangeRate(common.PRVID, common.USDTID, totalPRV, 0, true)
	totalUSDTView := float64(totalUSDT) / math.Pow10(6)

	totalBTC, _, _ := getExchangeRate(common.PRVID, common.BTCID, totalPRV, 0, true)
	totalBTCView := float64(totalBTC) / math.Pow10(9)

	var privateKeyStr string
	if passphrase != "" {
		privateKey, err := StateM.WalletManager.SafeStore.DecryptPrivateKey(
			&account.Crypto,
			passphrase)
		if err != nil {
			res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get account info"), err.Error(), 0))
			return string(res)
		}
		privateKeyStr = string(privateKey)
	} else {
		privateKeyStr = "enter passphrase to view ... "
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, infoJsonBuilder(account, privateKeyStr, totalPRVView, totalUSDTView, totalBTCView), 0))
	return string(res)
}