var exerciseSelectionScreen = function (view,spec) {

    var that = entity(view, spec);
    var _exerciseListView = document.getElementById('exerciseList'),
        exerciseListItems,
        _selectedExercise,
        backButton;


    (function(){
        var backButtonView = document.getElementById('backButtonExerciseSelectionScreen');
        backButton = entity(backButtonView, {})
            .on('select', _handleBackButtonPress);
    }());

    //  augment screen
    that.loadExercisesBySubject = function(subject){
        _fetchExercisesFromServer(subject['exercises']['href']);
        return this;
    };

    that.getSelectedExercise = function(){
        return _selectedExercise;
    };

    function _handleExerciseSelectedEvent(item) {
        _fetchSelectedExerciseDataFromServer(item.getData()['href']);
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
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                exercises = JSON.parse(xmlhttp.responseText)['exercises'];
                _clearExerciseList();
                _loadExerciseList(exercises);
            }
        };
        xmlhttp.open('GET', href, true);
        xmlhttp.send();
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
        xmlhttp.open('GET', href, true);
        xmlhttp.send();
    }

    /**
     * Iterates over each exercise in _exercises and loads it to list
     * @private
     */
    function _loadExerciseList(exercises) {

        for (var i = 0; i < exercises.length; i++) {
            $(_exerciseListView).append(_createAndAppendExerciseItem(exercises[i]));
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
     * @return {*|jQuery} a jquery object
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