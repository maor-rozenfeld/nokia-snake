var snake = function() {
		var width = 23;
		var height = 16;
		var blocksAmount = width * height;
		var blockSize = 15;
		var containerWidth = blockSize * width;

		var container = $(".snake");
		container.css("width", containerWidth);

		for (var i = 1; i <= blocksAmount; i++) {
			container.append('<div class="block">');
        }
		var blocks = $(".block");
		var direction = 1;
		var difficulty = parseInt(location.hash.substring(1)) || 80;
		var snakeSize = 4;
		var snakeBody = new Array({ x:2, y:5});
		var commands = new Array();
		var apple;
		placeApple();
		var runInterval;
		setTimeout(function() { runInterval	= setInterval(run, difficulty, 2000); }, 800);
		var points = 0;


		bindKeys();
		function run() {
			doDirectionCommand()
			var headPos = snakeBody[snakeBody.length -1];
			var nextHeadPos = getNextPosition(headPos);

			if (isCollision(nextHeadPos)) {
					clearInterval(runInterval);
					setTimeout(function() {
						container.hide();
						$(".points .text").text(points);
						$(".points").show();
						setTimeout(function() {
							container.empty().show();
							$(".points").hide();
							snake();
						}, 1800);
					}, 900);
					return;
			}


			if (nextHeadPos.x == apple.x && nextHeadPos.y == apple.y) {
				snakeSize++;
				getBlock(apple).removeClass("apple");
				placeApple();
				points += 9;
			}
			getBlock(nextHeadPos).addClass("snake-body");

			snakeBody.push(nextHeadPos);
			//console.log(snakeBody.length);
			if (snakeBody.length > snakeSize) {
				var tail = snakeBody.shift();
				if (tail.x != nextHeadPos.x || tail.y != nextHeadPos.y)
					getBlock(tail).removeClass("snake-body");
				//getBlock(tail).css("background-color", "red");
				//console.log(tail, nextHeadPos);
			}


		}

		function placeApple() {
			while (true) {
				var pos = { x: Math.floor(Math.random()*(width)), y:Math.floor(Math.random()*(height)) };
				var collision = false;
				for (var i in snakeBody) {
					if (i == 0)
						continue;
					var bodyPos = snakeBody[i];
					if (bodyPos.x == pos.x && bodyPos.y == pos.y) {
						collision = true; break;
					}
				}

				if (collision)
					continue;

				apple = pos;
				getBlock(pos).addClass("apple");
				return;
			}
		}


		function getBlock(pos) {
			var fullLines = pos.y - 1;
			return blocks.eq((pos.y * width) + pos.x);
		}

		function getNextPosition(pos) {
			pos = { x:pos.x, y:pos.y };
			switch (direction) {
				case 0: pos.y--; break;
				case 1: pos.x++; break;
				case 2: pos.y++; break;
				case 3: pos.x--; break;
			}

			/*if (pos.x >= width) pos.x = 0;
			if (pos.x < 0) pos.x = width - 1;
			if (pos.y >= height) pos.y = 0;
			if (pos.y < 0) pos.y = height - 1;
			*/
			return pos;
		}

		function isCollision(pos) {
			for (var i in snakeBody) {
				if (i == 0)
					continue;
				var bodyPos = snakeBody[i];
				if (bodyPos.x == pos.x && bodyPos.y == pos.y) {
					return true;
				}
			}

			if (pos.x >= width || pos.x < 0 || pos.y  >= height || pos.y < 0)
				return true;

			return false;
		}

		function bindKeys() {
			$(document).keydown(function(e) {
				switch(e.which) {
					case 37: commands.push(3); break;//left
					case 38: commands.push(0); break;
					case 39: commands.push(1); break;
					case 40: commands.push(2); break;

					default: return; // exit this handler for other keys
				}
				e.preventDefault(); // prevent the default action (scroll / move caret)
			});
		}

		function doDirectionCommand() {
			if (commands.length == 0)
				return;
			var dirCommand = commands.shift();
			if (dirCommand == direction)
				return;

			if (dirCommand == 0 && direction == 2) return;
			if (dirCommand == 2 && direction == 0) return;
			if (dirCommand == 3 && direction == 1) return;
			if (dirCommand == 1 && direction == 3) return;

			direction = dirCommand;
		}
};
$(snake);
