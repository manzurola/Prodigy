/**
 * User: guyman
 * Date: 12/15/13
 * Time: 8:19 PM
 */
function ProgressBar(elem, spec) {
    Visual.call(this, elem, spec);
    this.__inner = new Visual(document.createElement('div'), {})
        .decorate('progressbar-inner')
        .appendTo(this);
}
ProgressBar.prototype = Object.create(Visual.prototype);
ProgressBar.prototype.constructor = ProgressBar;
ProgressBar.prototype.progress = function (progress) {
    if (progress) {
        this.__progress = progress;
        this.__inner.style('width', this.__progress + '%');
        return this;
    } else {
        return this.__progress;
    }
};
function HealthBar(elem, spec) {
    Visual.call(this, elem, spec);
    this.__progressBar = new ProgressBar(document.createElement('div'), spec)
        .appendTo(this);
}
HealthBar.prototype = Object.create(Visual.prototype);
HealthBar.prototype.constructor = HealthBar;
HealthBar.prototype.value = function(hitpoints) {

};
function Choice(elem, spec) {
    Visual.call(this, elem, spec);
    this.state = this.states.IDLE;
}
Choice.prototype = Object.create(Visual.prototype);
Choice.prototype.constructor = Choice;
Choice.prototype.states = {
    IDLE : 0,
    CORRECT : 1,
    MISTAKE : 2
};

