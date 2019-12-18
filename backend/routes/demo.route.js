let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  XLSX = require('xlsx'),
  fs   = require('fs'),
  router = express.Router();

// Multer File upload settings
const DIR = './public/';

//seeding data 
fs.truncate('sharedTales.txt', 0, () => { });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype)
    cb(null, true);
    /*if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }*/
  }
});


// file model
let File = require('../models/upload');
// tales model 
let Tale = require('../models/tale');


// POST User
router.post('/uploadFile', upload.single('path'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const file = new File({
    _id: new mongoose.Types.ObjectId(),
    name: req.file.filename,
    path: url + '/public/' + req.file.filename
  });
  file.save().then(result => {
    console.log("---",result);
    res.status(201).json({
      message: "Upload file successfully!",
      taleCreated: {
        _id: result._id,
        name: result.name,
        path: result.path
      }
    })
  }).catch(err => {
    console.log("---->",err),
      res.status(500).json({
        error: err
      });
  })
})

// GET All Users
router.get("/", (req, res, next) => {
  const url = './public/file.xlsx';
  let workbook = XLSX.readFile(url);                //reading excel sheet
  let sheetFirstName = workbook.SheetNames[0];
  let workSheet = workbook.Sheets[sheetFirstName];
  let taleObjectArray = XLSX.utils.sheet_to_json(workSheet);
  
  let dataList = taleObjectArray.map((tale)=>{
    return {
        writer_id : tale.writer_id.toString(),
        tale_id : tale.tale_id.toString()
    }
  });
  
  //remove reapeating elements from the array
  const filterList  = (arr)=>{
    var uniq = new Set(arr.map(e => JSON.stringify(e)));
    var filteredArray = Array.from(uniq).map(e => JSON.parse(e));
    return filteredArray;
  }

  let uniqueArray = filterList(dataList);

//Count the total number tales
let getTotalTales = (arrayList,flag)=>{
  if(flag=== 0){
      return arrayList.length;
  } else if(flag === 1){
      let totalTales = 0;
      arrayList.forEach((array)=>{
          totalTales += array.myTales.length;
      })
      return totalTales;
  }
}
// intial 
let totalTales = getTotalTales(uniqueArray,0);
//counts the number of tales shared by individual writer and returns the winning probability
const WinningProbability = (array,writer_id) => {
  let count = 0;
  array.forEach((writer) => {
      if (writer.writer_id === writer_id) count++;
  })

return count / totalTales;   
}

//returns the array of tales shared by individual writers
const getMyTales = (writer_id) =>{
  let tales = [];
  uniqueArray.forEach((writer) => {
      if (writer.writer_id === writer_id) tales.push(writer.tale_id);
  })
  return tales;
}

//returns the maximum Winning Probability
const getMaxWinningProbability = (array) =>{
  let max = 0;
  array.forEach((tale)=>{
      if (tale.WinningProbability > max) max = tale.WinningProbability;
  });
  return max;
}

//makes array empty
const emptyLists = (allArrayList) => {
  allArrayList.forEach((chance) => {
      chance.length = 0;
  })
}

//mapping the tales to each writer
let modifiedUserList = uniqueArray.map((tale)=>{
                      return {
                          writer_id : tale.writer_id,
                          myTales : getMyTales(tale.writer_id),
                          WinningProbability: WinningProbability(uniqueArray,tale.writer_id), 
                          shareFlag : true,
                          earning : 0
                      }
                  });
//final chance of writers with their tales
let uniqueModifiedArray = filterList(modifiedUserList);

let bulk = Tale.collection.initializeOrderedBulkOp();
let counter = 0;

uniqueModifiedArray.forEach(function(doc) {
  bulk.insert(doc);
  counter++;
  if (counter % 500 == 0) {
      bulk.execute(function(err, r) {
         // do something with the result
         bulk = Tale.collection.initializeOrderedBulkOp();
         counter = 0;
      });
  }
});

if (counter > 0) {
  bulk.execute(function(err,result) {
     // Tales inserted in DB
     console.log(counter, " Tales inserted in DB.")
  });
}


//Group writers by their winning probability
let maxWinningProbability = getMaxWinningProbability(uniqueModifiedArray); //maximum winning probability
let chance1  = [],
  chance2  = [],
  chance3  = [],
  chance4  = [],
  chance5  = [],
  chance6  = [],
  chance7  = [],
  chance8  = [],
  chance9  = [],
  chance10 = [];

const fillList = (taleArray) => {
  taleArray.forEach((tale)=>{
     let wp = tale.WinningProbability;
     let numOfTales = tale.myTales.length; // Total tales present 
     let status = tale.shareFlag;
      if (maxWinningProbability * 0.9 < wp && wp <= maxWinningProbability && numOfTales != 0 && status === true){
         chance1.push(tale.writer_id);
      } else if (maxWinningProbability * 0.8 <= wp && wp < maxWinningProbability * 0.9 && numOfTales != 0 && status === true) {
         chance2.push(tale.writer_id);
      } else if (maxWinningProbability * 0.7 <= wp && wp < maxWinningProbability * 0.8 && numOfTales != 0 && status === true) {
         chance3.push(tale.writer_id);
      } else if (maxWinningProbability * 0.6 <= wp && wp < maxWinningProbability * 0.7 && numOfTales != 0 && status === true) {
         chance4.push(tale.writer_id);
      } else if (maxWinningProbability * 0.5 <= wp && wp < maxWinningProbability * 0.6 && numOfTales != 0 && status === true) {
         chance5.push(tale.writer_id);
      } else if (maxWinningProbability * 0.4 <= wp && wp < maxWinningProbability * 0.5 && numOfTales != 0 && status === true) {
         chance6.push(tale.writer_id);
      } else if (maxWinningProbability * 0.3 <= wp && wp < maxWinningProbability * 0.4 && numOfTales != 0 && status === true) {
         chance7.push(tale.writer_id);
      } else if (maxWinningProbability * 0.2 <= wp && wp < maxWinningProbability * 0.3 && numOfTales != 0 && status === true) {
         chance8.push(tale.writer_id);
      } else if (maxWinningProbability * 0.1 <= wp && wp < maxWinningProbability * 0.2 && numOfTales != 0 && status === true) {
         chance9.push(tale.writer_id);
      } else if (maxWinningProbability * 0 < wp && wp < maxWinningProbability * 0.1 && numOfTales != 0 && status === true){
         chance10.push(tale.writer_id);
      }
  })
}

fillList(uniqueModifiedArray);  

// Create Array of winning probability chance 
let allArrayList = [chance1,chance2,chance3,chance4,chance5,chance6,chance7,chance8,chance9,chance10];

//returns an array of non-empty chances
const arraySelector = (arrayList)=>{
  let selectedArrayList = [];
  arrayList.forEach((array)=>{
      if(array.length!=0){
          selectedArrayList.push(array);
      }
  })
  return selectedArrayList;
}

let selectedArrayList = arraySelector(allArrayList);

//returns random element from an array
const randomizer = (array) => {
  let randomIndex = Math.floor((Math.random() * array.length));
  return array[randomIndex];
}

//update the tale info if selected 

const update = (writer_id)=>{
  let len = uniqueModifiedArray.length;
  for(let i=0;i<len;i++){
      if (uniqueModifiedArray[i].writer_id === writer_id){
          if (uniqueModifiedArray[i].shareFlag === true && uniqueModifiedArray[i].myTales.length != 0) {
                  uniqueModifiedArray[i].earning += 1000;
                  let query = {'writer_id': writer_id} 
                  let data = { 'writer_id': writer_id, 
                                'myTales' : uniqueModifiedArray[i].myTales,
                                'WinningProbability' : uniqueModifiedArray[i].WinningProbability,
                                'shareFlag' : uniqueModifiedArray[i].shareFlag,
                                'earning' : uniqueModifiedArray[i].earning
                  };
                  
                  Tale.updateOne(query, data, function(err, doc) {
                    if (err) console.log("error",err);
                    uniqueModifiedArray[i].WinningProbability = WinningProbability(uniqueModifiedArray, writer_id);
                    totalTales = getTotalTales(uniqueModifiedArray, 1);
                    maxWinningProbability = getMaxWinningProbability(uniqueModifiedArray);
                    fillList(uniqueModifiedArray);
                  });
                 
                 
          }
          if (uniqueModifiedArray[i].myTales.length === 0){
              uniqueModifiedArray[i].shareFlag = false;
              uniqueModifiedArray[i].WinningProbability = 0;
          }
      }
  }

  selectedArrayList = arraySelector(allArrayList);
  emptyLists(allArrayList);
  fillList(uniqueModifiedArray);
}

//returns 10 Lucky writers of the day
const getLuckyTen = (arrayList) =>{
  let luckyTen =[];
  while (totalTales>=10) {
      
  arrayList.forEach((tale)=>{
      if(tale != undefined && tale.length!=0){
          let lucky = randomizer(tale);
          if (!luckyTen.includes(lucky)){
              luckyTen.push(lucky);
               //update selected writer data 
              update(lucky);
          }
      }
     
  });

  let length = luckyTen.length;
  // if lucky ten is not select then select randomly
  if(length!= 10){
     while(length<10){
         let randomIndex = Math.floor((Math.random() * selectedArrayList.length));
         if (selectedArrayList[randomIndex] != undefined && selectedArrayList[randomIndex].length != 0){
             let lucky = randomizer(selectedArrayList[randomIndex]);
             if (!luckyTen.includes(lucky)){
                luckyTen.push(lucky);
               //update selected writer data 
                update(lucky);
              }
         }
         length = luckyTen.length;
     }
  }

  return luckyTen;
  totalTales = getTotalTales(uniqueModifiedArray, 1)
}
}


let finalData = [];
for(let i=1;i<30;i++){
  let luckyTen = getLuckyTen(selectedArrayList);
  finalData.push({ 'date': i , 'published': luckyTen});
}
res.status(200).json({
  message: "Tales chance retrieved successfully!",
  tales: finalData
});
  console.log(finalData)
  /*Tale.find({'writer_id': {$in : finalData[0].published}}).then(data => {
    res.status(200).json({
      message: "Tales chance retrieved successfully!",
      tales: data
    });
  });*/
});

router.get("/status", (req, res, next) => {
  Tale.find({'earning': { $gt: 0}}).then(data => {
     let count = data;
     console.log("published",count)
    res.status(200).json({
      message: "Published tales retrieved successfully!",
      tales: data
    });
  });
});



module.exports = router;