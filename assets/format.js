console.log("-----");

let jsonData; // data.jsonから取り込んだデータ
let elemMenubar = $('menubar'); // メニューバーの要素
let pageName = elemMenubar.innerText; // ページ名
let userdata = new Object(); // ユーザーをIDで並べたもの
let elemNotes = $('notes') ?? undefined;
let showNoteNum;
if(elemNotes != undefined){
	showNoteNum = elemNotes.innerText.split(',', 2);
	showNoteNum[0] = Number(showNoteNum[0]);
	showNoteNum[1] = Number(showNoteNum[1]);
	console.log(showNoteNum);
}
let noteCount;

buildCommonPart();
console.log(pageName);
if(pageName == 'TOP' || pageName == 'メンバー一覧' || pageName == '投稿'){
	window.onload = function(){
		getJSON();

		//投稿を構成する
		if(elemNotes != undefined){
			noteCount = jsonData.n.length;
			let elemNoteViewPosition = $('noteViewPosition') ?? undefined
			if(elemNoteViewPosition != null) elemNoteViewPosition.innerText = showNoteNum[0] + 1 + '件目～' + Math.min(showNoteNum[0] + showNoteNum[1], noteCount) + '件目を表示中 / 全' + noteCount + '件';
			buildNotes();
		} 

		// メンバー一覧を構成する
		let elemMenbers = $('members') ?? undefined;
		if(elemMenbers != undefined){
			let htmlMembers = '';
			for(let i = 0; i < jsonData.u.length; i++){
				let colors = [jsonData.u[i].c[0] ?? 'white', jsonData.u[i].c[1] ?? '#4e89ff', jsonData.u[i].c[2] ?? '#4e89ff']
				htmlMembers
					+= '<div class="member" style="background:linear-gradient(120deg, '+ colors[1] +', '+ colors[2] +')">'
						+ '<img src="' + jsonData.u[i].a + '" class="icon">'
							+ '<div style="color:' + colors[0] + '">'
								+ '<h3>' + jsonData.u[i].n + '</h3>'
								+ '<p>' + jsonData.u[i].d + '</p>'
						+ '</div></div>'
			}
			// console.log(htmlMembers);
			elemMenbers.innerHTML = htmlMembers;
		}
	}
}

function getJSON(){
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			console.log('読み込んだよ');
			jsonData = JSON.parse(req.responseText);
			console.log(jsonData);
			for(let i = 0; i < jsonData.u.length; i++){
				let tmp = new Object();
				tmp.a = jsonData.u[i].a;
				tmp.n = jsonData.u[i].n;
				tmp.c = jsonData.u[i].c;
				userdata[jsonData.u[i].i] = tmp;
				// console.log(tmp);
			}
		}
	};
	//このファイルパスは仮のものであるため、後に正規の場所に移行すること。また、ローカルファイルは同一生成元ポリシーにより受け付けられない。
	// req.open("GET", "https://arrkmekawa.github.io/mekawa/assets/data.json", false);
	req.open("GET", "assets/data.json", false);
	req.send(null);
}

//共通部分を構成する
function buildCommonPart(){
	let pages = [
		['TOP', 'index.html'],
		['伊倉町について', 'about.html'],
		['メンバー一覧', 'members.html'],
		['投稿', 'notes.html'],
		['せ、せとくれええええ', '']];
	let htmlLinks = '<section class="links">';
	for(let i = 0; i < pages.length; i++){
		if(pages[i][0] == pageName) htmlLinks += '<span>' + pageName + '</span>';
		else htmlLinks += '<a href="' + pages[i][1] + '">' + pages[i][0] + '</a>';
	}
	htmlLinks += '</section>'
	elemMenubar.innerHTML 
		= '<input type="checkbox" name="cb_isShownMenu" id="isShownMenu" style="display: none;">' 
		+ '<div style="align-self: flex-start;">'
		+ '<a href="index.html" class="titleLink"><h1 style="width: 4.5em;">伊倉町</h1></a>'
		+ '<p class="color_main_500">Ikura Town Project</p>'
		+ '</div><label for="isShownMenu" class="menubtn">Menu</label>'
		+ htmlLinks + '</section>';

	let elemFooter = $('footer');
	let lastUpdated = elemFooter.innerText;
	let htmlFooter = '<p>(c)2020?-2023 伊倉町開発プロジェクト<br>' + lastUpdated + ' 芽河製作所 Arrk</p>';
	elemFooter.innerHTML = htmlFooter;
}

//投稿を構成する
function buildNotes(){
	let htmlNotes = '';
	for (let i = showNoteNum[0]; i < showNoteNum[0] + showNoteNum[1]; i++) {
		if(i >= jsonData.n.length) break;
		let htmlImgs = '';
		let imgData = jsonData.n[i].p ?? undefined;
		console.log(imgData);
		if(imgData){
			if(imgData[0] != undefined){
				htmlImgs = '<div class="imgs">';
				for(let j = 0; j < jsonData.n[i].p.length; j++){
					htmlImgs += '<img src="' + jsonData.n[i].p[j] + '">'
				}
				htmlImgs += '</div>';
			}
		}
		let htmlNote
			= '<div class="note"><img src="' 
			+ userdata[jsonData.n[i].i].a
			+ '" class="icon"><div class="noteContent">'
			+ '<span class="userName">'
			+ userdata[jsonData.n[i].i].n
			+ '</span> <span>'
			+ jsonData.n[i].d + '</span><br><p>'
			+ jsonData.n[i].c + '</p>'
			+ htmlImgs + '</div></div>';
		htmlNotes += htmlNote;
	}
	elemNotes.innerHTML = htmlNotes;
}

function notePage(pos){
	if(pos == 'start'){
		showNoteNum[0] = 0;
	}else if(pos == 'end'){
		showNoteNum[0] = noteCount - showNoteNum[1];
		if(showNoteNum[0] < 0) showNoteNum[0] = 0;
	}else{
		showNoteNum[0] += pos * showNoteNum[1];
		if(showNoteNum[0] + showNoteNum[1] > noteCount - 1) showNoteNum[0] = noteCount - showNoteNum[1];
		if(showNoteNum[0] < 0) showNoteNum[0] = 0;
	}
	console.log(showNoteNum);
	buildNotes();
	$('noteViewPosition').innerText = showNoteNum[0] + 1 + '件目～' + Math.min(showNoteNum[0] + showNoteNum[1], noteCount) + '件目を表示中 / 全' + noteCount + '件';
}

function changeNotePageShowCount(count){
	showNoteNum[1] = count;
	notePage(0);
}

function $(elemid){
	return document.getElementById(elemid);
}