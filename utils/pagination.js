const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports={
    paginateProductByTen:(data,page,limit)=>{

        let startIndex = (page -1) * limit;
        
        let endIndex = page * limit;

        let result ={}

        if(endIndex < data.length)
        result.next ={
            pg:page + 1,
            lim:limit
        }

        if(startIndex > 0){
            result.prev = {
                pg:page - 1,
                lim:limit
            }

        }

        console.log(data)
        result.result = data.slice(startIndex,endIndex);

        return result
    }
}