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

function postDB(name,word){

    //jsondataはobjectがいいらしい
    var send_data = {
      name : name,
      word1 : word,
      word2 : "",
      word3 : "",
    };

    //console.log("post : " + name + word);

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'mkWP.php',
		dataType: 	'json',
		data: send_data,
		success: function(){	// 通信に成功した場合の処理

			// アラートを出力（値が単一の場合）
		 console.log("post success");


		},
		complete: function() {	// 通信を終了した場合の処理（成功・失敗問わず）

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {	// 通信に失敗した場合の処理

			alert('\n通信に失敗しました。\nXMLHttpRequest : ' + XMLHttpRequest.status + '\ntextStatus : ' + textStatus + '\nerrorThrown : ' + errorThrown.message +'\n');

		}
	});
}
