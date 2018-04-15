/*
tegaki.jsで入力されたスクロールからgetするjs

1.DB->TP
ストロークごとに呼び出し,予測候補を取って来る
key -> word1~3 を呼び出す

2.DB->TP
文字選択ごとに呼び出し,先の候補を取って来る
key -> text1~3 を呼び出す
*/

//処理は中に書きたい
function getDB_TP(key){

  var defer = new $.Deferred;

    //jsondataはobjectがいいらしい
    //送るのはスクロールから得られた有力文字(単語)をkeyで関数で受け取りpost
    var send_data = {
      key : key
    };

    //console.log(send_data);

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'searchTP.php',
		dataType: 	'json',
		data: send_data,
		success: function(data){	// 通信に成功した場合の処理

      defer.resolve(data);

		},
		complete: function() {	// 通信を終了した場合の処理（成功・失敗問わず）


		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {	// 通信に失敗した場合の処理

			console.log('\n通信に失敗しました。\nXMLHttpRequest : ' + XMLHttpRequest.status + '\ntextStatus : ' + textStatus + '\nerrorThrown : ' + errorThrown.message +'\n');

		}
	});
  return defer.promise();
}
