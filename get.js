/*
tegaki.jsで入力されたスクロールからgetするjs

1.DB->WP
ストロークごとに呼び出し,予測候補を取って来る
name -> word1~3 を呼び出す

2.DB->TP
文字選択ごとに呼び出し,先の候補を取って来る
name -> text1~3 を呼び出す
*/


function getDB(name){

    //jsondataはobjectがいいらしい
    //送るのはスクロールから得られた有力文字(単語)をnameで関数で受け取りpost
    var send_data = {
      name : name
    };

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'searchWP.php',
		dataType: 	'json',
		data: send_data,
		success: function(response){	// 通信に成功した場合の処理

			console.log('\nget success： ' + response.word1);

      //受け取って配列に格納し,返す
      var get_data = [response.name,response.word1];
      //console.log(get_data[1]);
      $("#result").append(get_data[1]);


		},
		complete: function() {	// 通信を終了した場合の処理（成功・失敗問わず）

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {	// 通信に失敗した場合の処理

			console.log('\n通信に失敗しました。\nXMLHttpRequest : ' + XMLHttpRequest.status + '\ntextStatus : ' + textStatus + '\nerrorThrown : ' + errorThrown.message +'\n');

		}
	});
}
