<?php
/*
name + word1~3 を受け取ってDBに突っ込む
*/

//ヘッダーの設定
// POST値を取得して変数へ代入
$key = filter_input(INPUT_POST, 'key');
$word1 = filter_input(INPUT_POST, 'word1');
$word2 = filter_input(INPUT_POST, 'word2');
$word3 = filter_input(INPUT_POST, 'word3');
$word4 = filter_input(INPUT_POST, 'word4');
$word5 = filter_input(INPUT_POST, 'word5');
$word6 = filter_input(INPUT_POST, 'word6');
$word7 = filter_input(INPUT_POST, 'word7');
$word8 = filter_input(INPUT_POST, 'word8');
$word9 = filter_input(INPUT_POST, 'word9');
$word10 = filter_input(INPUT_POST, 'word10');
//送信用に配列に格納
$data = array(
  "key" => $key,
  "word1" => $word1,
  "word2" => $word2,
  "word3" => $word3,
  "word4" => $word4,
  "word5" => $word5,
  "word6" => $word6,
  "word7" => $word7,
  "word8" => $word8,
  "word9" => $word9,
  "word10" => $word10
);

//DB処理を突っ込む
//DB接続情報
$dsn = 'mysql:host=localhost;dbname=Tegaki;charset=utf8';
$username = 'root';
$password = 'yuyusama';
//DBに入れる
try{
  //PDOインスタンス生成
  $pdo = new PDO($dsn,$username,$password);
  //INSERT内容は配列から引用
  //INSERT文 Tabel = Tegaki
  //$stmt = $pdo -> prepare("INSERT INTO WordPrediction (W_key, word1, word2, word3 ) VALUES (:key, :word1, :word2, :word3)");

  //なければINSERTあればUPDATA
  $sql ="delete from WordPrediction where W_key='$key'";
  $stmt = $pdo -> query($sql);
  $sql ="INSERT INTO WordPrediction (W_key, word1, word2, word3,word4, word5, word6,word7, word8, word9,word10) VALUES ('$key', '$word1', '$word2', '$word3','$word4', '$word5', '$word6','$word7', '$word8', '$word9','$word10')";
  $stmt = $pdo -> query($sql);
  //var_dump($stmt);
  //$stmt->execute(); //実行

}catch (PDOException $e) {
	// UTF8に文字エンコーディングを変換します
	echo mb_convert_encoding($e->getMessage(),'UTF-8','SJIS-win');
}
// 接続を閉じる
$pdo = null;

//出力なし
?>
