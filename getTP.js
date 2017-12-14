/*
tegaki.jsで入力されたスクロールからgetするjs

1.DB->WP
ストロークごとに呼び出し,予測候補を取って来る
key -> word1~3 を呼び出す

2.DB->TP
文字選択ごとに呼び出し,先の候補を取って来る
key -> text1~3 を呼び出す
*/

//処理は中に書きたい
function getDB_TP(key,num){

    //jsondataはobjectがいいらしい
    //送るのはスクロールから得られた有力文字(単語)をkeyで関数で受け取りpost
    var send_data = {
      key : key
    };

    //console.log(send_data);

	// Ajax 通信の実行
	$.ajax({
		type: 		'POST',
		url: 		'searchWP.php',
		dataType: 	'json',
		data: send_data,
		success: function(response){	// 通信に成功した場合の処理

      //undefined
			/*if(typeof response === 'undefined'){
        console.log('\nget success： ' + response.word1);
      }*/

      //受け取って配列に格納する.
      //返すと非同期通信関連の未解決でundefineで返してしまうので、できればこちらで処理したい.
      var get_data = [response.key,response.word1,response.word2,response.word3];

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
      function putPredition (num){
        if(num == 1){
          $('#input_b1a').text(Prediction_1[1]);
          $('#input_b1b').text(Prediction_1[2]);
          $('#input_b1c').text(Prediction_1[3]);
          document.getElementById("input_b1a").style.display = "inline";
          document.getElementById("input_b1b").style.display = "inline";
          document.getElementById("input_b1c").style.display = "inline";
        }
        else if (num == 2) {
          $('#input_b2a').text(Prediction_2[1]);
          $('#input_b2b').text(Prediction_2[2]);
          $('#input_b2c').text(Prediction_2[3]);
          document.getElementById("input_b2a").style.display = "inline";
          document.getElementById("input_b2b").style.display = "inline";
          document.getElementById("input_b2c").style.display = "inline";
        }
        else if (num == 3) {
          $('#input_b3a').text(Prediction_3[1]);
          $('#input_b3b').text(Prediction_3[2]);
          $('#input_b3c').text(Prediction_3[3]);
          document.getElementById("input_b3a").style.display = "inline";
          document.getElementById("input_b3b").style.display = "inline";
          document.getElementById("input_b3c").style.display = "inline";
        }
      }




		},
		complete: function() {	// 通信を終了した場合の処理（成功・失敗問わず）

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {	// 通信に失敗した場合の処理

			console.log('\n通信に失敗しました。\nXMLHttpRequest : ' + XMLHttpRequest.status + '\ntextStatus : ' + textStatus + '\nerrorThrown : ' + errorThrown.message +'\n');

		}
	});
}
