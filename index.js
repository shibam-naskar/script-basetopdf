var request = require('request').defaults({ encoding: null });
fs = require('fs');
const axios = require('axios').default;
var dataall = require('./data.json')
MONGO_URL = "mongodb+srv://admin:Ggjy8DF8h2RJrxPb@cluster0.hm2yv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

var index = 0;



//moingo db here ...............

const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/collage-website-data')
mongoose.connect(MONGO_URL)
.then(()=>{
    console.log("db Connected")
    putdata()
})
.catch((err)=>{
    console.log(err)
})


// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("Mongo DB connected successfully!");
//     }
// });



const noticeSchema = new mongoose.Schema({
    // name: String,
    // data:String
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ['notice', 'important', 'newsletter'],
        default: 'notice',
    },
    department: {
        type: String,
        default: "All",
    },
    importent: {
        type: Boolean,
    },
    findid: {
        type: String,
    },
    driveId:{
        type: String,
        required: true
    },
    // createdBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     // required: true,
    // },
    // editedBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     default: null,
    // },
    // editedOn: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     default: null,
    // },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    }
})



const Notices = new mongoose.model("Notice",noticeSchema)


// const allNotices = new Notices({
//     name: "shibam",
//     data:"hellow"
// })

// allNotices.save()

//mongo db ends.............

// for(let i=0;i<dataall.length;i++){
//     request.get(dataall[i].hlink, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
//             // console.log(data);
//             const allNotices = new Notices({
//                 title: dataall[i].description,
//                 content:data,
//                 department:dataall[i].department,
//                 importent:dataall[i].isimportent==1?true:false
//             })

            
            
//             allNotices.save()
//             console.log("done")
//         }else{
//             console.log(`error in getting ${dataall[i].id}`)
//         }

        
//     });
// }

async function putdata(){
    request.get(dataall[index].hlink, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            dataBASE = Buffer.from(body).toString('base64');
            // const ataasstringURL = uploadPdf(dataBASE);


            axios.post('https://script.google.com/macros/s/AKfycby4Hy0No6Mc0jNaaRaTCvc320dsT2W-palaahfuFzPF4UBHFr-yEBk8Db57P8eKnelY/exec?q=upload&key=IYTnRp2CmeTSvPLgslOPFx5SdF9aiDMQ38HcCQ4foWerJHpavsw4Cm1DXy95ad7zZx3preWQ5GowxzcY9Z3zCsCiaZSUw8AsMCk9', {
                folderName:"notices",
                fileType:"application/pdf",
                fileName:dataall[index].description,
                data:dataBASE
            })
            .then(function (response) {
                console.log(response.data);
                const allNotices = new Notices({
                    title: dataall[index].description,
                    content:response.data['messege'],
                    driveId:response.data['id'],
                    department:dataall[index].department,
                    importent:dataall[index].isimportent==1?true:false,
                    findid:dataall[index].id
                })
    
                
                
                allNotices.save()
                console.log(`done ${index}`)
                index=index+1
                putdata()
            })
            .catch(function (error) {
                console.log(error);
            });





            // console.log(data);
            // const allNotices = new Notices({
            //     title: dataall[index].description,
            //     content:ataasstringURL,
            //     department:dataall[index].department,
            //     importent:dataall[index].isimportent==1?true:false,
            //     findid:dataall[index].id
            // })

            
            
            // allNotices.save()
            // console.log(`done ${index}`)
            // index=index+1
            // putdata()
        }else{
            
            const allNotices = new Notices({
                title: dataall[index].description,
                content:dataall[index].hlink?dataall[index].hlink:"",
                department:dataall[index].department,
                importent:dataall[index].isimportent==1?true:false,
                findid:dataall[index].id
            })
            allNotices.save()
            console.log(`error in getting ${dataall[index].id}`)
            index=index+1
            putdata()
        }

        
    });
}

async function after(){

}

async function uploadPdf(dataPDF){
    axios.post('https://script.google.com/macros/s/AKfycbzSIpv3c-4nRUNybto1U_zsARAdmu5SBC2sadiF15TCwqY4lPzrO4EyxmWHu-Cv5EYj/exec?q=upload&key=IYTnRp2CmeTSvPLgslOPFx5SdF9aiDMQ38HcCQ4foWerJHpavsw4Cm1DXy95ad7zZx3preWQ5GowxzcY9Z3zCsCiaZSUw8AsMCk9', {
        folderName:"notices",
        fileType:"application/pdf",
        fileName:"shibam",
        data:dataPDF
    })
    .then(function (response) {
        console.log(response.data);
        return response.data['messege'];
    })
    .catch(function (error) {
        console.log(error);
    });

}



// request.get('http://jgec.ac.in/2ndIn.pdf', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
//         // console.log(data);
//         const allNotices = new Notices({
//             name: "shibam",
//             data:data
//         })
        
//         allNotices.save()
//     }

    
// });