<?php
/*
name + text1~3 を受け取ってDBに突っ込む
*/

//ヘッダーの設定
// POST値を取得して変数へ代入
$key = filter_input(INPUT_POST, 'key');
$text1 = filter_input(INPUT_POST, 'text1');
$text2 = filter_input(INPUT_POST, 'text2');
$text3 = filter_input(INPUT_POST, 'text3');
//送信用に配列に格納
$data = array(
  "key" => $key,
  "text1" => $text1,
  "text2" => $text2,
  "text3" => $text3,
);

//DB処理を突っ込む
//DB接続情報
$dsn = 'mysql:host=mysql131.phy.lolipop.lan;dbname=LAA0977378-tegaki;charset=utf8';
$username = 'LAA0977378';
$password = 'yuyusama1675';
//DBに入れる
try{
  //PDOインスタンス生成
  $pdo = new PDO($dsn,$username,$password);
  //INSERT内容は配列から引用
  //INSERT文 Tabel = Tegaki
  //$stmt = $pdo -> prepare("INSERT INTO textPrediction (W_key, text1, text2, text3 ) VALUES (:key, :text1, :text2, :text3)");

  //なければINSERTあればUPDATA
  $sql ="delete from TextPrediction where T_key='$key'";
  $stmt = $pdo -> query($sql);
  $sql ="INSERT INTO TextPrediction (T_key, text1, text2, text3) VALUES ('$key', '$text1', '$text2', '$text3')";
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
