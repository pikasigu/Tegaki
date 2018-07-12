<?php
/*
DBからWPを引っ張り出して,予測候補を返す
GUI用
*/

//ヘッダーの設定
// POST値を取得して変数へ代入
//$key_data = filter_input(INPUT_POST, 'key');

//DB処理を突っ込む
//DB接続情報
$dsn = 'mysql:host=localhost;dbname=Tegaki;charset=utf8';
$username = 'root';
$password = 'yuyusama';
//DBから取り出す
try{
  //PDOインスタンス生成
  $pdo = new PDO($dsn,$username,$password);
//SELECT文
$sql = "SELECT * FROM WordPrediction";
$stmt = $pdo->query($sql);
//echo $sql;
$stmt -> execute(); //実行
//recにfetchで取得
$rec = $stmt->fetchAll(PDO::FETCH_ASSOC);

}catch (PDOException $e) {
	// UTF8に文字エンコーディングを変換します
	echo mb_convert_encoding($e->getMessage(),'UTF-8','SJIS-win');
}
// 接続を閉じる
$pdo = null;

// JSON形式に変換して出力
 echo json_encode($rec);
?>
