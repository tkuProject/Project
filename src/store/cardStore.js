import { defineStore } from "pinia";
import sendReq from '../utils/sendReq';

export const useCardStore = defineStore('card', {

    state: () => ({
        allCards: [],
        collectionCards: [],
        otherCards: []
    }),

    actions: {

        findCard(cardNo) {
            return this.allCards.find(item => item.Card_No == cardNo);
        },

        async getCards() {
            this.allCards = await sendReq().then(json => {
                if(json.status == 200) {
                    return json.allCards;
                }
            });
        }

    }

});