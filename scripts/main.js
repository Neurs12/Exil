var request = new XMLHttpRequest();
request.onreadystatechange = function(){ 
    if (request.readyState == 4 && (request.status == 200 || request.status == 304)){
        table = JSON.parse(request.responseText);
        convertTable(table);
    }
}
request.open("GET", "http://localhost:8080/gettable", true);
request.send(null);

var problems;
var profiles;
var mainJson;

function convertTable(data){
    var cell = document.getElementById("cell");
    cell.innerHTML = "<th></th>"
    for(var i = 0; i < data["problems"].length; i++){
        cell.innerHTML += "<th><label><input id=\"problem"+data["problems"][i]+"\" onclick=\"onCheckProblem(this.id)\" type=\"checkbox\" class=\"filled-in\" checked=\"checked\"/><span id=\"problem"+data["problems"][i]+"name\" class=\"names\">"+data["problems"][i]+"</span></label></th>";
    }
    cell.innerHTML += "<th><span>Total</span></th>";

    var tb = document.getElementById("profiles");
    tb.innerHTML = "";
    for(var i = 0; i < data["profiles"].length; i++){
        tb.innerHTML += "<tr id=\""+data["profiles"][i]+"\"><td><label><input id=\"profile"+data["profiles"][i]+"\" onclick=\"onCheckProfile(this.id)\" type=\"checkbox\" class=\"filled-in\" checked=\"checked\"/><span id=\"profile"+data["profiles"][i]+"name\" class=\"names\">"+data["profiles"][i]+"</span></label></td>\n";
    }

    for(var i = 0; i < data["profiles"].length; i++){
        var prp = document.getElementById(data["profiles"][i]);
        for(var j = 0; j < data["problems"].length; j++){
            prp.innerHTML += "<td><span id=\"score"+data["profiles"][i]+data["problems"][j]+"\" class=\"badge\">"+String(data["scores"][data["problems"][j]][data["profiles"][i]])+"/?</span></td>\n";
        }
        prp.innerHTML += "<td><span id=\"total"+data["profiles"][i]+"\" class=\"badge\">0/?</span></td>\n";
    }

    var types = document.getElementById("iotypes");
    for(var i = 0; i < data["problems"].length; i++){
        types.innerHTML += "<td><a id=\""+data["problems"][i]+"IOtype\" onclick=\"ChangeIOType(this.id)\" title=\"Click to change\" class=\""+data["problems"][i]+" IOfont\">"+data["IOtype"][data["problems"][i]]+"</a></td>";
    }
    problems = data["problems"];
    profiles = data["profiles"];
    mainJson = data;
}

function onCheckProblem(id){
    if(document.getElementById(id).checked == false){
        document.getElementById(`${id}name`).classList.remove("names");
    }
    else{
        if(document.getElementById(`${id}name`).classList.contains("names") == false){
            document.getElementById(`${id}name`).classList.add("names");
        }
    }
}

function onCheckProfile(id){
    if(document.getElementById(id).checked == false){
        document.getElementById(`${id}name`).classList.remove("names");
    }
    else{
        if(document.getElementById(`${id}name`).classList.contains("names") == false){
            document.getElementById(`${id}name`).classList.add("names");
        }
    }
}

function Home(){
    try{document.getElementById("settings").classList.remove("in-use");}
    catch(error){}

    if(document.getElementById("home").classList.contains("in-use") == false){
        document.getElementById("home").classList.add("in-use");
        document.getElementById("content").innerHTML = '<table class=\"highlight responsive-table\"><tbody><tr id=\"cell\"><th>Profiles</th></tr><tbody id=\"profiles\"></tbody><tr id=\"iotypes\"><th>IO Type</th></tr></tbody></table>'
        document.getElementById("start").style.display = "inline-block";
        document.getElementById("refresh").style.display = "inline-block";
        Refresh();
    }
}

var bartime;

function Refresh(){
    var refresh = new XMLHttpRequest();
    refresh.onreadystatechange = function(){ 
        if (refresh.readyState == 4 && (refresh.status == 200 || refresh.status == 304)){
            document.getElementById("content").innerHTML = '<table class=\"highlight responsive-table\"><tbody><tr id=\"cell\"><th>Profiles</th></tr><tbody id=\"profiles\"></tbody><tr id=\"iotypes\"><th>IO Type</th></tr></tbody></table>';
            table = JSON.parse(refresh.responseText);
            convertTable(table);
        }
    }
    refresh.open("GET", "http://localhost:8080/gettable", true);
    refresh.send(null);
}

function Settings(){
    try{document.getElementById("home").classList.remove("in-use");}
    catch(error){}
    
    if(document.getElementById("settings").classList.contains("in-use") == false){
        document.getElementById("settings").classList.add("in-use");
        document.getElementById("content").innerHTML = "<ul class=\"collection with-header\"><li class=\"collection-header\"><h5>Directories settings</h5></li><div class=\"row collection-item\"><div class=\"input-field col s6\"><input placeholder=\"\" id=\"test-cases-location\" type=\"text\" class=\"validate\"><label id=\"field\" for=\"test-cases-location\" class=\"active\">Test cases location</label></div></div><div class=\"row collection-item\"><div class=\"input-field col s6\"><input placeholder=\"\" id=\"profiles-location\" type=\"text\" class=\"validate\"><label id=\"field2\" for=\"profiles-location\" class=\"active\">Profiles location</label></div></div><li class=\"collection-header\"><h5>Language support settings</h5></li><div class=\"row collection-item\"><div class=\"input-field col s6\"><p>C/C++ support (<a href=\"https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win32/Personal%20Builds/mingw-builds/installer/mingw-w64-install.exe\" target=\"_blank\">Download MinGW</a>):</p><div class=\"switch\"><label>Off <input id=\"c\" type=\"checkbox\"><span class=\"lever\"></span>On</label></div></div></div><div class=\"row collection-item\"><div class=\"input-field col s6\"><input placeholder=\"[environment variables]\" id=\"C-complier-location\" type=\"text\" class=\"validate\"><label id=\"C-field\" for=\"C-complier-location\" class=\"active\">C/C++ Complier location</label></div></div><div class=\"row collection-item\"><div class=\"input-field col s6\"><p>Python support (<a href=\"https://www.python.org/downloads\" target=\"_blank\">Download Python</a>):</p><div class=\"switch\"><label>Off <input id=\"python\" type=\"checkbox\"><span class=\"lever\"></span>On</label></div></div></div><div class=\"row collection-item\"><div class=\"input-field col s6\"><input placeholder=\"[environment variables]\" id=\"Py-complier-location\" type=\"text\" class=\"validate\"><label id=\"Py-field\" for=\"Py-complier-location\" class=\"active\">Python Interpreter location</label></div></div><div class=\"row collection-item\"><div class=\"input-field col s6\"><p>Free Pascal support (<a href=\"https://www.freepascal.org/download.html\" target=\"_blank\">Download FPC</a>):</p><div class=\"switch\"><label>Off <input id=\"pascal\" type=\"checkbox\"><span class=\"lever\"></span>On</label></div></div></div><div class=\"row collection-item\"><div class=\"input-field col s6\"><input placeholder=\"[environment variables]\" id=\"FPC-complier-location\" type=\"text\" class=\"validate\"><label id=\"FPC-field\" for=\"FPC-complier-location\" class=\"active\">Pascal Complier location</label></div></div><div style=\"text-align:center\" class=\"row collection-item\"><button style=\"width:20%\" onclick=\"SaveChanges()\" id=\"save\" class=\"waves-effect waves-light btn\">apply</button></div></ul>";
        document.getElementById("field").classList.add("active");
        document.getElementById("field2").classList.add("active");
        document.getElementById("C-field").classList.add("active");
        document.getElementById("Py-field").classList.add("active");
        document.getElementById("FPC-field").classList.add("active");

        var lang_path = new XMLHttpRequest();
        lang_path.onreadystatechange = function(){ 
            if (lang_path.readyState == 4 && (lang_path.status == 200 || lang_path.status == 304)){
                var paths = JSON.parse(lang_path.responseText);
                if(paths["c"] == "[environment variables]"){
                    document.getElementById("C-complier-location").setAttribute("placeholder", paths["c"]);
                }
                else{
                    document.getElementById("C-complier-location").value = paths["c"];
                }

                if(paths["python"] == "[environment variables]"){
                    document.getElementById("Py-complier-location").setAttribute("placeholder", paths["python"]);
                }
                else{
                    document.getElementById("C-complier-location").value = paths["python"];
                }

                if(paths["pascal"] == "[environment variables]"){
                    document.getElementById("FPC-complier-location").setAttribute("placeholder", paths["pascal"]);
                }
                else{
                    document.getElementById("FPC-complier-location").value = paths["pascal"];
                }
            }
        }
        lang_path.open("GET", "http://localhost:8080/langpath", true);
        lang_path.send(null);

        var setting_set_location = new XMLHttpRequest();
        setting_set_location.onreadystatechange = function(){ 
            if (setting_set_location.readyState == 4 && (setting_set_location.status == 200 || setting_set_location.status == 304)){
                var data = JSON.parse(setting_set_location.responseText);
                document.getElementById("test-cases-location").value = data[0];
                document.getElementById("profiles-location").value = data[1];
            }
        }
        setting_set_location.open("GET", "http://localhost:8080/services-location", true);
        setting_set_location.send(null);

        var support_lang = new XMLHttpRequest();
        support_lang.onreadystatechange = function(){ 
            if (support_lang.readyState == 4 && (support_lang.status == 200 || support_lang.status == 304)){
                lang = JSON.parse(support_lang.responseText);
                for(var i = 0; i < lang.length; i++){
                    document.getElementById(lang[i]).checked = true;
                }
            }
        }
        support_lang.open("GET", "http://localhost:8080/supported-language", true);
        support_lang.send(null);

        document.getElementById("start").style.display = "none";
        document.getElementById("refresh").style.display = "none";
    }
}

function ChangeIOType(id){
    console.log(id)
    if(document.getElementById(id).innerHTML == "STDIN/OUT"){
        var change_text = document.getElementById(id);
        change_text.innerHTML = "FILE";
        var problem = change_text.classList[0];
        var changeType = new XMLHttpRequest();
        changeType.open("GET", `http://localhost:8080/change-io-type/${problem}/FILE`, true);
        changeType.send(null);
    }
    else{
        var change_text = document.getElementById(id);
        change_text.innerHTML = "STDIN/OUT";
        var problem = change_text.classList[0];
        var changeType = new XMLHttpRequest();
        changeType.open("GET", `http://localhost:8080/change-io-type/${problem}/STDIN-STDOUT`, true);
        changeType.send(null);
    }
}

function SaveChanges(){
    Saving()
    var c_location = new XMLHttpRequest();
    c_location.onreadystatechange = function(){ 
        if (c_location.readyState == 4 && (c_location.status == 200 || c_location.status == 304)){
            if(c_location.responseText == "c"){
                ohno("C/C++ Compiler location: ");
            }
        }
    }
    if(document.getElementById("C-complier-location").value == ""){
        c_location.open("GET", "http://localhost:8080/change-location/c/[environment variables]", true);
        c_location.send(null);
    }
    else{
        c_location.open("GET", "http://localhost:8080/change-location/c/"+encodeURI(document.getElementById("C-complier-location").value), true);
        c_location.send(null);
    }

    var py_location = new XMLHttpRequest();
    py_location.onreadystatechange = function(){ 
        if (py_location.readyState == 4 && (py_location.status == 200 || py_location.status == 304)){
            if(py_location.responseText == "python"){
                ohno("Python Interpreter location: ");
            }
        }
    }
    if(document.getElementById("Py-complier-location").value == ""){
        py_location.open("GET", "http://localhost:8080/change-location/python/[environment variables]", true);
        py_location.send(null);
    }
    else{
        py_location.open("GET", "http://localhost:8080/change-location/python/"+encodeURI(document.getElementById("Py-complier-location").value), true);
        py_location.send(null);
    }

    var pascal_location = new XMLHttpRequest();
    pascal_location.onreadystatechange = function(){ 
        if (pascal_location.readyState == 4 && (pascal_location.status == 200 || pascal_location.status == 304)){
            if(pascal_location.responseText == "pascal"){
                ohno("Pascal Compiler location: ");
            }
        }
    }
    if(document.getElementById("FPC-complier-location").value == ""){
        pascal_location.open("GET", "http://localhost:8080/change-location/pascal/[environment variables]", true);
        pascal_location.send(null);
    }
    else{
        pascal_location.open("GET", "http://localhost:8080/change-location/pascal/"+encodeURI(document.getElementById("FPC-complier-location").value), true);
        pascal_location.send(null);
    }

    var c_state = new XMLHttpRequest();
    if(document.getElementById("c").checked == true){
        c_state.open("GET", "http://localhost:8080/enable/c", true);
        c_state.send(null);
    }
    else{
        c_state.open("GET", "http://localhost:8080/disable/c", true);
        c_state.send(null);
    }

    var py_state = new XMLHttpRequest();
    if(document.getElementById("python").checked == true){
        py_state.open("GET", "http://localhost:8080/enable/python", true);
        py_state.send(null);
    }
    else{
        py_state.open("GET", "http://localhost:8080/disable/python", true);
        py_state.send(null);
    }

    var FPC_state = new XMLHttpRequest();

    if(document.getElementById("pascal").checked == true){
        FPC_state.open("GET", "http://localhost:8080/enable/pascal", true);
        FPC_state.send(null);
    }
    else{
        FPC_state.open("GET", "http://localhost:8080/disable/pascal", true);
        FPC_state.send(null);
    }

    var profiles_location = new XMLHttpRequest();
    profiles_location.onreadystatechange = function(){ 
        if (profiles_location.readyState == 4 && (profiles_location.status == 200 || profiles_location.status == 304)){
            if(profiles_location.responseText == "profiles-location"){
                ohno("Profiles location: ");
            }
        }
    }
    if(document.getElementById("profiles-location").value != ""){
        profiles_location.open("GET", "http://localhost:8080/change-location/profiles-location/"+encodeURI(document.getElementById("profiles-location").value), true);
        profiles_location.send(null);
    }

    var test_cases_location = new XMLHttpRequest();
    test_cases_location.onreadystatechange = function(){ 
        if (test_cases_location.readyState == 4 && (test_cases_location.status == 200 || test_cases_location.status == 304)){
            if(test_cases_location.responseText == "test-cases-location"){
                ohno("Test cases location: ");
            }
        }
    }
    if(document.getElementById("test-cases-location").value != ""){
        test_cases_location.open("GET", "http://localhost:8080/change-location/test-cases-location/"+encodeURI(document.getElementById("test-cases-location").value), true);
        test_cases_location.send(null);
    }
}

function changeTable(){
    
}

function StartTest(){
    const servicesSend = {
        "profiles": [],
        "problems": []
    }
    for(var i = 0; i < profiles.length; i++){
        if(document.getElementById("profile"+profiles[i]).checked){
            servicesSend["profiles"].push(profiles[i]);
        }
    }
    for(var i = 0; i < problems.length; i++){
        if(document.getElementById("problem"+problems[i]).checked){
            servicesSend["problems"].push(problems[i]);
        }
    }
    
    var k = setInterval(() => {
        var GetResult = new XMLHttpRequest();
        GetResult.onreadystatechange = function(){ 
            if (GetResult.readyState == 4 && (GetResult.status == 200 || GetResult.status == 304)){
                console.log(GetResult.responseText)
            }
        }
        GetResult.open("GET", "http://localhost:8080/get-result", true);
        GetResult.send();
    }, 1000)

    var RequestTest = new XMLHttpRequest();
    RequestTest.onreadystatechange = function(){ 
        if (RequestTest.readyState == 4 && (RequestTest.status == 200 || RequestTest.status == 304)){
            clearInterval(k);
            var GetResult = new XMLHttpRequest();
            GetResult.onreadystatechange = function(){ 
                if (GetResult.readyState == 4 && (GetResult.status == 200 || GetResult.status == 304)){
                    console.log(GetResult.responseText)
                }
            }
            GetResult.open("GET", "http://localhost:8080/get-result", true);
            GetResult.send();
        }
    }
    RequestTest.open("POST", "http://localhost:8080/start", true);
    RequestTest.setRequestHeader('Content-Type', 'application/json');
    RequestTest.send(JSON.stringify(servicesSend));
    
}