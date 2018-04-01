
var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me = true; 		//玩家True，AI False
context.strokeStyle = "#BFBFBF";
var logo = new Image();
logo.src = "image/unb.png"
var wins = []; 		//赢法数组，三维，棋盘+赢
var MyWin = []; 	//玩家赢法
var AIWin = []; 	//AI赢法
var over = false; 	//是否结束

//棋盘数组，记录落子情况
var chessBoard = [];
for (var i=0; i<15; i++){
	chessBoard[i]=[];
	for (var j=0; j<15; j++){
		chessBoard[i][j]=0;
	}
}

//赢法数组初始化
for (var i=0; i<15; i++){
	wins[i]=[];
	for (var j=0; j<15; j++){
		wins[i][j]=[];
	}
}

var count=0; 	//第几种赢法
//横向判断
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//竖向判断
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//斜向判断
for(var i=0; i<11; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//反斜向判断
for(var i=0; i<11; i++){
	for(var j=14; j>3; j--){
		for(var k=0; k<5; k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
console.log("count: " + count);

//玩家AI数组初始化
for(var i=0; i<count; i++){
	MyWin[i] = 0;
	AIWin[i] = 0;
}

//水印加载完成后，画棋盘和水印
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();
	//drawCycle();
	//oneStep(3,4,true);
	//oneStep(5,6,false);
}

//画格子
var drawChessBoard = function(){
	for (var i=0; i<15; i++)
	{
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		context.stroke(); 	//描边绘制
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
		context.stroke(); 	//绘制
	}
}

//落子绘制棋子（输入坐标，回合）
var oneStep = function(i, j, me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI); 	//(坐标，半径，0到2π)
	context.closePath();
	var gradient = context.createRadialGradient(15+i*30+2,15+j*30+2,10, 15+i*30+2,15+j*30+2,0); //绘制渐变，俩园位置和半径
	if (me){
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	}else{
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");		
	}

	context.fillStyle = gradient;
	context.fill(); 	//填充
}

//鼠标事件
chess.onclick = function(e){
	if (over == true)
	{
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	//alert("x=" + i + ", y=" + j);
	if (chessBoard[i][j] == 0){
		oneStep(i,j,me);
		chessBoard[i][j]=1;
		/*
		if (me){
			chessBoard[i][j]=1;
		}else{
			chessBoard[i][j]=2;
		}
		me = !me;
		*/
		//使用赢法数组判断输赢
		for(var k=0; k<count; k++){
			if(wins[i][j][k]){
				MyWin[k]++;
				AIWin[k]=9;
				if(MyWin[k] == 5){
					window.alert("Player Win!!!");
					over = true;
				}
			}
		}
		
		if (over == false){
			me = !me;
			AITurn();
		}
	}
}

var AITurn = function() {
	var PlayerScore = [];
	var AIScore = [];
	var max = 0;
	var u=0, v=0;
	//玩家和AI的打分数组
	for (var i=0; i<15; i++){
		PlayerScore[i] = [];
		AIScore[i] = [];
		for (var j=0; j<15; j++){
			PlayerScore[i][j] = 0;
			AIScore[i][j] = 0;
		}
	}
	
	for (var i=0; i<15; i++){
		for (var j=0; j<15; j++){
			if(chessBoard[i][j] == 0){ 	//如果当前位置可以落子
				for (var k=0; k<count; k++){ 	//遍历所有赢法
					if (wins[i][j][k]){
						if(MyWin[k] == 1){
							PlayerScore[i][j] += 200;
						}else if(MyWin[k] == 2){
							PlayerScore[i][j] += 400;
						}else if(MyWin[k] == 3){
							PlayerScore[i][j] += 2000;
						}else if(MyWin[k] == 4){
							PlayerScore[i][j] += 20000;
						}

						if(AIWin[k] == 1){
							AIScore[i][j] += 220;
						}else if(AIWin[k] == 2){
							AIScore[i][j] += 420;
						}else if(AIWin[k] == 3){
							AIScore[i][j] += 2200;
						}else if(AIWin[k] == 4){
							AIScore[i][j] += 40000;
						}
					}
				}
				//循环所有赢法后算出最高分的 坐标
				if (PlayerScore[i][j] >= max){
					max = PlayerScore[i][j];
					u = i;
					v = j;
				}else if (PlayerScore[i][j]==max && AIScore[i][j] > AIScore[u][v]){
					u = i;
					v = j;
				}
				if (AIScore[i][j] >= max){
					max = AIScore[i][j];
					u = i;
					v = j;
				}else if (AIScore[i][j]==max && PlayerScore[i][j] > PlayerScore[u][v]){
					u = i;
					v = j;
				}
			}
		}
	}
	oneStep(u,v,me);
	chessBoard[u][v] = 2;	
	
	//使用赢法数组判断输赢
	for(var k=0; k<count; k++){
		if(wins[u][v][k]){
			AIWin[k]++;
			MyWin[k]=9;
			if(AIWin[k] == 5){
				window.alert("AI Win!!!");
				over = true;
			}
		}
	}
	if (over == false){
		me = !me;
	}
	
}



