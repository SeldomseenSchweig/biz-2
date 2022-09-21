const express = require("express");
const router = express.Router();
const db = require("../db");
var slugify = require('slugify')
const ExpressError = require("../expressError");

router.get("/", async (req,res,next)=>{
    try {
        const results = await db.query('SELECT * FROM industries');
    
        return res.json({industries:results.rows})
        
    } catch (error) {
        return next(error);
    }

});

router.get("/:code", async (req,res,next)=>{
    try {
        let {code} = rea.params;
        let industry = await db.query(`SELECT * FROM industries WHERE code = $1`,
        [code]);
        // const results = await db.query(`SELECT * FROM companies WHERE code = $1`,
        // [code]);
    
        return res.json({industry:industry.rows})
        
    } catch (error) {
        return next(error);
    }

});

router.post('/', async (req,res,next)=>{
    try {
        

        const {name} = req.body;
        
        let code = slugify(name, {remove: /[aeiou]/g})
        const results = await db.query(`INSERT INTO companies (code,name) VALUES ($1,$2) RETURNING  code, name`, [code, name]);
        return res.status(201).json({company:results.rows[0]})
    
    } catch (error) {
        return next(error)
        
    }
    
    })




module.exports = router;