
var boxes = [];

var darkModeToggle = document.getElementById('darkModeToggle');
var colorPickerToggle = document.getElementById('colorPickerToggle');
var themePicker = document.getElementById('themePicker');
var customColorPicker = document.getElementById('customColorPicker');
var body = document.body;

// Load saved dark mode
var savedDarkMode = localStorage.getItem('darkMode');
if(savedDarkMode === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

// Load saved theme color
var savedThemeColor = localStorage.getItem('themeColor');
if(savedThemeColor) {
    setThemeColor(savedThemeColor);
    customColorPicker.value = savedThemeColor;
}

// Dark mode toggle
darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');

    if(body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('darkMode', 'true');
    } else {
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('darkMode', 'false');
    }
});

// Color picker toggle
colorPickerToggle.addEventListener('click', function() {
    themePicker.classList.toggle('show');
});

// Close color picker when clicking outside
document.addEventListener('click', function(event) {
    if (!themePicker.contains(event.target) && event.target !== colorPickerToggle) {
        themePicker.classList.remove('show');
    }
});

// Custom color picker
customColorPicker.addEventListener('input', function() {
    setThemeColor(this.value);
    localStorage.setItem('themeColor', this.value);
});

// Preset colors
var presetColors = document.querySelectorAll('.preset-color');
presetColors.forEach(function(preset) {
    preset.addEventListener('click', function() {
        var color = this.getAttribute('data-color');
        setThemeColor(color);
        customColorPicker.value = color;
        localStorage.setItem('themeColor', color);
    });
});

function setThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Calculate hover color (darker)
    var hoverColor = adjustColor(color, -20);
    document.documentElement.style.setProperty('--primary-hover', hoverColor);
    
    // Calculate light color (lighter)
    var lightColor = adjustColor(color, 20);
    document.documentElement.style.setProperty('--primary-light', lightColor);
    
    // Calculate light hover color (even lighter)
    var lightHoverColor = adjustColor(color, 40);
    document.documentElement.style.setProperty('--primary-light-hover', lightHoverColor);
}

function adjustColor(color, amount) {
    var hex = color.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

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
