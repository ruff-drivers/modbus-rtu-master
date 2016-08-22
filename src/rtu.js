/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var util = require('util');
var crc16 = require('./crc16');

function Rtu(timeout) {
    EventEmitter.call(this);

    // var that = this;
    // this._source = source;
    this._buffer = new Buffer(0);
    this._timeout = timeout;

    // this._source.on('data', function (data) {
    //     console.log('uart get data ...', data.toString('hex'), Date.now());
    //     that._setupTimer();
    //     that._buffer = Buffer.concat([that._buffer, data]);
    // });
}

util.inherits(Rtu, EventEmitter);

Rtu.prototype._setupTimer = function () {
    clearTimeout(this._timer);
    // var that = this;
    this._timer = setTimeout(this._emit.bind(this), this._timeout);
    // this._timer = setTimeout(function () {
    //     console.log('char timeout ...', Date.now());
    //     that._emit.call(that);
    // }, this._timeout);
};

Rtu.prototype._emit = function () {
    var data = this._decode(this._buffer);
    console.log('codec get data is ', this._buffer.toString('hex'));
    if (data === null) {
        console.log('emit errorMessage', Date.now());
        this.emit('errorMessage', 'Invalid checksum');
    } else {
        console.log('emit message', Date.now());
        this.emit('message', data);
    }
    this._buffer = new Buffer(0);
};

Rtu.prototype.encode = function (buffer) {
    var crcValue = crc16(buffer);
    var crcBuffer = new Buffer(2);
    crcBuffer.writeUInt16LE(crcValue, 0);
    return Buffer.concat([buffer, crcBuffer]);
};

Rtu.prototype.pushCodedStream = function (data) {
    this._setupTimer();
    this._buffer = Buffer.concat([this._buffer, data]);
};

Rtu.prototype._decode = function (buffer) {
    if (buffer.length < 2) {
        return null;
    }
    var crcValue = buffer.readUInt16LE(buffer.length - 2);
    var bufferDecoded = buffer.slice(0, -2);
    if (crc16(bufferDecoded) !== crcValue) {
        return null;
    }
    return bufferDecoded;
};

module.exports = Rtu;
