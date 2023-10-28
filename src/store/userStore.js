import { defineStore } from "pinia";
import sendReq from "../utils/sendReq";

export const useUserStore = defineStore('user', {
    state: () => ({
        account: null,
        // email: '',
        collectionCards: []
    }),
    actions: {
        async getCollectionCards() {
            this.collectionCards = await sendReq('getCollectionCards',
            {
                headers: { account: this.account }
            }
            ).then(json => {
                if(json.status == 200) {
                    return json.collectionCards;
                }
            });
        },

        inCollection(cardNo) {
            return this.collectionCards.some(item => item == cardNo);
        }
    }
});