// --- 2. Diseño del esquema de la base de datos

// consulta_1 
db.inspections.aggregate([
    {
        $group: {
            _id: "$restaurant_id",
            count: { $sum: 1 }
        }
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } }
])

// consulta_2
db.restaurants.aggregate([
  {
      $lookup: {
          from: "inspections",
          let: { restaurantId: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: [{ $toObjectId: "$restaurant_id" }, "$$restaurantId"] }}}],
          as: "inspections"
      }
  },
  { $match: { "inspections.0": { $exists: true } } },
  { $out: "restaurants_with_list_of_inspections" }  
]);

// validacion_1
db.runCommand({
  collMod: "restaurants",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "name", "address", "outcode", "postcode", "rating", "type_of_food"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Debe ser un ObjectId unico."
        },
				URL: {
        	bsonType: "string",
       		pattern: "^https?:\\/\\/.+",
        	description: "debe ser una URL válida."
      },
        name: {
          bsonType: "string",
          minLength: 1,
          description: "el nombre del restaurante debe ser un string."
        },
        address: {
          bsonType: "string",
          description: "la dirección debe ser un string."
        },
        "address line 2": {
          bsonType: ["string", "null"],
          description: "la segunda línea de dirección es opcional"
        },
        postcode: {
          bsonType: "string",
          description: "Código postal interno"
        },
				outcode: {
        	bsonType: "string",
        	description: "Código postal externo"
      	},
        rating: {
        bsonType: ["double", "int", "string"],
        description: "Valoración del restaurante entre 0 y 10, permitiendo solo valores enteros, .5 o 'Not yet rated'.",
        anyOf: [
          {
            bsonType: "string",
            enum: ["Not yet rated"]
          },
          {
            bsonType: ["double", "int"],
            minimum: 0,
            maximum: 10,
            enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
          }
        ]
      },
        type_of_food: {
          bsonType: "string",
          description: "El tipo de comida debe ser un string."
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

// validacion_2
db.runCommand({
  collMod: "inspections",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "id", "certificate_number", "business_name", "date", "sector", "result", "address", "restaurant_id"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Debe ser un ObjectId único."
        },
        id: {
          bsonType: "string",
          description: "Identificador único de la inspección."
        },
        certificate_number: {
          bsonType: "int",
          description: "número de certificado de la inspección."
        },
        business_name: {
          bsonType: "string",
          description: "El nombre del negocio inspeccionado."
        },
        date: {
          bsonType: "string",
          pattern: "^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d{2} \\d{4}$",
          description: "ejemplo de fecha: 'Dec 26 2023' o 'Sep 04 2024')"
        },
        result: {
          bsonType: "string",
          enum: ["Pass", "Fail", "Violation Issued", "Warning Issued", "No Violation Issued" ],
          description: "Resultado de la inspección: 'Pass', 'Fail' o 'Violation Issued', ''."
        },
        sector: {
          bsonType: "string",
          description: "Sector de la inspección."
        },
        address: {
          bsonType: "object",
          required: ["city", "zip", "street", "number"],
          properties: {
            city: {
              bsonType: "string",
              description: "ciudad donde se realizó la inspección."
            },
            zip: {
              bsonType: "string",
              pattern: "^[A-Z0-9 ]+$",
              description: "código postal válido."
            },
            street: {
              bsonType: "string",
              description: "nombre de la calle."
            },
            number: {
              bsonType: "string",
              description: "numero del edificio o local."
            }
          }
        },
        restaurant_id: {
          bsonType: "objectId",
          description: "Debe ser un ObjectId que haga referencia a un restaurante."
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});