var exerciseSelectionScreen = function (view,spec) {

    var _cssClassNames = {
        LOADING: 'loading'
    };

    logIt(spec);

    var that = entity(view, spec);
    var _exerciseListView = document.getElementById('exerciseList'),
        exerciseListItems,
        _selectedExercise,
        backButton;

    (function init(){
        var backButtonView = document.getElementById('backButtonExerciseSelectionScreen');
        backButton = entity(backButtonView, {})
            .on('select', _handleBackButtonPress);
    }());

    //  augment screen
    that.loadExercisesBySubject = function(subject){
        _clearExerciseList();
        _fetchExercisesFromServer(subject['exercises']['href']);
        return this;
    };

    that.getSelectedExercise = function(){
        return _selectedExercise;
    };

    function _handleExerciseSelectedEvent(item) {
        _fetchSelectedExerciseDataFromServer(item.getData()['href']);

        logIt(item.getData()['href']);
    }

    function _handleBackButtonPress(){
        that.fireEvent('back');
    }

    /**
     * Gets an array of exercises from server, matching the subject stored in local storage.
     * (i.e. selected in a previous screen).
     * @private
     */
    function _fetchExercisesFromServer(href) {
        var xmlhttp = new XMLHttpRequest();
        var exercises = [];
//        xmlhttp.onreadystatechange = function () {
//            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//                exercises = JSON.parse(xmlhttp.responseText)['exercises'];
//                _clearExerciseList();
//                _loadExerciseList(exercises);
//            }
//        };

        xmlhttp.addEventListener("progress", _updateProgress, false);
        xmlhttp.addEventListener("load", _transferComplete, false);
        xmlhttp.addEventListener("error", _transferFailed, false);
        xmlhttp.addEventListener("abort", _transferCanceled, false);

        xmlhttp.open('GET', href, true);
        xmlhttp.send();

        view.classList.add(_cssClassNames.LOADING);
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
        var exercises = JSON.parse(xmlhttp.responseText)['exercises'];

        _loadExerciseList(exercises);
    }

    function _transferFailed(evt) {
        alert("An error occurred while transferring the file.");
    }

    function _transferCanceled(evt) {
        alert("The transfer has been canceled by the user.");
    }

    function _fetchSelectedExerciseDataFromServer(href) {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                _selectedExercise = JSON.parse(xmlhttp.responseText)['exercise'];

                //  fire an exercise selected event only after data has been received from server
                that.fireEvent('exerciseSelected');
            }
        };
        xmlhttp.open('GET', href, false);
        xmlhttp.send(null);
    }

    /**
     * Iterates over each exercise in _exercises and loads it to list
     * @private
     */
    function _loadExerciseList(exercises) {

        for (var i = 0; i < exercises.length; i++) {
            _createAndAppendExerciseItem(exercises[i]);
        }
    }

    function _clearExerciseList() {
        while (_exerciseListView.lastChild) {
            _exerciseListView.removeChild(_exerciseListView.lastChild);
        }
    }

    /**
     * Creates an DOM item element populated with supplied data
     * @param exercise
     * @return {*|entity} an item entity
     */
    function _createAndAppendExerciseItem(exercise) {

        var listItemView = document.createElement('li');
        listItemView.innerHTML = exercise['title'];
        _exerciseListView.appendChild(listItemView);
        var item = entity(listItemView, exercise);

        item.on('select', _handleExerciseSelectedEvent);
        return item;
    }

    return that;
};