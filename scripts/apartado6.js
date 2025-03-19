// --- 6. Optimización del rendimiento

// consulta_10
db.restaurants_with_list_of_inspections.find({
    type_of_food: { $in: ["Chinese", "Japanese", "Korean", "Thai", "Vietnamese", "Sushi"] },
    rating: { $gte: 5 }
}).explain("executionStats");

// consulta_11
db.restaurants_with_list_of_inspections.find({
    type_of_food: { 
      $in: ["Chinese", "Japanese", "Korean", "Thai", "Vietnamese", "Sushi"] 
    },
    rating: { $gte: 5 },
    "inspections.result": "Pass"  
}).explain("executionStats");

// indices creados
db.restaurants_with_list_of_inspections.createIndex({ type_of_food: 1, rating: -1 })
db.restaurants_with_list_of_inspections.createIndex({ type_of_food: 1 })
db.restaurants_with_list_of_inspections.createIndex({ rating: -1 })
db.restaurants_with_list_of_inspections.createIndex({ "inspections.result": 1 })