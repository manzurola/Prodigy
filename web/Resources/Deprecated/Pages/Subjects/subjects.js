var subjectSelectionScreen = function (view, spec) {

    var _cssClassNames = {
        LOADING: 'loading'
    };

    var that = entity(view, spec);
    var _subjectListView = document.getElementById('subjectList'),
        _backButton,
        _subjectListItems = [],
        _selectedSubject;

    (function () {
        var backButtonView = document.getElementById('backButtonSubjectSelectionScreen');
        _backButton = entity(backButtonView, {})
            .on('select', _handleBackButtonPress);
    }());

    //  augment screen
    that.loadSubjects = function () {
        _clearSubjectList();
        _fetchSubjectsFromServer();
        return this;
    };

    that.getSelectedSubject = function () {
        return _selectedSubject;
    };

    function _handleSubjectSelectedEvent(subject) {
        _selectedSubject = subject.getData();
        that.fireEvent('subjectSelected');
    }

    function _handleBackButtonPress() {
        that.fireEvent('back');
    }

    function _fetchSubjectsFromServer() {

        var url = "rest/subjects";              //  the entry point to server api
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.addEventListener("progress", _updateProgress, false);
        xmlhttp.addEventListener("load", _transferComplete, false);
        xmlhttp.addEventListener("error", _transferFailed, false);
        xmlhttp.addEventListener("abort", _transferCanceled, false);

        xmlhttp.open('GET', url, true);
        xmlhttp.send(null);

        view.classList.add(_cssClassNames.LOADING);
    }

    function _handleSubjectsReceived(xmlhttp) {
        logIt(xmlhttp);
    }

    // progress on transfers from the server to the client (downloads)
    function _updateProgress(oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total;
            logIt('progress: ' + percentComplete);
            // ...
        } else {
            // Unable to compute progress information since the total size is unknown
        }
    }

    function _transferComplete(evt) {
        view.classList.remove(_cssClassNames.LOADING);
        logIt(evt);
        var xmlhttp = evt.target;
        var subjects = JSON.parse(xmlhttp.responseText)['subjects'];
        _populateSubjectList(subjects);
    }

    function _transferFailed(evt) {
        alert("An error occurred while transferring the file.");
    }

    function _transferCanceled(evt) {
        alert("The transfer has been canceled by the user.");
    }

    /**
     *
     * @private
     */
    function _populateSubjectList(subjects) {

        for (var i = 0; i < subjects.length; i++) {
            _createAndAppendSubjectItem(subjects[i]);
        }
    }

    function _clearSubjectList() {
        _subjectListItems = [];
        while (_subjectListView.lastChild) {
            _subjectListView.removeChild(_subjectListView.lastChild);
        }
    }

    /**
     * @param subject
     * @return
     */
    function _createAndAppendSubjectItem(subject) {
        //  the supplied subject is a json message as received from server.
        //  it is stored as a data attribute of a subject item to forward it to next screen for exercise fetching

        var listItemView = document.createElement('li');
        listItemView.innerHTML = subject['name'];
        _subjectListView.appendChild(listItemView);
        var item = entity(listItemView, subject);

        item.on('select', _handleSubjectSelectedEvent);
        return item;
    }

    return that;
};