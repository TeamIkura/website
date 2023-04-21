console.log("-----");

let jsonData; // data.jsonから取り込んだデータ
let userdata = new Object(); // ユーザーをIDで並べたもの
let userId; // 編集するユーザーの番号
let userCount = 0; // jsondata内のユーザー数
let elemNotes = $('notes') ?? undefined;
let isSaved = false;
let showNoteNum;
if(elemNotes != undefined){
	showNoteNum = elemNotes.innerText.split(',', 2);
	showNoteNum[0] = Number(showNoteNum[0]);
	showNoteNum[1] = Number(showNoteNum[1]);
	console.log(showNoteNum);
}
let noteCount;

buildCommonPart();
{
	window.onload = function(){
		getJSON();
		userCount = jsonData.u.length;

		//投稿を構成する
		if(elemNotes != undefined){
			noteCount = jsonData.n.length;
			let elemNoteViewPosition = $('noteViewPosition') ?? undefined
			if(elemNoteViewPosition != null) elemNoteViewPosition.innerText = showNoteNum[0] + 1 + '件目～' + Math.min(showNoteNum[0] + showNoteNum[1], noteCount) + '件目を表示中 / 全' + noteCount + '件';
			buildNotes();
		} 

		// メンバー欄を構成する
		buildMembers();
	}
}

function getJSON(){
	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			console.log('読み込んだよ');
			jsonData = JSON.parse(req.responseText);
			// console.log(jsonData);
			buildUserData();
		}
	};
	//このファイルパスは仮のものであるため、後に正規の場所に移行すること。また、ブラウザ上ではローカルファイルは同一生成元ポリシーにより受け付けられない。
	req.open("GET", "https://teamikura.github.io/website/assets/data.json", false);
	// req.open("GET", "../website/assets/data.json", false);
	req.send(null);
}

// userDataを構成する
function buildUserData(){
	userdata = new Object();
	for(let i = 0; i < jsonData.u.length; i++){
		let tmp = new Object();
		tmp.a = jsonData.u[i].a;
		tmp.n = jsonData.u[i].n;
		tmp.c = jsonData.u[i].c;
		tmp.d = jsonData.u[i].d;
		userdata[jsonData.u[i].i] = tmp;
		// console.log(tmp);
	}
}

//共通部分を構成する
function buildCommonPart(){
	let elemFooter = $('footer');
	let lastUpdated = elemFooter.innerText;
	let htmlFooter = '<p>(c)2020?-2023 伊倉町開発プロジェクト<br>' + lastUpdated + ' 芽河製作所 Arrk</p>';
	elemFooter.innerHTML = htmlFooter;
}

// メンバーを構成する
function buildMembers(){
	let elemMenbers = $('members') ?? undefined;
	if(elemMenbers != undefined){
		let htmlMembers = '<button class="member" style="background:linear-gradient(120deg, #4e89ff 33%, #2f4377)" onclick="showSelectWhatToDo(-1)"><div style="color:white"><h3>新規メンバーを追加</h3><p>ここに載って無ければこちら</p></div></button>';
		for(let i = 0; i < jsonData.u.length; i++){
			let colors = [jsonData.u[i].c[0] ?? 'white', jsonData.u[i].c[1] ?? '#4e89ff', jsonData.u[i].c[2] ?? '#4e89ff']
			htmlMembers
				+= '<button class="member" style="background:linear-gradient(120deg, '+ colors[1] +' 33%, '+ colors[2] +')" onclick="showSelectWhatToDo(' + jsonData.u[i].i + ')">'
					+ '<img src="' + jsonData.u[i].a + '" class="icon">'
					+ '<div style="color:' + colors[0] + '">'
						+ '<h3>' + jsonData.u[i].n + '</h3>'
						+ '<p>' + jsonData.u[i].d + '</p>'
					+ '</div></button>'
		}

		// console.log(htmlMembers);
		elemMenbers.innerHTML = htmlMembers;
	}

}

//投稿を構成する
function buildNotes(){
	let htmlNotes = '';
	for (let i = showNoteNum[0]; i < showNoteNum[0] + showNoteNum[1]; i++) {
		if(i >= jsonData.n.length) break;
		let htmlImgs = '';
		if(jsonData.n[i].p.length != 0){
			htmlImgs = '<div class="imgs">';
			for(let j = 0; j < jsonData.n[i].p.length; j++){
				htmlImgs += '<img src="' + jsonData.n[i].p[j] + '">'
			}
			htmlImgs += '</div>';
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

// ユーザー選択まで戻る
function backToSelectMember(){
	$("selectWhatToDo").setAttribute('style', 'display:none');
	$("selectMember").setAttribute('style', 'display:block');
	$("editUser").setAttribute('style', 'display:none');
	$("addNote").setAttribute('style', 'display:none');
}

// 何をする？に戻る
function backToSelectWhatToDo(){
	if(userId == -1) backToSelectMember();
	else showSelectWhatToDo(userId);
}

// 何をする？を表示
function showSelectWhatToDo(userNum){
	userId = userNum;
	$("selectWhatToDo").setAttribute('style', 'display:block');
	$("selectMember").setAttribute('style', 'display:none');
	$("editUser").setAttribute('style', 'display:none');
	$("addNote").setAttribute('style', 'display:none');
	// console.log('userId = ' + userId);
	if(userId == -1){
		showUserEditor(-1);
	}else{
		let colors = [userdata[userId].c[0] ?? 'white', userdata[userId].c[1] ?? '#4e89ff', userdata[userId].c[2] ?? '#4e89ff']
		$('user').innerHTML = '<div class="member" style="background:linear-gradient(120deg, '+ colors[1] +' 33%, '+ colors[2] +');width:calc(100% - 10px)">'
		+ '<img src="' + userdata[userId].a + '" class="icon">'
		+ '<div style="color:' + colors[0] + '">'
			+ '<h3>' + userdata[userId].n + '</h3>'
			+ '<p>として操作します<br>メンバーID：'+ userId +'</p>'
		+ '</div></div>'
	}
}

// ユーザー編集を表示
function showUserEditor(){
	isSaved = false;
	$("editUser").setAttribute('style', 'display:block');
	$("selectWhatToDo").setAttribute('style', 'display:none');
	console.log(userId);

	if(userId != -1){
		$('userAvator').value = userdata[userId].a;
		$('userName').value = userdata[userId].n;
		$('userDesc').value = userdata[userId].d;
		$('userColorA').value = userdata[userId].c[0];
		$('userColorB').value = userdata[userId].c[1];
		$('userColorC').value = userdata[userId].c[2];
		$('colorA').value = userdata[userId].c[0];
		$('colorB').value = userdata[userId].c[1];
		$('colorC').value = userdata[userId].c[2];
	}else{
		$('userAvator').value = '';
		$('userName').value = '';
		$('userDesc').value = '';
		$('userColorA').value = '#ffffff';
		$('userColorB').value = '#4e89ff';
		$('userColorC').value = '#2f4377';
	}
	refreshUserPreview(1);
}

// ユーザープレビューを更新
function refreshUserPreview(pos){
	$('userStrAlt').innerHTML = '';
	if(pos == 1){
		$('colorA').value = $('userColorA').value;
		$('colorB').value = $('userColorB').value;
		$('colorC').value = $('userColorC').value;
	}else if(pos == 2){
		$('userColorA').value = $('colorA').value;
		$('userColorB').value = $('colorB').value;
		$('userColorC').value = $('colorC').value;
	}
	$('userPreview').innerHTML
		= '<div class="member" style="background:linear-gradient(120deg, '+ $('userColorB').value +' 33%, '+ $('userColorC').value +');width: calc(100% - 10px);">'
		+ '<img src="'+ $('userAvator').value +'" class="icon">'
		+ '<div style="color:'+ $('userColorA').value +'">' 
		+ '<h3>'+ $('userName').value +'</h3>' 
		+ '<p>'+ $('userDesc').value +'</p></div></div>';
}

// 投稿追加を表示
function showNoteEditor(){
	isSaved = false;
	$("addNote").setAttribute('style', 'display:block');
	$("selectWhatToDo").setAttribute('style', 'display:none');
	$('noteContent').value = '';
	$('noteImgs').value = '';
	refreshNotePreview(0);
}

// 投稿プレビューを更新
function refreshNotePreview(pos){
	$('noteStrAlt').innerHTML = '';
	let date = new Date()
	date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	let imgs = $('noteImgs').value;
	console.log(imgs);
	imgs = imgs.split(/\n/);
	let elemImgs = '';
	if(imgs[0] != ''){
		elemImgs = '<div class="imgs">';
		for(let i = 0; i < imgs.length; i++){
			elemImgs += '<img src="' + imgs[i] + '">';
		}
		elemImgs += '</div>';
	}
	console.log(imgs);
	$('notePreview').innerHTML
	= '<img src="'+ userdata[userId].a +'" class="icon">'
	+ '<div class="noteContent">'
		+ '<span class="userName">'+ userdata[userId].n +'</span> '
		+ '<span>'+ date +'</span><br>'
		+ '<p>'+ $('noteContent').value.replaceAll(/\n/g, '<br>') +'</p>'
		+ elemImgs +'</div>'
}

// ユーザーを保存する
let tmpUserData = new Object();
function saveUserData(value){
	tmpUserData = new Object();
	console.log(userId + '番のユーザーを保存します')
	let colors = [$('userColorA').value, $('userColorB').value, $('userColorC').value];
	let maxNumOfMemberId = 0;
	if(userId == -1){
		for(let i = 0; i < jsonData.u.length; i++){
			if(maxNumOfMemberId < jsonData.u[i].i) maxNumOfMemberId = jsonData.u[i].i + 1;
		}
		console.log('tmpUser\'s ID = ' + maxNumOfMemberId);
		tmpUserData.i = maxNumOfMemberId;
		jsonData.u.splice(userCount, 1, tmpUserData);
		if(isSaved = false) userCount++;
		isSaved = true;
		userId = maxNumOfMemberId;
	}else{
		tmpUserData.i = userId;
		let splicePosition = jsonData.u.length;
		for(let i = 0; i < jsonData.u.length; i++){
			if(jsonData.u[i].i == userId){
				splicePosition = i;
				console.log('交換場所：' + i);
				break;
			}
		}
		jsonData.u.splice(splicePosition, 1, tmpUserData);
	}
	tmpUserData.a = $('userAvator').value;
	tmpUserData.n = $('userName').value
	tmpUserData.d = $('userDesc').value
	tmpUserData.c = colors;
	console.log(tmpUserData);

	if(value == 0){
		console.log(jsonData);
		exportJson();
	}else if(value == 1){
		console.log('クリップボードにコピーします');
		let copyText = JSON.stringify(tmpUserData, undefined, 0);
		console.log(copyText);
		navigator.clipboard.writeText('```json\n' + copyText + '```').then(() => {}, () => {
			$('userStrAlt').innerHTML = 'クリップボードへの書き込みに失敗しました<br><p style="background-color:var(--color-main-900);overflow:auto">```json<br>' + copyText + '<br>```</p>';
		});
		console.log(jsonData);
	}
	buildUserData();
	buildMembers();
}

// 投稿を追加する
function saveNote(value){
	let tmpNoteData = new Object();
	let date = new Date();
	let imgs = $('noteImgs').value;
	imgs = imgs.split(/\n/);
	tmpNoteData.i = userId;
	tmpNoteData.d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	tmpNoteData.c = $('noteContent').value.replaceAll(/\n/g, '<br>');
	if(imgs[0] != '') tmpNoteData.p = imgs;
	if(isSaved == true){
		jsonData.n.splice(0, 1, tmpNoteData);
	}else{
		jsonData.n.unshift(tmpNoteData);
		isSaved = true;
	}
	console.log(tmpNoteData);

	if(value == 0){
		console.log(jsonData);
		exportJson();
	}else if(value == 1){
		console.log('クリップボードにコピーします');
		let copyText = JSON.stringify(tmpNoteData, undefined, 0);
		console.log(copyText);
		navigator.clipboard.writeText('```json\n' + copyText + '```').then(() => {}, () => {
			$('noteStrAlt').innerHTML = 'クリップボードへの書き込みに失敗しました<br><p style="background-color:var(--color-main-900);overflow:auto">```json<br>' + copyText + '<br>```</p>';
		});
		console.log(jsonData);
	}
}

// JSON出力する
function exportJson(){
	console.log('ダウンロードします')
	const blob = new Blob([JSON.stringify(jsonData, undefined, 0)], {type: 'text/plain'});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	document.body.appendChild(a);
	a.download = 'data.json';
	a.href = url;
	a.click();
	a.remove();
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 1E4);
}

// 画像をギハブから参照する
let pointElemId = "";
function referImgURL(pointer, operation, event){
	console.log(pointer);
	pointElemId = pointer;
	if(operation == 'choose'){
		if(event.target.matches('.closeBtn')){
			console.log('閉じるボタンが押されたよ');
			operation = 'close';
		}else if(event.target.matches('.refreshBtn')){
			refreshRepImgs();
		}else if(event.target.closest('.referImgContent')){
			console.log('要素内が押されたよ');
		}else{
			console.log('要素外が押されたよ');
			operation = 'close';
		}
	}

	if(operation == 'open'){
		$('referImgContainer').setAttribute('style', 'top:0;opacity:1');
	}else if(operation == 'close'){
		$('referImgContainer').setAttribute('style', 'top:-100vh;opacity:0');
	}
}

// 参照ウィンドウの画像を更新する
let imagePaths;
const directoryPath = 'assets/imgs/' // 本鯖用
// const directoryPath = 'assets' // デバッグ用
function refreshRepImgs(){
	imagePaths = [];
	let xhr = new XMLHttpRequest();

	xhr.open('GET', directoryPath);
	xhr.onload = function() {
		if(xhr.status === 200){
			let parser = new DOMParser();
			let responseDoc = parser.parseFromString(xhr.responseText, 'text/html');

			let fileList = responseDoc.querySelectorAll('a');
			fileList.forEach(function(link){
				const fileName = link.getAttribute('href');
				const filePath = fileName.split('\\').pop();
				let extension = fileName.split('.').pop().toLowerCase();
				if(extension == 'png' || extension == 'jpg' || extension == 'gif'){
					imagePaths.push('https://teamikura.github.io/website/assets/imgs/' + filePath);
				}
			});
			console.log(imagePaths);
			let elemImgList = $('imageList');
			elemImgList.innerHTML = '';
			for(let i = 0; i < imagePaths.length; i++){
				elemImgList.innerHTML += '<button onclick="insertImgURL(\''+ imagePaths[i] +'\')"><img src="' + imagePaths[i] + '"></button>'
			}
		} else {
			console.error('Request failed. Returned status of ' + xhr.statusText);
		}
	};
	xhr.onerror = function(){
		console.error(xhr.statusText);
	};
	xhr.send();
}
refreshRepImgs();

function insertImgURL(value){
	console.log(value);
	if(pointElemId == 'userAvator'){
		$('userAvator').value = value;
		refreshUserPreview(0);
	}else if(pointElemId == 'noteImgs'){
		if($('noteImgs').value == ''){
			$('noteImgs').value += value;
		}else $('noteImgs').value += ('\n' + value);
		refreshNotePreview(0);
	}
	referImgURL(null, 'close', null);
}

function $(elemid){
	return document.getElementById(elemid);
}