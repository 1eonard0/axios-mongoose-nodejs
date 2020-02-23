const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const axios = require('axios').default;
const cheerio = require('cheerio');
const cron = require('node-cron');
const { BreakingNew } = require('./model');


mongoose.connect(MONGO_URI,{ useNewUrlParser: true });

//0 */4 * * *

cron.schedule('* * * * *', async () => {
    console.log('Cron job executed!.');
    const html = await axios.get('https://www.diarionorte.com/notas/policiales/');
    const $ = cheerio.load(html.data);
    const titles = $('article');

    titles.each( (index, element) => {
        
        const breakingNew = {
            title: $(element).find('a h2').text(),
            link: $(element).find('a').attr('href')
        }

        BreakingNew.create([breakingNew]);
    });
});
