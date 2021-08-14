// regex ptan for search
module.exports ={
    escapeRegex:text=>text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
} 