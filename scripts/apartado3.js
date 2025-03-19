// --- 3. Implementación de consultas en MongoDB

// consulta_3
db.restaurants.countDocuments({ "type_of_food": "Chinese" })

// consulta_4
db.inspections.aggregate([
    {
      "$match": { "result": "Violation Issued" }
    },
    {
      "$addFields": {
        "date_parsed": {
          "$dateFromString": { "dateString": "$date", "format": "%b %d %Y" }
        }
      }
    },
    { "$sort": { "date_parsed": -1 } }
])

//consulta_5
db.restaurants.find({ "rating": { "$gt": 4 } })
db.restaurants.countDocuments({ "rating": { "$gt": 4 } })