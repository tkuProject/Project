<script setup>

    import { ref } from 'vue';

    const headerSprites = [
        {text: '卡片總覽', path: '/cards'},
        {text: '分類排行', path: '#'},
        {text: '通知', path: '#'}
    ];

    const avatarHovering = ref(false);
    
    const settingMode = ref(false);

    // 之後要改成真的使用者暱稱和信箱
    const userNickname = '賽納爾';
    const userEmail = 'cardventure@gmail.com';

    const editingNickname = ref(false);
    const editingEmail = ref(false);

</script>

<template>
    <div class="header">
        <router-link to="/" class="logo">CCC</router-link>
        <ul>
            <li v-for="(item, index) in headerSprites">
                <router-link :to="item.path" class="aIcon" :style="{ backgroundPositionX: 11.3-index*41.8 + 'px' }">
                    {{ item.text }}
                </router-link>
            </li>
            <!-- 去學pinia，然後來判斷使用者登入了沒 -->
            <li @mouseenter="avatarHovering=true" @mouseleave="avatarHovering=false" class="liForProfile">
                <router-link to="#" class="profilePic"></router-link>
                <ul v-show="avatarHovering" class="profileList">
                    <li class="myCollection"><router-link to="/cards">我的收藏</router-link></li>
                    <li @click="settingMode=true" class="settingSwitch">設定</li>
                    <hr>
                    <li class="logout">登出</li>
                </ul>
            </li>
        </ul>
    </div>

    <div v-if="settingMode" @click="settingMode=false" class="setting">
        <div class="settingMask"></div>
        <ul @click.stop class="settingList">
            <button @click="settingMode=false" class="cloSetting">╳</button>
            <hr>
            <li class="nickname">
                暱稱：
                <template v-if="editingNickname">
                    <input type="text">
                    <button @click="editingNickname=false" class="cancelBtn">取消</button>
                    <button @click="editingNickname=false">確認</button>
                </template>
                <template v-else><span class="userInfo">{{ userNickname }}</span>
                    <button @click="editingNickname=true" class="editBtn">編輯</button>
                </template>
            </li>
            <li class="email">
                信箱：
                <template v-if="editingEmail">
                    <input type="text">
                    <button @click="editingEmail=false" class="cancelBtn">取消</button>
                    <button @click="editingEmail=false">確認</button>
                </template>
                <template v-else><span class="userInfo">{{ userEmail }}</span>
                    <button @click="editingEmail=true" class="editBtn">編輯</button>
                </template>
            </li>
            <li class="notificationSetting">
                <router-link to="/cards">通知設定 &gt;</router-link>
            </li>
        </ul>
    </div>

</template>

<style lang="less" scoped>

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        z-index: 2;
        box-sizing: border-box;
        padding: 0 20px;
        width: 100vw;
        height: 80px;
        background-color: #81D9EC;

        .logo {
            width: 160px;
            height: 100%;
            background-image: '';
            /* 下面這段有logo之後刪掉 */
            color: #009DBF;
            font-size: 48px;
            text-align: center;
            text-decoration: none;
            line-height: 80px;
            transition: .2s;
            &:hover {
                text-shadow: 0 0 6px white;
            }
        }

        ul {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            width: 300px;
            li {
                display: flex;
                flex-direction: column;
                
                .aIcon {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    text-decoration: none;
                    text-align: center;
                    line-height: 7.6;
                    font-size: 12px;
                    color: white;
                    background: url('../assets/images/headerSprites.svg') no-repeat left 0;
                    background-size: 300%;
                    transition: .2s;
                    &:hover {
                        color: #009DBF;
                        background-image: url('../assets/images/headerSpritesHover.svg');
                    }
                }
            }
        }

        .liForProfile {
            position: relative;
            padding: 10px 0;
            .profilePic {
                width: 50px;
                height: 50px;
                border: 1px solid gray;
                border-radius: 50%;
                background: white url('../assets/images/預設頭像.svg') no-repeat center 8px;
                background-size: 60%;
            }
            .profileList {
                overflow: hidden;
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 70px;
                right: -14px;
                padding: 4px 0;
                width: 140px;
                border: 1px solid gray;
                border-radius: 12px;
                background-color: white;
                a {
                    color: black;
                    text-decoration: none;
                    &:hover {
                        color: #009DBF;
                    }
                }
                li {
                    margin: 4px 0;
                    padding: 8px 0;
                    width: 100%;
                    text-indent: 50px;
                    background: url('../assets/images/profileSprites.svg') no-repeat 16px;
                    background-size: 20%;
                    cursor: pointer;
                    &:hover {
                        color: #009DBF;
                        background-image: url('../assets/images/profileSpritesHover.svg');
                    }
                }
                .myCollection {
                    background-position-y: 12px;
                }
                .settings {
                    background-position-y: -19px;
                }
                .logout {
                    background-position-y: -50px;
                }
                hr {
                    margin: 4px 0;
                    width: 100px;
                    border: 1px solid lightgray;
                }
            }
        }

    }

    .setting {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        z-index: 3;
        .settingMask {
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, .5);
        }
        .settingList {
            overflow: hidden;
            position: absolute;
            padding-bottom: 10px;
            width: 380px;
            border: 1px solid #009DBF;
            border-radius: 12px;
            background-color: white;
            .cloSetting {
                position: relative;
                top: 0;
                right: -86%;
                width: 40px;
                height: 40px;
                color: gray;
                font-weight: 700;
                border: none;
                background: none;
                &:hover {
                    color: #009DBF;
                }
            }
            hr {
                margin: auto;
                width: 90%;
                border: 1px solid lightgray;
            }
            li {
                display: flex;
                align-items: center;
                position: relative;
                height: 60px;
                text-indent: 70px;
                background: url('../assets/images/settingSprites.svg') no-repeat 16px;
                background-size: 10%;
                .userInfo {
                    text-indent: 0;
                }
                button {
                    position: absolute;
                    right: 16px;
                    color: gray;
                    border: none;
                    background: none;
                    &:hover {
                        color: #009DBF;
                    }
                }
                .cancelBtn {
                    right: 50px;
                }
                a {
                    color: gray;
                    text-decoration: none;
                    &:hover {
                        color: #009DBF;
                    }
                }
            }
            
            .nickname {
                background-position-y: 12px;
            }
            .email {
                background-position-y: -38px;
            }
            .notificationSetting {
                background-position-y: -88px;
            }

        }
    }
    
</style>