/* Google CGI を使って変換候補を捻り出す */
function CGI(word , index , num){ //word:cgiをリクするためのword index:undefinedの配列 num:Predictionの数
  $.ajax({
                  url: "http://www.google.com/transliterate",
                  data: {
                    langpair: 'ja-Hira|ja',
                      jsonp: 'callback',
                      text: word
                    },
                  dataType: "jsonp",
                  jsonpCallback: 'callback',
                  //成功した場合
                  success :function(data) { //data[0][1]
                    //console.log(data[0][1]);
                    if(num == 1){
                      $.each(index,function(i,val){

                      });
                      Prediction_1[index] = data[0][1][index];
                    }
                    if (num == 2) {
                      $.each(index,function(i,val){

                      });
                      Prediction_2[index] = data[0][1][index];
                    }
                    if (num == 3) {
                      $.each(index,function(i,val){

                      });
                      Prediction_3[index] = data[0][1][index];
                    }
                    //console.log(Prediction);
                  }
              });
}
