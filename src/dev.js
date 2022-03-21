const allEntities = [
	{
		name: "Art of Mike",
		id: "id1",
		file: "./Archive.zip",
		tags: ["sci-fi"],
		path: "/Users/benjamin/Documents/3d models/stl/untitled folder 2/Art of Mike - 202011",
		children: [],
		isLeaf: true
	},
	{
		name: "Chibi Samus - Metroid",
		id: "id2",
		kind: "bust",
		tags: [
			"chibi",
			"metroid",
			"samus"
		],
		picture: "./Chibi Samus - Metroid.jpg",
		path: "/Users/benjamin/Documents/3d models/stl/Chibi Samus - Metroid",
		children: [],
		isLeaf: true
	},
	{
		name: "PAPZ_INDUSTRIES_UNIQUE_SYNTHETIC_TIMOTHY",
		id: "id3",
		kind: "miniature",
		tags: [
			"prometheus",
			"alien",
			"David"
		],
		picture: "./PAPZ_INDUSTRIES_UNIQUE_SYNTHETIC_TIMOTHY.jpg",
		path: "/Users/benjamin/Documents/3d models/stl/Aliens vs Humans - Papsikels/PAPZ_INDUSTRIES_UNIQUE_SYNTHETIC_TIMOTHY",
		children: [],
		isLeaf: true
	},
	{
		name: "Warriors of the Secret Jungle",
		id: "id4",
		picture: "Warriors of the Secret Jungle.png",
		tags: ["aztec"],
		path: "/Users/benjamin/Documents/3d models/stl/Warriors of the Secret Jungle",
		children: [
			{
				name: "Centerpiece",
				id: "id5",
				kind: "terrain",
				tags: ["multi"],
				picture: "./Centerpiece.jpg",
				path: "/Users/benjamin/Documents/3d models/stl/Warriors of the Secret Jungle/Centerpiece",
				children: [],
				isLeaf: true
			},
			{
				name: "Heroes",
				id: "id6",
				tags: ["heroes"],
				kind: "miniatures",
				path: "/Users/benjamin/Documents/3d models/stl/Warriors of the Secret Jungle/Heroes",
				children: [
					{
						name: "Necahual Arisen Celestial Mistress",
						id: "id7",
						kind: "miniature",
						tags: [
							"mummy",
							"woman",
							"wizard",
							"magic"
						],
						picture: "./Necahual Arisen Celestial Mistress.jpg",
						path: "/Users/benjamin/Documents/3d models/stl/Warriors of the Secret Jungle/Heroes/Necahual Arisen Celestial Mistress",
						children: [],
						isLeaf: true
					}
				]
			},
			{
				name: "Salamander Warriors",
				id: "id8",
				file: "./Salamander Warriors.zip",
				pictures: ["./Salamander Warriors.jpg"],
				kind: "miniatures",
				tags: [
					"monster",
					"troops",
					"salamander"
				],
				types: {
					lys: true,
					supported: true,
					unsupported: true
				},
				path: "/Users/benjamin/Documents/3d models/stl/Warriors of the Secret Jungle/Troops/Salamander Warriors",
				children: [],
				isLeaf: true
			}
		]
	}
];

function findEntity(id, entities) {
	for (const entity of entities) {
		if (entity.id === id) {
			return entity;
		}

		let child = findEntity(id, entity.children);
		if (child) {
			return child;
		}
	}

	return null;
}

if (!window.electronAPI) {
	window.electronAPI = {
		setTitle: () => Promise.resolve(),
		getAllEntities: () => Promise.resolve(allEntities),
		getEntity: (id) => Promise.resolve(findEntity(id, allEntities))
	};
}
