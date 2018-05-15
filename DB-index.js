//DBのGUIを追加
$(function(){

$('#get_btn').click(function(e) {
  //nameをpost
  $("#result").text("result : ");
  $.when(getDB_WP($('#get_key').val()))
  .done(function(data){
    if(data){
      $("#result").append(data);
      TableMaker.make(data);
    }else{
      $("#result").append("no data");
    }
  });
});
$('#get_all_btn').click(function(e) {
  $("#result").text("result : ");
  $.when(getDB_WP_ALL())
  .done(function(data){
    if(data){
      for(let obj of data){
        TableMaker.make(obj);
      }
    }else{
      $("#result").append("");
    }
  });
});

$("#clear_btn").click(function(){
    // ヘッダ以外の全行を削除
    $('#resultTable').find("tr:gt(0)").remove();
});

$("#post_btn").click(function(){
  let Prediction_obj = {
    Prediction: ""
  }
    $.when(getDB_WP($('#post_key').val()))
      .done(function(data){
        if(data){
          Prediction_obj.Prediction = [data.W_key,data.word1,data.word2,data.word3,data.word4,data.word5,data.word6,data.word7,data.word8,data.word9,data.word10];
        }else{
          Prediction_obj.Prediction = [$("#post_key").val(),"","","","","","","","","",""];
        }
        post_WP($("#post_key").val(),$("#post_word").val(),10,Prediction_obj);
      })
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
