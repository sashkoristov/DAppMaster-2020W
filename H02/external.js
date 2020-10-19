'use strict';

const _ = require('lodash')

exports.acceptable = function(num_queens, queen_rows){
    for(var i of _.range(0, num_queens)){
        for(var j of _.range(i + 1, num_queens)){
            if(queen_rows[i] == queen_rows[j]){
                return false;
            }
            if(queen_rows[i] - queen_rows[j] == i - j || queen_rows[i] - queen_rows[j] == j - i){
                return false;
            }
        }
    }
    return true;
}