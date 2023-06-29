<template>
    <div class="header">
        <a href="/" class="logo">這裡之後放logo</a>
        <div class="search">
            <input type="search" name="" id="">
            <button type="button"></button>
        </div>
        <ul>
            <li><a href="#" class="allCardsIcon">試算優惠</a></li>
            <li><a href="#" class="rankingsIcon">分類排行</a></li>
            <li><a href="#" class="notificationIcon">卡片總覽</a></li>
            <li><a href="#" class="profilePic"></a></li>
        </ul>
    </div>
</template>

<style lang="less" scoped>

    .header {
        overflow: hidden;
        position: fixed;
        z-index: 2;
        height: 80px;
        background-color: #81D9EC;

        .logo {
            position: absolute;
            margin-left: 40px;
            width: 160px;
            height: 100%;
            background-image: '';
            /* 下面這段有logo之後刪掉 */
            color: gray;
            background-color: lightpink;
            text-align: center;
            text-decoration: none;
            line-height: 80px;
        }

        .search {
            position: absolute;
            overflow: hidden;
            margin: 20px 0 20px 420px;
            width: 400px;
            height: 40px;
            background-color: white;
            border: none;
            border-radius: 12px;

            input {
                position: absolute;
                padding-left: 14px;
                width: 90%;
                height: 100%;
                border: none;
                outline: none;
            }

            button {
                position: absolute;
                right: 0;
                width: 10%;
                height: 100%;
                background: url('../assets/images/放大鏡.svg') no-repeat center;
                background-size: 40%;
                border: none;
            }

        }

        ul {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin: 10px 40px 10px 950px;
            width: 280px;

            a {
                display: inline-block;
                width: 60px;
                height: 60px;
                text-decoration: none;
                text-align: center;
                line-height: 8;
                font-size: 12px;
                color: black;
                background: no-repeat center 10px;
                background-size: 24px 24px;
            }

        }

        .allCardsIcon {
            background-image: url('../assets/images/卡片總覽.svg');
            color: white;
        }

        .rankingsIcon {
            background-image: url('../assets/images/分類榜.svg');
            color: white;
        }

        .notificationIcon {
            background-image: url('../assets/images/小鈴鐺.svg');
            color: white;
        }

        .profilePic {
            width: 40px;
            height: 40px;
            border: 1px solid gray;
            border-radius: 50%;
            background: white url('../assets/images/預設頭像.svg') no-repeat center 8px;
            background-size: 60%;
        }

    }

</style>