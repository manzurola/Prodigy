var subjectSelectionScreen = function(view, spec){

    var that = entity(view, spec);
    var _subjectListView = document.getElementById('subjectList'),
        _backButton,
        _subjectListItems = [],
        _selectedSubject;

    (function(){
        var backButtonView = document.getElementById('backButtonSubjectSelectionScreen');
        _backButton = entity(backButtonView, {})
            .on('select', _handleBackButtonPress);
    }());

    //  augment screen
    that.loadSubjects = function(){
        _fetchSubjectsFromServer();
        return this;
    };

    that.getSelectedSubject = function(){
        return _selectedSubject;
    };

    function _handleSubjectSelectedEvent(subject){
        _selectedSubject = subject.getData();
        that.fireEvent('subjectSelected');
    }

    function _handleBackButtonPress(){
        that.fireEvent('back');
    }

    function _fetchSubjectsFromServer(){

        var url = "rest/subjects";              //  the entry point to server api
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var subjects = JSON.parse(xmlhttp.responseText)['subjects'];
                _populateSubjectList(subjects);
            }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    }

    /**
     *
     * @private
     */
    function _populateSubjectList(subjects){

        _clearSubjectList();

        for( var i=0; i<subjects.length; i++ ){
            _createAndAppendSubjectItem(subjects[i]);
        }
    }

    function _clearSubjectList(){
        _subjectListItems = [];
        while( _subjectListView.lastChild ){
            _subjectListView.removeChild(_subjectListView.lastChild);
        }
    }

    /**
     * @param subject
     * @return
     */
    function _createAndAppendSubjectItem(subject) {

        var listItemView = document.createElement('li');
        listItemView.innerHTML = subject['name'];
        _subjectListView.appendChild(listItemView);
        var item = entity(listItemView, subject);

        item.on('select', _handleSubjectSelectedEvent);
        return item;

        //  the supplied subject is a json message as received from server.
        //  it is stored as a data attribute of a subject item to forward it to next screen for exercise fetching
//        var subjectItem = $('<li></li>').data("message", subject);
//        var nameElement = $('<span></span>').addClass('name').html(subject["name"]);
//        var exerciseElement = $('<span></span>').addClass('exercises')
//            .append($('<span></span>').html(subject['numberOfExercises']))
//            .append($('<span></span>').html('exercises'));
//
//        subjectItem.append(nameElement)
//            .append(exerciseElement)
//            .on('click', {'message': subjectItem.data('message')}, function (event) {
//                var subjectJson = event.data.message;
//                localStorage.setItem('subject', JSON.stringify(subjectJson));
//                _handleSubjectSelectedEvent();
//            });
//        return subjectItem;
    }

    return that;
};