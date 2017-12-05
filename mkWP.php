<?php
/*
name + word1~3 を受け取ってDBに突っ込む
*/

//ヘッダーの設定
// POST値を取得して変数へ代入
$name = filter_input(INPUT_POST, 'name');
$word1 = filter_input(INPUT_POST, 'word1');
$word2 = filter_input(INPUT_POST, 'word2');
$word3 = filter_input(INPUT_POST, 'word3');
//送信用に配列に格納
$data = array(
  "name" => $name,
  "word1" => $word1,
  "word2" => $word2,
  "word3" => $word3,
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
  $stmt = $pdo -> prepare("INSERT INTO WordPrediction (name, word1, word2, word3 ) VALUES (:name, :word1, :word2, :word3)");
  //型名指定
	$stmt->bindParam(':name', $name, PDO::PARAM_STR);
	$stmt->bindParam(':word1', $word1, PDO::PARAM_STR);
  $stmt->bindParam(':word2', $word2, PDO::PARAM_STR);
	$stmt->bindParam(':word3', $word3, PDO::PARAM_STR);
  $stmt->execute(); //実行

}catch (PDOException $e) {
	// UTF8に文字エンコーディングを変換します
	echo mb_convert_encoding($e->getMessage(),'UTF-8','SJIS-win');
}
// 接続を閉じる
$pdo = null;

//出力なし
?>
