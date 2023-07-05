<script setup>

    const headerSpirits = ['卡片總覽', '分類排行', '通知'];

</script>

<template>
    <div class="header">
        <a href="/" class="logo">CCC - Credit Card Comparison</a>
        <div class="search">
            <input type="search" name="" id="">
            <button type="button"></button>
        </div>
        <ul>
            <li v-for="(name, index) in headerSpirits">
                <a href="#" class="aIcon" :style="{ backgroundPositionX: 11.3-index*41.8 + 'px' }">
                    {{ name }}
                </a>
            </li>
            <li>
                <a href="#" class="profilePic"></a>
                
            </li>
        </ul>
    </div>
</template>

<style lang="less" scoped>

    .header {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        position: fixed;
        z-index: 2;
        width: 100vw;
        height: 80px;
        background-color: #81D9EC;

        .logo {
            width: 400px;
            height: 100%;
            background-image: '';
            /* 下面這段有logo之後刪掉 */
            color: #009DBF;
            font-size: 30px;
            text-align: center;
            text-decoration: none;
            line-height: 80px;
        }

        .search {
            position: relative;
            overflow: hidden;
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
            justify-content: space-evenly;
            width: 330px;

            li {

                display: flex;
                flex-direction: column;
                align-items: center;
                
                .aIcon {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    text-decoration: none;
                    text-align: center;
                    line-height: 7.6;
                    font-size: 12px;
                    color: white;
                    background: url('../assets/images/headerSpirits.svg') no-repeat left 0;
                    background-size: 300%;
                    transition: .2s;
                    &:hover {
                        color: #009DBF;
                        background-image: url('../assets/images/headerSpiritsHover.svg');
                    }
                }

                .profilePic {
                    width: 50px;
                    height: 50px;
                    border: 1px solid gray;
                    border-radius: 50%;
                    background: white url('../assets/images/預設頭像.svg') no-repeat center 8px;
                    background-size: 60%;
                    &:hover {
                        
                    }
                }

            }

        }

    }

</style>