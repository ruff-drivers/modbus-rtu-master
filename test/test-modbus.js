/*!
 * Copyright (c) 2017 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var EventEmitter = require('events');
var util = require('util');
var assert = require('assert');
var mock = require('ruff-mock');
var when = mock.when;

var Modbus = require('../src/modbus');
var crc16 = require('../src/crc16');

require('t');

function Uart() {
    EventEmitter.call(this);
}
util.inherits(Uart, EventEmitter);
Uart.prototype.write = function () {
};

describe('Test modbus request data in RTU mode', function () {
    var modbus;
    var uart;

    beforeEach(function () {
        uart = mock(new Uart());
        modbus = new Modbus(uart, {
            mode: 'rtu'
        });
    });

    it('should send expected data when invoke request 0x01 function `requestReadCoils`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x01;
        var startAddress = 0x01;
        var quantity = 10;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(startAddress, 2);
        expectedData.writeUInt16BE(quantity, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestReadCoils(slaveAddress, startAddress, quantity, done);
    });

    it('should send expected data when invoke request 0x02 function `requestReadDiscreteInputs`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x02;
        var startAddress = 0x01;
        var quantity = 10;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(startAddress, 2);
        expectedData.writeUInt16BE(quantity, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestReadDiscreteInputs(slaveAddress, startAddress, quantity, done);
    });

    it('should send expected data when invoke request 0x03 function `requestReadHoldingRegisters`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x03;
        var startAddress = 0x01;
        var quantity = 10;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(startAddress, 2);
        expectedData.writeUInt16BE(quantity, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestReadHoldingRegisters(slaveAddress, startAddress, quantity, done);
    });

    it('should send expected data when invoke request 0x04 function `requestReadInputRegisters`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x04;
        var startAddress = 0x01;
        var quantity = 10;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(startAddress, 2);
        expectedData.writeUInt16BE(quantity, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestReadInputRegisters(slaveAddress, startAddress, quantity, done);
    });

    it('should send expected data when invoke request 0x05 function `requestWriteSingleCoil`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x05;
        var address = 0x01;
        var state = 1;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(address, 2);
        expectedData.writeUInt16BE(state ? 0xFF00 : 0x0000, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestWriteSingleCoil(slaveAddress, address, state, done);
    });

    it('should send expected data when invoke request 0x06 function `requestWriteSingleRegister`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x06;
        var address = 0x01;
        var value = 0x5555;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(address, 2);
        expectedData.writeUInt16BE(value, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestWriteSingleRegister(slaveAddress, address, value, done);
    });

    it('should send expected data when invoke request 0x0F function `requestWriteMultipleCoils`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x0F;
        var startAddress = 0x01;
        var states = [1, 0, 1, 0, 0, 1, 0, 0, 0, 1];

        var expectedData = new Buffer(11);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(startAddress, 2);
        expectedData.writeUInt16BE(10, 4);
        expectedData.writeUInt8(2, 6);
        expectedData.writeUInt16LE(0x0225, 7);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 9);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestWriteMultipleCoils(slaveAddress, startAddress, states, done);
    });

    it('should send expected data when invoke request 0x10 function `requestWriteMultipleRegisters`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x10;
        var startAddress = 0x01;
        var values = [1, 2, 3, 4];

        var expectedData = new Buffer(17);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(startAddress, 2);
        expectedData.writeUInt16BE(values.length, 4);
        expectedData.writeUInt8(values.length * 2, 6);
        expectedData.writeUInt16BE(1, 7);
        expectedData.writeUInt16BE(2, 9);
        expectedData.writeUInt16BE(3, 11);
        expectedData.writeUInt16BE(4, 13);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 15);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.requestWriteMultipleRegisters(slaveAddress, startAddress, values, done);
    });
});

describe('Test modbus response data in RTU mode', function (done) {
    var modbus;
    var uart;

    beforeEach(function () {
        uart = mock(new Uart());
        modbus = new Modbus(uart, {
            timeout: 5,
            mode: 'rtu',
            parseSlaveData: false
        });
    });
    it('should send expected data when invoke response 0x01 function `responseReadCoils`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x01;
        // var startAddress = 0x03;
        // var coilStatus = 0x056BCD;
        var coilStatusArray = [
            1, 0, 1, 1,
            0, 0, 1, 1,
            1, 1, 0, 1,
            0, 1, 1, 0,
            1, 0, 1, 0,
            0, 0];

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt8(3, 2);
        expectedData.writeUInt16LE(0x6BCD, 3);
        expectedData.writeUInt8(0x05, 5);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseReadCoils(slaveAddress, coilStatusArray, done);
    });

    it('should send expected data when invoke response 0x02 function `responseReadDiscreteInputs`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x02;
        // var startAddress = 0x03;
        // var discreteInputs = 0x056BCD;
        var discreteInputsArray = [
            1, 0, 1, 1,
            0, 0, 1, 1,
            1, 1, 0, 1,
            0, 1, 1, 0,
            1, 0, 1, 0,
            0, 0];

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt8(3, 2);
        expectedData.writeUInt16LE(0x6BCD, 3);
        expectedData.writeUInt8(0x05, 5);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseReadDiscreteInputs(slaveAddress, discreteInputsArray, done);
    });

    it('should send expected data when invoke response 0x03 function `responseReadHoldingRegisters`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x03;
        var holdingRegisters = [1, 2, 3, 4];

        var expectedData = new Buffer(13);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt8(8, 2);
        for (var i = 0; i < holdingRegisters.length; ++i) {
            expectedData.writeUInt16BE(holdingRegisters[i], 3 + 2 * i);
        }
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 11);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseReadHoldingRegisters(slaveAddress, holdingRegisters, done);
    });
    it('should send expected data when invoke response 0x04 function `responseReadInputRegisters`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x04;
        var inputRegisters = [1, 2, 3, 4];

        var expectedData = new Buffer(13);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt8(8, 2);
        for (var i = 0; i < inputRegisters.length; ++i) {
            expectedData.writeUInt16BE(inputRegisters[i], 3 + 2 * i);
        }
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 11);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseReadInputRegisters(slaveAddress, inputRegisters, done);
    });
    it('should send expected data when invoke response 0x05 function `responseWriteSingleCoil`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x05;
        var address = 0x01;
        var state = 1;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(address, 2);
        expectedData.writeUInt16BE(state ? 0xFF00 : 0x0000, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseWriteSingleCoil(slaveAddress, address, state, done);
    });
    it('should send expected data when invoke response 0x06 function `responseWriteSingleRegister`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x06;
        var address = 0x01;
        var value = 0x5555;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(address, 2);
        expectedData.writeUInt16BE(value, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseWriteSingleRegister(slaveAddress, address, value, done);
    });
    it('should send expected data when invoke response 0x0F function `responseWriteMultipleCoils`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x0F;
        var address = 0x01;
        var value = 0x5555;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(address, 2);
        expectedData.writeUInt16BE(value, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseWriteMultipleCoils(slaveAddress, address, value, done);
    });
    it('should send expected data when invoke response 0x10 function `responseWriteMultipleRegisters`', function (done) {
        var slaveAddress = 0x01;
        var functionCode = 0x10;
        var address = 0x01;
        var value = 0x5555;

        var expectedData = new Buffer(8);
        expectedData.writeUInt8(slaveAddress, 0);
        expectedData.writeUInt8(functionCode, 1);
        expectedData.writeUInt16BE(address, 2);
        expectedData.writeUInt16BE(value, 4);
        expectedData.writeUInt16LE(crc16(expectedData.slice(0, -2)), 6);
        when(uart).write(expectedData, Function).then(function (data, callback) {
            callback();
        });
        modbus.responseWriteMultipleRegisters(slaveAddress, address, value, done);
    });
});

describe('Test modbus parse request data in RTU mode', function () {
    var modbus;
    var uart;

    beforeEach(function () {
        uart = new Uart();
        uart.write = function (data, callback) {
            callback && callback();
            modbus.emit('message', data.slice(0, -2));
        };
    });

    describe('Test response data converted', function () {
        beforeEach(function () {
            modbus = new Modbus(uart, {
                mode: 'rtu',
                parseSlaveData: true
            });
        });

        afterEach(function () {
            modbus.removeAllListeners('message');
        });

        it('Test 0x01 function `parseReadCoilsResponse`', function (done) {
            var slaveAddress = 0x01;
            // var coilStatus = 0x056BCD;
            var coilStatusArray = [
                1, 0, 1, 1,
                0, 0, 1, 1,
                1, 1, 0, 1,
                0, 1, 1, 0,
                1, 0, 1, 0,
                0, 0];

            modbus.on('message', function (message) {
                var response = modbus.parseReadCoilsResponse(coilStatusArray.length, message);
                assert.deepEqual(response.status, coilStatusArray);
                done();
            });

            modbus.responseReadCoils(slaveAddress, coilStatusArray);
        });
        it('Test 0x02 function `parseReadDiscreteInputsResponse`', function (done) {
            var slaveAddress = 0x01;
            // var discreteInput = 0x056BCD;
            var discreteInputArray = [
                1, 0, 1, 1,
                0, 0, 1, 1,
                1, 1, 0, 1,
                0, 1, 1, 0,
                1, 0, 1, 0,
                0, 0];

            modbus.on('message', function (message) {
                var response = modbus.parseReadDiscreteInputsResponse(discreteInputArray.length, message);
                assert.deepEqual(response.status, discreteInputArray);
                done();
            });

            modbus.responseReadDiscreteInputs(slaveAddress, discreteInputArray);
        });
        it('Test 0x03 function `parseReadHoldingRegistersResponse`', function (done) {
            var slaveAddress = 0x01;
            var holdingRegisters = [1, 2, 3, 4];

            modbus.on('message', function (message) {
                var response = modbus.parseReadHoldingRegistersResponse(holdingRegisters.length, message);
                assert.deepEqual(response.status, holdingRegisters);
                done();
            });

            modbus.responseReadHoldingRegisters(slaveAddress, holdingRegisters);
        });
        it('Test 0x04 function `parseReadInputRegistersResponse`', function (done) {
            var slaveAddress = 0x01;
            var inputRegisters = [1, 2, 3, 4];

            modbus.on('message', function (message) {
                var response = modbus.parseReadInputRegistersResponse(2, message);
                assert.deepEqual(response.status, inputRegisters);
                done();
            });

            modbus.responseReadInputRegisters(slaveAddress, inputRegisters);
        });
        it('Test 0x05 function `parseWriteSingleCoilResponse`', function (done) {
            var slaveAddress = 0x01;
            var address = 0x01;
            var state = 1;

            modbus.on('message', function (message) {
                var response = modbus.parseWriteSingleCoilResponse(message);
                assert.equal(response.state, state);
                done();
            });

            modbus.responseWriteSingleCoil(slaveAddress, address, state);
        });
        it('Test 0x06 function `parseWriteSingleRegisterResponse`', function (done) {
            var slaveAddress = 0x01;
            var address = 0x01;
            var value = 0x5555;

            modbus.on('message', function (message) {
                var response = modbus.parseWriteSingleRegisterResponse(message);
                assert.equal(response.value, value);
                done();
            });

            modbus.responseWriteSingleRegister(slaveAddress, address, value);
        });
        it('Test 0x0F function `parseWriteMultipleCoilsResponse`', function (done) {
            var slaveAddress = 0x01;
            var startAddress = 0x01;
            var states = [1, 0, 1, 0, 0, 1, 0, 0, 0, 1];

            modbus.on('message', function (message) {
                var response = modbus.parseWriteMultipleCoilsResponse(message);
                assert.equal(response.quantity, states.length);
                done();
            });

            modbus.responseWriteMultipleCoils(slaveAddress, startAddress, states.length);
        });
        it('Test 0x10 function `parseWriteMultipleRegistersResponse`', function (done) {
            var slaveAddress = 0x01;
            var startAddress = 0x01;
            var values = [1, 2, 3, 4];

            modbus.on('message', function (message) {
                var response = modbus.parseWriteMultipleRegistersResponse(message);
                assert.equal(response.quantity, values.length);
                done();
            });

            modbus.responseWriteMultipleRegisters(slaveAddress, startAddress, values.length);
        });
    });

    describe('Test response data unconverted', function () {
        beforeEach(function () {
            modbus = new Modbus(uart, {
                mode: 'rtu',
                parseSlaveData: false
            });
        });

        afterEach(function () {
            modbus.removeAllListeners('message');
        });

        it('Test 0x01 function `parseReadCoilsResponse`', function (done) {
            var slaveAddress = 0x01;
            // var coilStatus = 0x056BCD;
            var coilStatusArray = [
                1, 0, 1, 1,
                0, 0, 1, 1,
                1, 1, 0, 1,
                0, 1, 1, 0,
                1, 0, 1, 0,
                0, 0];

            modbus.on('message', function (message) {
                var response = modbus.parseReadCoilsResponse(coilStatusArray.length, message);
                assert.deepEqual(response.status, [0xCD, 0x6B, 0x05]);
                done();
            });

            modbus.responseReadCoils(slaveAddress, coilStatusArray);
        });
        it('Test 0x02 function `parseReadDiscreteInputsResponse`', function (done) {
            var slaveAddress = 0x01;
            // var discreteInput = 0x056BCD;
            var discreteInputArray = [
                1, 0, 1, 1,
                0, 0, 1, 1,
                1, 1, 0, 1,
                0, 1, 1, 0,
                1, 0, 1, 0,
                0, 0];

            modbus.on('message', function (message) {
                var response = modbus.parseReadCoilsResponse(discreteInputArray.length, message);
                assert.deepEqual(response.status, [0xCD, 0x6B, 0x05]);
                done();
            });

            modbus.responseReadCoils(slaveAddress, discreteInputArray);
        });
        it('Test 0x03 function `parseReadHoldingRegistersResponse`', function (done) {
            var slaveAddress = 0x01;
            var holdingRegisters = [1, 2, 3, 4];

            modbus.on('message', function (message) {
                var response = modbus.parseReadHoldingRegistersResponse(holdingRegisters.length, message);
                assert.deepEqual(response.status, [0x00, 0x01, 0x00, 0x02, 0x00, 0x03, 0x00, 0x04]);
                done();
            });

            modbus.responseReadHoldingRegisters(slaveAddress, holdingRegisters);
        });
        it('Test 0x04 function `parseReadInputRegistersResponse`', function (done) {
            var slaveAddress = 0x01;
            var inputRegisters = [1, 2, 3, 4];

            modbus.on('message', function (message) {
                var response = modbus.parseReadInputRegistersResponse(inputRegisters.length, message);
                assert.deepEqual(response.status, [0x00, 0x01, 0x00, 0x02, 0x00, 0x03, 0x00, 0x04]);
                done();
            });

            modbus.responseReadInputRegisters(slaveAddress, inputRegisters);
        });
        it('Test 0x05 function `parseWriteSingleCoilResponse`', function (done) {
            var slaveAddress = 0x01;
            var address = 0x01;
            var state = 1;

            modbus.on('message', function (message) {
                var response = modbus.parseWriteSingleCoilResponse(message);
                assert.deepEqual(response.state, state ? [0xFF, 0x00] : [0x00, 0xFF]);
                done();
            });

            modbus.responseWriteSingleCoil(slaveAddress, address, state);
        });
        it('Test 0x06 function `parseWriteSingleRegisterResponse`', function (done) {
            var slaveAddress = 0x01;
            var address = 0x01;
            var value = 0x5555;

            modbus.on('message', function (message) {
                var response = modbus.parseWriteSingleRegisterResponse(message);
                assert.deepEqual(response.value, [0x55, 0x55]);
                done();
            });

            modbus.responseWriteSingleRegister(slaveAddress, address, value);
        });
        it('Test 0x0F function `parseWriteMultipleCoilsResponse`', function (done) {
            var slaveAddress = 0x01;
            var startAddress = 0x01;
            var states = [1, 0, 1, 0, 0, 1, 0, 0, 0, 1];

            modbus.on('message', function (message) {
                var response = modbus.parseWriteMultipleCoilsResponse(message);
                assert.equal(response.quantity, states.length);
                done();
            });

            modbus.responseWriteMultipleCoils(slaveAddress, startAddress, states.length);
        });
        it('Test 0x10 function `parseWriteMultipleRegistersResponse`', function (done) {
            var slaveAddress = 0x01;
            var startAddress = 0x01;
            var values = [1, 2, 3, 4];

            modbus.on('message', function (message) {
                var response = modbus.parseWriteMultipleRegistersResponse(message);
                assert.equal(response.quantity, values.length);
                done();
            });

            modbus.responseWriteMultipleRegisters(slaveAddress, startAddress, values.length);
        });
    });
});
