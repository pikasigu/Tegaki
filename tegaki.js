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


  $("#input_b1a,#input_b1b,#input_b1c,#input_b2a,#input_b2b,#input_b2c,#input_b3a,#input_b3b,#input_b3c").click(function(e){
    pushButton($(this).text());
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
       getPredition(result1,1);
       getPredition(result2,2);
       getPredition(result3,3);


      });

    }

    //input用の候補本体をボタンに入力機能を追加
    $('#input_b1').click(function(e) {
      pushButton(result1);
    });
    $('#input_b2').click(function(e) {
      pushButton(result2);
    });
    $('#input_b3').click(function(e) {
      pushButton(result3);
    });



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

    //予測候補が辞書に含まれるか確認する
    //getDBでDBから文字列を取得する
    /*
    getPredition -> getDB -> putPrediction
    */

    //keyとnumを受け取って,投げる
    function getPredition (key , num){
      getDB(key,num);
    }

    function putPredition (num){
      if(num == 1){
        $('#input_b1a').text(Prediction_1[1]);
        $('#input_b1b').text(Prediction_1[2]);
        $('#input_b1c').text(Prediction_1[3]);
        document.getElementById("input_b1a").style.display = "inline";
        document.getElementById("input_b1b").style.display = "inline";
        document.getElementById("input_b1c").style.display = "inline";
        console.log("success put Prediction : " + Prediction_1);
      }
      else if (num == 2) {
        $('#input_b2a').text(Prediction_2[1]);
        $('#input_b2b').text(Prediction_2[2]);
        $('#input_b2c').text(Prediction_2[3]);
        document.getElementById("input_b2a").style.display = "inline";
        document.getElementById("input_b2b").style.display = "inline";
        document.getElementById("input_b2c").style.display = "inline";
      }
      else if (num == 3) {
        $('#input_b3a').text(Prediction_3[1]);
        $('#input_b3b').text(Prediction_3[2]);
        $('#input_b3c').text(Prediction_3[3]);
        document.getElementById("input_b3a").style.display = "inline";
        document.getElementById("input_b3b").style.display = "inline";
        document.getElementById("input_b3c").style.display = "inline";
      }
    }




    //ボタン押下後の動作
    function pushButton (name) {
      $("#input").append(name);
      suggest(name);
      result="";
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
      //続く候補を表示する処理を以下に...
      getTextPrediction(name);

    }

    //続く候補を提示するfunc
    function getTextPrediction(key){
      if(key in textPrediction == true){
        //辞書検索に当たった場合
        //辞書から候補の配列を取得
        var pre_result = textPrediction[key];
        $('#input_b1a').text(pre_result[0]);
        $('#input_b1b').text(pre_result[1]);
        $('#input_b1c').text(pre_result[2]);
        document.getElementById("input_b1a").style.display = "inline";
        document.getElementById("input_b1b").style.display = "inline";
        document.getElementById("input_b1c").style.display = "inline";
      }
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
