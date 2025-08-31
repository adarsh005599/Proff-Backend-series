// const asyncshendelar = (func) => async(req, res, next) => {
//     try{
//         await func(req, res, next)

//     } catch (error) {
//         res.status(error.code || 5000).json({
//             success: false,
//             massage: error.massage
//         })

//     }
// }

// using Promise

const asyncshendelar = (reqhandler) => {
    return (req, res, next) => {
        Promise.resolve(reqhandler(req, res, next)).catch((error) => next(error));
    };
};

export { asyncshendelar };

