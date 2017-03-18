
var database = {};
var trainSchedule = [];
var currentTrain = -1;


function getNextTimeInterval(lastTimeInterval, period)
{
	var now = moment();
	
	if (lastTimeInterval.diff(now) < 0)
	{
		nextTimeInterval = lastTimeInterval.add(period, 'm');
		getNextTimeInterval(nextTimeInterval, period);
	}
	return nextTimeInterval;
}

function editTrainInfo(action, index)
{
	currentTrain = index;		
	$("#train-entry-name").val(trainSchedule[index].train.trainName);
	$("#train-entry-dest").val(trainSchedule[index].train.trainDest);
	$("#train-entry-arrival").val(trainSchedule[index].train.trainArrival);
	$("#train-entry-freq").val(trainSchedule[index].train.trainFreq);
	
	$("#train-add").addClass("hide");
	if (action == '1') 
	{
		$("#train-update").removeClass("hide");
		$("#train-delete").addClass("hide");
	}
	else
	{
		$("#train-update").addClass("hide");
		$("#train-delete").removeClass("hide");		
	}
	
}
function clearTrainFields()
{
	$("#train-entry-name").html('');
	$("#train-entry-dest").html('');
	$("#train-entry-arrival").html('');
//	$("#train-entry-freq").empty();
}
function getNewTrain()
{
	var validateMoment = moment($("#train-entry-arrival").val().trim(),'HH:mm');
	console.log(validateMoment);
	if (validateMoment.isValid()) 
	{
		console.log('valid');
		this.trainName = $("#train-entry-name").val().trim();
		this.trainDest = $("#train-entry-dest").val().trim();
		
		this.trainArrival = moment($("#train-entry-arrival").val().trim(),'HH:mm').toString();
		this.trainFreq = $("#train-entry-freq").val().trim();
		this.valid = true;
	}	
	else
	{
		this.valid = false;
	}
}

function displayTrain(dataRecord, triggerEvent)
{
	var trainData = {train: {}, key: "" };

	trainData.train = dataRecord.val();
	trainData.key = dataRecord.key;

	trainSchedule.push(trainData);
	
	var trainScheduletable = document.getElementById("train-list-table");
	var newRow = trainScheduletable.insertRow(trainSchedule.length);
	
	var tAct = newRow.insertCell(0);
	var tMin = newRow.insertCell(0);
	var tNext = newRow.insertCell(0);
	var tFreq = newRow.insertCell(0);
	var tDest = newRow.insertCell(0);
	var tName = newRow.insertCell(0);
  
// not implemented  
//	var btnEdit = "<button class='action-button' onClick='editTrainInfo(1,"+(trainSchedule.length-1)+")' >Edit</button>"
//	            + "<button class='action-button' onClick='editTrainInfo(2,"+(trainSchedule.length-1)+")' >Delete</button>";
//	tAct.innerHTML = btnEdit;

	tDest.innerHTML = trainData.train.trainDest;
	tName.innerHTML = trainData.train.trainName;
	tFreq.innerHTML = trainData.train.trainFreq;
	
	// These need to be calculated.
	var nextArrival =  moment(getNextTimeInterval(moment(trainData.train.trainArrival), trainData.train.trainFreq));
	var timeToTrain = moment(nextArrival.diff(moment()));
	tMin.innerHTML = timeToTrain.format('mm');
	tNext.innerHTML = nextArrival.format('HH:mm');
}

// not implemented
function deleteTrain()
{
	var modifiedTrain = {};
	// trainSchedule[1].train.trainName = 'Bilbo Baggins';
	// modifiedTrain[trainSchedule[1].key] = trainSchedule[1].train ;
	// database.ref(trainSchedule[1].key).remove();
	
	$("#train-add").removeClass("hide");
	$("#train-update").addClass("hide");
	$("#train-delete").addClass("hide");
	clearTrainFields();
}

// not implemented
function updateTrain()
{
	var modifiedTrain = {};
	modifiedTrain[trainSchedule[currentTrain].key] = new getNewTrain();
	database.ref().update(modifiedTrain);
	currentTrain = -1;
	$("#train-add").removeClass("hide");
	$("#train-update").addClass("hide");
	$("#train-delete").addClass("hide");
	clearTrainFields();
	
}

function addTrain()
{
	var newTrain = new getNewTrain
	if(newTrain.valid)
	{
		database.ref().push(newTrain);
		clearTrainFields();
	}	
}


function chooChooCheeChee()
{	
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCqfTnrMLjnNr5VPR28AHSDfwbXNhPhMYY",
    authDomain: "bootcampstuff-c6ecb.firebaseapp.com",
    databaseURL: "https://bootcampstuff-c6ecb.firebaseio.com",
    storageBucket: "bootcampstuff-c6ecb.appspot.com",
    messagingSenderId: "632661052823"
  };
  firebase.initializeApp(config);	
	database = firebase.database();	
	
	$("#train-add-button").on("click", function (event)
		{
			// halt submission of form
			event.preventDefault();
			addTrain();
		});

		
	$("#train-delete-button").on("click", function (event)
		{
			// halt submission of form
			event.preventDefault();
			deleteTrain();
		});
		
	$("#train-update-button").on("click", function (event)
		{
			// halt submission of form
			event.preventDefault();
			updateTrain();
		});

  database.ref().on("child_added", function(data) { displayTrain(data, "added");});
  database.ref().on("child_changed", function(data) { displayTrain(data, "changed" );});
  database.ref().on("child_removed", function(data) { displayTrain(data, "removed" );});
}

	