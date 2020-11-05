package controllers

import (
	"encoding/json"
	"errors"
	"gopkg.in/mgo.v2/bson"
	"math"
	"wid/backend/database"
	"wid/backend/lib/common"
	"wid/backend/models"
)


type PdeParams struct {
	Token1IDStr    string `json:"token1id"`
	Token2IDStr    string `json:"token2id"`
	ExchangeAmount uint64 `json:"exchangeamount"`
	ExchangeFee    uint64 `json:"exchangefee"`
	FromTokenIDStr string `json:"fromtokenidstr"`
	ToTokenIDStr   string `json:"totokenidstr"`
	Limit          int    `json:"limit"`
}

func getExchangeRate(fromToken, toToken  string, amount, fee uint64, isEstimate bool) (uint64, *models.PdePoolPairs, error) {
	pool, err := new(PdeManager).GetPool(fromToken, toToken)
	if err != nil {
		return uint64(0), nil, err
	}
	if isEstimate == true {
		token := getTokenByID(fromToken)
		unitAmount := uint64(math.Pow10(token.Decimal))
		unitReceiveAmount, err := StateM.PdeManager.GetRate(unitAmount, fee, fromToken, toToken, pool)
		if err != nil {
			return 0, nil, err
		}
		receiveAmount := uint64(float64(amount) * float64(unitReceiveAmount) / float64(unitAmount))
		return receiveAmount, pool, err
	}
	receiveAmount, err := StateM.PdeManager.GetRate(amount, fee, fromToken, toToken, pool)
	return receiveAmount, pool, err
}

func getExchangeCrossRate(fromToken, toToken string, amount, fee uint64) (uint64, error) {
	midAmount , _, err := getExchangeRate(fromToken, common.PRVID, amount, fee, false)
	if err != nil {
		return 0, err
	}
	finalAmount, _, err := getExchangeRate(common.PRVID, toToken, midAmount, 0, false)
	if err != nil {
		return 0, err
	}
	return finalAmount, nil
}

func (PdeCtrl) GetPdePoolPairPrice(fromTokenIDStr, toTokenIDStr string, exchangeAmount, exchangeFee uint64) string {

	receiveAmount,requestPoolPair, err := getExchangeRate(fromTokenIDStr, toTokenIDStr, exchangeAmount, exchangeFee, false)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get exchange rate from pool pair data"), err.Error(), 0))
		return string(res)
	}

	res, _ := json.Marshal(responseJsonBuilder(nil, pdePoolPairPriceJsonBuilder(requestPoolPair,
		fromTokenIDStr, exchangeAmount, receiveAmount), 0))
	return string(res)
}

func (PdeCtrl) GetPdeCrossPoolPairPrice(fromTokenIDStr, toTokenIDStr string, exchangeAmount, exchangeFee uint64) string {

	if fromTokenIDStr == common.PRVID || toTokenIDStr == common.PRVID {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("bad request"),"one of from or to token id is prv", 0))
		return string(res)
	}
	receiveAmount, requestPoolPair, err := getExchangeRate(fromTokenIDStr, common.PRVID, exchangeAmount, uint64(0), false)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get exchange rate from first pool pair data"), err.Error(), 0))
		return string(res)
	}

	finalReceiveAmount, finalRequestPoolPair, err := getExchangeRate(common.PRVID, toTokenIDStr, receiveAmount, uint64(0), false)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get exchange rate from second pool pair data"), err.Error(), 0))
		return string(res)
	}
	pdePoolPairPrices := make([]*PdePoolPairPriceJson, 2)
	pdePoolPairPrices[0] = pdePoolPairPriceJsonBuilder(requestPoolPair, fromTokenIDStr, exchangeAmount, receiveAmount)
	pdePoolPairPrices[1] = pdePoolPairPriceJsonBuilder(finalRequestPoolPair, common.PRVID, receiveAmount, finalReceiveAmount)
	res, _ := json.Marshal(responseJsonBuilder(nil, pdePoolPairPrices, 0))
	return string(res)
}

func (p *PdeCtrl) GetPdeTradeHistory(pageIndex, pageSize int, tokenID1, tokenID2 string) string {
	var pdeHistory []*models.PdeTradeHistory
	query := bson.M{}

	if tokenID1 != "" && tokenID2 != "" {
		query1 := bson.M{
			"fromtokenidstr": tokenID1,
			"totokenidstr": tokenID2,
		}
		query2 := bson.M{
			"fromtokenidstr": tokenID2,
			"totokenidstr": tokenID1,
		}
		query = bson.M{"$or": []bson.M{query1, query2}}
	} else {
		if tokenID1 != "" {
			query = bson.M{"$or": []bson.M{bson.M{"fromtokenidstr": tokenID1}, bson.M{"totokenidstr": tokenID1}}}
		}
		if tokenID2 != "" {
			query = bson.M{"$or": []bson.M{bson.M{"fromtokenidstr": tokenID2}, bson.M{"totokenidstr": tokenID2}}}
		}
	}

	size, err := database.PdeHistory.Find(query).Count()
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get total pde history"), err.Error(), 0))
		return string(res)
	}

	err = database.PdeHistory.Find(query).Sort("-locktime").Skip((pageIndex-1) * pageSize).Limit(pageSize).All(&pdeHistory)
	if err != nil {
		res, _ := json.Marshal(responseJsonBuilder(errors.New("cannot get pde history"), err.Error(), 0))
		return string(res)
	}
	res, _ := json.Marshal(responseJsonBuilder(nil, pdeTradeHistoryJsonBuilder(pdeHistory, size), 0))
	return string(res)
}
