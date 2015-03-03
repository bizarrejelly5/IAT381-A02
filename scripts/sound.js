function Sound() {
  this._audioContext = new AudioContext();
  this._listeners = {};
}

Sound.prototype.load = function (url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'alarm.mp3', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    this._audioContext.decodeAudioData(xhr.response, function (buffer) {
      this._buffer = buffer;
      this._listeners['load'] && this._listeners['load'].forEach(function (fn) {
        fn();
      });
    }.bind(this));
  }.bind(this);
  xhr.send();
};

Sound.prototype.on = function (label, cb) {
  if (this._listeners[label]) {
    this._listeners.push(cb);
    return;
  }
  this._listeners[label] = [cb];
};

Sound.prototype.play = function () {
  if (this._buffer) {
    this._source && this.source.disconnect();
    this._source = this._audioContext.createBufferSource();
    this._source.buffer = this._buffer;
    this._source.connect(this._audioContext.destination);
    this._source.start();
  }
};

Sound.prototype.stop = function () {
  this._source && this.source.disconnect();
  this._source = null;
}
