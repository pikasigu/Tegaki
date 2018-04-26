//DBのGUIを追加
$(function(){
$('#post_btn').click(function(e) {
  //name + w1 をpost
  //console.log($('#name').val());
  postDB($('#name').val(),$('#w1').val());
});

$('#get_btn').click(function(e) {
  //nameをpost
  $("#result").text("result : ");
  console.log("start access DB");
  $.when(getDB_WP($('#name').val()))
  .done(function(data){
    if(data){
      $("#result").append(data);
      TableMaker.make(data);
      console.log(data);
    }else{
      $("#result").append("no data");
    }
  });
});
});

class TableMaker{
  static make(json = null){
    if(typeof json === 'string') json = JSON.parse(json);
    if(resultTable.rows.length == 0){
      this.build(Object.keys(json));
    }
    this.build(Object.values(json));
  }

  static build(array){
    let innerStr = '<thead><tr>';
    for(let v of array){
      innerStr += '<td>' + v + '</td>';
    }
    innerStr += '</tr></thead>';
    $('#resultTable').append(innerStr);
  }
}
