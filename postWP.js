/*
tegaki.jsで入力選択されたものをpost
*/

function postDB_WP(send_data){

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'mkWP.php',
		dataType: 	'json',
		data: send_data,
		success: function(){	// 通信に成功した場合の処理
		},
		complete: function() {	// 通信を終了した場合の処理（成功・失敗問わず）
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {	// 通信に失敗した場合の処理
			//alert('\n通信に失敗しました。\nXMLHttpRequest : ' + XMLHttpRequest.status + '\ntextStatus : ' + textStatus + '\nerrorThrown : ' + errorThrown.message +'\n');
		}
	});
}

/* getした配列から辞書が複数になるように...(ry) */
function post_WP(key,word,flg,Prediction_obj){
  postDB_WP(checkDB_WP(key.slice(0,1),word,flg,Prediction_obj));
}

//Prediction_*とダブっていないか確認する
//ダブっていたらsend_dataの入れ方を変える
//flgでPrediction_*を判断
//Prediction_は配列だった...
//send_dataを返す
function checkDB_WP(key,word,flg,Prediction_obj){
  //keyに対応するのでここでobjを作る
  //jsondataはobjectがいいらしい
  var send_data = {
    key : key
  };

  //spliceの削除先配列
  var remove;

  $.each(Prediction_obj.Prediction, function(i,val){
    if(val === word && i != 0){ //一致する
      remove = Prediction_obj.Prediction.splice(i,1);
    }
  });
  //辞書登録されていない単語,頭に突っ込めばいい
  remove = Prediction_obj.Prediction.splice(1,0,word);
  return fix_send_data(Prediction_obj.Prediction,send_data);

}

//配列を受け取ってsend_dataに詰め込む、send_dataを返したい
//受け取るsend_dataにはkeyだけ入れてある
function fix_send_data(Prediction,send_data){
  for(var i=1;i<11;i++){
    eval("send_data.word" +i+ " = Prediction[" + i +"];");
  }

  return send_data;
}
