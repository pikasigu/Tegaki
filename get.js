/*
tegaki.jsで入力されたスクロールからgetするjs

1.DB->WP
ストロークごとに呼び出し,予測候補を取って来る
name -> word1~3 を呼び出す

2.DB->TP
文字選択ごとに呼び出し,先の候補を取って来る
name -> text1~3 を呼び出す
*/

//処理は中に書きたい
function getDB(name,num){

    //jsondataはobjectがいいらしい
    //送るのはスクロールから得られた有力文字(単語)をnameで関数で受け取りpost
    var send_data = {
      name : name
    };

    console.log(send_data);

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'searchWP.php',
		dataType: 	'json',
		data: send_data,
		success: function(response){	// 通信に成功した場合の処理

			console.log('\nget success： ' + response.word1);

      //受け取って配列に格納する.
      //返すと非同期通信関連の未解決でundefineで返してしまうので、できればこちらで処理したい.
      var get_data = [response.name,response.word1,response.word2,response.word3];

      //用意してある配列に入れ込む
      //numで代入配列を管理
      if(num == 1){
        Prediction_1 = get_data;
      }else if(num == 2){
        Prediction_2 = get_data;
      }else{
        Prediction_3 = get_data;
      }
      putPredition(num);


      //$("#result").append(get_data[1]);




		},
		complete: function() {	// 通信を終了した場合の処理（成功・失敗問わず）

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {	// 通信に失敗した場合の処理

			console.log('\n通信に失敗しました。\nXMLHttpRequest : ' + XMLHttpRequest.status + '\ntextStatus : ' + textStatus + '\nerrorThrown : ' + errorThrown.message +'\n');

		}
	});
}
