package controllers

import (
	"encoding/json"
	"errors"
	log "github.com/sirupsen/logrus"
	"wid/backend/database"
)

type NetworkParam struct {
	TokenName   string `json:"tokenname"`
	TokenSymbol string `json:"tokensymbol"`
	Verified    bool   `json:"verified"`
	TokenID     string `json:"tokenid"`
	NetworkName string `json:"networkname"`
	NetworkURL  string `json:"networkurl"`
}

/*
/network/gettokenbyID
Get Token by ID
- token id
*/
func (NetworkCtrl) GetTokenByID(tokenID string) string {
	token, err := StateM.NetworkManager.GetTokenByID(tokenID)
	if err != nil {
		log.Errorf("Cannot get token by id from database. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get token by id"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, token, 0))
	return string(res)
}

/*
/network/gettokenbysymbol
Get Token by Symbol
- token symbol
*/
func (NetworkCtrl) GetTokenBySymbol(tokenSymbol string) string {
	token, err := StateM.NetworkManager.GetTokenBySymbol(tokenSymbol)
	if err != nil {
		log.Errorf("Cannot get token by id from database. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get token by symbol"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, token, 0))
	return string(res)
}

/*
/network/getalltokens
Get All Token
*/
func (NetworkCtrl) GetAllToken(pageIndex, pageSize int) string {
	size, err := database.Tokens.Find(nil).Count()
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get token size"), err.Error(), 0))
		return string(res)
	}

	mapTokens, err := StateM.NetworkManager.GetAllTokens(pageSize, pageIndex)
	if err != nil {
		log.Errorf("Cannot get token by id from database. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get token by id"), err.Error(), 0))
		return string(res)
	}
	result := &Result{
		Size:   size,
		Detail: mapTokens,
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, result, 0))
	return string(res)
}
