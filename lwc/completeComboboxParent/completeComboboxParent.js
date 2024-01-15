import { LightningElement, api, track, wire } from 'lwc';
import getCountries from '@salesforce/apex/AppRealloc.GetCountries';
import getStores from '@salesforce/apex/AppRealloc.GetStores';
import getOwners from '@salesforce/apex/AppRealloc.GetOwners';
import getAccounts from '@salesforce/apex/AppRealloc.GetAccounts';
import performReallocation from '@salesforce/apex/AppRealloc.performReallocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text', sortable: true },
    { label: 'Id', fieldName: 'Id', type: 'Number', sortable: true,  cellAttributes: { alignment: 'left' }, },
    { label: 'Segment', fieldName: 'Segment', type: 'text', sortable: true,  cellAttributes: {class:'slds-text-color_success'}, },
    { label: 'Main Store', fieldName: 'main_store', type: 'text',sortable: true, cellAttributes: { alignment: 'left' }, },
    { label: 'Seller', fieldName: 'Seller', type: 'text', sortable: true,  cellAttributes: {class:'slds-text-color_error'}, },
];





export default class CompleteComboboxParent extends LightningElement {
columns = columns;
@track picklistCountryInput = [];
@track picklistStorsInput = [];
@track picklistOwnersInput = [];
@track picklistAccountsInput = [];
@track picklistStorsRealloction = [];
@track picklistOwnersRealloction = [];
@track dataFetch = [];



@track selectedCountryItems = [];
@track selectedStorsItems = [];
@track selectedOwnersItems = [];
@track selectedAccountsItems = [];
@track selectedDataTableItems = [];
@track selectedStorsRealloctionItems = [];
@track selectedOwnersRealloctionItems = [];
@track selectedSellersRealloctionItems = [];

@track searchString;
@track initialRecords;
selectedOwnerId;
selectedOwnerStore;
@track searchKey = '';


isCountriesDisabled = true;
isStoresDisabled = true;
isStoresRealloctionDisabled = true;
isOwnersDisabled = true;


defaultSortDirection = 'asc';
sortDirection = 'asc';
sortedBy;
showTable = false;
sellerChosen;
isModalOpen = false;
isSelectAll = false;
casesSpinner = true;

recordsToLoadOnScroll = 20;
allAccounts;







    // Wire service to fetch countries from the server 
    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) { 
            if (data.length > 0) {
                this.isCountriesDisabled = false;
            }
            else{
                this.isCountriesDisabled = true;
            }
            
            this.picklistCountryInput = data;
            console.log("ppp", JSON.stringify(this.picklistCountryInput));
            
            
        } else if (error) {
            console.error(error);
        }
        
    }                                                         

    
    // Wire service to fetch Stores from the server 
    @wire(getStores, { lstCtry: '$selectedCountryItems' })
    wiredStores({ error, data }) {
        if (data) {
            if (data.length > 0) {
                this.isStoresDisabled = false;
            }
            else{
                this.isStoresDisabled = true;
            }
            
            this.picklistStorsInput = data.map(item => ({ Name: item.Name, Id: item.Id }));
            console.log("this.picklistStorsInput",JSON.stringify(this.picklistStorsInput));
        } else if (error) {
            console.error('Error fetching stores', error);
        }
    }
    
    // Wire service to fetch Owners from the server 
    @wire(getOwners, { lstStors: '$selectedStorsItems' })
    wiredOwners({ error, data }) {
        if (data) {
            if (data.length > 0) {
                this.isOwnersDisabled = false;
            }
            else{
                this.isOwnersDisabled = true;
            }
            this.picklistOwnersInput = data.map(item=>({Name:item.FirstName+' '+item.LastName +' ('+item.accountCount+')', Id:item.OwnerId}));
            
            
        } else if (error) {
            console.error('Error fetching stores', error);
        }
    }
    // Wire service to fetch Accounts from the server
    @wire(getAccounts, { lstOwner: '$selectedOwnersItems' })
    wiredAccounts({ error, data }) {
        if (data) {
             this.casesSpinner = false;
            console.log("data",JSON.stringify(data));
            if (data.length > 0) {
                this.showTable = true;
             }
             else{
                this.showTable = false;
            }
        
        this.picklistAccountsInput = data.map(item=>({Name:item.Name, Id:item.Id, Segment:item.Segment__c, main_store:item.main_store__r.Name, main_store_Id:item.main_store__c, Seller:item.Owner.FirstName+' '+item.Owner.LastName}));
        console.log("this.picklistAccountsInput",JSON.stringify(this.picklistAccountsInput));
        this.allAccounts = this.picklistAccountsInput;
        this.loadRecords(this.picklistAccountsInput.slice(0, this.recordsToLoadOnScroll));
        } else if (error) {
            console.error('Error fetching stores', error);
        }
    
    }

    // Wire service to fetch Stors for Realloction part from the server
    @wire(getStores, { lstCtry: '$selectedStorsRealloctionItems' })
    wiredStoresRealloction({ error, data }) {
            if (data) {
                if (data.length > 0) {
                    this.isStoresRealloctionDisabled = false;
                }
                
                this.picklistStorsRealloction = data.map(item => ({ Name: item.Name, Id: item.Id }));
                console.log("this.picklistStorsRealloction",JSON.stringify(data));
            } else if (error) {
                console.error('Error fetching stores', error);
            }
        }
    
    // Wire service to fetch Owners for Realloction part from the server
    @wire(getOwners, { lstStors: '$selectedOwnersRealloctionItems' })
    wiredOwnersRealloction({ error, data }) {
        if (data) {
            this.picklistOwnersRealloction = data.map(item=>({Name:item.FirstName+' '+item.LastName +' ('+item.accountCount+')', Id:item.OwnerId, main_store_Id:item.main_store__c, main_store:item.Name,country:item.countryISO__c}));
            console.log("data",JSON.stringify(this.picklistOwnersRealloction));
            
            
        } else if (error) {
            console.error('Error fetching stores', error);
        }
    }
    
    // Event handler for country selection change
    handleCountrySelectionChange(event) {
        const eventResult  = event.detail.selectedParentItems;
        this.selectedCountryItems = eventResult.map(item => item.Name);
        
    }
    // Event handler for Store selection change
    handleStoreSelectionChange(event) {
        const eventResult  = event.detail.selectedParentItems;
        this.selectedStorsItems = eventResult.map(item => item.Id);
        
    }
    // Event handler for Users selection change
    handleUsersSelectionChange(event) {
        const eventResult  = event.detail.selectedParentItems;
        this.selectedOwnersItems = eventResult.map(item => item.Id);
        console.log("selectedOwnersItems",JSON.stringify(this.selectedOwnersItems));
    }
    // Event handler for Country in Realloction part selection change
    handleCountryRealloction(event) {
        const eventResult  = event.detail.selectedParentItems;
        this.selectedStorsRealloctionItems = eventResult.map(item => item.Name);
    }
    // Event handler for Store in Realloction part selection change
    handleStoreRealloction(event) {
        const eventResult  = event.detail.selectedParentItems;
        this.selectedOwnersRealloctionItems = eventResult.map(item => item.Id);
    }
    // Event handler for Seller in Realloction part selection change
    handleSellerRealloction(event) {
        const eventResult  = event.detail.selectedParentItems;
        console.log("this.selectedSellersRealloctionItems",JSON.stringify(this.selectedSellersRealloctionItems));
        this.selectedSellersRealloctionItems = eventResult.map(item => item.Id);
    }
    
    // Event handler for Seller Chosen selection change
    handleSellerChosen(event) {
        const eventResult = event.detail;
        this.selectedOwnerId = eventResult.Id;
        this.selectedOwnerStore = eventResult.Store;

    }
    
    // Event handler for Selected Name selection change
    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        
        const dataLength = this.dataFetch.map(row => row.Id);
        if(selectedRows.length >= dataLength.length){
            this.isSelectAll = true}
            else{this.isSelectAll = false}
            
    
        this.selectedDataTableItems = selectedRows.map(row => row.Id);
        console.log("this.selectedDataTableItems",JSON.stringify(this.selectedDataTableItems));
        
    }

    // Event handler for Select All include the names that not on selection change
    handleClickSelectAll(){
        
        this.selectedDataTableItems = this.picklistAccountsInput.map(row => row.Id);
        console.log("this.selectedDataTableItems",JSON.stringify(this.selectedDataTableItems));
    }
    
    // Event handler for sorting the data table
    sortBy(field, reverse, primer) {
        const key = primer
        ? function (x) {
            return primer(x[field]);
        }
        : function (x) {
            return x[field];
        };
        
        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    // Event handler for sorting the data table
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.picklistAccountsInput];
        console.log("event",JSON.stringify(cloneData));
        
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.picklistAccountsInput = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    
    
    
    // Method to load more data for infinite scrolling
    loadMoreData() {
    const currentCount = this.dataFetch.length;
    const nextRecords = this.allAccounts.slice(currentCount, currentCount + this.recordsToLoadOnScroll);
    this.loadRecords(nextRecords);
    }
    loadRecords(records) {
        const newRecords = records;

        this.dataFetch = [...this.dataFetch, ...newRecords];
    }

    // Method to open the modal
    openModal() {
        this.isModalOpen = true;
    }
    // Method to close the modal
    closeModal() {
        this.isModalOpen = false;
    }
    // Method to submit reallocation details
    submitDetails() {
         
        performReallocation({ listAccountsId: this.selectedDataTableItems, selectedOwnerId: this.selectedOwnerId, selectedOwnerStore:this.selectedOwnerStore })
            .then(result => {
                console.log('Reallocation successful', result);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Reallocation successful!',
                        variant: 'success',
                    })
            );
            })
            .catch(error => {
                console.error('Error during reallocation', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error during reallocation. Please try again.',
                        variant: 'error',
                    })
                );
            });
    
        this.isModalOpen = false;
    }

    // Event handler for searching the data table
    handleSearchTable(event) {
      const searchKey = event.target.value.toLowerCase();
 
        if (searchKey) {
            this.dataFetch = this.picklistAccountsInput;
 
            if (this.dataFetch) {
                let searchRecords = [];
 
                for (let record of this.dataFetch) {
                    let valuesArray = Object.values(record);
 
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
 
                        if (strVal) {
 
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
 
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                this.dataFetch = searchRecords;
            }
        } else {
            this.dataFetch = this.picklistAccountsInput;
        }
    }
  

}
