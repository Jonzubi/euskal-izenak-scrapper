const superagent = require("superagent");
const cheerio = require("cheerio");
const fs = require('fs');
const URL = 'https://euskalizenak.eus/zerrenda'
const LAST_PAGE = 81;

async function main(){
    let allNames = [];
    allNames = allNames.concat(await findPagesNames(URL));
    
    for(let i = 1; i <= LAST_PAGE; i++){
      allNames = allNames.concat(await findPagesNames(`${URL}?page=${i}`));
    }
    
    // Pasar el contenido del array a un fichero JSON
    fs.writeFileSync('izenak.json', JSON.stringify(allNames));
  }
  
  const findPagesNames = async (url) => {
  console.log(`Izenak lortzen ${url}`);
  const namesInPage = [];
  const response = await superagent.get(url);
      const $ = cheerio.load(response.text);
      const viewsRows = $('.views-row');
      viewsRows.each((index, element) => {
        const name = $(element).find('.field-content').first().text();
        const gender = $(element).find('.sexua').text();
        const origin = $(element).find('.jatorria').text();
        namesInPage.push({
          name,
          gender,
          origin
        });
      });
  return namesInPage;
}

main();

