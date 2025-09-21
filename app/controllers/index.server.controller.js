exports.index = async function (req, res, next) {
    res.json({ message: 'Welcome to Invoice Services : ' + new Date().toString() });
}