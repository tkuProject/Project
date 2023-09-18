// routers modules
// 1. import express and mysql2 modules
const express = require('express');
const mysql2 = require('mysql2');
// 2. create router
const router = express.Router();
// 3. establish connection pool
function getDBconfig() {
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "aaa", // has to change ot DB's name when DB is ready
      connectionLimit: 1,
    };
}
const config = getDBconfig();
const promisePool = mysql2.createPool(config).promise();

// hosting router
// 3. create router address
// 1. GET request to pass parameter req.ruery
router.get('/', async(req,res) => {   //根目錄, 把所有卡片叫出來備用
    // * stands for any region
    // res.header('Access-Control-Allow-Origin', '*')
    try {
        // 執行查詢
        const [rows] = await promisePool.query(
            "SELECT * FROM Credit_Card"
        );
        res.send({ status:200, allCards:rows});
    } catch (err) {
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
})

router.post('/regist', async(req,res) => {   // 註冊, body, 缺少接收使用者寄來之帳密的參數
    console.log('service is running the regist page!')
    const {account, password} = req.body //接前端丟過來的值, email
    // console.log(req.body)
    try{
        const [rows] = await promisePool.query(
            "SELECT COUNT(*) AS count FROM member WHERE mAccount = ?",
            [account]
        )
        const accountExists = rows[0].count > 0;
        if(accountExists) {
            res.send({status:400, qualified: false})
        } else {
            promisePool.query(
                `insert into member (mAccount, mPassword) values ("${account}","${password}")`
            )
            res.send({status:200, qualified: true})
        }
    } catch(err){
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
    // let userPassword = req.body.password;
    // let passwordInfo = transformPassword(userPassword);

    //const qualified = true
    //res.status(200).send(qualified)
})

// 密碼如果能設太長的話，會有惡意代碼的風險(SQL injection)
router.post('/login', async(req,res) => {   // 登入, body, 用戶收藏的卡片陣列（collectionCards）
    const {account, password} = req.body
    try{
        const [rows] = await promisePool.query(
            "SELECT COUNT(*) AS count FROM member WHERE mAccount = ?",
            [account]
        )
        const accountExists = rows[0].count > 0;    //應該是指該參數是否大於0
        let loginSucc = false
        if(accountExists) {
            const [passwordRows] = await promisePool.query(
                "SELECT mPassword FROM member WHERE mAccount = ?",
                [account]
            )
            const psw = passwordRows[0].mPassword
            if(password === psw){
                res.send({status:200, loginSucc:true})  //登入成功
            } else {
                res.send({status:401, loginSucc:false}) //密碼錯誤
            }
        } else {
            res.send({status:404, accountExists: false});   //帳號錯誤
        }
    } catch(err){
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
})

router.put('/setPsw', async(req,res) => {   // 設定密碼, body
    const {account} = req.headers
    const {oldPsw, newPsw} = req.body
    try {
        const [DBsPsw] = await promisePool.query(
            `SELECT mPassword FROM member WHERE mAccount = ?`,
            [account]
        )
        console.log(DBsPsw[0].mPassword, oldPsw, newPsw)
        if(oldPsw === DBsPsw[0].mPassword){
            await promisePool.query(
            `UPDATE member
            SET mPassword = ?
            WHERE mAccount = ?`,
            [newPsw, account]
        )
            res.send({status:200})
        }else{
            res.send({status:401})
        }

    } catch(err){
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
})

router.put('/setEmail', async(req,res) => {
    const {account} = req.headers
    const {newEmail} = req.body
    try {
        await promisePool.query(
            `UPDATE member
            SET email = ?
            WHERE mAccount = ?`,
            [newEmail, account]
        )
        res.status({status: 200})
    } catch(err){
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
})

router.get('/getCollectionCards', async(req,res) => {   //卡片收藏, headers, 要抓卡片編號
    try{
        const{account} = req.headers
        
        const [CardArr] = await promisePool.query(
            "SELECT Card_No From collect_card WHERE mAccount = ?",
            [account]
        )
        const collectionCards = CardArr.map(item => item.Card_No)
        console.log(collectionCards);
        res.send({status: 200, collectionCards})
    } catch (err){
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})

router.get('/getPlatform', async(req,res) => {   // 顯示購物平台, query, ＊格式：[ 購物平台（*） ]
    try {
        // 執行查詢
        const [platforms] = await promisePool.query(
            "SELECT * FROM Shopping_Platform"
        );
        res.send({status: 200, platforms })
    } catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})

router.get('/compFilter', async(req,res) => {   // 比較, query, ＊格式：[{優惠方案（object）, 卡片編號},　… ]
    const {platformNos, installment, totalCost, startDate, endDate} = req.query
    console.log('installment: ',installment)
    try {
        // 組成字串、執行查詢
        let str = `SELECT DISTINCT * 
		FROM Condition_of_Use AS cu
		INNER JOIN discount_description AS dd
        ON cu.dNo = dd.dNo
        INNER JOIN Precautions AS pct
        ON cu.dNo = pct.dNo
		WHERE cu.sNo IN (${platformNos})
		AND (
			(cu.specific_duration_start <= "${startDate}"
				AND
				cu.specific_duration_end >= "${startDate}")
			OR
			(cu.specific_duration_start <= "${endDate}"
				AND
				cu.specific_duration_end >= "${endDate}")
			OR
			(cu.specific_duration_start >= "${startDate}"
				AND
				cu.specific_duration_end <= "${endDate}"))
		`
        if(installment === false || installment === 'false') {                                     //分期與否
			str+= `AND (cu.single_consumption_threshold <= "${totalCost}" 
                AND cu.single_consumption_threshold IS NOT NULL
                AND cu.single_consumption_threshold>0)`
		} else{
			str+= `AND (cu.cumulative_installments_threshold IS NOT NULL 
                OR
                cu.single_installments_threshold <= "${totalCost}" 
                AND cu.single_installments_threshold IS NOT NULL
                AND cu.single_installments_threshold>0)`
		}
        console.log(str);
		let [results] = await promisePool.query(str)
        for(let result of results){
            // 特定周幾
            const [thoseDays] = await promisePool.query(
                `SELECT the_day
                FROM day_of_the_week
                WHERE uNo = ?`,
                [result.uNo]
            )
            result.thoseDays = thoseDays.map(item =>item.the_day)
            let conCardNos = await promisePool.query(
                `SELECT Card_No
                FROM Condition_Card_Nos
                WHERE uNo = ${ result.uNo }`
            )
            
            if(conCardNos[0].length>0) {
                result.cardNos = conCardNos[0].map(item =>item.Card_No)
            } else {
                let que = ''
                if(result.dCard_issuer) {
                    que = `SELECT card_No
                        FROM Credit_Card
                        WHERE card_issuer = '${result.dCard_issuer}'`
                } else {
                    que = `SELECT card_No
                        FROM Credit_Card
                        WHERE bank = '${result.bank_name}'
                        `
                        console.log('que: ', que);
                }
                let rows = await promisePool.query(que)
                
                result.cardNos = rows[0].map(card => card.card_No)
            }
        }
        results = results.filter(result => result.cardNos.length>0)
        console.log("results", results)
        res.send({status: 200, results})
    } catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
    
})

router.post('/notiOn', async(req,res) => {   // 開啟推播, body, forntend: 會員帳號（account）：字串 ＊放headers
    const {account} = req.headers
    const {Card_No} = req.body
    try{
        await promisePool.query(
            `INSERT INTO opening_notification (mAccount, Card_No) VALUES("${account}", "${Card_No}")`
        )
        res.send({status: 200})
    }catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}}) 
    }

})
router.delete('/notiOff/:Card_No', async(req,res) => {   // 關閉推播, params
    const {account} = req.headers
    const Card_No = req.params.Card_No
    try{
        await promisePool.query(
            `DELETE FROM opening_notification WHERE mAccount = "${account}" AND Card_No = "${Card_No}"`
        )
        res.send({status: 200})
    }catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})

router.post('/appendCollection', async(req,res) => {   // 把卡片加入收藏, body
    const {account} = req.headers
    const {Card_No} = req.body

    try{
        await promisePool.query(
            `INSERT INTO collect_card(mAccount, Card_No) VALUES("${account}", "${Card_No}")`
        )
        res.send({status: 200})
    }catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}}) 
    }
})
router.delete('/delCollection/:Card_No', async(req,res) => {   // 把卡片從收藏中刪除, params
    const {account} = req.headers
    const Card_No = req.params.Card_No
    try{
        await promisePool.query(
            `DELETE FROM collect_card WHERE mAccount = "${account}" AND Card_No = "${Card_No}"`
        )
        res.send({status: 200})
    }catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}}) 
    }
})

router.get('/searchCards', async(req,res) =>{//銀行 卡 關鍵字 優惠資訊(前)
    const keyIn = req.query.keyIn
    const likeParam = `%${keyIn.toUpperCase()}%`
    try{
        const [result1] = await promisePool.query(
            `SELECT DISTINCT card_no
            FROM Credit_Card
            WHERE upper(Card_Name) LIKE ?`,
            [likeParam]
        )
        const [result2] = await promisePool.query(
            `SELECT DISTINCT conform.Card_No
            FROM conform
            NATURAL JOIN keyword
            WHERE upper(keyword.kName) LIKE ?`,
            [likeParam]
        )
        const [result3] = await promisePool.query(
            `SELECT DISTINCT Card_No     
            FROM Credit_Card
            WHERE upper(bank) LIKE ?`,
            [likeParam]
        )
        const [result4] = await promisePool.query(
            `SELECT DISTINCT Card_No     
            FROM Credit_Card
            WHERE upper(card_issuer) LIKE ?`,
            [likeParam]
        )
        const cardNos = [...result1,...result2,...result3,...result4].map(item => Object.values(item)[0])

        console.log(result1);
        console.log(cardNos);
        res.send({status: 200, cardNos})
    } catch (err) {
        console.error("Error executing query:", err)
        res.send({status: 500, error: "Internal Server Error" })
    }
})

router.get('/getRankingCate', async(req,res) => {   // 查詢分類編號, query, rankingCates格式：[ { "分類編號", "分類名稱" }, … ]
    try {
        // 執行查詢
        const [rankingCates] = await promisePool.query(
            "SELECT * FROM Charts"
        )
        res.send({ status: 200, rankingCates})
    } catch (err) {
        console.error("Error executing query:", err)
        res.send({status: 500, error: "Internal Server Error" })
    }
})
router.get('/ranking', async(req,res) => {   // 顯示排行, query, ＊格式：[　{ 名次, 卡片編號 },　… ]
    const {Category_No} = req.query
    try {
        // 執行查詢
        const [ranksCard] = await promisePool.query(
            `SELECT weight_score, Card_No 
            FROM Ranking 
            WHERE Category_No = "${Category_No}"
            ORDER BY weight_score DESC`
        )
        res.send({status: 200, ranksCard});
    } catch (err) {
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})

router.get('/notiCards', async(req,res) => {   // 顯示有開通知的卡片（篩選用）, headers, ＊格式：[ { 卡片編號 }, … ]
    const {account} = req.headers
    try {
        // 執行查詢
        const CardArr = await promisePool.query(
            "SELECT Card_No FROM opening_notification WHERE mAccount = ?",
            [account]
        )
        const cardNo = CardArr[0].map(item => item.Card_No)
        res.send({status: 200, cardNo});
    } catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})
router.get('/notiAll', async(req,res) => {   // 顯示所有通知, headers, ＊格式：[ { 卡片編號, 通知 }, … ]
    const {account} = req.headers
    try {
        // 執行查詢
        const [notis] = await promisePool.query(
            "SELECT Notification.nNo, Notification.nLink, Notification.nDate, Notification.Card_No, opening_notification.mAccount FROM Notification INNER JOIN opening_notification ON Notification.Card_No = opening_notification.Card_No WHERE opening_notification.mAccount = ?",
            [account]
        )
        res.send({status: 200, notis})
    } catch (err) {
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})
router.post('/appendNotiCollection', async(req,res) => {   // 把通知加入收藏, body
    const {account} = req.headers
    const {nNo} = req.body
    try{
        await promisePool.query(
            `INSERT INTO collecting_notification(mAccount, nNo) VALUES("${account}", "${nNo}")`
        )
        res.send({status:200})
    }catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}}) 
    }

})
router.delete('/delNotiCollection/:nNo', async(req,res) => {   // 把通知從收藏中刪除, params
    const {account} = req.headers
    const {nNo} = req.params.nNo
    try{
        await promisePool.query(
            `DELETE FROM collecting_notification WHERE mAccount = "${account}" AND nNo = "${nNo}"`
        )
        res.send({status:200})
    }catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}}) 
    }
})

// 4. export the router module, used by home page from index.js
module.exports = router;