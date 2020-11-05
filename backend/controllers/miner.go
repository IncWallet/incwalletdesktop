package controllers

import (
	"encoding/json"
	"errors"
	log "github.com/sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"wid/backend/database"
	"wid/backend/lib/base58"
	"wid/backend/lib/common"
	"wid/backend/lib/hdwallet"
	"wid/backend/models"
)

type MinerParams struct {
	PaymentAddresses []string `json:"paymentaddresses"`
	MiningKeys []string `json:"miningkeys"`
}

//Get miner info
//- paymentAddress[]
//- miningKey[]
func (MinerCtrl) GetMinerInfo(paymentAddresses, miningKeys []string) string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	listMinerInfoJson := make([]*MinerInfoJson, 0)
	for i := range paymentAddresses {
		minerInfo := &MinerInfoJson{
			PaymentAddress:    paymentAddresses[i],
			MiningKey:    miningKeys[i],
			BeaconHeight: StateM.NetworkManager.BeaconState.Height,
			Epoch:        StateM.NetworkManager.BeaconState.Epoch,
			Reward: uint64(0),
			Status: "None",
			ShardID: -2,
			Index:  0,
		}

		kw, err := hdwallet.Base58CheckDeserialize(minerInfo.PaymentAddress)
		if err != nil {
			res, _ := json.Marshal(responseJsonBuilder(errors.New("payment address is invalid"), err.Error(), 0))
			return string(res)
		}

		publicKeyStr := base58.Base58Check{}.Encode(kw.KeySet.PaymentAddress.Pk, common.ZeroByte)
		var reward models.CommitteReward
		if err := database.Reward.Find(bson.M{"publickey":publicKeyStr}).One(&reward); err == nil {
			minerInfo.Reward = reward.Amount
		}
		committeePublicKey, err := hdwallet.GetMiningPubKey(minerInfo.MiningKey, minerInfo.PaymentAddress)
		if err != nil {
			log.Errorf("cannot get committee public key from mining key %v. Error %v", minerInfo.MiningKey, err)
			listMinerInfoJson = append(listMinerInfoJson, minerInfo)
			continue
		}
		var committee models.Committee
		if err := database.Committee.Find(bson.M{"key": committeePublicKey}).One(&committee); err == nil {
			minerInfo.Status = committee.Role
			minerInfo.ShardID = committee.ShardId
			minerInfo.Index = committee.Index
		} else {
			log.Errorf("cannot get committee info %v. Error %v", committeePublicKey, err)
		}
		listMinerInfoJson = append(listMinerInfoJson, minerInfo)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, listMinerInfoJson, 0))
	return string(res)
}

//Get miner info
func (MinerCtrl) GetAllMinerInfo() string {
	if flag, _ := IsStateFull() ; !flag{
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot start to sync all account, import or add account first"), StateM.WalletManager.WalletID, 0))
		return string(res)
	}

	var listAccounts []models.Account
	if err := database.Accounts.Find(bson.M{
		"wallet": StateM.WalletManager.WalletID,
	}).All(&listAccounts); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get all accounts"), err.Error(), 0))
		return string(res)
	}

	listMinerInfoJson := make([]*MinerInfoJson, 0)
	for i := range listAccounts{
		minerInfo := &MinerInfoJson{
			PaymentAddress:    listAccounts[i].PaymentAddress,
			MiningKey:    listAccounts[i].MiningKey,
			BeaconHeight: StateM.NetworkManager.BeaconState.Height,
			Epoch:        StateM.NetworkManager.BeaconState.Epoch,
			Reward: uint64(0),
			Status: "None",
			ShardID: -2,
			Index:  0,
		}
		kw, err := hdwallet.Base58CheckDeserialize(minerInfo.PaymentAddress)
		if err != nil {
			res, _ := json.Marshal(responseJsonBuilder(errors.New("payment address is invalid"), err.Error(), 0))
			return string(res)
		}
		publicKeyStr := base58.Base58Check{}.Encode(kw.KeySet.PaymentAddress.Pk, common.ZeroByte)
		var reward models.CommitteReward
		if err := database.Reward.Find(bson.M{"publickey":publicKeyStr}).One(&reward); err == nil {
			minerInfo.Reward = reward.Amount
		}
		committeePublicKey, err := hdwallet.GetMiningPubKey(minerInfo.MiningKey, minerInfo.PaymentAddress)
		if err != nil {
			log.Errorf("cannot get committee public key from mining key %v. Error %v", minerInfo.MiningKey, err)
			listMinerInfoJson = append(listMinerInfoJson, minerInfo)
			continue
		}
		var committee models.Committee
		if err := database.Committee.Find(bson.M{"key": committeePublicKey}).One(&committee); err == nil {
			minerInfo.Status = committee.Role
			minerInfo.ShardID = committee.ShardId
			minerInfo.Index = committee.Index
		} else {
			log.Errorf("cannot get committee info %v. Error %v", committeePublicKey, err)
		}
		listMinerInfoJson = append(listMinerInfoJson, minerInfo)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, listMinerInfoJson, 0))
	return string(res)
}
