* first create cocos-challenge repo
* I started with readme with my plan
* then npx create-expo-app cocos-challenge --template expo-template-blank-typescript
* Update expo
* create the folder structure.
* install needed dependecies for kick off ui.
* added types for 
`GET https://dummy-api-topaz.vercel.app/portfolio`
`GET https://dummy-api-topaz.vercel.app/instruments`
`GET https://dummy-api-topaz.vercel.app/search?query=DYC`
`POST https://dummy-api-topaz.vercel.app/orders`
`Ejemplo body 1
{
    instrument_id: 1,
    side: 'BUY',
    type: 'MARKET',
    quantity: 1234
}`
* created the api call for each of them
* instruments using style inline until I have defined how I want it looks like.
* orders modal created but still need works.
* tabs defined and how the screen will look like
* added types for components and barrel file for instruments also
* added simple search tab separating the intention of the user
* I think ticker is okay
* fix typos on instruments
* start with portfolio integration
* I separate the financial calcs from the formatters so the logics is not tight to how the ui is being render
* I had to create a different way for the keys on  keyExtractor because of duplicated keys
* these repetead key represent different lots per instrument so I've decided to consolidate.
* for debugging I had to use staleTime 1 min aprox
* start with ordermodal and logic
* main focused on expo for delivery challenge
* put robust error handler everyplace I think is neccesary
* i created also history of orders so I check is working properly. could be a good feature if it's improved.
