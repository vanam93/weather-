import http from 'http'
import fs from 'fs'
import request from 'requests'
import ktc from 'kelvin-to-celsius'
const htmlFile=fs.readFileSync('home.html', 'utf8');

const replaceVal=(tempval,orgval)=>{
    
    let final=tempval.replace("{%temp%}",ktc(orgval.main.temp).toFixed(2));
    final=final.replace("{%temp_max%}",ktc(orgval.main.temp_max).toFixed(2));
    final=final.replace("{%temp_min%}",ktc(orgval.main.temp_min).toFixed(2));
    
    final=final.replace("{%city%}",orgval.name);
    final=final.replace("{%country%}",orgval.sys.country);
   
 return final;
   
}


const server = http.createServer((req,res)=>{
    if(req.url=='/'){
        request(`https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=16ea73ea20d629c79c6300b2d0df05a2`)

        .on("data",(data)=>{
            const objdata = JSON.parse(data);
            const arrdata=[objdata];
            const finaldata=arrdata.map((val)=> {return replaceVal(htmlFile,val)}).join("");
          
           res.write(finaldata)
           
        })
        .on("end",(err)=>{
            res.end();
        })
        
       
    }
})
server.listen(3000,()=>{console.log("server listening...");});