// --- 4. Uso de agregaciones

// consulta_6
db.restaurants.aggregate([
    {
        $group: {
            _id: "$type_of_food",  
            avgRating: { $avg: "$rating" } 
        }
    },
    {
        $project: {
            _id: 0, 
            type_of_food: "$_id",  
            avgRating: 1  
        }
    }
  ]);
  
  // consulta_7
  db.inspections.aggregate([
    {
      $group: {
        _id: "$result",  
        total: { $sum: 1 }  
      }
    },
    {
      $group: {
        _id: null,  
        totalInspections: { $sum: "$total" },  
        results: { $push: { result: "$_id", total: "$total" } }  
      }
    },
    { $unwind: "$results" },
    {
      $project: {
        _id: "$results.result",  
        total: "$results.total",  
        percentage: { $multiply: [ { $divide: ["$results.total", "$totalInspections"] }, 100 ] } 
          }
    }
  ])
  
  // consulta_8
  db.restaurants.aggregate([
    {
        $lookup: {
            from: "inspections",
            let: { restaurantId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: [{ $toObjectId: "$restaurant_id" }, "$$restaurantId"] } }},
                {
                    $project: {
                        _id: 0,  
                        id: 1,
                        certificate_number: 1
                    }
                }
            ],
            as: "inspections"
        }
    },
    { $match: { "inspections.0": { $exists: true } } },
  ]);