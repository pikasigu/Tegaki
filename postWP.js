/*
tegaki.jsで入力選択されたものをpostするjs

1.DB->WPには認識文字のDBを作成する.
1文字が候補で2文字以上を選択した場合は1文字に対して2文字をDBに
2文字以上であれば,1文字と対象文字に対してDBに

*DBの優先度を考えて,jsのが配列弄りやすそうなのでこっちで調整する.
getで常にDBから予測候補は取ってあるのでそれを弄って送ることにする
(だから,suggestでは極力配列を弄らない方向で...)

2.文字を選んだ後の候補,DB->TPのDBを作成する.
次の文字が入力されるまで入力文字を保持しておいて,繋がるようにDBを作成
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
//よーするに辞書がダブらないように突っ込むためのなんか
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
