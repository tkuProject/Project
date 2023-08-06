import { defineStore } from "pinia";
import sendReq from '../utils/sendReq';
import { useUserStore } from "./userStore";

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

            const userStore = useUserStore();
            if(userStore.account) {
                this.separateCards();
            }
            
        },

        async separateCards() {

            const userStore = useUserStore();

            this.collectionCards.length = 0;
            this.otherCards.length = 0;

            this.allCards.forEach(item => {
                if(item.Card_No in userStore.collectionCards) {
                    this.collectionCards.push(item);
                } else {
                    this.otherCards.push(item);
                }
            });

            console.log('separateCards');
            console.log(this.allCards);

        }

    }

});