const generate = require("randomstring").generate;
const { genLink, getLink, getTrendingLinks } = require("../helpers/helper");
const bodyParser = require("body-parser");
const validator = require("validator");
const cors = require("cors")
require("dotenv").config()

url_validator_options = {
    protocols: ['http', 'https', 'ftp'],
    require_tld: true,
    require_protocol: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: true,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false,
}


module.exports = function (app) {

    app.use(bodyParser.json());

    app.use(cors());

    app.post("/shorten", async (req, res) => {
        let link = req.body.link;
        let host = req.get("host");

        let isLink = validator.isURL(link, url_validator_options);

        if (!isLink) {
            res.status(500).json({ error: "not a valid link", status: false });
            return;
        }

        try {
            let shortened_link = await genLink(link, host);

            res.status(201).json({ shortened_link: shortened_link, status: true });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "server error", status: false })
        }
    });

    app.post("/trending", async (req, res) => {
        let data = req.body;
        let host = req.get("host");

        try {            
            let links = await getTrendingLinks(data);
            res.status(200).json({ links: links, host:host,  status: true });
        }
        catch (error) {
            throw new Error(error);
        }

    });


    app.get("/:linkCode", async (req, res) => {
        let linkCode = req.params.linkCode;

        try {

            let link = await getLink(linkCode);

            if (!link) {
                res.status(404).json({ error: "no link found or link expired", status: false });
                return;
            }

            res.redirect(`${link}`);
            // res.status(200).json({ link: link, status: true });
        }
        catch (error) {
            throw new Error(error);
        }

    });
}