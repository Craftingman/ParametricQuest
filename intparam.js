
window.onload = function() {
		$(".taskBox").hide();
		$(".answerBox").hide();
		setTimeout(() => $(".loading").hide(), 1000);
		preload([
		"./img/bakers_son.png",
		"./img/bakers_wife.png",
		"./img/dog.png",
		"./img/homeless.png",
		]);
};

function startQuest() {
	$(".startButton").hide();
	let quest = new Quest([ new Story([
			new Scene([new Answer("./img/bakers_son.png", "Светловолосый мальчик-поварёнок по имени Ханс"), new Answer("./img/bakers_wife.png", "Жена-сладкоежка пекаря"), new Answer("./img/dog.png", "Прожорливый хозяйский пёс породы золотистый ретривер", true), new Answer("./img/homeless.png", "Бездомный, околачивающийся возле пекарни")], new Evidence("#", "Светлый волос на полу; крошки по всей пекарне; следы от когтей на мебели.")),
			new Scene([new Answer("./img/bakers_son.png", "Светловолосый мальчик-поварёнок по имени Ханс"), new Answer("./img/bakers_wife.png", "Жена-сладкоежка пекаря", true), new Answer("./img/dog.png", "Прожорливый хозяйский пёс породы золотистый ретривер"), new Answer("./img/homeless.png", "Бездомный, околачивающийся возле пекарни")], new Evidence("#", "Аккуратно сложенный мешок из-под печенья, найденный в шкафу; светлый волос; а ещё пекарь сегодня не получил от жены оплеуху.")),
			new Scene([new Answer("./img/bakers_son.png", "Светловолосый мальчик-поварёнок по имени Ханс", true), new Answer("./img/bakers_wife.png", "Жена-сладкоежка пекаря"), new Answer("./img/dog.png", "Прожорливый хозяйский пёс породы золотистый ретривер"), new Answer("./img/homeless.png", "Бездомный, околачивающийся возле пекарни")], new Evidence("#", "Лопатка для замеса, валяющаяся на полу; шоколад на лице Ханса; всё тот же светлый волос.")),],
			"Печенье", `В городской пекарне паника. Кто-то украл целый мешок шоколадного печенья! Пекарь в отчаянии, ведь печенье должно было отправиться на королевский стол.
Давайте поможем бедолаге, иначе не сносить ему головы!`),
					new Story([
			new Scene([new Answer("./img/scientist.png", "Учёный Феодосий. 50 лет. Курит."), 
				new Answer("./img/punk.png", "Физик-ядерщик Арсен. Любит пиротехнику и экстрим"), 
				new Answer("./img/watchmans_daughter.png", "Дочка сторожа. Любит цветы."), 
				new Answer("./img/watchman.png", "Сторож лаборатории. Никого не подозревает. Близорукий.", true)], 
				new Evidence("#", "Осколки колб и лужи химикатов; обломки очков, найденные на месте взрыва; странный запах горючего газа от плаща сторожа")),
			new Scene([new Answer("./img/scientist.png", "Учёный Феодосий. 50 лет. Курит."), 
				new Answer("./img/punk.png", "Физик-ядерщик Арсен. Любит пиротехнику и экстрим"), 
				new Answer("./img/watchmans_daughter.png", "Дочка сторожа. Любит цветы.", true), 
				new Answer("./img/watchman.png", "Сторож лаборатории. Никого не подозревает. Близорукий.")], 
				new Evidence("#", "Обгоревшие ромашки, найденные в коридоре; разбитые колбы; разноцветные реактивы, перемешанные в хаотичном порядке")),
			new Scene([new Answer("./img/scientist.png", "Учёный Феодосий. 50 лет. Курит.", true), 
				new Answer("./img/punk.png", "Физик-ядерщик Арсен. Любит пиротехнику и экстрим"), 
				new Answer("./img/watchmans_daughter.png", "Дочка сторожа. Любит цветы."), 
				new Answer("./img/watchman.png", "Сторож лаборатории. Никого не подозревает. Близорукий.")], 
				new Evidence("#", "Странный свёрток возле входа, похож на сигару; от некоторых вещей, вроде личного микроскопа профессора, не осталось даже обломков; разлитые и разбросанные материалы")),],
			"Взрыв", `В дворцовой лаборатории произошёл взрыв! К счастью, никто не пострадал, но экспериментальное крыло разрушено до основания. Что же произошло и кто из работников лаборатории виноват во взрыве?`)
		]);
	$(".answerBox").show(400, function() {
		$(".taskBox").show(400);
		preload([
		"./img/punk.png",
		"./img/scientist.png",
		"./img/watchman.png",
		"./img/watchmans_daughter.png",
		]);
	});
	quest.start();
}

function Quest(stories) {
	this.stories = stories;
	this.result = new Result();
	this.start = function() {
		if(stories.length > 0) {
			stories[0].start();
			this.currentStory = 0;
		}
		$(document).on("storyCompleted", (e) => {
			this.result.addStor(e.originalEvent.detail);
			if(this.currentStory < this.stories.length - 1) {
				this.currentStory++;
				
				$(".taskBox").hide(400, () => {
					$(".taskBox").show(400);
				});
				$(".answerBox").hide(400 , () => {
					this.stories[this.currentStory].start();
					$(".answerBox").show(400);
				}); 
				
				
			} else {
				$(document).off("storyCompleted");
				$(".taskBox").hide(400, () => {
					$(".answerBox").hide(400 , () => {
						this.result.render();
					}); 
				});
			}
		});
	};
}

function Story(scenes, name, text) {
	this.scenes = scenes;
	this.name = name;
	this.text = text;
	this.ansArr = [];
	this.completed = false;
	this.start = function() {
		let storyText = $(".storyText");
		storyText.empty();
		storyText.append([$("<h2>", { "text":this.name, "class":"storyName" }), $("<div>", {"text":this.text, "class": "storyDesc"})]);
		if(scenes.length > 0) {
			scenes[0].render();
			this.currentScene = 0;
		}
		$(document).on("sceneCompleted", (e) => {
			if(this.currentScene < this.scenes.length - 1) {
				this.currentScene++;
				this.ansArr.push(e.originalEvent.detail);
				this.scenes[this.currentScene].render();
			} else {
				this.ansArr.push(e.originalEvent.detail);
				$(document).off("sceneCompleted");
				document.dispatchEvent(new CustomEvent("storyCompleted", {bubbles: true, detail: this.ansArr}));
			}
		});
	};

}

function Scene(answers, evidence, backgroundSrc) {
	this.answers = answers;
	this.evidence = evidence;
	this.backgroundSrc = backgroundSrc;
	this.completed = false;
	this.render = function() {
		this.evidence.render();

		let answerBox = $(".answerBox");
		answerBox.empty();
		for (answer of this.answers) {
			answer.render();
		}

	};
}

function Answer(img, text, isTrue = false) {
	this.img = img;
	this.text = text;
	this.isTrue = isTrue;
	this.render = function() {
		let answerBox = $(".answerBox");
		let answerObj = $("<div>", {"class": "answer"});
		let answerText = $("<div>", {"class": "answerText", "text": this.text});
		let answerImg = $("<img>", {"class": "answerImg", "src": this.img});

		answerObj.append(answerImg);
		answerObj.append(answerText);

		answerObj.on("mousedown", () => answerObj.css("box-shadow", "none"));
		
		answerObj.on("click", () => {
			document.dispatchEvent(new CustomEvent("sceneCompleted", { 
				bubbles: true, 
				detail: {"isTrueAns": this.isTrue, "ansText": this.text},
			}));
		});
		answerBox.append(answerObj);
	};
}

function Evidence(img, text) {
	this.img = img;
	this.text = text;
	this.render = function() {
		let evidenceImg = $(".evidenceImg");
		let evidenceText = $(".evidenceText");

		evidenceImg.attr("src", this.img);
		evidenceText.text(this.text);
	};
}

function Result() {
	this.stors = [];
	this.addStor = function(stor) {
		this.stors.push(stor);
	};
	this.render = function() {
		let resultOl = $("<ol>", { "class": "resultOl" });
		for (stor of this.stors) {
			for (ans of stor) {
				let li = $("<li>", { "text": ans.ansText});
				if (ans.isTrueAns) {
					li.css("color", "green");
				} else {
					li.css("color", "red");
				}
				resultOl.append(li);
			}
		}
		$(".resultDiv").append(resultOl);
		$(".resultDiv").show();
	};
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}