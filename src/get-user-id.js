var uuidV4 = require("uuid/v4");

module.exports = function getUserId() {
  var userId = window.localStorage.getItem("userId");
  if (!userId) {
    userId = uuidV4();
    window.localStorage.setItem("userId", userId);
  }
  return userId;
};
