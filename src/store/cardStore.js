import { defineStore } from "pinia";
import sendReq from '../utils/sendReq';

export const useCardStore = defineStore('card', {

    state: () => ({
        allCards: []
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