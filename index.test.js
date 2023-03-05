const { sequelize } = require("./db");
const { Board, Cheese, User } = require("./index");

describe("Cheese Board Models", () => {
	
    beforeAll(async () => {
		await sequelize.sync({ force: true });
	});

	test("Create New Board", async () => {
		
        const testBoard = await Board.create({
			type: "Blue Cheese",
			description: "A semi-soft cheese with a sharp, salty flavor.",
			rating: 7,
		});

		expect(testBoard.type).toBe("Blue Cheese");
		expect(testBoard.description).toBe("A semi-soft cheese with a sharp, salty flavor.");
		expect(testBoard.rating).toBe(7);
	});

	test("Create Cheese", async () => {
	
        const testCheese = await Cheese.create({
			title: "Blue Cheese",
			description: "A semi-soft cheese with a sharp, salty flavor.",
		});

		expect(testCheese.title).toBe("Blue Cheese");
		expect(testCheese.description).toBe("A semi-soft cheese with a sharp, salty flavor.");
	
    });

	test("Create User", async () => {
		
        const testUser = await User.create({
			name: "Rachel Boursia",
			email: "rachel.l.boursia@gmail.com",
		});

		expect(testUser.name).toBe("Rachel Boursia");
		expect(testUser.email).toBe("rachel.l.boursia@gmail.com");
	
    });

	test("Connect user to board", async () => {
		
        const user = await User.create({
			name: "Rachel Boursia",
			email: "rachel.l.boursia@gmail.com",
		});

		const board1 = await Board.create({
			type: "Smoked Board",
			description: "Smoked: Smoked Gouda, Provolone, and Cheddar",
			rating: 9,
		});

		const board2 = await Board.create({
			type: "Blue Cheese Board",
			description: "Blue cheese: Gorgonzola, Stilton, Roquefort",
			rating: 10,
		});

		await user.addBoard(board1);
		await user.addBoard(board2);

		const boards = await user.getBoards();

		expect(boards).toHaveLength(2);
		expect(boards[0].type).toBe("Smoked Board");
		expect(boards[1].type).toBe("Blue Cheese Board");

	});

	test("Board with multiple cheeses", async () => {
		
        const board = await Board.create({
			type: "Smoked Board",
			description: "Smoked: Smoked Gouda, Provolone, and Cheddar",
			rating: 10,
		});

		const cheese1 = await Cheese.create({
			title: "Smoked Gouda",
			description: "A buttery, creamy and smooth cheese with sweet and salty notes",
		});
		const cheese2 = await Cheese.create({
			title: "Provolone",
			description: "A complex cheese, sharp taste with buttery and nutty flavors.",
		});
		await board.addCheese(cheese1);
		await board.addCheese(cheese2);

		const cheeses = await board.getCheeses();
		expect(cheeses).toHaveLength(2);
		expect(cheeses[0].title).toBe("Cheese1");
		expect(cheeses[1].title).toBe("Cheese2");

	});
    
	test("Cheese on multiple boards", async () => {
	
        const board1 = await Board.create({
			type: "Firm Board",
			description: "Firm: Parmigiano Reggiano, Manchego, Gouda",
			rating: 9,
		});
		const board2 = await Board.create({
			type: "Aged Board",
			description: "Aged: Gouda, Sharp Cheddar, Gruyere",
			rating: 9,
		});

		const cheese = await Cheese.create({
			title: "Gouda",
			description: "A buttery, creamy and smooth cheese with sweet and salty notes",
		});

		await board1.addCheese(cheese);
		await board2.addCheese(cheese);

		const boards = await cheese.getBoards();
		expect(boards).toHaveLength(2);
		expect(boards[0].type).toBe("Firm Board");
		expect(boards[1].type).toBe("Aged Board");

	});

	test("Board preloaded with cheese", async () => {
	
        const board = await Board.create({
			type: "Crumbly Board",
			description: "Crumbly: Goat and Feta Cheese",
			rating: 10,
		});

		const cheese1 = await Cheese.create({
			title: "Goat Cheese",
			description: "A mild, earthy, buttery but tart flavor.",
		});
		const cheese2 = await Cheese.create({
			title: "Feta Cheese",
			description: "A salty, tangy, sharp, and creamy taste. ",
		});
		await board.addCheese(cheese1);
		await board.addCheese(cheese2);

		const boardWithCheese = await Board.findOne({
			where: { id: board.id },
			include: Cheese,
		});

		expect(boardWithCheese.cheeses).toHaveLength(2);
		expect(boardWithCheese.cheeses[0].title).toBe("Goat Cheese");
		expect(boardWithCheese.cheeses[1].title).toBe("Feta Cheese");
    });

});