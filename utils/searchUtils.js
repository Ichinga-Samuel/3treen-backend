
function queryFormater(query){
    const stopWords = ['the', 'and', "your", 'you', 'our', 'when', 'what', 'where', 'ours', 'yours', 'a', 'an', 'any', 'be', 'but', 'can', 'did', 'do', 'had', 'has', 'have', 'in', 'about',
        'me', 'around', 'for', 'from', 'out', 'over', 'below', 'by', 'under', 'ok', 'only', 'once', 'above', 'before', 'after', 'to', 'on', 'was', 'some', 'such', 'it', 'is', 'she', 'him', 'how',
        'so', 'are', 'he', 'at']
    // split query to different words of length 3 and above
    let queries = query.toLocaleLowerCase().split(' ').filter(q => !stopWords.includes(q))
    queries.sort((a, b) => b.length - a.length);
    queries.unshift(query);
    queries = queries.join('|');
    return new RegExp(`${queries}`, 'i')
}

function searchRanker(query, results){
    results.sort((a, b) => jaccardSimillarity(b, query) - jaccardSimillarity(a, query))
    // return results
}

function jaccardSimillarity(product, word){
    try{
        // rank by name
        let set1 = new Set(word.split(' '))
        let set2 = new Set(product.name.split(' '))
        let union = new Set([...set1, ...set2])
        let inter = new Set([...set1].filter(x => set2.has(x)))
        let name = (inter.size / union.size) * 5

        // rank by description
        set2 = new Set(product.description.split(' '))
        union = new Set([...set1, ...set2])
        inter = new Set([...set1].filter(x => set2.has(x)))
        let description = (inter.size / union.size) * 3

        // rank by specs
        set2 = new Set(product.specification.split(' '))
        union = new Set([...set1, ...set2])
        inter = new Set([...set1].filter(x => set2.has(x)))
        let spec = (inter.size / union.size) * 3

        // rank by features
        set2 = new Set(product.keyFeatures.split(' '))
        union = new Set([...set1, ...set2])
        inter = new Set([...set1].filter(x => set2.has(x)))
        let keyfeat = (inter.size / union.size) * 3

        return name + description + keyfeat + spec
    }
    catch (e){
        return 1
    }
}

module.exports = {queryFormater, searchRanker}
