//DBあたりのテスト用
//一応テスト成功
$(function(){
$('#post_btn').click(function(e) {
  //name + w1 をpost
  //console.log($('#name').val());
  postDB($('#name').val(),$('#w1').val());
});

$('#get_btn').click(function(e) {
  //nameをpost
  getDB($('#get').val());

});
});
