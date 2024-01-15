// sellerCard.js
import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class SellerCard extends LightningElement {

    @api seller;
    @api sellerChosen;
    @api sellerStore;
    @track isSelected = false;

    //make a CustomEvent to send the data for the perent
    handleSelection(event) {
        this.isSelected = event.target.checked;
        this.sellerChosen = event.currentTarget.value;
        this.sellerStore = event.currentTarget.main_store;
        console.log("this.sellerChosen",JSON.stringify(this.sellerChosen));

        if (this.isSelected) {
            const selectionEvent = new CustomEvent('selectionchange', {detail: {Id: this.sellerChosen, Store:this.sellerStore}});
            this.dispatchEvent(selectionEvent);
            
        } else {
            console.error('Error fetching stores', error);
        }
    }

   
}
