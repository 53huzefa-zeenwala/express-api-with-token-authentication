exports.success = (message, results, statusCode) => {
    return {
      message,
      error: false,
      code: statusCode,
      body: results,
    };
  };