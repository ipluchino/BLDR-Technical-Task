# Rental Platform Backend
This project represents a backend API written using Node and Express for a platform where users can rent out items. There are defined routes to list a new item, unlist existing items, search for items (by name, minimum price, and maximum price), rent items for date ranges, and return items. The item list is stored as a JSON array in a file titled "items.json". For testing purposes, users can rent items for dates in the past and return items in the future. In a real system, it would not be possible to rent an item in the past or return an item in the future (other than cancelling a future rental period). If I were to expand this project, I would create an interactive front-end that allows items to be listed, unlisted, searched for, rented, and returned directly through a website.

Example of items.json:
```yaml
[
    {
    "id": 1,
    "name": "Apple IPhone",
    "description": "An IPhone X with 128GB of memory.",
    "pricePerDay": "39.99",
    "rentalInformation": {
      "rentalPeriods": [
        {
          "startDate": "02-06-2025",
          "endDate": "02-09-2025"
        },
        {
          "startDate": "04-11-2025",
          "endDate": "04-14-2025"
        }
      ]
    }
  }
]
```
# Download Instructions
1. **Clone this repository.**
```bash
git clone https://github.com/ipluchino/BLDR-Technical-Task
```
2. **Navigate to the repository folder.**
```bash
cd BLDR-Technical-Task
```
4. **Install the dependencies.**
```bash
npm install
```
4. **Run the server.**
```bash
npm start
```
If running on a local machine, the server will be live at http://localhost:3000/ unless a different port is explicitly specified.

# API Endpoints and Testing Instructions
### 1. List an item (POST)
- Description: Used to add an item to the overall list of items that can be rented.
- Endpoint: /list
- Query Parameters:
  - name (required): The name of the item.
  - description (optional): A description of the item.
  - pricePerDay (required): The price to rent the item per day.
  - rentalDates (optional): A JSON object with pre-defined rental dates. This parameter is used if the item has already been rented out for the future before being listed.
- Example: POST localhost:3000/list?name=Drone&description=A drone with a 4K camera.&pricePerDay=209.99&rentalDates={"rentalPeriods":[{"startDate":"02-02-2025","endDate":"02-28-2025"}, {"startDate":"04-11-2025","endDate":"04-14-2025"}]}

### 2. Unlist an item (POST)
- Description: Used to unlist an item from the overall list of items that can be rented.
- Endpoint: /unlist/id
  - id is the id of the item to be unlisted.
- Query Parameters: None.
- Example: POST localhost:3000/unlist/8

### 3. Search for an item (GET)
- Description: Used to search for specific items on the item list. If no search query parameters are included, all items will be returned. All search results are sorted by price order.
- Endpoint: /search
- Query Parameters:
  - name (optional): Filters the items by a name.
  - minPrice (optional): Filters the items by a minimum price.
  - maxPrice (optional): Filters the items by a maximum price.
- Example: GET localhost:3000/search?minPrice=40&maxPrice=80

### 4. Rent an item (POST)
- Description: Used to rent a specific item for a specified date range.
- Endpoint: /rent/id
  - id is the id of the item to be rented.
- Query Parameters:
  -  startDate (required): The starting date of the rental period.
  -  endDate (required): The ending date of the rental period.
- Example: POST localhost:3000/rent/5?startDate=05-02-2025&endDate=05-05-2025

### 5. Return an item (POST)
- Description: Used to return an item.
- Endpoint: /return/id
  - id is the id of the item to be returned.
- Query Paramters:
  - returnDate (required): The date the item is being returned.
- Example: POST localhost:3000/return/5?returnDate=05-04-2025
