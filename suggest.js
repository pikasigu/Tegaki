//googel suggest API を使用して候補を返す
//値を返すのが面倒なので、ここでボタンの情報書いちゃおうかと
function suggest(word , num){
  $.ajax({
                  url: "http://www.google.com/complete/search",
                  data: {hl:'ja', client:'firefox', q: word},
                  dataType: "jsonp",
                  type: "GET",
                  //成功した場合
                  success :function(data) {
                    if(num == 1){
                      $('#input_b1a').text(data[1][0]);
                      $('#input_b1b').text(data[1][1]);
                      $('#input_b1c').text(data[1][2]);
                      document.getElementById("input_b1a").style.display = "inline";
                      document.getElementById("input_b1b").style.display = "inline";
                      document.getElementById("input_b1c").style.display = "inline";
                    }
                    if (num == 2) {
                      $('#input_b2a').text(data[1][0]);
                      $('#input_b2b').text(data[1][1]);
                      $('#input_b2c').text(data[1][2]);
                      document.getElementById("input_b2a").style.display = "inline";
                      document.getElementById("input_b2b").style.display = "inline";
                      document.getElementById("input_b2c").style.display = "inline";
                    }
                    if (num == 3) {
                      $('#input_b3a').text(data[1][0]);
                      $('#input_b3b').text(data[1][1]);
                      $('#input_b3c').text(data[1][2]);
                      document.getElementById("input_b3a").style.display = "inline";
                      document.getElementById("input_b3b").style.display = "inline";
                      document.getElementById("input_b3c").style.display = "inline";
                    }
                  }
              });
}
