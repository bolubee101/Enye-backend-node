const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/rates", (req, res) => {
  let base = req.query.base;
  let currency = req.query.currency;
  if (!base) {
    res.status(400);
    return res.json({
      error: "missing base query parameter",
    });
  }if(!currency){
    fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
    .then((res) => res.json())
    .then((json) => {
        res.json({
            results:{
                base:json.base,
                date:json.date,
                rates:json.rates
            }
        })
    })
  } else {
    fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
      .then((res) => res.json())
      .then((json) => {
       // console.log(json);
        if (json.error&&json.error.includes(base)) {
          res.status(404);
          return res.json({
            error: `The requested base, "${base}" cannot be found`,
          })
        }else{
            // I am not using the symbol parameter in the api so in order to return the exact currency that is invalid
            let symbols =Object.keys(json.rates);
            currency=currency.split(",");
            let missing="";
            let rates={};
            for(i of currency){
                if(!symbols.includes(i)){
                    missing+=i+",";
                }else{
                    rates[i]=json.rates[i];
                };
            }
            if(missing!==""){
                res.status(404);
          return res.json({
            error: `The following currencies "${missing}" cannot be found`,
          })
            }else{
                res.json(
                    {
                        "results": {
                            "base": base,
                            "date": json.date,
                            "rates": rates
                        }
                    }
                )
            }
        }
      });
  }
});

module.exports = router;
