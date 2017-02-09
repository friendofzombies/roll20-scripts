//script for outputting bristol

var BristolStoolChart = BristolStoolChart || (function() {
	'use strict';

	//config values
	var version = 0.2,
		dType = 20,
		apiCommand = "!poop",
		helpMsg = "Usage - !poop [--help|-h] [--private|-w], rolls on the bristol charter, optionally whispers result to roller if --private is used. '--help' will return this message.",
		tableName = "Bristol Table",
//later need to create a custom template, poop themed
		msgTemplate = "&{template:default} {{name=Bristol}} {{type=!type}} {{description=!description}}",
//see bristol wiki https://en.wikipedia.org/wiki/Bristol_stool_scale for data used for d20 table
//www.ncbi.nlm.nih.gov/pmc/articles/PMC3714416 has a different study with more precise percentages used for d100 table
//d20: 1,2 : 3,4 : 5-9 : 10-17 : 18 : 19 : 20
//d100 1-2 : 3-7 :  8-17 : 18-77 : 78-85 : 86-99 : 100 
		poopTable= [
			{range: [1,2], type: "1", description: "Seperate hard lumps"},
			{range: [3,4], type: "2",  description: "Lumpy and sausage like"},
			{range: [5,6,7,8,9], type: "3",  description: "A Sausage shape with cracks in the surface"},
			{range: [10,11,12,13,14,15,16,17], type: "4 ", description: "Like a smooth, soft sausage or snake"},
			{range: [18], type: "5", description: "Soft blobs with clear-cut edges"},
			{range: [19], type: "6", description: "Mushy consistency with ragged edges"},
			{range: [20], type: "7", description: "Liquid consistency with no solid pieces"}
		],


		writeResult = function(msg, rollResult, isPrivate) {
			var message = msgTemplate.replace('!type', rollResult.type).replace('!description', rollResult.description)
			var speakingAs = msg.who || tableName;
			if(isPrivate){
				message = "/w "+msg.who+" "+message;
				speakingAs = tableName;
			}
			sendChat(speakingAs, message);
		},

		rollOnTable = function() {
			var roll = randomInteger(dType);
			var checkRange = function(entry){ return entry.range.indexOf(roll) !== -1 };
			var tableEntry = _.find(poopTable, checkRange);
			return { 
				type: tableEntry.type,
				description: tableEntry.description
			};
		},

		handleInput = function(msg) {
			var args,
			    option,
			    isPrivate = false;

			if(msg.type !== "api") {
				return;
			}
			args = msg.content.split(/\s+/);
			if(args.length > 0 && args[0] == apiCommand) {
				if(args.length > 1)
					option = args[1]
				if(option == "--help" || option == "-h"){
					sendChat(tableName, helpMsg);
					return;
				}
				if(option == "--private" || option == "-w") {
					isPrivate = true;
				}
				writeResult(msg, rollOnTable(), isPrivate);
			}
		},

		checkInstall = function() {
			log(tableName+' v'+version+' Ready');
		},

		registerEventHandlers = function() {
			on("chat:message", handleInput);
		};

		return {
			CheckInstall: checkInstall,
			RegisterEventHandlers: registerEventHandlers
		};
}());

on('ready', function() {
	'use strict';
	BristolStoolChart.CheckInstall();
	BristolStoolChart.RegisterEventHandlers();
});

