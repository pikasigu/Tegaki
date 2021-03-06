/*
tegaki.jsで入力選択されたものをpostするjs

1.DB->TPには認識文字のDBを作成する.
1文字が候補で2文字以上を選択した場合は1文字に対して2文字をDBに
2文字以上であれば,1文字と対象文字に対してDBに

*DBの優先度を考えて,jsのが配列弄りやすそうなのでこっちで調整する.
getで常にDBから予測候補は取ってあるのでそれを弄って送ることにする
(だから,suggestでは極力配列を弄らない方向で...)

2.文字を選んだ後の候補,DB->TPのDBを作成する.
次の文字が入力されるまで入力文字を保持しておいて,繋がるようにDBを作成
*/

function postDB_TP(send_TP){
    //console.log("post : " + key + word);

    //console.log(send_TP);

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'mkTP.php',
		dataType: 	'json',
		data: send_TP,
		success: function(){	// 通信に成功した場合の処理

			// アラートを出力（値が単一の場合）
		 console.log("post success" + send_TP);


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
function post_TP(key,word,Prediction){
  postDB_TP(checkDB_TP(key,word,Prediction));
}

//Prediction_*とダブっていないか確認する
//ダブっていたらsend_TPの入れ方を変える
//flgでPrediction_*を判断
//Prediction_は配列だった...
//send_TPを返す
function checkDB_TP(key,word,Prediction){

  //console.log(key + " :: " + word);

  //keyに対応するのでここでobjを作る
  //jsondataはobjectがいいらしい
  var send_TP = {
    key : "",
    text1 : "",
    text2 : "",
    text3 : "",
  };

  //spliceの削除先配列
  var remove;



    $.each(Prediction, function(i,val){
      if(val === word){ //一致する
        remove = Prediction.splice(i,1);
      }
    });
    //辞書登録されていない単語,頭に突っ込めばいい
    remove = Prediction.splice(1,0,word);
    return fix_send_TP(Prediction,send_TP);
}

//配列を受け取ってsend_TPに詰め込む、send_TPを返したい
//受け取るsend_TPにはkeyだけ入れてある
function fix_send_TP(Prediction,send_TP){
  send_TP.key = Prediction[0];
  send_TP.text1 = Prediction[1];
  send_TP.text2 = Prediction[2];
  send_TP.text3 = Prediction[3];
  return send_TP;
}
