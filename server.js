/**
 * zhangrenyang
 */
var express=require('express');
var app=express();
app.listen(520);
var bodyParser=require('body-parser');
app.use(bodyParser.json());
var fs=require('fs');
app.use(express.static(__dirname));
app.get('/',function(req,res){
    res.sendFile('./index.html',{root:__dirname})
});

function setStudents(students,callback) {
    fs.writeFile('./students.json',JSON.stringify(students),callback);
}
function getStudents(callback) {
    fs.readFile('./students.json','utf8',function (err,data) {
        var students = [];
        if(err){
            callback(students);//如果有错误默认为空数组
        }else{
            try{
                students = JSON.parse(data);
            }catch(e){
                students = [];
            }
            callback(students);
        }
    });
}

app.get('/students',function(req,res){
    var orderBy = req.query.orderBy;
    var asc = req.query.asc=='asc'?1:-1;
    var keyword = req.query.keyword;
    var pageSize = isNaN(req.query.pageSize)?10:parseInt(req.query.pageSize);
    var pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);
    var result = [];
    getStudents(function(students){

        students = students.filter(function(item){
            // startsWith endsWith includes
            return item.name.includes(keyword);
        }).sort(function(a,b){
            if(typeof a[orderBy] == 'number'){
                return (a[orderBy] - b[orderBy])*asc;
            }else{
                return (a[orderBy].localeCompare(b[orderBy]))*asc;
            }
        });
        var totalPage=Math.ceil(students.length/pageSize);

        students = students.slice((pageNum-1)*pageSize,pageSize*pageNum);

        result.push({orderBy,asc,keyword,pageSize,pageNum,totalPage,students});
        res.send(result);

    })
});
app.post('/students',function(req,res){
    var student=req.body;
   getStudents(function(students){
       console.log(students);
       student.id=students.length?students[students.length-1].id+1:1;
       students.push(student);
       setStudents(students,function(){
           res.send(student)
       })
   })
});
app.get('/students/:id',function(req,res){
    var id = req.params.id;
    getStudents(function (data) {
        var student = data.find(function (item) {
            return item.id == id;
        });
        res.send(student);
    })
});
app.put('/students/:id',function(req,res){
    var id = req.params.id;
    var student = req.body;

    getStudents(function (data) {
        var students = data.map(function (item) {
            if(item.id == id){
                return student
            }else{
                return item
            }
        });
        setStudents(students,function () {
            res.send(student);
        })
    })
});
app.delete('/students/:id',function(req,res){
    var id = req.params.id;
    getStudents(function (data) {
        var students = data.filter(function (item) {
            return item.id!=id;
        });
        setStudents(students,function () {
            res.send({});
        })
    })
});
