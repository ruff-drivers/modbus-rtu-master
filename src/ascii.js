/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var util = require('util');
var lrc = require('./lrc');

function Ascii(timeout) {
    EventEmitter.call(this);
    this._buffer = new Buffer(0);
    this._timeout = timeout;
}

util.inherits(Ascii, EventEmitter);

Ascii.prototype.pushCodedStream = function (data) {
    this._buffer = Buffer.concat([this._buffer, data]);

    // var startIndex = this._buffer.indexOf(':');
    var startIndex = indexOfBuffer(this._buffer, new Buffer(':'));
    if (startIndex === -1) {
        // if not there, reset the buffer and return
        this._buffer = new Buffer(0);
        return;
    }
    // if there is data before the start delimiter, remove it
    if (startIndex > 0) {
        this._buffer = this._buffer.slice(startIndex);
    }
    this._setupTimer();

    // console.log(this._buffer);
    // do we have the complete message (i.e. are the end delimiters there)
    if (indexOfBuffer(this._buffer, new Buffer('\r\n')) >= 0) {
        this._emit();
    } else {
        // otherwise just wait for more data to arrive
    }
};

Ascii.prototype._setupTimer = function () {
    clearTimeout(this._timer);
    this._timer = setTimeout(this._timeoutHandle.bind(this), this._timeout);
};

Ascii.prototype._timeoutHandle = function () {
    this._buffer = new Buffer(0);
    this.emit('error', new Error('Frame timeout'));
};

Ascii.prototype._emit = function () {
    var _data = this._decode(this._buffer);
    // (_data !== null) && that.emit('data', _data);
    if (_data === null) {
        this.emit('error', new Error('Invalid checksum'));
    } else {
        this.emit('data', _data);
    }
    clearTimeout(this._timer);
    this._buffer = new Buffer(0);
};

Ascii.prototype.encode = function (buffer) {
    // replace the 2 byte crc16 with a single byte lrc
    var lrcValue = lrc(buffer);
    var lrcBuffer = new Buffer(1);
    lrcBuffer.writeUInt8(lrcValue, 0);
    var bufferAll = Buffer.concat([buffer, lrcBuffer]);
    // create a new buffer of the correct size
    var bufferAscii = new Buffer(bufferAll.length * 2 + 3); // 1 byte start delimit + x2 data as ascii encoded + 2 lrc + 2 end delimit

    // start with the single start delimiter
    bufferAscii.write(':', 0);
    // encode the data, with the new single byte lrc
    bufferAscii.write(bufferAll.toString('hex').toUpperCase(), 1);
    // end with the two end delimiters
    bufferAscii.write('\r', bufferAscii.length - 2);
    bufferAscii.write('\n', bufferAscii.length - 1);

    return bufferAscii;
};

Ascii.prototype._decode = function (buffer) {
    // var endIndex = buffer.indexOf('\n');
    var endIndex = indexOfBuffer(buffer, new Buffer('\n'));
    var bufferToDecode = buffer.slice(0, endIndex + 1);

    // create a new buffer of the correct size (based on ascii encoded buffer length)
    var bufferDecoded = new Buffer((bufferToDecode.length - 1) / 2);

    // decode into new buffer (removing delimiters at start and end)
    for (var i = 0; i < (bufferToDecode.length - 3) / 2; i++) {
        bufferDecoded.write(String.fromCharCode(bufferToDecode.readUInt8(i * 2 + 1), bufferToDecode.readUInt8(i * 2 + 2)), i, 1, 'hex');
    }

    // check the lrc is true
    var lrcValue = bufferDecoded.readUInt8(bufferDecoded.length - 2);
    bufferDecoded = bufferDecoded.slice(0, -2);
    if (lrc(bufferDecoded) !== lrcValue) {
        // return null if lrc error
        return null;
    }

    return bufferDecoded;
};

function indexOfBuffer(buffer, subBuffer) {
    var bufferLength = buffer.length;
    var subBufferLength = subBuffer.length;
    var match = false;
    var i;
    var j;
    if (bufferLength === 0 || subBufferLength === 0 || subBufferLength > bufferLength) {
        match = false;
    } else {
        for (i = 0; i < bufferLength; i++) {
            if (buffer[i] === subBuffer[0]) {
                for (j = 0; j < subBufferLength; j++) {
                    if (buffer[i + j] !== subBuffer[j]) {
                        break;
                    }
                }
            }
            if (j === subBufferLength) {
                match = true;
                break;
            }
        }
    }
    if (match) {
        return i;
    } else {
        return -1;
    }
}

module.exports = Ascii;
