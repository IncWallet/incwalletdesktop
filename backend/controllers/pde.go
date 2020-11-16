package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"math"
	"net/http"
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
	resp, err := http.Get(fmt.Sprintf("%v/pde/txhistory?pagesize=%v&pageindex=%v", common.URLService, pageSize, pageIndex))


	if err != nil {
		log.Errorf("cannot get list token info from app api. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("bad request"),"cannot get pde history", 0))
		return string(res)
	}
	defer resp.Body.Close()

	resultBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Errorf("cannot read body from response. Error %v", err)
		res, _ := json.Marshal(responseJsonBuilder(errors.New("bad request"),"cannot read body from response", 0))
		return string(res)
	}

	return string(resultBytes)
}
