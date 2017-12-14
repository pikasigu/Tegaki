//googel suggest API を使用して候補を返す
//値を返すのが面倒なので、ここでボタンの情報書いちゃおうかと
function suggest(word){
  var defer = new $.Deferred;
  $.ajax({
                  url: "http://www.google.com/complete/search",
                  data: {hl:'ja', client:'firefox', q: word},
                  dataType: "jsonp",
                  type: "GET",
                  //成功した場合
                  success :function(data) {
                    defer.resolve(data);
                  }
              });
              return defer.promise();
}
