exports.getDate = () => {
    const currentDate = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    return currentDate.toLocaleDateString("vi-VN", options);
};

exports.getDay = function() {
    const currentDate = new Date();
    const options = {
        weekday: "long",
    };
    return currentDate.toLocaleDateString("vi-VN", options);
};

exports.getYear = function() {
    const currentDate = new Date();
    const options = {
        month: "long",
        year: "numeric"
    };
    return currentDate.toLocaleDateString("vi-VN", options);
};