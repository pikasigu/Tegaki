/**
*手書き認識の本体部分
*/
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
      color: "blue",
      isDrawing: false
    }
    var borderWidth = 1;

    //Google 手書きAPIの送信用の時間定義
    var startTime;
    var endTime;


    var result;
    var i = 0;
    var Timer = 0;

    var oldpost;



    //TP用の前回の入力と配列
    var Old_key = "";
    var T_Prediction =[];

    //現在のモード,辞書送信のご送信を防ぐ
    var mode = "WP";


    //Google手書き認識APIに投げるための定義
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
    for(var i = 1; i < BUTTON_NUMBER + 1; i++ ){
      myEval("var Prediction_" + i + ";");
      myEval("var W_Prediction_" + i + ";");
      myEval("var result" + i + ";");
    }

    //htmlにボタンを追加
    var inputbtns_text = '';
    for(var i = 1; i < BUTTON_NUMBER + 1; i++){
      inputbtns_text += '<div>';
      inputbtns_text += '<button class="inputbtn ' +  'bline' + i + '" id="input_b' + i + '"></button>'
      for(var  j = 1; j < PREDICTION_NUMBER + 1; j++){
        inputbtns_text += '<button class="inputbtn ' +  'bline' + i + '" id="input_b' + i + '_' + j + '"></button>'
      }
      inputbtns_text += '</div>'
    }
    $('#inputbtns').prepend(inputbtns_text);


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
      //タッチ認識用
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
      //setTimeout(getResult(),3000);
      getResult();

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
      //setTimeout(getResult(),3000);
      getResult();
    });



    //Buttonが押されるとlineのnumberをflgとしてpushButtonを起こす
    for(var i = 1; i < BUTTON_NUMBER + 1 ;i++){
      $(".bline" + i).click(function(e){
        var flg = $(this).attr("id");
        pushButton($(this).text(),flg.slice(7,8));
      })
    }




    $('#clear').click(function(e) {
      $("#info").text("");
      text.requests[0].ink = [];
      ctx.clearRect(0,0,canvas.width,canvas.height);
      clear_Prediction();
      //Old_key = "";
    });

    $('#text_clear').click(function(e) {
      $('#input').text("");
    });
    $('#spacebtn').click(function(e) {
      $('#input').append(" ");
    });
    $('#new_line').click(function(e) {
      $('#input').append("\n");
    });

    new Clipboard('#copybtn');

    function scrollX(){return document.documentElement.scrollLeft || document.body.scrollLeft;}
    function scrollY(){return document.documentElement.scrollTop || document.body.scrollTop;}

    //google手書き認識API
    function getResult(){
      $.ajax({
        url : 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit',
        method : 'POST',
        contentType : 'application/json',
        data : JSON.stringify(text),
        dataType : 'json',
      }).done(function(json) {
        mode = "WP";

        //有力候補を取得する
        for(var i = 1; i < BUTTON_NUMBER + 1 ; i++){
          myEval('result' + i + ' = "' + json[1][0][1][(i-1)] + '";' );
          result = json[1][0][1][(i-1)];
          $('#input_b' + i).text(result);
        }

        $('.particle_btn').css('display','none');

        $('.inputbtn').css('display','inline');

       //予測候補を追加する getPredition(key,num)
       //setTimeout(getPredition,500);
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
          if(pos.isDrawing || mouse.isDrawing){}
          else{

          //undefined用の空きを確認するobj
          //cgi,suggestを使用する場所のobj
          var cgi_num = {};
          var requests = [];

          //cgi_numとrequestsの初期化
          //上手くいかないのでeval使用
          for(var i=1;i < BUTTON_NUMBER + 1;i++){
            eval('cgi_num.Prediction_' + i + ' = [];');
            eval('requests.push({ param: { key: result' + i + '} });');
          }


          var getDB_txt = "";
          var data_txt = "";
          var getDB_pre_txt = "";

          //evalにsetするtextのset
          for(var i=1;i < BUTTON_NUMBER+1;i++){

            //getDB_txt : getDB に渡す,非同期処理を書いてある
            getDB_txt += 'getDB_WP(requests[' + (i-1) + '].param.key)';
            if(i != BUTTON_NUMBER){
              getDB_txt += ',';
            }

            //whenから受け取る形
            data_txt += "data_" + i; //data_1
            if(i != BUTTON_NUMBER){
              data_txt += ',';
            }

            //main処理,受け取ったものを配列に埋め込む
            getDB_pre_txt += "if(data_" + i + "){";
            getDB_pre_txt += "Prediction_" + i + ' = [data_' + i + '.W_key';
            for(var j = 1;j < PREDICTION_NUMBER + 1;j++){
              getDB_pre_txt += ',data_' + i + '.word' + j;
            }
            getDB_pre_txt += '];';
            getDB_pre_txt += "W_Prediction_" + i + ' = [data_' + i + '.W_key';
            for(var j = 1;j < PREDICTION_NUMBER + 1;j++){
              getDB_pre_txt += ',data_' + i + '.word' + j;
            }
            getDB_pre_txt += ']; }else{ ';
            getDB_pre_txt += 'Prediction_' + i + ' = [result' + i;
            for(var j = 1;j < PREDICTION_NUMBER + 1;j++){
              getDB_pre_txt += ',""';
            }
            getDB_pre_txt += '];';
            getDB_pre_txt += 'W_Prediction_' + i + ' = [result' + i;
            for(var j = 1;j < PREDICTION_NUMBER + 1;j++){
              getDB_pre_txt += ',""';
            }
            getDB_pre_txt += '];}';
          }

          for(var j =1;j<BUTTON_NUMBER+1;j++){
            getDB_pre_txt += 'undefined_Preiction(W_Prediction_' + j + ',' + j + ',cgi_num);';

          }

          //残りの取得手法を選択
          //getDB_pre_txt += 'getCGI(cgi_num);'
          getDB_pre_txt += 'get_suggest(cgi_num);'

          eval('$.when(' + getDB_txt + ').done(function(' + data_txt + '){' + getDB_pre_txt + '});');

          }
        }


        function undefined_Preiction(get_data,num,cgi_num){ //Predictionの空の場所をobjに入れる
          $.each(get_data, function(i,val){
            if(val === ""){ //undefinedであれば実行,値が既にあれば実行しない
              if(i != 0){ //Prediction_*のkeyに突っ込む i:配列の番号,num:Predictionの数
                eval('cgi_num.Prediction_' + num + '.push(' + i + ');')
              }
            }
          });
        }


        function getCGI(cgi_num){ //undefineの(空欄)に予測候補(CGI)を詰める
          var getCGI_txt = "";
          var data_txt = "";
          var getCGI_pre_txt = "";

          //evalにsetするtextのset
          for(var i=1;i < BUTTON_NUMBER+1;i++){

            //getCGI_txt : getCGI に渡す,非同期処理を書いてある
            getCGI_txt += 'CGI(get_key(' + i + '))';
            if(i != BUTTON_NUMBER){
              getCGI_txt += ',';
            }

            //whenから受け取る形
            data_txt += "data_" + i; //data_1
            if(i != BUTTON_NUMBER){
              data_txt += ',';
            }


            //main処理,受け取ったものを配列に埋め込む
            getCGI_pre_txt += "$.each(cgi_num.Prediction_" + i + ',function(i,val){';
            getCGI_pre_txt += "Prediction_" + i + '[val] = data_' +i+ '[0][1][val-1];});';

          }

          getCGI_pre_txt += 'putPredition();'

          eval('$.when(' + getCGI_txt + ').done(function(' + data_txt + '){' + getCGI_pre_txt + '});');

          /*
          $.when(
            CGI(get_key(1)),
            CGI(get_key(2)),
            CGI(get_key(3)))
            .done(function(data_1,data_2,data_3){
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

            });*/
          //getがundefinedであればgetCGIする.


        }

        function get_suggest(cgi_num){ //undefineの(空欄)に予測候補(CGI)を詰める
          var getsuggest_txt = "";
          var data_txt = "";
          var getsuggest_pre_txt = "";

          //evalにsetするtextのset
          for(var i=1;i < BUTTON_NUMBER+1;i++){

            //getsuggest_txt : getsuggest に渡す,非同期処理を書いてある
            getsuggest_txt += 'suggest(get_key(' + i + '))';
            if(i != BUTTON_NUMBER){
              getsuggest_txt += ',';
            }

            //whenから受け取る形
            data_txt += "data_" + i; //data_1
            if(i != BUTTON_NUMBER){
              data_txt += ',';
            }


            //main処理,受け取ったものを配列に埋め込む
            getsuggest_pre_txt += "$.each(cgi_num.Prediction_" + i + ',function(i,val){';
            getsuggest_pre_txt += "Prediction_" + i + '[val] = data_' +i+ '[1][val-1];});';

          }

          getsuggest_pre_txt += 'putPredition();'

          eval('$.when(' + getsuggest_txt + ').done(function(' + data_txt + '){' + getsuggest_pre_txt + '});');
          /*
          $.when(
            suggest(get_key(1)),
            suggest(get_key(2)),
            suggest(get_key(3)))
            .done(function(data_1,data_2,data_3){
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

            });*/
          //getがundefinedであればgetCGIする.

        }

    function putPredition (){
      for(var i=1;i<BUTTON_NUMBER+1;i++){
        for(var j=1;j<PREDICTION_NUMBER+1;j++){
          myEval('$("#input_b' +i+ '_' +j+ '").text(Prediction_' +i+ '[' +j+ ']);')
        }
      }
      $('.inputbtn').css('display','inline');
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
      var key = eval('Prediction_' +flg+ '[0];');
      return key;
    }

    function get_prediction(flg){
      var pre = eval('Prediction_' +flg+ ';');
      return pre;
    }

    function clear_Prediction(){
      $('.inputbtn').css('display','none');
      $('.inputbtn').text("");
      text.requests[0].ink = [];
      ctx.clearRect(0,0,canvas.width,canvas.height);
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
          if(data){
            T_Prediction = [data.T_key,data.text1,data.text2,data.text3];
          }else{
            T_Prediction = [word,"","",""];
          }
          $('#input_b1_1').text(T_Prediction[1]);
          $('#input_b1_2').text(T_Prediction[2]);
          $('#input_b1_3').text(T_Prediction[3]);
          document.getElementById("input_b1_1").style.display = "inline";
          document.getElementById("input_b1_2").style.display = "inline";
          document.getElementById("input_b1_3").style.display = "inline";

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
        Prediction: ""
      }

      //文字を入力
      $("#input").append(word);

      $.when(
        getDB_WP(get_key(flg).slice(0,1)))
        .done(function(data){
          //false処理を書く
          if(data){
            Prediction_obj.Prediction = [data.W_key,data.word1,data.word2,data.word3,data.word4,data.word5,data.word6,data.word7,data.word8,data.word9,data.word10];
          }else{
            Prediction_obj.Prediction = [get_key(flg).slice(0,1),"","","","","","","","","",""];
          }
          if(mode == "WP"){
            post_WP(get_key(flg),word,Prediction_obj);
            mode = "TP";
          }
        });


      clear_Prediction();

      get_TextPrediction(word);

      if(Old_key != ""){
        post_TP(Old_key,word,T_Prediction);
      }

      Old_key = word;

      $('.particle_btn').css('display','inline');

    }

    //続く候補を提示するfunc
    function put_TextPrediction(Old_key,word,T_Prediction){
      post_TP(Old_key,word);
      //検索に当てはまらなければ,助詞を提示する
      $('.particle_btn').css('display','inline');

    }

    //特定の文字は文章の続きとして提示する
    $('#input_ga').click(function(e){
      push_particle("が")
    });
    $('#input_no').click(function(e){
      push_particle("の")
    });
    $('#input_wo').click(function(e){
      push_particle("を")
    });
    $('#input_ni').click(function(e){
      push_particle("に")
    });
    $('#input_he').click(function(e){
      push_particle("へ")
    });

    function push_particle(word){
      //文字を入力
      $("#input").append(word);
    }

    //実行関数
    function myEval(expr){
      Function(expr)();
    }

  }

})();
