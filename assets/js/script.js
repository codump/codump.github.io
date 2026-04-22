$(window).on('load', function () {
  if (sessionStorage.getItem('loaderShown')) {
    $('#load').show();
    $('#loadtxt1')
      .removeClass('loadOK')
      .delay(1500)
      .queue(function (next) {
        $(this)
          .addClass('loadOK')
          .delay(500)
          .queue(function (next2) {
            $('#loadtxt2 span').css('color', '#00b646');
            $('#loadtxt1').animate({ marginLeft: '7.8rem' }, 500);
            $('#loadtxt2').animate({ marginLeft: '15.8rem' }, 500);
            next2();
          });
        next();
      });

    $('#load').ready(function () {
      $('#progress, #progress2').animate({ width: '20%' }, 500);
    });

    $('#sidebar').ready(function () {
      $('#progress, #progress2').animate({ width: '75%' }, 500);
    });

    $('#main-wrapper').ready(function () {
      $('#progress, #progress2').animate({ width: '100%' }, 500);
      $('#load').delay(3000).fadeOut(200);
    });

    sessionStorage.setItem('loaderShown', 'true');
  }
});
