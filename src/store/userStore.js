import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        account: null,
        email: '',
        collectionCards: []
    })
});