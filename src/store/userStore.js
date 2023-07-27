import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        mNo: 0,
        userName: '賽納爾',
        email: 'cardventure@gmail.com'
    })
});