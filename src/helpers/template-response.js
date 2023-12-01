const templateResponse = (status, message, data) => {
  return {
    status,
    message,
    data,
  };
};

module.exports = {
  templateResponse,
};
