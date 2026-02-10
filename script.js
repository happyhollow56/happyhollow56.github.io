
var boxes = [];

window.onload = function() {
    var savedBoxes = localStorage.getItem('myBoxes');
    if(savedBoxes) {
        boxes = JSON.parse(savedBoxes);
        displayBoxes();
        updateSelectBox();
    }
};

function saveBoxes() {
    localStorage.setItem('myBoxes', JSON.stringify(boxes));
}

document.getElementById('boxForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var boxName = document.getElementById('boxName').value.trim();
    
    if(boxName == "") {
        alert("Please enter a box name!");
        return;
    }
    
    for(var i = 0; i < boxes.length; i++) {
        if(boxes[i].name == boxName) {
            alert("A box with that name already exists!");
            return;
        }
    }
    
    var newBox = {
        id: Date.now(),
        name: boxName,
        links: []
    };
    
    boxes.push(newBox);
    
    saveBoxes();
    displayBoxes();
    updateSelectBox();
    
    document.getElementById('boxName').value = "";
    
    alert("Box created successfully!");
});

document.getElementById('linkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var selectBox = document.getElementById('selectBox').value;
    var linkName = document.getElementById('linkName').value.trim();
    var linkUrl = document.getElementById('linkUrl').value.trim();
    
    if(selectBox == "") {
        alert("Please select a box!");
        return;
    }
    
    if(linkName == "") {
        alert("Please enter a link name!");
        return;
    }
    
    if(linkUrl == "") {
        alert("Please enter a URL!");
        return;
    }
    
    if(!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
        linkUrl = 'https://' + linkUrl;
    }
    
    for(var i = 0; i < boxes.length; i++) {
        if(boxes[i].id == selectBox) {
            boxes[i].links.push({
                name: linkName,
                url: linkUrl
            });
            break;
        }
    }
    
    saveBoxes();
    displayBoxes();
    
    document.getElementById('linkName').value = "";
    document.getElementById('linkUrl').value = "";
    
    alert("Link added successfully!");
});

function displayBoxes() {
    var container = document.getElementById('boxesContainer');
    
    if(boxes.length == 0) {
        container.innerHTML = '<p id="noBoxes">No boxes yet. Create one above!</p>';
        return;
    }
    
    var html = '';
    
    for(var i = 0; i < boxes.length; i++) {
        html += '<div class="link-box">';
        html += '<h4>' + boxes[i].name + 
                ' <button class="delete-box-btn" onclick="deleteBox(' + boxes[i].id + ')">Delete Box</button></h4>';
        
        if(boxes[i].links.length == 0) {
            html += '<p>No links in this box yet.</p>';
        } else {
            html += '<ul>';
            for(var j = 0; j < boxes[i].links.length; j++) {
                html += '<li>';
                html += '<a href="' + boxes[i].links[j].url + '" target="_blank">' + boxes[i].links[j].name + '</a>';
                html += ' <button class="delete-btn" onclick="deleteLink(' + boxes[i].id + ', ' + j + ')">Remove</button>';
                html += '</li>';
            }
            html += '</ul>';
        }
        
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function updateSelectBox() {
    var select = document.getElementById('selectBox');
    
    select.innerHTML = '<option value="">-- Select a box --</option>';
    
    for(var i = 0; i < boxes.length; i++) {
        var option = document.createElement('option');
        option.value = boxes[i].id;
        option.textContent = boxes[i].name;
        select.appendChild(option);
    }
}

function deleteBox(boxId) {
    if(!confirm("Are you sure you want to delete this box?")) {
        return;
    }
    
    for(var i = 0; i < boxes.length; i++) {
        if(boxes[i].id == boxId) {
            boxes.splice(i, 1);
            break;
        }
    }
    
    saveBoxes();
    displayBoxes();
    updateSelectBox();
}

function deleteLink(boxId, linkIndex) {
    for(var i = 0; i < boxes.length; i++) {
        if(boxes[i].id == boxId) {
            boxes[i].links.splice(linkIndex, 1);
            break;
        }
    }
    
    saveBoxes();
    displayBoxes();
}
