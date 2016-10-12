$('#menu').affix({
  offset: {
    top: 100
  }
})



function slidechange() {
    $("#slide_2").delay(5000).fadeOut(3500);
    $("#slide_2").delay(5000).fadeIn(3500, function() {
        slidechange();
    });
}
slidechange();