import { LightningElement , api, track} from 'lwc';

export default class TableDataPerso extends LightningElement {


    @api mydata=[];
    @track selectedRows = [];

    get columns() {
        return columns;
    }

    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
    }

    handleGetSelectedIds() {
        const selectedIds = this.selectedRows.map(row => row.Id);
      // Émettre un événement contenant les ID sélectionnés
      const selectedIdsEvent = new CustomEvent('selectedids', {
        detail: { selectedIds },
        });
       this.dispatchEvent(selectedIdsEvent);

        console.log('ID sélectionnés:', selectedIds);
        // Vous pouvez traiter les ID sélectionnés comme nécessaire

    }
}
