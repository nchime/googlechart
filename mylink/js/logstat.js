
$(window).load(function () {

$.ajax({
      type: 'post',
      url: '/log/stat',
      data: {
          'referer': document.referrer
      },
      success: function (json) {
          console.log(JSON.stringify(json));
          var retMsg = JSON.parse(JSON.stringify(json));
      },
      error: function (xhr, status, error) {
          console.log(JSON.stringify(error));
          location.href = "/";
      }
  });
}); 