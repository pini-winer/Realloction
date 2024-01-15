public with sharing class AppRealloc {
        @AuraEnabled(cacheable=true)
        public static List<Country__c> GetCountries(){
            return [SELECT  Id, Name 
            FROM Country__c   
            ORDER BY Name];
        }
    
        @AuraEnabled(cacheable=true)
        public static List<Store__c> GetStores(List<String> lstCtry){
            return [SELECT Id, Name 
            FROM Store__c
            WHERE Country__r.Name IN :lstCtry 
            ORDER BY Country__r.Name];
        }
        
        @AuraEnabled(cacheable=true)
        public static List<AggregateResult> GetOwners(List<String> lstStors){
            return [SELECT main_store__r.Name,main_store__c, OwnerId, Owner.LastName, Owner.FirstName,main_store__r.Country__r.countryISO__c, COUNT(Id) accountCount 
            FROM Account 
            WHERE main_store__c IN :lstStors   
            GROUP BY main_store__c, OwnerId , Owner.LastName, Owner.FirstName,main_store__r.Name,main_store__r.Country__r.countryISO__c];
        }


        @AuraEnabled(cacheable=true)
        public static List<Account> GetAccounts(List<String> lstOwner){
            return [SELECT Id,  Name,  Segment__c, OwnerId, Owner.LastName, Owner.FirstName, main_store__r.Name  
                    FROM Account
                    WHERE OwnerId  IN :lstOwner];
        }
        
 
        
        @AuraEnabled
        public static void performReallocation(List<String> listAccountsId, String selectedOwnerId, String selectedOwnerStore) {
                // Fetch the new owner and store information from the selectedOwner list
                
                List<Account> accountsToUpdate = new List<Account>();
                for (String row : listAccountsId) {
                  Account temp = new Account();
                  temp.Id = row;
                  temp.OwnerId = selectedOwnerId;
                  temp.main_store__c = selectedOwnerStore;
                  accountsToUpdate.add(temp);
                }
        
                if (!accountsToUpdate.isEmpty()) {
                    update accountsToUpdate;
                }
            }
        
        
    
    }