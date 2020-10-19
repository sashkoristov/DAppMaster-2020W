'use strict';

var external = require('./external');

exports.fraction = async function (ev, res) {
    var from = parseInt(ev.params.from);
    var to = parseInt(ev.params.to);
    var num_queens = parseInt(ev.params.num_queens);
    var solutions = 0;
    for(var iter = from; iter < to; iter++){
        var code = iter;
        var queen_rows = [];
        for(var i = 0; i < num_queens; i++){
            queen_rows[i] = code % num_queens;
            code = Math.floor(code/num_queens);
        }
        if(external.acceptable(num_queens, queen_rows)){
            solutions += 1;
            console.log("Found valid placement: ", queen_rows);
        }
    }
    var result = { "solutions": solutions };
    return result;
}


var args = process.argv;
if(args.length > 2){
    var num_queens = parseInt(args[2]);
    var from = parseInt(args[3]);
    var to = parseInt(args[4]);
    console.log("Running for placement range ", from, " to ", to);
    this.fraction({ params: { from: from, to: to, num_queens: num_queens } })
        .then(console.log)
} else {
    console.log("USAGE: node index.js NUM_QUEENS FROM TO");
}