<script setup>

    import { ref } from 'vue';
    import { useUserStore } from '../store/userStore';
    import PopUpBox from './PopUpBox.vue';
    import sendReq from '../utils/sendReq';

    const userStore = useUserStore();

    const headerSprites = [
        {text: '優惠比較', path: '/'},
        {text: '卡片總覽', path: '/cards'},
        {text: '分類排行', path: '/ranking'}
    ];

    const avatarHovering = ref(false);
    
    // 登入
    const logining = ref({ on: false });
    const loginAccount = ref('');
    const loginPassword = ref('');

    const confirmPassword = async () => {

        const { status, loginSucc } = await sendReq(
            'login',
            {
                body: {
                    account: loginAccount.value,
                    password: loginPassword.value
                }
            },
            'post'
        );
        if(status == 200) {
            if(loginSucc) {
                userStore.account = loginAccount.value;
                localStorage.setItem('account', userStore.account);
                userStore.getCollectionCards();
                loginAccount.value = '';
                loginPassword.value = '';
                logining.value.on = false;
            } else {
                alert('登入失敗，請檢查帳號密碼是否正確');
            }
        } else if(status == 400) {
            // 具體情況再討論
            if(!loginSucc) {
                alert('登入失敗，請檢查帳號密碼是否正確');
            }
        }

    };

    // 註冊
    const registerMode = ref({ on: false });
    const registerAccount = ref('');
    const registerPassword = ref('');
    // const registerEmail = ref(null);

    const register = async () => {
        const data = {
            account: registerAccount.value,
            password: registerPassword.value
        };
        // if(registerEmail.value) {
        //     data.email = registerEmail;
        // }

        const { status, qualified } = await sendReq('regist', { body: data }, 'post');

        if(status == 200) {
            if(qualified) {
                alert('註冊成功！');
                registerAccount.value = '';
                registerPassword.value = '';
                registerEmail.value = '';
                registerMode.value.on = false;
            }
            else {
                alert('註冊失敗，請檢查輸入的資料是否符合要求');
            }
        }
    };

    // 設定
    const editingPassword = ref(false);
    // const editingEmail = ref(false);

    const settingMode = ref({ on: false });

    const newPsw = ref('');

    const editPassword = () => {
        sendReq('setPsw', {
            headers: {
                account: userStore.account
            },
            body: {
                newPsw: newPsw.value
            }
        }, 'put').then(json => {
            if(json.status == 200) {
                alert('已成功修改密碼');
                newPsw.value = '';
                editingPassword.value = false;
            } else {
                alert('未能成功修改密碼');
            }
        });
    };

    const logout = () => {
        if(confirm('確定要登出嗎？')) {
            userStore.account = null;
            localStorage.removeItem('account');
        }
    };

</script>

<template>
    <div class="header">
        <div class="titleWrapper">
            <router-link to="/" class="logo">CCC</router-link>
            <span>Credit Card Comparator</span>
        </div>
        <ul>
            <li v-for="(item, index) in headerSprites">
                <router-link :to="item.path" class="aIcon" :style="{ backgroundPositionX: 16-index*42 + 'px' }">
                    {{ item.text }}
                </router-link>
            </li>
            
            <li v-if="userStore.account" @mouseenter="avatarHovering=true" @mouseleave="avatarHovering=false" class="liForProfile">
                <button class="profilePic roundBtn"></button>
                <ul v-if="avatarHovering" class="profileList">
                    <li class="myCollection"><router-link to="/cards">收藏</router-link></li>
                    <!-- <li class="myNotification"><router-link to="/notification">通知</router-link></li> -->
                    <li @click="settingMode.on=true" class="settingSwitch">設定</li>
                    <hr>
                    <li @click="logout" class="logout">登出</li>
                </ul>
            </li>
            <li v-else>
                <button @click="logining.on=true" class="loginBtn roundBtn">登入</button>
            </li>

        </ul>
    </div>

    <PopUpBox :show="logining">
        <template #tab>登入</template>
        <template #content>
            <div class="inputInfo">

                <label>
                    帳號：<br>
                    <input type="text" v-model="loginAccount">
                </label>
                <label>
                    密碼：<br>
                    <input type="password" v-model="loginPassword">
                </label>
                <button @click="confirmPassword()" type="button">確認</button>

                <hr>
                <span>還不是會員？</span>
                <button @click="registerMode.on=true; logining.on=false" type="button">點此註冊</button>

            </div>
        </template>
    </PopUpBox>

    <PopUpBox :show="registerMode">
        <template #tab>註冊</template>
        <template #content>
            <div class="inputInfo">
                <label>
                    帳號：<br>
                    <input type="text" v-model="registerAccount" placeholder="請設定您的帳號">
                </label>
                <label>
                    密碼：<br>
                    <input type="password" v-model="registerPassword" placeholder="請設定您的密碼">
                </label>
                <!-- <label>
                    信箱：（非必填）<br>
                    <input type="text" v-model="registerEmail" placeholder="請填入您的信箱">
                </label> -->
                <button @click="register()" type="button">
                    確認
                </button>
            </div>
        </template>
    </PopUpBox>

    <PopUpBox :show="settingMode">
        <template #tab>設定</template>
        <template #content>
            <ul class="settingUl">
                <li class="nickname">
                    密碼
                    <template v-if="editingPassword">
                        <input v-model="newPsw" type="password" placeholder="請輸入新密碼">
                        <button @click="editingPassword=false" class="cancelBtn">取消</button>
                        <button @click="editPassword">確認</button>
                    </template>
                    <template v-else>
                        <button @click="editingPassword=true" class="editBtn">編輯</button>
                    </template>
                </li>
                <!-- <li class="email">
                    信箱
                    <template v-if="editingEmail">
                        <input type="text">
                        <button @click="editingEmail=false" class="cancelBtn">取消</button>
                        <button @click="editingEmail=false">確認</button>
                    </template>
                    <template v-else><span class="userInfo">{{ userStore.email }}</span>
                        <button @click="editingEmail=true" class="editBtn">編輯</button>
                    </template>
                </li>
                <li class="notificationSetting">
                    <router-link to="/cards" @click="settingMode.on=false">通知設定 &gt;</router-link>
                </li> -->
            </ul>
        </template>
    </PopUpBox>        

</template>

<style lang="less" scoped>

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        top: 0;
        z-index: 2;
        box-sizing: border-box;
        padding: 0 30px;
        width: 100vw;
        height: 80px;
        background-color: #81D9EC;
        
        .titleWrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            padding-left: 20px;
            height: 100%;
            color: #009DBF;
            cursor: pointer;
            &:hover {
                text-shadow: 0 0 6px white;
            }
            .logo {
                width: 160px;
                height: 60%;
                color: #009DBF;
                font-size: 48px;
                text-decoration: none;
            }
        }

        ul {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            margin-right: 20px;
            width: 260px;
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

        li {
            position: relative;
            padding: 10px 0;
            .roundBtn {
                width: 50px;
                height: 50px;
                border: 1px solid gray;
                border-radius: 50%;
            }
            .profilePic {
                background: white url('../assets/images/預設頭像.svg') no-repeat center 8px;
                background-size: 60%;
            }
            .loginBtn {
                font-size: 16px;
                color: gray;
                background-color: white;
                transition: .2s;
                &:hover {
                    color: white;
                    background-color: #009DBF;
                }
            }
            .profileList {
                overflow: hidden;
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 70px;
                right: -30px;
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
                    text-indent: 66px;
                    background: url('../assets/images/profileSprites.svg') no-repeat 26px;
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
                /*
                .myNotification {
                    background-position-y: -19px;
                }
                */
                .settingSwitch {
                    background-position-y: -50px;
                }
                .logout {
                    background-position-y: -81px;
                }
                hr {
                    margin: 4px 0;
                    width: 100px;
                    border: 1px solid lightgray;
                }
            }
        }

    }

    .inputInfo {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        label {
            margin: 10px 40px;
            input {
                margin-top: 10px;
            }
        }
        button {
            margin: 20px;
            padding: 0 10px;
            height: 40px;
            color: white;
            background-color: #81D9EC;
            border: 1px solid #009DBF;
            border-radius: 12px;
            &:hover {
                background-color: #009DBF;
            }
        }
        hr {
            margin: auto;
            margin-bottom: 20px;
            width: 90%;
            border: 1px solid lightgray;
        }
    }


    .settingUl {
        width: 380px;
        li {
            display: flex;
            align-items: center;
            position: relative;
            height: 60px;
            text-indent: 70px;
            background: url('../assets/images/settingSprites.svg') no-repeat 16px;
            background-size: 10%;
            input {
                margin-left: 1em;
            }
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
    
</style>