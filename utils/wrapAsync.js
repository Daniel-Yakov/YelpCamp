module.exports = fn => {
    return function(req, res, next){
        fn(req, res, next).catch(next);
    }
}

// catch(next) is the same as catch(e => next(e))