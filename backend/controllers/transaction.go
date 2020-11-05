package controllers

import (
	"encoding/json"
	"errors"
	log "github.com/sirupsen/logrus"
	"gopkg.in/mgo.v2/bson"
	"wid/backend/database"
	"wid/backend/lib/common"
	"wid/backend/lib/hdwallet"
	"wid/backend/lib/transaction"
	"wid/backend/models"
)

type TxParam struct {
	Receivers  map[string]uint64    `json:"receivers"`
	Fee        uint64               `json:"fee"`
	Info       string               `json:"info"`
	Passphrase string               `json:"passphrase"`
	TokenID    string               `json:"tokenid"`
	Metadata   transaction.Metadata `json:"metadata"`
	TxHash     string               `json:"txhash"`
}

type TxTradeParam struct {
	FromTokenID      string `json:"fromtokenid"`
	ToTokenID        string `json:"totokenid"`
	SendAmount       uint64 `json:"sendamount"`
	MinReceiveAmount uint64 `json:"minreceiveamount"`
	TradingFee       uint64 `json:"tradingfee"`
	TraderAddressStr string `json:"traderaddressstr"`
	TxFee            uint64 `json:"txfee"`
	Passphrase       string `json:"passphrase"`
}

/* MINER TRANSACTION */
/*
Init Stop Auto Staking Tx
- txfee
- passphrase
*/
func (TransactionsCtrl) InitStopAutoStakingTransaction(txFee uint64, passphrase string) string {
	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}
	receiver := make(map[string]uint64)
	receiver[common.BurnAddress2] = uint64(0)

	committeePublicKey, err := hdwallet.GetMiningPubKey(StateM.AccountManage.Account.MiningKey, StateM.AccountManage.Account.PaymentAddress)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, cannot get mining public key"), err.Error(), 0))
		return string(res)
	}

	meta := transaction.NewStopAutoStakingMetadata(
		committeePublicKey,
	)

	txHash, err := txManager.InitTransaction(
		receiver,
		txFee,
		"",
		meta,
		common.PRVID,
		false,
		passphrase)
	if err != nil {
		log.Errorf("Cannot Init transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}

func (TransactionsCtrl) InitWithdrawRewardTransaction(passphrase string) string {
	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}
	receiver := make(map[string]uint64)
	txFee := uint64(0)
	keyWallet, _ := hdwallet.Base58CheckDeserialize(StateM.AccountManage.Account.PaymentAddress)
	meta := transaction.NewWithdrawRewardMetadata(common.PRVID, keyWallet.KeySet.PaymentAddress)

	txHash, err := txManager.InitTransaction(
		receiver,
		txFee,
		"",
		meta,
		common.PRVID,
		false,
		passphrase)
	if err != nil {
		log.Errorf("Cannot Init transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}


/* TRADE TRANSACTION */
/*
Init Trade PRV Tx
- from token
- to token
- send amount
- min receive amount
- trading fee
- trader address str
- passphrase
*/
func (TransactionsCtrl) InitTradePRVTransaction(fromTokenID, toTokenID string, sendAmount, minReceiveAmount, tradingFee, txFee uint64, traderAddressStr, passphrase string) string {
	txTradeParam := &TxTradeParam{
		FromTokenID:      fromTokenID,
		ToTokenID:        toTokenID,
		SendAmount:       sendAmount,
		MinReceiveAmount: minReceiveAmount,
		TradingFee:       tradingFee,
		TraderAddressStr: traderAddressStr,
		TxFee:            txFee,
		Passphrase:       passphrase,
	}

	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}
	receiver := make(map[string]uint64)
	receiver[common.BurnAddress2] = txTradeParam.SendAmount + txTradeParam.TradingFee
	meta := transaction.NewPDETradeRequestMetadata(
		txTradeParam.ToTokenID,
		txTradeParam.FromTokenID,
		txTradeParam.SendAmount,
		txTradeParam.MinReceiveAmount,
		txTradeParam.TradingFee,
		txTradeParam.TraderAddressStr,
	)

	txHash, err := txManager.InitTransaction(
		receiver,
		txFee,
		"",
		meta,
		common.PRVID,
		false,
		txTradeParam.Passphrase)
	if err != nil {
		log.Errorf("Cannot Init transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}

/*
Init Trade Token Tx
- from token
- to token
- send amount
- min receive amount
- trading fee
- trader address str
- token id
- passphrase
*/
func (TransactionsCtrl) InitTradeTokenTransaction(fromTokenID, toTokenID string, sendAmount, minReceiveAmount, tradingFee, txFee uint64, traderAddressStr, passphrase string) string {
	txTradeParam := &TxTradeParam{
		FromTokenID:      fromTokenID,
		ToTokenID:        toTokenID,
		SendAmount:       sendAmount,
		MinReceiveAmount: minReceiveAmount,
		TradingFee:       tradingFee,
		TraderAddressStr: traderAddressStr,
		TxFee:            txFee,
		Passphrase:       passphrase,
	}

	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}

	receiver := make(map[string]uint64)
	receiver[common.BurnAddress2] = txTradeParam.SendAmount + txTradeParam.TradingFee
	meta := transaction.NewPDETradeRequestMetadata(
		txTradeParam.ToTokenID,
		txTradeParam.FromTokenID,
		txTradeParam.SendAmount,
		txTradeParam.MinReceiveAmount,
		txTradeParam.TradingFee,
		txTradeParam.TraderAddressStr,
	)

	txHash, err := txManager.InitTokenTransaction(
		nil,
		receiver,
		txFee,
		"",
		meta,
		txTradeParam.FromTokenID,
		false,
		txTradeParam.Passphrase)
	if err != nil {
		log.Errorf("Cannot Init transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}

/*
Init Trade Token Tx
- from token
- to token
- send amount
- min receive amount
- trading fee
- trader address str
- token id
- iscross
- passphrase
*/
func (TransactionsCtrl) InitTradeCrossTokenTransaction(fromTokenID, toTokenID string, sendAmount, minReceiveAmount, tradingFee, txFee uint64, traderAddressStr, passphrase string) string {
	txTradeParam := &TxTradeParam{
		FromTokenID:      fromTokenID,
		ToTokenID:        toTokenID,
		SendAmount:       sendAmount,
		MinReceiveAmount: minReceiveAmount,
		TradingFee:       tradingFee,
		TraderAddressStr: traderAddressStr,
		TxFee:            txFee,
		Passphrase:       passphrase,
	}

	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	if txTradeParam.FromTokenID == common.PRVID || txTradeParam.ToTokenID == common.PRVID {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), "one of from or to token id is PRV", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}

	receiverPrv := make(map[string]uint64)
	receiverPrv[common.BurnAddress2] = txTradeParam.TradingFee

	receiverToken := make(map[string]uint64)
	receiverToken[common.BurnAddress2] = txTradeParam.SendAmount

	meta := transaction.NewPDETradeCrossRequestMetadata(
		txTradeParam.ToTokenID,
		txTradeParam.FromTokenID,
		txTradeParam.SendAmount,
		txTradeParam.MinReceiveAmount,
		txTradeParam.TradingFee,
		txTradeParam.TraderAddressStr,
	)

	txHash, err := txManager.InitTokenTransaction(
		receiverPrv,
		receiverToken,
		txFee,
		"",
		meta,
		txTradeParam.FromTokenID,
		false,
		txTradeParam.Passphrase)
	if err != nil {
		log.Errorf("Cannot Init transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}

/* TRANSFER TRANSACTION */
/*
Init PRVTx
- Receivers
- Fee
- Info
- Passphrase
*/
func (TransactionsCtrl) InitTransaction(receivers map[string]uint64, fee uint64, info string, passphrase string) string {
	txParam := &TxParam{
		Receivers:  receivers,
		Fee:        fee,
		Info:       info,
		Passphrase: passphrase,
		Metadata:   nil,
	}

	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}

	txHash, err := txManager.InitTransaction(
		txParam.Receivers,
		txParam.Fee,
		txParam.Info,
		txParam.Metadata,
		common.PRVID,
		true,
		txParam.Passphrase)
	if err != nil {
		log.Errorf("Cannot Init transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}

/*
Init PRVTx Token
- Receivers
- Fee
- Info
- TokenID
- Passphrase
*/
func (TransactionsCtrl) InitTokenTransaction(receivers map[string]uint64, fee uint64, info, tokenID, passphrase string) string {
	txParam := &TxParam{
		Receivers:  receivers,
		Fee:        fee,
		Info:       info,
		Passphrase: passphrase,
		Metadata:   nil,
		TokenID: tokenID,
	}

	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	txManager := &TransactionManager{
		am:        StateM.AccountManage,
		rpcCaller: StateM.RpcCaller,
	}

	if txParam.TokenID == "" || txParam.TokenID == common.PRVID {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("bad request"), "Only accept pToken", 0))
		return string(res)
	}

	txHash, err := txManager.InitTokenTransaction(
		nil,
		txParam.Receivers,
		txParam.Fee,
		txParam.Info,
		txParam.Metadata,
		txParam.TokenID,
		true,
		txParam.Passphrase)

	if err != nil {
		log.Errorf("Cannot Init token transfer transaction. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, txHash, 0))
	return string(res)
}


/* GET INFORMATION */
/*
/transaction/history
TxHistory
- token id
*/
func (TransactionsCtrl) GetTxHistory(pageIndex, pageSize int, tokenID string) string {
	if flag, _ := IsStateFull(); !flag {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot create transaction, import or add account first"), "", 0))
		return string(res)
	}

	var query bson.M
	if len(tokenID) != 0 {
		query = bson.M{
			"publickey": StateM.AccountManage.AccountID,
			"tokenid":   tokenID,
		}
	} else {
		query = bson.M{
			"publickey": StateM.AccountManage.AccountID,
		}
	}

	var listTxHistory []models.TxHistory
	size, err := database.TxHistory.Find(query).Count()
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot load tx history"), err.Error(), 0))
		return string(res)
	}

	if err := database.TxHistory.Find(query).Sort("-locktime").Skip((pageIndex - 1) * pageSize).Limit(pageSize).All(&listTxHistory); err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot load tx history"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, txHistoryJsonBuilder(listTxHistory, size), 0))
	return string(res)
}

/*
/transactions/info
Tx Info
- txhash
*/
func (TransactionsCtrl) GetTxInfo(txHash string) string {

	var tx *models.AutoTxByHash
	tx, err := StateM.RpcCaller.GetAutoTxByHash(txHash)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get tx info from txhash"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, txInfoJsonBuilder(tx), 0))
	return string(res)
}

