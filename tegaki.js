(function(){
  window.onload = function(){
    var canvas = document.getElementById('mycanvas');
    if(!canvas || !canvas.getContext){
      return false;
    }
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 5;

    //マウスの座標を取得
    var mouse = {
      startX: 0,
      startY: 0,
      getX: 0,
      getY: 0,
      x: 0,
      y: 0,
      color: "black",
      isDrawing: false
    };

    //touchの座標を取得
    var pos = {
      startX: 0,
      startY: 0,
      getX: 0,
      getY: 0,
      x: 0,
      y: 0,
      color: "black",
      isDrawing: false
    }
    var borderWidth = 1;

    var startTime;
    var endTime;

    var result;
    var i = 0;
    var Timer = 0;

    var oldpost;

    var Old_key = "";
    var T_Prediction =[];

    // text yo be sent
    var text = {
      'app_version' : 0.4,
      'api_level' : '537.36',
      'device' : window.navigator.userAgent,
      'input_type' : 0,
      'options' : 'enable_pre_space',
      'requests' : [ {
        'writing_guide' : {
          'writing_area_width' : canvas.width, // canvas width
          'writing_area_height' : canvas.height, // canvas height
        },
        'pre_context' : '', // confirmed preceding chars
        'max_num_results' : 1,
        'max_completions' : 0,
        'ink' : []
      } ]
    };

    // 予測候補の配列
    var Prediction_1,Prediction_2,Prediction_3;

    canvas.addEventListener("mousemove", function(e){
      //マウスが動いたら座標値を取得
      var rect = e.target.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - borderWidth;
      mouse.y = e.clientY - rect.top - borderWidth;

      //isDrawがtrueのとき描画
      if (mouse.isDrawing){
        ctx.beginPath();
        ctx.moveTo(mouse.startX, mouse.startY);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = mouse.color;
        ctx.stroke();
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        setInterval(getPoint(),20);
      }
    });

    canvas.addEventListener("touchmove", function(e){
      var post = getPosT(e);
      if (pos.isDrawing){
        ctx.beginPath();
        ctx.moveTo(oldpost.x, oldpost.y);
        ctx.lineTo(post.x, post.y);
        ctx.strokeStyle = pos.color;
        ctx.stroke();
        oldpost = post;
        setInterval(getPos(),20);
      }
    });

    //以前の点(getXY)を保持し、かつ今回のストローク分を配列に入れ込む
    //Timerも更新しておく
    function getPoint(){
      endTime = new Date();
      //inkに突っ込む
      text.requests[0].ink[i][0].push(mouse.x); //xを突っ込む
      text.requests[0].ink[i][1].push(mouse.y); //yを突っ込む
      text.requests[0].ink[i][2].push((endTime - startTime)/1000); //timeを突っ込む
      mouse.getX = mouse.x;
      mouse.getY = mouse.y;
      //Timer = endTime;
    }

    function getPos(){
      endTime = new Date();
      //inkに突っ込む
      text.requests[0].ink[i][0].push(oldpost.x); //xを突っ込む
      text.requests[0].ink[i][1].push(oldpost.y); //yを突っ込む
      text.requests[0].ink[i][2].push((endTime - startTime)/1000); //timeを突っ込む
      //Timer = endTime;
    }

    //マウスを押したら、描画OK(myDrawをtrue)
    canvas.addEventListener("mousedown", function(e){
      startTime = new Date();
      //Timer = startTime;
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      //初期点かつ分岐点
      mouse.getX = mouse.x;
      mouse.getY = mouse.y;
      mouse.isDrawing = true;
      //初期点をinkに突っ込んでおく
      //iはストローク数
      text.requests[0].ink[i] = ([[mouse.x],[mouse.y],[0]]);
    });

    //6.マウスを上げたら、描画禁止(myDrawをfalse)
    canvas.addEventListener("mouseup", function(e){
      //endTime = new Date();
      mouse.secondX = mouse.x;
      mouse.secondY = mouse.y;
      mouse.isDrawing = false;
      i++;
      setTimeout(getResult(),3000);

    });
    canvas.addEventListener("touchstart", function(e){
      e.preventDefault();
      startTime = new Date();
      //Timer = startTime;
      oldpost = getPosT(e);
      pos.startX = oldpost.x;
      pos.startY = oldpost.y;
      //初期点かつ分岐点
      pos.isDrawing = true;
      text.requests[0].ink[i] = ([[oldpost.x],[oldpost.y],[0]]);
    });

    //マウスを上げたら、描画禁止(myDrawをfalse)
    canvas.addEventListener("touchend", function(e){
      endTime = new Date();
      //pos.secondX = pos.x;
      //pos.secondY = pos.y;
      pos.isDrawing = false;
      i++;
      //console.log(text.requests[0].ink);
      setTimeout(getResult(),3000);
    });


  $('#inputbtn').click(function(e) {
    $("#input").append(result1);
    result="";
    $("#info").text("");
    text.requests[0].ink = [];
    ctx.clearRect(0,0,canvas.width,canvas.height);
  });


  $("#input_b1a,#input_b1b,#input_b1c").click(function(e){
    pushButton($(this).text(),1);
  });
  $("#input_b2a,#input_b2b,#input_b2c").click(function(e){
    pushButton($(this).text(),2);
  });
  $("#input_b3a,#input_b3b,#input_b3c").click(function(e){
    pushButton($(this).text(),3);
  });



    $('#clear').click(function(e) {
      $("#info").text("");
      result="";
      text.requests[0].ink = [];
      ctx.clearRect(0,0,canvas.width,canvas.height);
    });


    function scrollX(){return document.documentElement.scrollLeft || document.body.scrollLeft;}
    function scrollY(){return document.documentElement.scrollTop || document.body.scrollTop;}

    //google手書き認識API
    function getResult(){
      $.ajax({
        url : 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit&amp;app=demopage',
        method : 'POST',
        contentType : 'application/json',
        data : JSON.stringify(text),
        dataType : 'json',
      }).done(function(json) {
        //console.log(json);

        //有力候補を上から3つ所持する
        result1 = json[1][0][1][0];
        result2 = json[1][0][1][1];
        result3 = json[1][0][1][2];

       //最有力候補
       //$("#info").text(result1);

       //入力予測のボタンを提示
       //とりあえず,候補3つを提示
       //$('#input_buttons').empty();
       document.getElementById("input_b1").style.display = "inline";
       document.getElementById("input_b2").style.display = "inline";
       document.getElementById("input_b3").style.display = "inline";
       $('#input_b1').text(result1);
       $('#input_b2').text(result2);
       $('#input_b3').text(result3);

       document.getElementById("input_b1a").style.display = "none";
       document.getElementById("input_b1b").style.display = "none";
       document.getElementById("input_b1c").style.display = "none";
       document.getElementById("input_b2a").style.display = "none";
       document.getElementById("input_b2b").style.display = "none";
       document.getElementById("input_b2c").style.display = "none";
       document.getElementById("input_b3a").style.display = "none";
       document.getElementById("input_b3b").style.display = "none";
       document.getElementById("input_b3c").style.display = "none";



       //予測候補をプラスで追加する getPredition(key,num)
       getPredition();

       //辞書取得を完了を確認してからCGI取得を行いたい
       //Predictionを全て埋めてからputPreditionする.
       //putPredition();


      });

    }

        //予測候補が辞書に含まれるか確認する
        //getDBでDBから文字列を取得する
        /*
        getPredition -> getDB -> putPrediction
        */
        //keyとnumを受け取って,投げる
        function getPredition (){
          //undefined用の空きを確認するobj
          var cgi_num = {
            Prediction_1 : [],
            Prediction_2 : [],
            Prediction_3 : []
          };

          var requests = [
            { param: { key: result1 } },
            { param: { key: result2 } },
            { param: { key: result3 } }
          ];

          //console.log(requests);

          $.when(
            getDB_WP(requests[0].param.key),
            getDB_WP(requests[1].param.key),
            getDB_WP(requests[2].param.key))
            .done(function(data_1,data_2,data_3){
              if(data_1){
                Prediction_1 = [data_1.W_key,data_1.word1,data_1.word2,data_1.word3];
              }else{
                Prediction_1 = [result1,"","",""];
              }
              if(data_2){
                Prediction_2 = [data_2.W_key,data_2.word1,data_2.word2,data_2.word3];
              }else{
                Prediction_2 = [result2,"","",""];
              }
              if(data_3){
                Prediction_3 = [data_3.W_key,data_3.word1,data_3.word2,data_3.word3];
              }else{
                Prediction_3 = [result3,"","",""];
              }
              //console.log(Prediction_1);
              //console.log(Prediction_2);
              //console.log(Prediction_3);
              undefined_Preiction(Prediction_1,1,cgi_num);
              undefined_Preiction(Prediction_2,2,cgi_num);
              undefined_Preiction(Prediction_3,3,cgi_num);
              //console.log(cgi_num);
              //getCGI(cgi_num);
              get_suggest(cgi_num);
            });



        }

        function undefined_Preiction(get_data,num,cgi_num){ //Predictionの空の場所をobjに入れる
          $.each(get_data, function(i,val){
            //console.log(i + " : " + num + " :: " + val);
            if(val === ""){ //undefinedであれば実行,値が既にあれば実行しない
              if(i != 0){ //Prediction_*のkeyに突っ込む i:配列の番号,num:Predictionの数
                if(num == 1){
                  cgi_num.Prediction_1.push(i);
                }else if(num == 2){
                  cgi_num.Prediction_2.push(i);
                }else{
                  cgi_num.Prediction_3.push(i);
                }
              }
            }
          });
        }


        function getCGI(cgi_num){ //undefineの(空欄)に予測候補(CGI)を詰める
          $.when(
            CGI(get_key(1)),
            CGI(get_key(2)),
            CGI(get_key(3)))
            .done(function(data_1,data_2,data_3){
              //console.log(cgi_num);
              $.each(cgi_num.Prediction_1,function(i,val){
                Prediction_1[val] = data_1[0][1][val-1];
              });
              $.each(cgi_num.Prediction_2,function(i,val){
                Prediction_2[val] = data_2[0][1][val-1];
              });
              $.each(cgi_num.Prediction_3,function(i,val){
                Prediction_3[val] = data_3[0][1][val-1];
              });
              putPredition();

            });
          //getがundefinedであればgetCGIする.

        }

        function get_suggest(cgi_num){ //undefineの(空欄)に予測候補(CGI)を詰める
          $.when(
            suggest(get_key(1)),
            suggest(get_key(2)),
            suggest(get_key(3)))
            .done(function(data_1,data_2,data_3){
              //console.log(data_1);
              $.each(cgi_num.Prediction_1,function(i,val){
                Prediction_1[val] = data_1[1][val-1];
              });
              $.each(cgi_num.Prediction_2,function(i,val){
                Prediction_2[val] = data_2[1][val-1];
              });
              $.each(cgi_num.Prediction_3,function(i,val){
                Prediction_3[val] = data_3[1][val-1];
              });
              putPredition();

            });
          //getがundefinedであればgetCGIする.

        }

    //input用の候補本体をボタンに入力機能を追加
    $('#input_b1').click(function(e) {
      pushButton(result1,10);
    });
    $('#input_b2').click(function(e) {
      pushButton(result2,20);
    });
    $('#input_b3').click(function(e) {
      pushButton(result3,30);
    });

    function putPredition (){
      //if(num == 1){
        $('#input_b1a').text(Prediction_1[1]);
        $('#input_b1b').text(Prediction_1[2]);
        $('#input_b1c').text(Prediction_1[3]);
        document.getElementById("input_b1a").style.display = "inline";
        document.getElementById("input_b1b").style.display = "inline";
        document.getElementById("input_b1c").style.display = "inline";
      //}
      //else if (num == 2) {
        $('#input_b2a').text(Prediction_2[1]);
        $('#input_b2b').text(Prediction_2[2]);
        $('#input_b2c').text(Prediction_2[3]);
        document.getElementById("input_b2a").style.display = "inline";
        document.getElementById("input_b2b").style.display = "inline";
        document.getElementById("input_b2c").style.display = "inline";
      //}
      //else if (num == 3) {
        $('#input_b3a').text(Prediction_3[1]);
        $('#input_b3b').text(Prediction_3[2]);
        $('#input_b3c').text(Prediction_3[3]);
        document.getElementById("input_b3a").style.display = "inline";
        document.getElementById("input_b3b").style.display = "inline";
        document.getElementById("input_b3c").style.display = "inline";
      //}
    }



    //API送信用のTimeを取得
    function TimerResult(){
      var nTime = new Date();
      if(nTime - endTime > 2000){
        getResult();
      }
    }

    function getPosT (event) {
      var mouseX = event.touches[0].clientX - $(canvas).position().left + scrollX();
      var mouseY = event.touches[0].clientY - $(canvas).position().top + scrollY();
      return {x:mouseX, y:mouseY};
    }

    canvas.addEventListener('mouseleave', function(e){
      mouse.isDrawing = false;
    });


    //flgからkeyを取ってくる
    function get_key(flg){
      if(flg == 1 || flg == 10){
        return result1;
      }else if(flg == 2 || flg == 20){
        return result2;
      }else{
        return result3;
      }
    }

    function get_prediction(flg){
      if(flg == 1 || flg == 10){
        return Prediction_1;
      }else if(flg == 2 || flg == 20){
        return Prediction_2;
      }else{
        return Prediction_3;
      }
    }

    function clear_Prediction(){
      document.getElementById("input_b1").style.display = "none";
      document.getElementById("input_b2").style.display = "none";
      document.getElementById("input_b3").style.display = "none";
      $("#info").text("");
      $('#input_b1').text("");
      $('#input_b2').text("");
      $('#input_b3').text("");
      text.requests[0].ink = [];
      ctx.clearRect(0,0,canvas.width,canvas.height);
      document.getElementById("input_b1a").style.display = "none";
      document.getElementById("input_b1b").style.display = "none";
      document.getElementById("input_b1c").style.display = "none";
      document.getElementById("input_b2a").style.display = "none";
      document.getElementById("input_b2b").style.display = "none";
      document.getElementById("input_b2c").style.display = "none";
      document.getElementById("input_b3a").style.display = "none";
      document.getElementById("input_b3b").style.display = "none";
      document.getElementById("input_b3c").style.display = "none";
    }

    //予測候補が辞書に含まれるか確認する
    //getDBでDBから文字列を取得する
    /*
    getPredition -> getDB -> putPrediction
    */
    //keyとnumを受け取って,投げる
    function get_TextPrediction (word){

      $.when(
        getDB_TP(word))
        .done(function(data){
          //console.log(data);
          if(data){
            T_Prediction = [data.T_key,data.text1,data.text2,data.text3];
          }else{
            T_Prediction = [word,"","",""];
          }
          console.log(T_Prediction);
          $('#input_b1a').text(T_Prediction[1]);
          $('#input_b1b').text(T_Prediction[2]);
          $('#input_b1c').text(T_Prediction[3]);
          document.getElementById("input_b1a").style.display = "inline";
          document.getElementById("input_b1b").style.display = "inline";
          document.getElementById("input_b1c").style.display = "inline";

      });

    }





    //ボタン押下後の動作
    /* flgは辞書に押し込むためのFLG
    *  WPへの登録は文字数が1文字以上かで動きを変える
    *  num + 0:字本体なので1文字であれば登録は無し,2文字以上であれば登録
    *  num:予測文字本体をkeyで登録
    */
    function pushButton (word,flg) {
      var Prediction_obj = {
        Prediction_1: Prediction_1,
        Prediction_2: Prediction_2,
        Prediction_3: Prediction_3
      }
      $("#input").append(word);

      post_WP(get_key(flg),word,flg,Prediction_obj);
      clear_Prediction();

      //console.log(word);
      get_TextPrediction(word);

      if(Old_key != ""){
        post_TP(Old_key,word,T_Prediction);
      }

      Old_key = word;

      $('#input_b2a').text("が");
      $('#input_b2b').text("の");
      $('#input_b2c').text("を");
      document.getElementById("input_b2a").style.display = "inline";
      document.getElementById("input_b2b").style.display = "inline";
      document.getElementById("input_b2c").style.display = "inline";

    }

    //続く候補を提示するfunc
    function put_TextPrediction(Old_key,word,T_Prediction){
      post_TP(Old_key,word);
      //検索に当てはまらなければ,助詞を提示する
      $('#input_b2a').text("が");
      $('#input_b2b').text("の");
      $('#input_b2c').text("を");
      document.getElementById("input_b2a").style.display = "inline";
      document.getElementById("input_b2b").style.display = "inline";
      document.getElementById("input_b2c").style.display = "inline";

    }

  }



})();
