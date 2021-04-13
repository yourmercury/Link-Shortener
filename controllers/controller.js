const Active_link = require("../models/model")();
const generate = require("randomstring").generate;
const { genLink, getLink } = require("../helpers/helper");
const bodyParser = require("body-parser");


module.exports = function (app) {

    app.use(bodyParser.json());

    app.post("/shorten", async (req, res) => {
        let link = req.body.link;
        let host = req.get("host");

        try {
            let shortened_link = await genLink(link, host);
            
            res.json({ shortened_link: shortened_link });
        }
        catch (error) {
            console.log(error);
        }
    });



    app.get("/:linkCode", async (req, res) => {
        let linkCode = req.params.linkCode;

        try {
            
            let link = await getLink(linkCode);

            if (!link) {
                res.status(404).json({ err: "no like found or link expired" });
                return;
            }

            res.redirect(`http://${link}`);
        }
        catch (error) {
            throw new Error(error)
        }

    });
}