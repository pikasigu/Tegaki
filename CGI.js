/* Google CGI を使って変換候補を捻り出す */
function CGI(key){ //word:cgiをリクするためのword index:undefinedの配列 num:Predictionの数
  var defer = new $.Deferred;
  $.ajax({
                  url: "http://www.google.com/transliterate",
                  data: {
                    langpair: 'ja-Hira|ja',
                      text: key
                    },
                  dataType: "json",
                  type: 'GET',
                  //成功した場合
                  success :function(data) { //data[0][1]
                    defer.resolve(data);
                  }
              });
              return defer.promise();
}
