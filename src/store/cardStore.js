import { defineStore } from "pinia";
import sendReq from '../utils/sendReq';

export const useCardStore = defineStore('card', {

    state: () => ({
        allCards: [],
        collectionCards: [],
        otherCards: []
    }),

    actions: {

        async getCards() {
            const cards = await sendReq().then(json => {
                if(json.status == 200) {
                    return json.allCards;
                }
            });
            this.allCards = cards;
        }

    }

});