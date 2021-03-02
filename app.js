//Task Databases
const todoDb = [
    // {text: "task1", done:false, projectId: "ZM20", tags: null, priority:1},
    // {text: "task2", done:true, projectId: "ZM20", tags: null, priority:2},
    // {text: "task3", done:false, projectId: "ZM20", tags: null, priority:3},
];

//task Class
class Task {
    constructor (text, done, projectId, tags, priority) {
        this.text = text;
        this.done = done;
        this.projectId = projectId;
        this.tags = tags;
        this.priority = priority;
    }
}

//constants
const addBtn = document.querySelector(".addBtn"); //the add button

//variables
let selectedFilter = document.querySelector(".selectedFilter"); //the status filter
let list = document.querySelector(".listContainer"); //the list container <ol>
let inputText = document.querySelector(".inputText"); //input text (not the value)

//functions
function checkInputLength() { //check if there is text in input
    if (inputText.value.length > 0){
        // createLi();
        createTask();
        inputText.value = "";
        renderList();
    }else{
        window.alert("Please enter text");
    }
}

function createTask() { //create task in Database
    let createdTask = new Task (inputText.value, false, null, null, null);
    todoDb.push(createdTask);
}

function createLi(task, i, arr) { //create HTML Element
    let item = document.createElement("li");
    let itemClass = document.createAttribute("class");
    itemClass.value = "itemContainer";
    item.setAttributeNode(itemClass);
    list.appendChild(item);
    if(task.done===true){ //check if item done and add class doneItem if done
        item.classList.add("doneitem");
    }

    let itemText = document.createElement("p1");//create the text
    let itemTextClass = document.createAttribute("class");
    itemTextClass.value = "todoText";
    itemText.setAttributeNode(itemTextClass);
    item.appendChild(itemText); 
    itemText.innerHTML = arr[i].text;

    let itemDoneBtn = document.createElement("button");//create done button
    let itemDoneBtnClass = document.createAttribute("class");
    itemDoneBtnClass.value = "doneBtn";
    itemDoneBtn.setAttributeNode(itemDoneBtnClass);
    item.appendChild(itemDoneBtn);
    itemDoneBtn.innerHTML ="Done";
    itemDoneBtn.addEventListener("click", markAsDone); //done button event listener

    let itemDeleteBtn = document.createElement("button");//creat the delete button
    let itemDeleteBtnClass = document.createAttribute("class");
    itemDeleteBtnClass.value = "deletBtn";
    itemDeleteBtn.setAttributeNode(itemDeleteBtnClass);
    item.appendChild(itemDeleteBtn);
    itemDeleteBtn.innerHTML ="Delete";
    itemDeleteBtn.addEventListener("click", deleteTask);//delete button event listener

    let priorityLable = document.createElement("t"); //create priority lable.
    item.appendChild(priorityLable);
    priorityLable.innerHTML = "Priority: ";


    let priorityField = document.createElement("input"); //priority field creation
    let priorityFieldClass = document.createAttribute("class");
    priorityFieldClass.value = "priorityField";
    priorityField.setAttributeNode(priorityFieldClass);
    let priorityFieldtype = document.createAttribute("type");
    priorityFieldtype.value = "number";
    priorityField.setAttributeNode(priorityFieldtype);
    item.appendChild(priorityField);
    priorityField.addEventListener("change",sortDb);
    if(task.priority > 0) { //when there is a task in todoDb put the priority value in the priority field to keep order when updating
        let priorityFieldValue = document.createAttribute("value");
        priorityFieldValue.value = task.priority;
        priorityField.setAttributeNode(priorityFieldValue);
    }
    
}

function checkStatusDone(task, i, todoDb) {//check for status done
    if(todoDb[i].done === true) {
        return todoDb[i];
    }
}

function checkStatusNot(task, i, todoDb) { //check for status not done
    if(todoDb[i].done === false) {
        return todoDb[i];
    }
}

function renderList() {//render HTML List
    while (list.hasChildNodes()) {  
        list.removeChild(list.firstChild);//clear board
      }
    if (selectedFilter.value === "all") { //if you want to see all
        let renderedLi = todoDb.map(createLi); //creat HTML Elements by todoDb
    }else if(selectedFilter.value === "done"){//if you want to see done
        let doneDb = todoDb.filter(checkStatusDone); //filter todoDb for done tasks
        let renderedLi = doneDb.map(createLi); //render the filtered array
    }else{
        let notDb = todoDb.filter(checkStatusNot);//etc
        let renderedLi = notDb.map(createLi);
    }
}

function markAsDone() {//mark task as done in todoDb
    let targetItem = event.target.parentNode.firstElementChild.innerHTML;//get task text
    let targetItemContainer = event.target.parentNode; 
    todoDb.forEach((task) => {
        if(task.text == targetItem && task.done === false) {//check todoDb to find a matching task.text and if done value false flip to true
            task.done = true
            targetItemContainer.classList.add("doneItem");
            renderList();
        } else if (task.text == targetItem && task.done === true){//... and task.done value true flip to false
            task.done = false
            targetItemContainer.classList.remove("doneItem");
            renderList();
        }
    });
}



function deleteTask(){//delet task from todoDb and render HTML list
    let targetItem = event.target.parentNode.firstElementChild.innerHTML; //get task text
    todoDb.forEach((task) =>{
        if(task.text == targetItem){
            todoDb.splice(todoDb.indexOf(task),1)
            renderList();
        } 
    });
}

function sortDb(){ //sort the todoDb
let htmlList = list.children;
let i;
for(i=0; i<htmlList.length; i++){
    let targetItem = htmlList[i].firstChild.innerHTML;
    let targetPriority = htmlList[i].childNodes[4].value;
    todoDb.forEach((task) =>{ //find the task in todoDb and log the priority from the input value to the key.
        if(task.text == targetItem){
            task.priority = targetPriority;
        }
     });
    }   

    todoDb.sort(function(a, b) {//sort todoDb numericly by priority value. this is working when you change a value but it doesnt log the change into todoDb so on render the value gets overiden.
        return a.priority-b.priority;
    });
    renderList();
}

//eventListeners
addBtn.addEventListener("click",checkInputLength);//add button listener
selectedFilter.addEventListener("change", renderList); //input selection change triggers re-render of list