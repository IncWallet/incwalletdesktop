package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"gopkg.in/mgo.v2/bson"
	"wid/backend/database"
	"wid/backend/models"
)

type AddressBookParam struct {
	Name           string `json:"name"`
	PaymentAddress string `json:"paymentaddress"`
	ChainName      string `json:"chainname"`
	ChainType      string `json:"chaintype"`
}

/*
Add Address
- name : hieutran
- paymentaddress:12Rtu5A4kF7QvtaXvrjreU36BKsLdjto8gr7bob8zmhReiJVgdEtyVNwkTqmJgNtP4sxhfxtDPAA5GDjCp6FtSaP9rg6Yn8ca1grNgH
- chainname: incognito
- chaintype: mainnet
*/
func (AddressBookCtrl) AddAddress(name, paymentAddress, chainName string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	query := bson.M{
		"$or": []bson.M{
			bson.M{
				"name": name,
			},
			bson.M{
				"paymentaddress": paymentAddress,
			},
		},
	}
	if count ,err := database.AddressBook.Find(query).Count(); err == nil && count > 0 {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot add new address book"), errors.New(fmt.Sprintf("address {%v, %v} already existed", name, paymentAddress)), 0))
		return string(res)
	}

	newAddress := &models.AddressBook{
		Name:           name,
		PaymentAddress: paymentAddress,
		ChainName:      chainName,
	}
	if err := database.AddressBook.Insert(newAddress); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot add new address book"), err.Error(), 0))
		return string(res)

	}
	res, _ := json.Marshal(responseJsonBuilder(nil, "done", 0))
	return string(res)
}

/*
Delete Address
- name
- paymentaddress
*/
func (AddressBookCtrl) RemoveAddress(name, paymentAddress string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	addressBook := new(models.AddressBook)
	if err := database.AddressBook.Find(bson.M{
		"name": name,
		"paymentaddress": paymentAddress,
	}).One(&addressBook); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot remove address book"), errors.New(fmt.Sprintf("address {%v, %v} cannot be removed", name, paymentAddress)), 0))
		return string(res)
	}

	if err := database.AddressBook.Remove(addressBook); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot remove address book"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, "done", 0))
	return string(res)
}

/*
Get By Name
- name
*/
func (AddressBookCtrl) GetByName(name string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	addressBook := new(models.AddressBook)
	if err := database.AddressBook.Find(bson.M{
		"name": name,
	}).One(&addressBook); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get address book"), errors.New(fmt.Sprintf("address {%v} cannot be removed", name)), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, addressBook, 0))
	return string(res)
}

/*
Get By Payment Address
- payment address
*/
func (AddressBookCtrl) GetByPaymentAddress(paymentAddress string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	addressBook := new(models.AddressBook)
	if err := database.AddressBook.Find(bson.M{
		"paymentaddress": paymentAddress,
	}).One(&addressBook); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get address book"), errors.New(fmt.Sprintf("address {%v} cannot be removed", paymentAddress)), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, addressBook, 0))
	return string(res)
}

/*
Get All
*/
func (AddressBookCtrl) GetAll() string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	addressBooks := make([]*models.AddressBook, 0)
	if err := database.AddressBook.Find(bson.M{}).All(&addressBooks); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get all address book"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, addressBooks, 0))
	return string(res)
}