import { get } from 'node:https';
import { readdirSync, readFileSync, existsSync, mkdir, createWriteStream } from 'node:fs';

const temp = process.env.PWD+"/tmp/";

async function load(dir) {
    if(dir.indexOf('://') == -1){
	let results = []
    	readdirSync(dir).forEach((name) => {
            if(name.substr(-3) == 'csv'){ // Maybe(?) parse another formats 
		let res     = readFileSync(dir+name, 'utf8').split('\r\n');
		let keys    = res.shift().split(',');
		res.forEach(record => {
		   let arr = record.split(',');
		   results.push(keys.reduce((map, x, idx) => { map[x] = arr[idx]; return map; }, {}))
		});
            }
    	})
    	return results
    }
    else{
        get(dir, response => {
             response.pipe(createWriteStream(dir.split('/').pop())).on("finish", async () => {
                if(!existsSync(temp)) mkdir(temp, { recursive: true })
		return load(temp)
             });
        });
    }
}
load("https://raw.githubusercontent.com/godata-ai/vscode/main/input.csv").then((res) => {
  console.log(res)
))
