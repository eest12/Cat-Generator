exports.handler = async function (event, context) {
    try {
      const { id, sunglasses, imgUrl } = event.queryStringParameters;
  
      switch (id) {
        case "cat_api":
          // build the url
          let catUrl = "https://api.thecatapi.com/v1/images/search?mime_types=jpg,png";
          if (sunglasses && sunglasses.toLowerCase() == "true") {
            catUrl += "&category_ids=4";
          }
          catUrl += `&api_key=${process.env.CAT_KEY}`;
  
          // fetch and return data
          const catData = await fetch(catUrl).then((res) => res.json());
          return {
            statusCode: 200,
            body: JSON.stringify({data: catData})
          };
  
        case "se_api":
          if (imgUrl) {
            // build the url
            const seUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${process.env.IMG_MOD_USER}&api_secret=${process.env.IMG_MOD_SECRET}`;
            
            // fetch and return data
            const colorData = await fetch(seUrl).then((res) => res.json());
            return {
              statusCode: 200,
              body: JSON.stringify({data: colorData})
            }
          } else {
            return {
              statusCode: 404,
              body: JSON.stringify({error: "Missing image URL"})
            }
          }
  
        default:
          return {
            statusCode: 404,
            body: JSON.stringify({error: "Invalid ID"})
          };
      }
    } catch (err) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: err.toString()})
      };
    }
  };