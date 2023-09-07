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
      database: "NEW_CREATE_ENG", // has to change ot DB's name when DB is ready
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
        console.log(rows);
        res.send({ status:200, allCards:rows});
    } catch (err) {
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
})

router.post('/regist', async(req,res) => {   // 註冊, body, 缺少接收使用者寄來之帳密的參數
    console.log('service is running the regist page!')
    const {account, password} = req.body //接果渣丟過來的值, email
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
        console.log(platforms);
        res.send({status: 200, platforms })
    } catch (err) {
        console.error("Error executing query:", err)
        res.send({status:500, resData:{ error: "Internal Server Error"}})
    }
})

router.get('/compFilter', async(req,res) => {   // 比較, query, ＊格式：[{優惠方案（object）, 卡片編號},　… ]
    const {platformNos, installment, costPerMonth, totalCost, startDate, endDate} = req.query
    try {
        // 組成字串、執行查詢
        let str = `SELECT * 
		FROM Condition_of_Use AS cu
		INNER JOIN discount_description
        ON cu.dNo = discount_description.dNo
		WHERE sNo IN (${platformNos})
		AND (
			(specific_duration_start <= "${startDate}"
				AND
				specific_duration_end >= "${startDate}")
			OR
			(specific_duration_start <= "${endDate}"
				AND
				specific_duration_end >= "${endDate}")
			OR
			(specific_duration_start >= "${startDate}"
				AND
				specific_duration_end <= "${endDate}"))
		`
        if(installment === false || installment === 'false') {                                     //分期與否
			str+= `AND (Single_consumption_threshold <= "${totalCost}" AND NOT NULL)`
		} else{
			str+= `AND (cumulative_installments_threshold <= "${totalCost}" AND NOT NULL OR single_installments_threshold <= "${costPerMonth}" AND NOT NULL)`
		}
        //console.log()
		let [results] = await promisePool.query(str)                        //查詢語句
        for(let result of results){
            if(result.Card_No === null){
                const [rows] = await promisePool.query(
                `SELECT card_No
                FROM Credit_Card
                WHERE bank = ?`,
                [result.bank_name])
                //console.log(rows)
                result.cardNos = rows.map(card => card.card_No);
            }
        }
        /*
        for(let uNos of results){
            const [rows] = await promisePool.query(
                `SELECT the_day
                FROM day_of_the_week
                WHERE uNo = ?`,
                [results.uNo]
            )
        }
        */
        
        /*
        if (installment === true) {
            filter = await promisePool.query(
                `SELECT * 
                FROM Condition_of_Use AS cu
                INNER JOIN discount_description AS dd ON cu.dNO = dd.dNo
                LEFT JOIN credit_card AS cc ON cu.Card_No = cc.Card_No
                WHERE 
                sNo IN (${platformNos})
                AND (
                    (cumulative_installments_threshold <= "${totalCost}" 
                        AND specific_duration_start BETWEEN "${startDate}" AND "${endDate}"
                    )
                    OR(
                        specific_duration_end BETWEEN "${startDate}" AND "${endDate}"
                    )
                    OR(
                        single_installments_threshold <= "${costPerMonth}" 
        				AND specific_duration_start BETWEEN "${startDate}" AND "${endDate}"
                    )
                    OR(
                        specific_duration_end BETWEEN "${startDate}" AND "${endDate}"
                    )
                )
                OR (
                    cu.Card_No IS NULL
                    AND cc.bank = cu.bank_name
                )`
            );
        } else if (installment === false) {
        filter = await promisePool.query(
            `SELECT * 
            FROM Condition_of_Use AS cu
            INNER JOIN discount_description AS dd ON cu.dNO = dd.dNo
            LEFT JOIN credit_card AS cc ON cu.Card_No = cc.Card_No
            WHERE 
            sNo IN (${platformNos})
            AND (
    				(Single_consumption_threshold <= "${totalCost}" 
    				AND specific_duration_start BETWEEN "${startDate}" AND "${endDate}")
                OR 
                (specific_duration_end BETWEEN "${startDate}" AND "${endDate}")
            )
            OR (
                cu.Card_No IS NULL
                AND cc.bank = cu.bank_name
            )`
        );
    }*/
        //console.log(str, results)
        console.log({des: "this is TRING:", str})
        res.send({status: 200, results});
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

router.get('/searchCards', async(req,res) =>{
    const keyIn = req.query.keyIn
    try{
        const CardArr = await promisePool.query(
            `SELECT Card_No 
            FROM Keyword
            NATURAL JOIN conform 
            WHERE Keyword.kName LIKE ?`,
            [`%${keyIn}%`]
        )
        console.log(CardArr)
        const cardNos = CardArr[0].map(item => item.Card_No)
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