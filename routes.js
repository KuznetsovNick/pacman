import express from 'express';
import pug from 'pug';
import path from 'path';

const router = express.Router();

router.get("/", (req, res, next) => {
    res.send(pug.compileFile("index.pug", null)())
});

router.get("*", (req, res)=>{
    res.status(404);
    res.end("Page not found");
});

export default router