function getFutureMinutes(minutes) {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + minutes * 60000);
  }
  
  function minuteDifference(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return parseInt(
      (Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60)) % 60
    );
  }
  
  module.exports = {
    getFutureMinutes,
    minuteDifference,
  };
  