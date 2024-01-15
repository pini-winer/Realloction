import { LightningElement, api } from 'lwc';

export default class CompleteComboboxChild extends LightningElement {
   
    // API Variables
    @api picklistinput = [];
    @api selectedItems = [];
    @api label;
    @api isdisabled ;
   
    

     allValues = []; 
     selectedObject = false;
     valuesVal = undefined;
     searchTerm = '';
     showDropdown = false;
     itemcounts = 'None Selected';
     selectionlimit = 10;
     showselectall = false;
     errors;
   

    //this function is used to filter the sata when get 

     get filteredResults() {
         
         
         this.valuesVal = this.picklistinput;
         Object.keys(this.valuesVal).map(item => {
             this.allValues.push({ Id: this.valuesVal[item].Id, Name: this.valuesVal[item].Name });
            })
            
            this.allValues = [];
            
            
            
        if (this.valuesVal != null && this.valuesVal.length != 0) {
            if (this.valuesVal) {
                const selecteditemNames = this.selectedItems.map(item => item.Name);
                        this.allValues = [];

                return this.valuesVal.map(item => {
                    //below logic is used to show check mark (✓) in dropdown checklist
                    const isChecked = selecteditemNames.includes(item.Name);
                    return {
                        ...item,
                        isChecked,
                    };
                    
                }).filter(item =>
                    item.Name.toLowerCase().includes(this.searchTerm.toLowerCase())
                    ).slice(0, 50000);
                } else {
                    return [];
                }
            }
        }
        
        
  
        
        //this function is used to filter/search the dropdown list based on user input
        handleSearch(event) {
        this.searchTerm = event.target.value;
        this.showDropdown = true;
        this.mouse = false;
        this.focus = false;
        this.blurred = false;
        if (this.selectedItems.length != 0) {
            if (this.selectedItems.length >= this.selectionlimit) {
                this.showDropdown = false;
            }
        }
    }

    //this function is used when user check/uncheck/selects (✓) an item in dropdown picklist
    handleSelection(event) {
        const selecteditemId = event.target.value;
        const isChecked = event.target.checked;

        if (this.selectedItems.length < this.selectionlimit) {
            
            if (isChecked) {
                const selecteditem = this.valuesVal.find(item => item.Id === selecteditemId);
                if (selecteditem) {
                    this.selectedItems = [...this.selectedItems, selecteditem];
                    this.allValues.push(selecteditemId);
                }
            } else {
                this.selectedItems = this.selectedItems.filter(item => item.Id !== selecteditemId);
                this.allValues.splice(this.allValues.indexOf(selecteditemId), 1);
            }
        } else {
            
            if (isChecked) {
                this.showDropdown = false;
                this.errormessage();
            }
            else {
                this.selectedItems = this.selectedItems.filter(item => item.Id !== selecteditemId);
                this.allValues.splice(this.allValues.indexOf(selecteditemId), 1);
                this.errormessage();
            }
        }
        const selectedoptions = this.selectedItems.map(item => item.Name);
        this.itemcounts = this.selectedItems.length > 0 ? `${selectedoptions}` : 'None Selected';
        
        if (this.itemcounts == 'None Selected') {
            this.selectedObject = false;
        } else {
            this.selectedObject = true;
        }
        const selectionEvent = new CustomEvent('selectionchange', {detail: {selectedParentItems: this.selectedItems}});
       
        
        this.dispatchEvent(selectionEvent);
        
        
        
    }

    //custom function used to close/open dropdown picklist
    clickhandler(event) {
        this.mouse = false;
        this.showDropdown = true;
        this.clickHandle = true;
        this.showselectall = true;
    }

    //custom function used to close/open dropdown picklist
    mousehandler(event) {
        this.mouse = true;
        this.dropdownclose();
    }

    //custom function used to close/open dropdown picklist
    blurhandler(event) {
        this.blurred = true;
        this.dropdownclose();
    }

    //custom function used to close/open dropdown picklist
    focuhandler(event) {
        this.focus = true;
    }

    //custom function used to close/open dropdown picklist
    dropdownclose() {
        if (this.mouse == true && this.blurred == true && this.focus == true) {
            this.searchTerm = '';
            this.showDropdown = false;
            this.clickHandle = false;
        }
    }

    //this function is invoked when user deselect/remove (✓) items from dropdown picklist
    handleRemove(event) {
        const valueRemoved = event.target.name;
        this.selectedItems = this.selectedItems.filter(item => item.Id !== valueRemoved);
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
        this.itemcounts = this.selectedItems.length > 0 ? `${this.selectedItems.Name}` : 'None Selected';
        this.errormessage();

        if (this.itemcounts == 'None Selected') {
            this.selectedObject = false;
        } else {
            this.selectedObject = true;
        }

             const selectionEvent = new CustomEvent('selectionchange', {detail: {selectedParentItems: this.selectedItems}});
       
        
        this.dispatchEvent(selectionEvent);
    }

    //this function is used to deselect/uncheck (✓) all of the items in dropdown picklist
    handleclearall(event) {
        event.preventDefault();
        this.showDropdown = false;
        this.selectedItems = [];
        this.allValues = [];
        this.itemcounts = 'None Selected';
        this.searchTerm = '';
        this.selectionlimit = 100;
        this.errormessage();
        this.selectedObject = false;

        const selectionEvent = new CustomEvent('selectionchange', {detail: {selectedParentItems: this.selectedItems}});
       
        
        this.dispatchEvent(selectionEvent);

    }

    //this function is used to select/check (✓) all of the items in dropdown picklist
    selectall(event) {
        event.preventDefault();

            this.valuesVal = this.picklistinput;

        this.selectedItems = this.valuesVal;
        const selectedoptions = this.selectedItems.map(item => item.Name);
        this.itemcounts = selectedoptions + ',';
        this.selectionlimit = this.selectedItems.length + 1;
        this.allValues = [];
        this.valuesVal.map((value) => {
            for (let property in value) {
                if (property == 'Name') {
                    this.allValues.push(`${value[property]}`);
                }
            }
        });
        this.errormessage();
        this.selectedObject = true;


        const selectionEvent = new CustomEvent('selectionchange', {detail: {selectedParentItems: this.selectedItems}});
       
        
        this.dispatchEvent(selectionEvent);
    }

    //this function is used to show the custom error message when user is trying to select picklist items more than selectionlimit passed by parent component  
    errormessage() {
        this.errors = {
            "Search Objects": "Maximum of " + this.selectionlimit + " items can be selected",
        };
        this.template.querySelectorAll("lightning-input").forEach(item => {
            let label = item.label;
            if (label == 'Search Objects') {

                // if selected items list crosses selection limit, it will through custom error
                if (this.selectedItems.length >= this.selectionlimit) {
                    item.setCustomValidity(this.errors[label]);
                } else {
                    //else part will clear the error
                    item.setCustomValidity("");
                }
                item.reportValidity();
            }
        });
    }





    



    
}







