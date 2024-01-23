
# Salesforce Lightning Web Components Reallocation App
![recording-ezgif com-video-to-gif-converter](https://github.com/pini-winer/Realloction/assets/95618690/ab0ea408-8b27-486b-9ad2-96c7cf25057a)

## Overview

This Salesforce Lightning Web Components (LWC) application is designed for reallocation of accounts among different owners and stores. It provides a user interface with dropdowns to select countries, stores, owners, and accounts. Users can perform reallocation by changing the owner and store for selected accounts.

## Features

- **Dropdown Components**: Utilizes Lightning Web Components for dropdowns to select countries, stores, owners, and accounts.

- **Reallocation Logic**: Implements Apex classes for backend logic to fetch and update records for reallocation.

- **Infinite Scrolling**: Enables loading more accounts as the user scrolls through the table.

- **Search Functionality**: Allows users to search for specific accounts in the data table.

- **Checkbox Selection**: Supports selecting multiple accounts using checkboxes.

- **Modal for Reallocation**: Utilizes a modal to confirm and execute the reallocation of selected accounts.

## Components

### 1. `AppRealloc` (Apex Class)

- Contains Apex methods for fetching countries, stores, owners, and accounts.
- Handles the reallocation logic.

### 2. `CompleteComboboxParent` (LWC)

- Main Lightning Web Component that orchestrates the reallocation process.
- Uses child components for dropdowns and displays the account data table.
- Implements infinite scrolling, sorting, and search functionality.

### 3. `CompleteComboboxChild` (LWC)

- Child component responsible for rendering dropdowns with checkbox options.
- Handles user interactions such as search, selection, and deselection.

### 4. `SellerCard` (LWC)

- Represents a card for displaying seller information with a checkbox.
- Used for selecting sellers during the reallocation process.



## Usage

1. Open the Lightning app containing the `CompleteComboboxParent` component.

2. Select a country, store, and owner.

3. View the accounts in the data table and choose the ones for reallocation.

4. Open the modal, confirm the reallocation details, and submit.

5. Receive success or error messages via toast notifications.

## Contributions

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.


---

